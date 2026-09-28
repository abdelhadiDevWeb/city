import { Admin, type AdminDocument } from "../models/Admin";
import type { AccountType } from "../models/RefreshToken";
import { SuperAdmin, type SuperAdminDocument } from "../models/SuperAdmin";

// Anyone who can log in: a super admin, or an admin / sub_admin.
export type Account =
  | { type: "SuperAdmin"; doc: SuperAdminDocument }
  | { type: "Admin"; doc: AdminDocument };

const SECRET_FIELDS = "+motDePasseHash +tentativesEchouees +verrouilleJusqua";

export function rolesOf(account: Account): string[] {
  return account.type === "SuperAdmin" ? ["super_admin"] : [account.doc.role];
}

export function accountTypeFromRoles(roles: string[]): AccountType {
  return roles.includes("super_admin") ? "SuperAdmin" : "Admin";
}

export function publicAccount(account: Account) {
  return { ...account.doc.toJSON(), type: account.type, roles: rolesOf(account) };
}

export async function findAccountByEmail(email: string, withSecrets = false): Promise<Account | null> {
  const superAdmin = await (withSecrets ? SuperAdmin.findOne({ email }).select(SECRET_FIELDS) : SuperAdmin.findOne({ email }));
  if (superAdmin) return { type: "SuperAdmin", doc: superAdmin };

  const admin = await (withSecrets ? Admin.findOne({ email }).select(SECRET_FIELDS) : Admin.findOne({ email }));
  if (admin) return { type: "Admin", doc: admin };

  return null;
}

export async function findAccountById(type: AccountType, id: string): Promise<Account | null> {
  if (type === "SuperAdmin") {
    const doc = await SuperAdmin.findById(id);
    return doc ? { type, doc } : null;
  }
  const doc = await Admin.findById(id);
  return doc ? { type, doc } : null;
}

// Login looks accounts up by email across both collections, so an email must be unique across both.
export async function isLoginEmailTaken(email: string): Promise<boolean> {
  const [superAdmin, admin] = await Promise.all([SuperAdmin.exists({ email }), Admin.exists({ email })]);
  return !!superAdmin || !!admin;
}

export async function updateAccount(account: Account, update: Record<string, unknown>): Promise<void> {
  if (account.type === "SuperAdmin") await SuperAdmin.updateOne({ _id: account.doc._id }, update);
  else await Admin.updateOne({ _id: account.doc._id }, update);
}

export async function incrementFailedLogins(account: Account): Promise<number> {
  const options = { new: true, projection: { tentativesEchouees: 1 } };
  const update = { $inc: { tentativesEchouees: 1 } };
  const updated =
    account.type === "SuperAdmin"
      ? await SuperAdmin.findOneAndUpdate({ _id: account.doc._id }, update, options)
      : await Admin.findOneAndUpdate({ _id: account.doc._id }, update, options);
  return updated?.tentativesEchouees ?? 0;
}
