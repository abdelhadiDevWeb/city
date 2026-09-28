// Makes sure the platform always has at least one super admin and one admin.
// Runs automatically on server startup, or manually with: bun run seed:accounts
// Credentials come from the DEFAULT_* variables in .env, never from code.
import { env } from "./config/env";
import { connectMongo, disconnectMongo } from "./db/mongoose";
import { httpLogger } from "./middleware/logger";
import { Admin } from "./models/Admin";
import { SuperAdmin } from "./models/SuperAdmin";
import { isLoginEmailTaken } from "./services/account.service";
import { hashPassword } from "./services/auth.service";

const log = httpLogger.logger;

async function ensureSuperAdmin(): Promise<void> {
  if (await SuperAdmin.exists({})) return;

  const defaults = env.defaultAccounts.superAdmin;
  if (!defaults?.password) {
    log.warn("No super admin exists and DEFAULT_SUPER_ADMIN_* (with password) is not set in .env; skipping");
    return;
  }
  if (await isLoginEmailTaken(defaults.email)) {
    log.warn({ email: defaults.email }, "Cannot create default super admin: email already used by another account");
    return;
  }

  await SuperAdmin.create({
    nomComplet: defaults.nomComplet,
    email: defaults.email,
    motDePasseHash: await hashPassword(defaults.password),
  });
  log.info({ email: defaults.email }, "Default super admin created");
}

async function ensureAdmin(): Promise<void> {
  if (await Admin.exists({ role: "admin" })) return;

  const defaults = env.defaultAccounts.admin;
  if (!defaults?.password) {
    log.warn("No admin exists and DEFAULT_ADMIN_* (with password) is not set in .env; skipping");
    return;
  }
  if (await isLoginEmailTaken(defaults.email)) {
    log.warn({ email: defaults.email }, "Cannot create default admin: email already used by another account");
    return;
  }

  const { password, ...profile } = defaults;
  await Admin.create({ ...profile, role: "admin", motDePasseHash: await hashPassword(password) });
  log.info({ email: defaults.email }, "Default admin created");
}

export async function ensureDefaultAccounts(): Promise<void> {
  await ensureSuperAdmin();
  await ensureAdmin();
}

if (import.meta.main) {
  await connectMongo();
  try {
    await Promise.all([SuperAdmin.createIndexes(), Admin.createIndexes()]);
    await ensureDefaultAccounts();
  } finally {
    await disconnectMongo();
  }
}
