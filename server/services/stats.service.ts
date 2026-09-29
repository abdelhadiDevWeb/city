import mongoose, { type Model } from "mongoose";
import { Abonnement } from "../models/Abonnement";
import { AbonnementUser } from "../models/AbonnementUser";
import { Admin } from "../models/Admin";
import { Appartement } from "../models/Appartement";
import { Batiment } from "../models/Batiment";
import { Residence } from "../models/Residence";
import { SuperAdmin } from "../models/SuperAdmin";
import { User } from "../models/User";

const MONTHS = 12;

// `sanitizeFilter` rejects raw `$` operators in filters; these values are built server-side.
const trusted = <T extends object>(filter: T) => mongoose.trusted(filter) as T;

const monthKey = (date: Date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

async function createdPerMonth(model: Model<any>, since: Date): Promise<Map<string, number>> {
  const rows = await model.aggregate<{ _id: string; total: number }>([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, total: { $sum: 1 } } },
  ]);
  return new Map(rows.map((r) => [r._id, r.total]));
}

export async function getStats() {
  const now = new Date();
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS - 1), 1));
  const months = Array.from({ length: MONTHS }, (_, i) => monthKey(new Date(Date.UTC(since.getUTCFullYear(), since.getUTCMonth() + i, 1))));
  const beforeWindow = { createdAt: trusted({ $lt: since }) };

  const [
    residences,
    batiments,
    appartements,
    appartementsAvecProprietaire,
    admins,
    sousAdmins,
    superAdmins,
    users,
    formules,
    souscriptions,
    souscriptionsActives,
    baseResidences,
    baseBatiments,
    baseComptes,
    residencesParMois,
    batimentsParMois,
    comptesParMois,
    paiements,
    batimentsParResidence,
    abonnementsParFormule,
  ] = await Promise.all([
    Residence.countDocuments(),
    Batiment.countDocuments(),
    Appartement.countDocuments(),
    Appartement.countDocuments({ idProprietaire: trusted({ $ne: null }) }),
    Admin.countDocuments({ role: "admin" }),
    Admin.countDocuments({ role: "sub_admin" }),
    SuperAdmin.countDocuments(),
    User.countDocuments(),
    Abonnement.countDocuments(),
    AbonnementUser.countDocuments(),
    AbonnementUser.countDocuments({ debut: trusted({ $lte: now }), fin: trusted({ $gt: now }) }),
    Residence.countDocuments(beforeWindow),
    Batiment.countDocuments(beforeWindow),
    Admin.countDocuments(beforeWindow),
    createdPerMonth(Residence, since),
    createdPerMonth(Batiment, since),
    createdPerMonth(Admin, since),
    AbonnementUser.aggregate<{ _id: { mois: string; paye: boolean }; montant: number; total: number }>([
      { $lookup: { from: Abonnement.collection.name, localField: "idAbonnement", foreignField: "_id", as: "plan" } },
      { $unwind: "$plan" },
      {
        $group: {
          _id: { mois: { $dateToString: { format: "%Y-%m", date: "$debut" } }, paye: "$statutPaiement" },
          montant: { $sum: "$plan.prix" },
          total: { $sum: 1 },
        },
      },
    ]),
    Batiment.aggregate<{ nom: string; batiments: number }>([
      { $group: { _id: "$idResidence", batiments: { $sum: 1 } } },
      { $sort: { batiments: -1 } },
      { $limit: 8 },
      { $lookup: { from: Residence.collection.name, localField: "_id", foreignField: "_id", as: "residence" } },
      { $unwind: "$residence" },
      { $project: { _id: 0, nom: "$residence.nom", batiments: 1 } },
    ]),
    AbonnementUser.aggregate<{ nom: string; souscriptions: number }>([
      { $group: { _id: "$idAbonnement", souscriptions: { $sum: 1 } } },
      { $lookup: { from: Abonnement.collection.name, localField: "_id", foreignField: "_id", as: "plan" } },
      { $unwind: "$plan" },
      { $sort: { souscriptions: -1 } },
      { $project: { _id: 0, nom: "$plan.nom", souscriptions: 1 } },
    ]),
  ]);

  const sumWhere = (paye: boolean, field: "montant" | "total", mois?: string) =>
    paiements.filter((p) => p._id.paye === paye && (!mois || p._id.mois === mois)).reduce((sum, p) => sum + p[field], 0);

  return {
    totaux: {
      residences,
      batiments,
      appartements,
      appartementsAvecProprietaire,
      admins,
      sousAdmins,
      superAdmins,
      users,
      formules,
      souscriptions,
      souscriptionsActives,
      souscriptionsPayees: sumWhere(true, "total"),
      souscriptionsImpayees: sumWhere(false, "total"),
    },
    revenus: { encaisse: sumWhere(true, "montant"), enAttente: sumWhere(false, "montant") },
    baseline: { residences: baseResidences, batiments: baseBatiments, comptes: baseComptes },
    mensuel: months.map((mois) => ({
      mois,
      residences: residencesParMois.get(mois) ?? 0,
      batiments: batimentsParMois.get(mois) ?? 0,
      comptes: comptesParMois.get(mois) ?? 0,
      souscriptions: sumWhere(true, "total", mois) + sumWhere(false, "total", mois),
      revenus: sumWhere(true, "montant", mois),
    })),
    batimentsParResidence,
    abonnementsParFormule,
  };
}
