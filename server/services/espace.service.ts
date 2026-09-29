import mongoose from "mongoose";
import { Abonnement } from "../models/Abonnement";
import { AbonnementUser } from "../models/AbonnementUser";
import type { AdminDocument } from "../models/Admin";
import { getResidenceDetails } from "./residence.service";

// `sanitizeFilter` rejects raw `$` operators in filters; these values are built server-side.
const trusted = <T extends object>(filter: T) => mongoose.trusted(filter) as T;

async function currentPaidSubscription(idAdmin: string) {
  const now = new Date();
  const souscription = await AbonnementUser.findOne({
    idAdmin,
    statutPaiement: true,
    debut: trusted({ $lte: now }),
    fin: trusted({ $gt: now }),
  }).sort({ fin: -1 });
  if (!souscription) return null;
  const plan = await Abonnement.findById(souscription.idAbonnement);
  return { nom: plan?.nom ?? null, debut: souscription.debut, fin: souscription.fin };
}

// What an admin / sub_admin sees after login: his residence, and either all its buildings (admin)
// or only the building he is responsible for (sub_admin).
export async function getEspace(account: AdminDocument) {
  if (!account.idResidence) return { role: account.role, residence: null, admin: null, batiments: [], abonnement: null };

  const details = await getResidenceDetails(String(account.idResidence));
  const batiments =
    account.role === "sub_admin" ? details.batiments.filter((b) => b.id === String(account.idBatiment)) : details.batiments;
  const payerId = account.role === "admin" ? (account.id as string) : details.admin?.id;

  return {
    role: account.role,
    residence: details.residence,
    admin: details.admin,
    batiments,
    abonnement: payerId ? await currentPaidSubscription(payerId) : null,
  };
}
