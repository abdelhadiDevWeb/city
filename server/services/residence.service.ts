import mongoose, { type Types } from "mongoose";
import { Admin, type AdminDocument } from "../models/Admin";
import { Appartement } from "../models/Appartement";
import { Batiment } from "../models/Batiment";
import { Residence } from "../models/Residence";
import { User, type UserDocument } from "../models/User";
import { AppError } from "../utils/AppError";
import { isDuplicateKeyError } from "../utils/mongo";
import { activeAccountIds } from "./accountStatus.service";

// `sanitizeFilter` rejects raw `$` operators in filters; these ids come from our own queries.
const inIds = (ids: Types.ObjectId[]) => mongoose.trusted({ $in: ids });

function responsable(admin: AdminDocument | undefined | null, activeIds: Set<string>) {
  if (!admin) return null;
  return {
    id: admin.id as string,
    prenom: admin.prenom,
    nom: admin.nom,
    email: admin.email,
    telephone: admin.telephone,
    role: admin.role,
    actif: activeIds.has(admin.id as string),
  };
}

function proprietaire(user: UserDocument | undefined) {
  if (!user) return null;
  return { id: user.id as string, prenom: user.prenom, nom: user.nom, email: user.email, telephone: user.telephone };
}

export async function listResidences() {
  const residences = await Residence.find().sort({ createdAt: -1 });
  const ids = residences.map((r) => r._id);

  const [counts, admins] = await Promise.all([
    Batiment.aggregate<{ _id: Types.ObjectId; batiments: number }>([
      { $match: { idResidence: { $in: ids } } },
      { $group: { _id: "$idResidence", batiments: { $sum: 1 } } },
    ]),
    Admin.find({ role: "admin", idResidence: inIds(ids) }),
  ]);

  const countByResidence = new Map(counts.map((c) => [String(c._id), c.batiments]));
  const adminByResidence = new Map(admins.map((a) => [String(a.idResidence), a]));
  const activeIds = await activeAccountIds(admins);

  return residences.map((r) => ({
    ...r.toJSON(),
    batiments: countByResidence.get(r.id) ?? 0,
    admin: responsable(adminByResidence.get(r.id), activeIds),
  }));
}

export async function getResidenceDetails(id: string) {
  const residence = await Residence.findById(id);
  if (!residence) throw new AppError(404, "Résidence introuvable");

  const batiments = await Batiment.find({ idResidence: residence._id }).sort({ nom: 1 }).collation({ locale: "fr", numericOrdering: true });
  const batimentIds = batiments.map((b) => b._id);

  const [admin, sousAdmins, appartements] = await Promise.all([
    Admin.findOne({ role: "admin", idResidence: residence._id }),
    Admin.find({ role: "sub_admin", idBatiment: inIds(batimentIds) }),
    Appartement.find({ idBatiment: inIds(batimentIds) }).sort({ etage: 1, nom: 1 }).collation({ locale: "fr", numericOrdering: true }),
  ]);

  const ownerIds = appartements.flatMap((a) => (a.idProprietaire ? [a.idProprietaire] : []));
  const owners = ownerIds.length ? await User.find({ _id: inIds(ownerIds) }) : [];
  const ownerById = new Map(owners.map((u) => [u.id as string, u]));
  const sousAdminByBatiment = new Map(sousAdmins.map((a) => [String(a.idBatiment), a]));
  const activeIds = await activeAccountIds(admin ? [admin, ...sousAdmins] : sousAdmins);

  return {
    residence: residence.toJSON(),
    admin: responsable(admin, activeIds),
    batiments: batiments.map((b) => ({
      ...b.toJSON(),
      id: b.id as string,
      sousAdmin: responsable(sousAdminByBatiment.get(b.id), activeIds),
      appartements: appartements
        .filter((a) => a.idBatiment.equals(b._id))
        .map((a) => ({ id: a.id as string, nom: a.nom, etage: a.etage, proprietaire: proprietaire(a.idProprietaire ? ownerById.get(String(a.idProprietaire)) : undefined) })),
    })),
  };
}

export async function createResidence(input: { nom: string; localisation: string }) {
  const residence = await Residence.create({ nom: input.nom, localisation: input.localisation });
  return { ...residence.toJSON(), batiments: 0, admin: null };
}

export async function createBatiment(residenceId: string, input: { nom: string; etages: number }) {
  if (!(await Residence.exists({ _id: residenceId }))) throw new AppError(404, "Résidence introuvable");

  try {
    const batiment = await Batiment.create({ nom: input.nom, etages: input.etages, idResidence: residenceId });
    return batiment.toJSON();
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new AppError(409, "Un bâtiment porte déjà ce nom dans cette résidence");
    throw err;
  }
}
