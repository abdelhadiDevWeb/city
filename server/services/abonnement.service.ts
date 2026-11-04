import mongoose, { type Types } from "mongoose";
import { Abonnement, type AbonnementCible, type AbonnementDocument } from "../models/Abonnement";
import { AbonnementUser, type AbonnementUserDocument } from "../models/AbonnementUser";
import { Admin, type AdminDocument } from "../models/Admin";
import { Batiment } from "../models/Batiment";
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
  return plan ? { id: plan.id as string, nom: plan.nom, prix: plan.prix, duree: plan.duree, cible: plan.cible ?? "admin" } : null;
}

function souscriptionJson(s: AbonnementUserDocument, planById: Map<string, AbonnementDocument>) {
  return {
    id: s.id as string,
    idAdmin: String(s.idAdmin),
    roleAbonne: s.roleAbonne,
    abonnement: planJson(planById.get(String(s.idAbonnement))),
    debut: s.debut,
    fin: s.fin,
    statutPaiement: s.statutPaiement,
    modePaiement: s.modePaiement,
    montantPaye: s.montantPaye,
    notesPaiement: s.notesPaiement,
  };
}

export async function listPlans(cible?: AbonnementCible) {
  const query = cible ? { cible } : {};
  const [plans, counts] = await Promise.all([
    Abonnement.find(query).sort({ prix: 1 }),
    AbonnementUser.aggregate<{ _id: Types.ObjectId; total: number }>([{ $group: { _id: "$idAbonnement", total: { $sum: 1 } } }]),
  ]);
  const countByPlan = new Map(counts.map((c) => [String(c._id), c.total]));
  return plans.map((p) => ({ ...p.toJSON(), souscriptions: countByPlan.get(p.id) ?? 0 }));
}

