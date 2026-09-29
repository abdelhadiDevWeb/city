import mongoose, { type Types } from "mongoose";
import { Abonnement, type AbonnementDocument } from "../models/Abonnement";
import { AbonnementUser, type AbonnementUserDocument } from "../models/AbonnementUser";
import { Admin } from "../models/Admin";
import { Residence } from "../models/Residence";
import { AppError } from "../utils/AppError";
import { isDuplicateKeyError } from "../utils/mongo";
import { activeAccountIds } from "./accountStatus.service";

// `sanitizeFilter` rejects raw `$` operators in filters; these values are built server-side.
const trusted = <T extends object>(filter: T) => mongoose.trusted(filter) as T;
const inIds = (ids: Types.ObjectId[]) => trusted({ $in: ids });

// Adds calendar months in UTC, clamping to the last day of the target month (31 Jan + 1 month = 28/29 Feb).
export function addMonths(date: Date, months: number): Date {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return target;
}

function planJson(plan: AbonnementDocument | undefined) {
  return plan ? { id: plan.id as string, nom: plan.nom, prix: plan.prix, duree: plan.duree } : null;
}

function souscriptionJson(s: AbonnementUserDocument, planById: Map<string, AbonnementDocument>) {
  return {
    id: s.id as string,
    abonnement: planJson(planById.get(String(s.idAbonnement))),
    debut: s.debut,
    fin: s.fin,
    statutPaiement: s.statutPaiement,
  };
}

export async function listPlans() {
  const [plans, counts] = await Promise.all([
    Abonnement.find().sort({ prix: 1 }),
    AbonnementUser.aggregate<{ _id: Types.ObjectId; total: number }>([{ $group: { _id: "$idAbonnement", total: { $sum: 1 } } }]),
  ]);
  const countByPlan = new Map(counts.map((c) => [String(c._id), c.total]));
  return plans.map((p) => ({ ...p.toJSON(), souscriptions: countByPlan.get(p.id) ?? 0 }));
}

export async function createPlan(input: { nom: string; prix: number; duree: number }) {
  try {
    const plan = await Abonnement.create({ nom: input.nom, prix: input.prix, duree: input.duree });
    return { ...plan.toJSON(), souscriptions: 0 };
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new AppError(409, "Une formule porte déjà ce nom");
    throw err;
  }
}

export async function listAdminsWithSubscriptions() {
  const admins = await Admin.find({ role: "admin" }).sort({ createdAt: -1 });
  const residenceIds = admins.flatMap((a) => (a.idResidence ? [a.idResidence] : []));

  const [residences, souscriptions, plans] = await Promise.all([
    Residence.find({ _id: inIds(residenceIds) }),
    AbonnementUser.find({ idAdmin: inIds(admins.map((a) => a._id)) }).sort({ debut: -1 }),
    Abonnement.find(),
  ]);

  const residenceById = new Map(residences.map((r) => [r.id as string, r]));
  const planById = new Map(plans.map((p) => [p.id as string, p]));
  const activeIds = await activeAccountIds(admins);

  return admins.map((a) => {
    const residence = a.idResidence ? residenceById.get(String(a.idResidence)) : undefined;
    return {
      id: a.id as string,
      prenom: a.prenom,
      nom: a.nom,
      email: a.email,
      telephone: a.telephone,
      residence: residence ? { id: residence.id as string, nom: residence.nom } : null,
      actif: activeIds.has(a.id as string),
      souscriptions: souscriptions.filter((s) => s.idAdmin.equals(a._id)).map((s) => souscriptionJson(s, planById)),
    };
  });
}

export async function createSouscription(input: { idAdmin: string; idAbonnement: string; debut: Date; statutPaiement: boolean }) {
  const [admin, plan] = await Promise.all([Admin.findById(input.idAdmin), Abonnement.findById(input.idAbonnement)]);
  if (!admin || admin.role !== "admin") throw new AppError(404, "Admin introuvable");
  if (!plan) throw new AppError(404, "Formule introuvable");

  const debut = input.debut;
  const fin = addMonths(debut, plan.duree);

  const overlapping = await AbonnementUser.exists({ idAdmin: admin._id, debut: trusted({ $lt: fin }), fin: trusted({ $gt: debut }) });
  if (overlapping) throw new AppError(409, "Cet admin a déjà un abonnement sur cette période");

  const souscription = await AbonnementUser.create({
    idAbonnement: plan._id,
    idAdmin: admin._id,
    debut,
    fin,
    statutPaiement: input.statutPaiement,
  });
  return souscriptionJson(souscription, new Map([[plan.id as string, plan]]));
}

export async function setPaymentStatus(id: string, statutPaiement: boolean) {
  const souscription = await AbonnementUser.findOneAndUpdate({ _id: id }, { $set: { statutPaiement } }, { new: true });
  if (!souscription) throw new AppError(404, "Abonnement introuvable");
  const plan = await Abonnement.findById(souscription.idAbonnement);
  return souscriptionJson(souscription, new Map(plan ? [[plan.id as string, plan]] : []));
}
