// Makes sure the platform always has at least one super admin and one admin
// (plus one sub admin when DEFAULT_SUB_ADMIN_* is filled in).
// Runs automatically on server startup, or manually with: bun run seed:accounts
// Credentials come from the DEFAULT_* variables in .env, never from code.
import { env, type AdminDefaults } from "./config/env";
import { connectMongo, disconnectMongo } from "./db/mongoose";
import { httpLogger } from "./middleware/logger";
import { Admin, type AdminRole } from "./models/Admin";
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

async function ensureAdminWithRole(role: AdminRole, defaults: AdminDefaults | null, envPrefix: string, required: boolean): Promise<void> {
  if (await Admin.exists({ role })) return;

  if (!defaults?.password) {
    if (required) log.warn(`No ${role} exists and ${envPrefix}_* (with password) is not set in .env; skipping`);
    return;
  }
  if (await isLoginEmailTaken(defaults.email)) {
    log.warn({ email: defaults.email }, `Cannot create default ${role}: email already used by another account`);
    return;
  }

  const { password, ...profile } = defaults;
  await Admin.create({ ...profile, role, motDePasseHash: await hashPassword(password) });
  log.info({ email: defaults.email }, `Default ${role} created`);
}

export async function ensureDefaultAccounts(): Promise<void> {
  await ensureSuperAdmin();
  await ensureAdminWithRole("admin", env.defaultAccounts.admin, "DEFAULT_ADMIN", true);
  await ensureAdminWithRole("sub_admin", env.defaultAccounts.subAdmin, "DEFAULT_SUB_ADMIN", false);
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