export async function createPlan(input: { nom: string; prix: number; duree: number; cible?: AbonnementCible }) {
  try {
    const plan = await Abonnement.create({
      nom: input.nom,
      prix: input.prix,
      duree: input.duree,
      cible: input.cible ?? "admin",
    });
    return { ...plan.toJSON(), souscriptions: 0 };
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new AppError(409, "Une formule porte déjà ce nom pour ce rôle");
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

export async function listSousAdminsWithSubscriptions(actor?: { sub: string; roles: string[] }) {
  const isSuperAdmin = actor?.roles.includes("super_admin") ?? false;
  let query: Record<string, unknown> = { role: "sub_admin" };

  if (!isSuperAdmin && actor) {
    const creator = await Admin.findById(actor.sub);
    if (!creator || !creator.idResidence) throw new AppError(403, "Aucune résidence attribuée");
    query = { role: "sub_admin", idResidence: creator.idResidence };
  }

  const sousAdmins = await Admin.find(query).sort({ createdAt: -1 });
  const residenceIds = sousAdmins.flatMap((a) => (a.idResidence ? [a.idResidence] : []));
  const batimentIds = sousAdmins.flatMap((a) => (a.idBatiment ? [a.idBatiment] : []));

  const [residences, batiments, souscriptions, plans] = await Promise.all([
    Residence.find({ _id: inIds(residenceIds) }),
    Batiment.find({ _id: inIds(batimentIds) }),
    AbonnementUser.find({ idAdmin: inIds(sousAdmins.map((a) => a._id)) }).sort({ debut: -1 }),
    Abonnement.find(),
  ]);

  const residenceById = new Map(residences.map((r) => [r.id as string, r]));
  const batimentById = new Map(batiments.map((b) => [b.id as string, b]));
  const planById = new Map(plans.map((p) => [p.id as string, p]));
  const activeIds = await activeAccountIds(sousAdmins);
  const now = new Date();

  return sousAdmins.map((a) => {
    const residence = a.idResidence ? residenceById.get(String(a.idResidence)) : undefined;
    const batiment = a.idBatiment ? batimentById.get(String(a.idBatiment)) : undefined;
    const userSubs = souscriptions.filter((s) => s.idAdmin.equals(a._id));
    const aJour = userSubs.some((s) => s.statutPaiement && s.debut <= now && s.fin > now);

    return {
      id: a.id as string,
      prenom: a.prenom,
      nom: a.nom,
      email: a.email,
      telephone: a.telephone,
      residence: residence ? { id: residence.id as string, nom: residence.nom } : null,
      batiment: batiment ? { id: batiment.id as string, nom: batiment.nom } : null,
      actif: activeIds.has(a.id as string),
      aJour,
      souscriptions: userSubs.map((s) => souscriptionJson(s, planById)),
    };
  });
}

export async function getSousAdminKPIs(actor?: { sub: string; roles: string[] }) {
  const list = await listSousAdminsWithSubscriptions(actor);
  const total = list.length;
  const payes = list.filter((s) => s.aJour).length;
  const impayes = total - payes;
  return { total, payes, impayes };
}

export async function createSouscription(
  input: {
    idAdmin: string;
    idAbonnement: string;
    debut: Date;
    statutPaiement: boolean;
    modePaiement?: string;
    montantPaye?: number;
    notesPaiement?: string;
  },
  actor?: { sub: string; roles: string[] },
) {
  const isSuperAdmin = actor?.roles.includes("super_admin") ?? false;
  const [admin, plan] = await Promise.all([Admin.findById(input.idAdmin), Abonnement.findById(input.idAbonnement)]);
  if (!admin) throw new AppError(404, "Gestionnaire introuvable");
  if (!plan) throw new AppError(404, "Formule introuvable");

  if (!isSuperAdmin) {
    if (admin.role !== "sub_admin") {
      throw new AppError(403, "Vous ne pouvez gérer les abonnements que de vos sous-admins");
    }
    const creator = await Admin.findById(actor?.sub);
    if (!creator || !creator.idResidence || !admin.idResidence || !admin.idResidence.equals(creator.idResidence)) {
      throw new AppError(403, "Ce sous-admin n'appartient pas à votre résidence");
    }
  }

  const debut = input.debut;
  const fin = addMonths(debut, plan.duree);

  const overlapping = await AbonnementUser.exists({ idAdmin: admin._id, debut: trusted({ $lt: fin }), fin: trusted({ $gt: debut }) });
  if (overlapping) throw new AppError(409, "Ce gestionnaire a déjà un abonnement sur cette période");

  const souscription = await AbonnementUser.create({
    idAbonnement: plan._id,
    idAdmin: admin._id,
    roleAbonne: admin.role,
    idResidence: admin.idResidence ?? null,
    idBatiment: admin.idBatiment ?? null,
    debut,
    fin,
    statutPaiement: input.statutPaiement,
    modePaiement: input.modePaiement || "Virement bancaire",
    montantPaye: input.montantPaye !== undefined ? input.montantPaye : plan.prix,
    notesPaiement: input.notesPaiement || "",
  });
  return souscriptionJson(souscription, new Map([[plan.id as string, plan]]));
}

export async function setPaymentStatus(
  id: string,
  statutPaiement: boolean,
  actor?: { sub: string; roles: string[] },
) {
  const souscription = await AbonnementUser.findById(id);
  if (!souscription) throw new AppError(404, "Abonnement introuvable");

  const isSuperAdmin = actor?.roles.includes("super_admin") ?? false;
  if (!isSuperAdmin) {
    if (souscription.roleAbonne !== "sub_admin") {
      throw new AppError(403, "Vous ne pouvez modifier que les paiements de vos sous-admins");
    }
    const creator = await Admin.findById(actor?.sub);
    if (!creator || !creator.idResidence || !souscription.idResidence || !souscription.idResidence.equals(creator.idResidence)) {
      throw new AppError(403, "Cet abonnement n'appartient pas à votre résidence");
    }
  }

  souscription.statutPaiement = statutPaiement;
  await souscription.save();

  const plan = await Abonnement.findById(souscription.idAbonnement);
  return souscriptionJson(souscription, new Map(plan ? [[plan.id as string, plan]] : []));
}

export async function updatePlan(id: string, input: Partial<{ nom: string; prix: number; duree: number; cible: AbonnementCible }>) {
  const plan = await Abonnement.findById(id);
  if (!plan) throw new AppError(404, "Formule introuvable");
  if (input.nom !== undefined) plan.nom = input.nom;
  if (input.prix !== undefined) plan.prix = input.prix;
  if (input.duree !== undefined) plan.duree = input.duree;
  if (input.cible !== undefined) plan.cible = input.cible;
  try {
    await plan.save();
    return plan.toJSON();
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new AppError(409, "Une formule porte déjà ce nom pour ce rôle");
    throw err;
  }
}

export async function deletePlan(id: string) {
  const plan = await Abonnement.findById(id);
  if (!plan) throw new AppError(404, "Formule introuvable");
  await Promise.all([
    Abonnement.findByIdAndDelete(id),
    AbonnementUser.deleteMany({ idAbonnement: plan._id }),
  ]);
  return { ok: true };
}

export async function deleteSouscription(id: string, actor?: { sub: string; roles: string[] }) {
  const souscription = await AbonnementUser.findById(id);
  if (!souscription) throw new AppError(404, "Souscription introuvable");

  const isSuperAdmin = actor?.roles.includes("super_admin") ?? false;
  if (!isSuperAdmin) {
    if (souscription.roleAbonne !== "sub_admin") {
      throw new AppError(403, "Vous ne pouvez supprimer que les abonnements de vos sous-admins");
    }
    const creator = await Admin.findById(actor?.sub);
    if (!creator || !creator.idResidence || !souscription.idResidence || !souscription.idResidence.equals(creator.idResidence)) {
      throw new AppError(403, "Cet abonnement n'appartient pas à votre résidence");
    }
  }

  await AbonnementUser.findByIdAndDelete(id);
  return { ok: true };
}
