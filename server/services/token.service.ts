import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtUser = {
  sub: string;
  roles: string[];
  idResidence?: string;
};

const ALGORITHM = "HS256";

export function signAccessToken(accountId: string, roles: string[], idResidence?: string): string {
  const payload: Record<string, unknown> = { roles };
  if (idResidence) payload.idResidence = idResidence;

  return jwt.sign(payload, env.jwt.accessSecret, {
    algorithm: ALGORITHM,
    subject: accountId,
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
    expiresIn: env.jwt.accessTtlSeconds,
    jwtid: crypto.randomUUID(),
  });
}

// Throws if the token is invalid, expired, or signed with any other algorithm.
export function verifyAccessToken(token: string): JwtUser {
  const decoded = jwt.verify(token, env.jwt.accessSecret, {
    algorithms: [ALGORITHM],
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
  });

  if (typeof decoded === "string" || !decoded.sub) throw new Error("Invalid token payload");
  const payload = decoded as jwt.JwtPayload;
  const roles = Array.isArray(payload.roles) ? payload.roles.filter((r): r is string => typeof r === "string") : [];
  const idResidence = typeof payload.idResidence === "string" ? payload.idResidence : undefined;
  const sub = typeof payload.sub === "string" ? payload.sub : String(payload.sub);
  return { sub, roles, idResidence };
}

export function generateOpaqueToken(bytes = 48): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
