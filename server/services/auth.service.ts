import crypto from "node:crypto";
import { env } from "../config/env";
import { httpLogger } from "../middleware/logger";
import { RefreshToken } from "../models/RefreshToken";
import { AppError } from "../utils/AppError";
import {
  findAccountByEmail,
  findAccountById,
  incrementFailedLogins,
  rolesOf,
  updateAccount,
  type Account,
} from "./account.service";
import { generateOpaqueToken, hashToken, signAccessToken } from "./token.service";

const MAX_FAILED_LOGINS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const INVALID_CREDENTIALS = "Invalid email or password";

export type ClientMeta = { ip?: string; userAgent?: string };

export type Session = {
  account: Account;
  accessToken: string;
  refreshToken: string;
};

export function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, { algorithm: "argon2id" });
}

// Verifying against a throwaway hash when the email is unknown keeps response times
// indistinguishable, so attackers cannot enumerate registered emails.
let dummyHash: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  dummyHash ??= hashPassword(crypto.randomBytes(32).toString("hex"));
  return dummyHash;
}

export async function login(email: string, password: string): Promise<Account> {
  const account = await findAccountByEmail(email, true);

  if (!account) {
    await Bun.password.verify(password, await getDummyHash());
    throw new AppError(401, INVALID_CREDENTIALS);
  }

  const { motDePasseHash, tentativesEchouees, verrouilleJusqua } = account.doc;
  const passwordOk = await Bun.password.verify(password, motDePasseHash);
  const isLocked = !!verrouilleJusqua && verrouilleJusqua.getTime() > Date.now();

  if (isLocked) throw new AppError(401, INVALID_CREDENTIALS);

  if (!passwordOk) {
    if ((await incrementFailedLogins(account)) >= MAX_FAILED_LOGINS) {
      await updateAccount(account, {
        $set: { verrouilleJusqua: new Date(Date.now() + LOCK_DURATION_MS), tentativesEchouees: 0 },
      });
      httpLogger.logger.warn({ accountId: account.doc.id, type: account.type }, "account locked after repeated failed logins");
    }
    throw new AppError(401, INVALID_CREDENTIALS);
  }

  if (tentativesEchouees > 0 || verrouilleJusqua) {
    await updateAccount(account, { $set: { tentativesEchouees: 0, verrouilleJusqua: null } });
  }

  return account;
}

async function issueRefreshToken(account: Account, family: string, meta: ClientMeta): Promise<string> {
  const refreshToken = generateOpaqueToken();
  await RefreshToken.create({
    accountId: account.doc._id,
    accountType: account.type,
    tokenHash: hashToken(refreshToken),
    family,
    expiresAt: new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000),
    createdByIp: meta.ip?.slice(0, 64),
    userAgent: meta.userAgent?.slice(0, 512),
  });
  return refreshToken;
}

function accessTokenFor(account: Account): string {
  return signAccessToken(account.doc.id, rolesOf(account));
}

export async function createSession(account: Account, meta: ClientMeta): Promise<Session> {
  const refreshToken = await issueRefreshToken(account, crypto.randomUUID(), meta);
  return { account, accessToken: accessTokenFor(account), refreshToken };
}

async function revokeFamily(family: string): Promise<void> {
  await RefreshToken.updateMany({ family, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

export async function rotateSession(rawRefreshToken: string, meta: ClientMeta): Promise<Session> {
  const tokenHash = hashToken(rawRefreshToken);

  // Atomically claim the token so two concurrent refreshes cannot both succeed.
  const current = await RefreshToken.findOneAndUpdate(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );

  if (!current) {
    const reused = await RefreshToken.findOne({ tokenHash });
    if (reused) {
      await revokeFamily(reused.family);
      httpLogger.logger.warn({ accountId: String(reused.accountId) }, "refresh token reuse detected; session family revoked");
    }
    throw new AppError(401, "Invalid session");
  }

  if (current.expiresAt.getTime() <= Date.now()) throw new AppError(401, "Session expired");

  const account = await findAccountById(current.accountType, String(current.accountId));
  if (!account) {
    await revokeFamily(current.family);
    throw new AppError(401, "Invalid session");
  }

  const refreshToken = await issueRefreshToken(account, current.family, meta);
  await RefreshToken.updateOne({ _id: current._id }, { $set: { replacedByHash: hashToken(refreshToken) } });

  return { account, accessToken: accessTokenFor(account), refreshToken };
}

export async function revokeSession(rawRefreshToken: string): Promise<void> {
  const current = await RefreshToken.findOne({ tokenHash: hashToken(rawRefreshToken) });
  if (current) await revokeFamily(current.family);
}

export async function revokeAllSessions(accountId: string): Promise<void> {
  await RefreshToken.updateMany({ accountId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}
