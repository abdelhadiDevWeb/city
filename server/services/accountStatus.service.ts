import mongoose, { type Types } from "mongoose";
import { AbonnementUser } from "../models/AbonnementUser";
import { Admin, type IAdmin } from "../models/Admin";

// `sanitizeFilter` rejects raw `$` operators in filters; these values are built server-side.
const trusted = <T extends object>(filter: T) => mongoose.trusted(filter) as T;

type StatusSubject = Pick<IAdmin, "role" | "idResidence"> & { _id: Types.ObjectId };

export const INACTIVE_ACCOUNT_MESSAGE = "Compte inactif : aucun abonnement payé en cours. Contactez le Super Admin.";

// Status is derived, never stored, so it turns false by itself when a subscription ends or is marked unpaid.
// An admin is active with a paid subscription covering `now`; a sub_admin is active when his residence's admin is.
export async function activeAccountIds(accounts: StatusSubject[], now = new Date()): Promise<Set<string>> {
  const residenceIds = accounts.flatMap((a) => (a.role === "sub_admin" && a.idResidence ? [a.idResidence] : []));
  const residenceAdmins = residenceIds.length
    ? await Admin.find({ role: "admin", idResidence: trusted({ $in: residenceIds }) }, { idResidence: 1 })
    : [];
  const adminByResidence = new Map(residenceAdmins.map((a) => [String(a.idResidence), a._id]));

  const payerIds = [...accounts.filter((a) => a.role === "admin").map((a) => a._id), ...adminByResidence.values()];
  const paid = payerIds.length
    ? await AbonnementUser.find(
        { idAdmin: trusted({ $in: payerIds }), statutPaiement: true, debut: trusted({ $lte: now }), fin: trusted({ $gt: now }) },
        { idAdmin: 1 },
      )
    : [];
  const payers = new Set(paid.map((s) => String(s.idAdmin)));

  return new Set(
    accounts
      .filter((a) => {
        if (a.role === "admin") return payers.has(String(a._id));
        const residenceAdmin = a.idResidence ? adminByResidence.get(String(a.idResidence)) : undefined;
        return !!residenceAdmin && payers.has(String(residenceAdmin));
      })
      .map((a) => String(a._id)),
  );
}

export async function isAccountActive(account: StatusSubject): Promise<boolean> {
  return (await activeAccountIds([account])).has(String(account._id));
}
