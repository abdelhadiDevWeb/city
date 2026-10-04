import { Admin, type AdminDocument } from "../models/Admin";
import { Appartement } from "../models/Appartement";
import { Batiment } from "../models/Batiment";
import type { AccountType } from "../models/RefreshToken";
import { Residence } from "../models/Residence";
import { SuperAdmin, type SuperAdminDocument } from "../models/SuperAdmin";
import { User, type UserDocument } from "../models/User";

// Anyone who can log in: a super admin, an admin / sub_admin, or a resident user.
export type Account =
  | { type: "SuperAdmin"; doc: SuperAdminDocument }
  | { type: "Admin"; doc: AdminDocument }
  | { type: "User"; doc: UserDocument };

const SECRET_FIELDS = "+motDePasseHash +tentativesEchouees +verrouilleJusqua";

export function rolesOf(account: Account): string[] {
  if (account.type === "SuperAdmin") return ["super_admin"];
  if (account.type === "Admin") return [account.doc.role];
  return ["resident"];
}

export function accountTypeFromRoles(roles: string[]): AccountType {
  if (roles.includes("super_admin")) return "SuperAdmin";
  if (roles.includes("admin") || roles.includes("sub_admin")) return "Admin";
  return "User";
}

export async function publicAccount(account: Account) {
  const base = { ...account.doc.toJSON(), type: account.type, roles: rolesOf(account) };
  if (account.type === "User") {
    const user = account.doc;
    const [residence, batiment, appartement] = await Promise.all([
      user.idResidence ? Residence.findById(user.idResidence) : null,
      user.idBatiment ? Batiment.findById(user.idBatiment) : null,
      user.idAppartement ? Appartement.findById(user.idAppartement) : null,
    ]);
    return {
      ...base,
      residence: residence ? { id: residence.id, nom: residence.nom, localisation: residence.localisation } : null,
      batiment: batiment ? { id: batiment.id, nom: batiment.nom } : null,
      appartement: appartement ? { id: appartement.id, nom: appartement.nom, etage: appartement.etage } : null,
    };
  }
  return base;
}

export async function findAccountByEmail(email: string, withSecrets = false): Promise<Account | null> {
  const superAdmin = await (withSecrets ? SuperAdmin.findOne({ email }).select(SECRET_FIELDS) : SuperAdmin.findOne({ email }));
  if (superAdmin) return { type: "SuperAdmin", doc: superAdmin };

  const admin = await (withSecrets ? Admin.findOne({ email }).select(SECRET_FIELDS) : Admin.findOne({ email }));
  if (admin) return { type: "Admin", doc: admin };

  const user = await (withSecrets ? User.findOne({ email }).select(SECRET_FIELDS) : User.findOne({ email }));
  if (user) return { type: "User", doc: user };

  return null;
}

export async function findAccountById(type: AccountType, id: string): Promise<Account | null> {
  if (type === "SuperAdmin") {
    const doc = await SuperAdmin.findById(id);
    return doc ? { type, doc } : null;
  }
  if (type === "Admin") {
    const doc = await Admin.findById(id);
    return doc ? { type, doc } : null;
  }
  const doc = await User.findById(id);
  return doc ? { type, doc } : null;
}

// Login looks accounts up by email across all three collections, so an email must be unique across all.
export async function isLoginEmailTaken(email: string): Promise<boolean> {
  const [superAdmin, admin, user] = await Promise.all([
    SuperAdmin.exists({ email }),
    Admin.exists({ email }),
    User.exists({ email }),
  ]);
  return !!superAdmin || !!admin || !!user;
}

export async function updateAccount(account: Account, update: Record<string, unknown>): Promise<void> {
  if (account.type === "SuperAdmin") await SuperAdmin.updateOne({ _id: account.doc._id }, update);
  else if (account.type === "Admin") await Admin.updateOne({ _id: account.doc._id }, update);
  else await User.updateOne({ _id: account.doc._id }, update);
}

export async function incrementFailedLogins(account: Account): Promise<number> {
  const options = { new: true, projection: { tentativesEchouees: 1 } };
  const update = { $inc: { tentativesEchouees: 1 } };
  const updated =
    account.type === "SuperAdmin"
      ? await SuperAdmin.findOneAndUpdate({ _id: account.doc._id }, update, options)
      : account.type === "Admin"
      ? await Admin.findOneAndUpdate({ _id: account.doc._id }, update, options)
      : await User.findOneAndUpdate({ _id: account.doc._id }, update, options);
  return updated?.tentativesEchouees ?? 0;
}
