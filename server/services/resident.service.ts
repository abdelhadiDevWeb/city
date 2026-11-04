import mongoose, { type Types } from "mongoose";
import type { AdminDocument } from "../models/Admin";
import { Appartement, type AppartementDocument } from "../models/Appartement";
import { Batiment, type BatimentDocument } from "../models/Batiment";
import { Charge } from "../models/Charge";
import { RefreshToken } from "../models/RefreshToken";
import { User, type UserDocument } from "../models/User";
import { AppError } from "../utils/AppError";
import { isDuplicateKeyError } from "../utils/mongo";
import { isLoginEmailTaken } from "./account.service";
import { hashPassword } from "./auth.service";

// `sanitizeFilter` rejects raw `$` operators in filters; these ids come from our own queries.
const trusted = <T extends object>(filter: T) => mongoose.trusted(filter) as T;
const inIds = (ids: Types.ObjectId[]) => trusted({ $in: ids });
const FLAT_COLLATION = { locale: "fr", strength: 1 };

export type NewResident = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nin?: string | null;
  idBatiment: string;
  etage: number;
  appartement: string;
  password?: string;
};

export type ActorInfo = { sub: string; roles: string[] } | AdminDocument;

const etageLabel = (etage: number) => (etage === 0 ? "rez-de-chaussée" : etage === 1 ? "1er étage" : `${etage}e étage`);

function isSuperAdminActor(actor: ActorInfo): boolean {
  if ("roles" in actor && Array.isArray(actor.roles)) {
    return actor.roles.includes("super_admin");
  }
  return false;
}

// An admin manages the users of his residence; a sub_admin only those of his building; super_admin can see all.
function scopeOf(actor: ActorInfo, residenceIdFilter?: string) {
  if (isSuperAdminActor(actor)) {
    return residenceIdFilter ? { idResidence: new mongoose.Types.ObjectId(residenceIdFilter) } : {};
  }
  const admin = actor as AdminDocument;
  if (admin.role === "admin") {
    if (!admin.idResidence) throw new AppError(403, "Aucune résidence ne vous est attribuée");
    return { idResidence: admin.idResidence };
  }
  if (!admin.idBatiment) throw new AppError(403, "Aucun bâtiment ne vous est attribué");
  return { idBatiment: admin.idBatiment };
}

function residentJson(user: UserDocument, batiment: BatimentDocument | undefined, appartement: AppartementDocument | undefined) {
  return {
    ...user.toJSON(),
    id: user.id as string,
    batiment: batiment ? { id: batiment.id as string, nom: batiment.nom } : null,
    appartement: appartement ? { id: appartement.id as string, nom: appartement.nom, etage: appartement.etage } : null,
  };
}

export async function listResidents(actor: ActorInfo, residenceIdFilter?: string) {
  const users = await User.find(scopeOf(actor, residenceIdFilter)).sort({ createdAt: -1 });
  const batimentIds = users.flatMap((u) => (u.idBatiment ? [u.idBatiment] : []));
  const appartementIds = users.flatMap((u) => (u.idAppartement ? [u.idAppartement] : []));

  const [batiments, appartements] = await Promise.all([
    batimentIds.length ? Batiment.find({ _id: inIds(batimentIds) }) : [],
    appartementIds.length ? Appartement.find({ _id: inIds(appartementIds) }) : [],
  ]);
  const batimentById = new Map(batiments.map((b) => [b.id as string, b]));
  const appartementById = new Map(appartements.map((a) => [a.id as string, a]));

  const activeResidents = users.filter((u) => u.idBatiment && batimentById.has(String(u.idBatiment)));

  return activeResidents.map((u) =>
    residentJson(u, batimentById.get(String(u.idBatiment)), appartementById.get(String(u.idAppartement))),
  );
}

// Reuses the flat if it already exists in the building and is free; creates it otherwise (enforcing maxAppartements).
async function findOrCreateFlat(batiment: BatimentDocument, nom: string, etage: number): Promise<AppartementDocument> {
  const existing = await Appartement.findOne({ idBatiment: batiment._id, nom }).collation(FLAT_COLLATION);
  if (existing) {
    if (existing.idProprietaire) throw new AppError(409, `L'appartement ${existing.nom} a déjà un propriétaire`);
    if (existing.etage !== etage) {
      throw new AppError(409, `L'appartement ${existing.nom} existe déjà au ${etageLabel(existing.etage)} de ce bâtiment`);
    }
    return existing;
  }

  const maxAllowed = batiment.maxAppartements ?? 50;
  const currentCount = await Appartement.countDocuments({ idBatiment: batiment._id });
  if (currentCount >= maxAllowed) {
    throw new AppError(403, `Quota d'appartements atteint (${maxAllowed} max) pour le bâtiment ${batiment.nom}`);
  }

  try {
    return await Appartement.create({ idBatiment: batiment._id, nom, etage });
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new AppError(409, "Cet appartement vient d'être créé par quelqu'un d'autre, réessayez");
    throw err;
  }
}

export async function createResident(actor: ActorInfo, input: NewResident) {
  const batiment = await Batiment.findById(input.idBatiment);
  if (!batiment) throw new AppError(404, "Bâtiment introuvable");

  if (!isSuperAdminActor(actor)) {
    const scope = scopeOf(actor);
    const allowed = "idResidence" in scope ? batiment.idResidence.equals(scope.idResidence) : batiment._id.equals(scope.idBatiment);
    if (!allowed) {
      const admin = actor as AdminDocument;
      throw new AppError(
        403,
        admin.role === "admin" ? "Ce bâtiment n'appartient pas à votre résidence" : "Vous ne pouvez ajouter des résidents que dans votre bâtiment",
      );
    }
  }

  if (input.etage > batiment.etages) {
    throw new AppError(400, `Le bâtiment ${batiment.nom} a ${batiment.etages} étage(s) : choisissez un étage entre 0 (rez-de-chaussée) et ${batiment.etages}`);
  }

  const cleanedNin = input.nin?.trim() ? input.nin.trim() : null;
  const [emailTaken, ninTaken] = await Promise.all([
    isLoginEmailTaken(input.email),
    cleanedNin ? User.exists({ nin: cleanedNin }) : Promise.resolve(null),
  ]);
  if (emailTaken) throw new AppError(409, "Cet email est déjà utilisé par un compte (résident ou administrateur)");
  if (ninTaken) throw new AppError(409, "Ce NIN est déjà enregistré pour un autre résident");

  const appartement = await findOrCreateFlat(batiment, input.appartement, input.etage);

  const initialPassword = input.password?.trim() || "City@2026";
  const motDePasseHash = await hashPassword(initialPassword);

  let user: UserDocument;
  try {
    user = await User.create({
      prenom: input.prenom,
      nom: input.nom,
      email: input.email,
      telephone: input.telephone,
      ...(cleanedNin ? { nin: cleanedNin } : {}),
      motDePasseHash,
      idResidence: batiment.idResidence,
      idBatiment: batiment._id,
      idAppartement: appartement._id,
    });
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new AppError(409, "Cet email ou ce NIN vient d'être enregistré pour un autre résident");
    throw err;
  }

  // Claim the flat atomically so two concurrent requests can't both become its owner.
  const claimed = await Appartement.findOneAndUpdate(
    { _id: appartement._id, idProprietaire: null },
    { $set: { idProprietaire: user._id } },
    { new: true },
  );
  if (!claimed) {
    await User.deleteOne({ _id: user._id });
    throw new AppError(409, `L'appartement ${appartement.nom} vient d'être attribué à un autre propriétaire`);
  }

  return {
    ...residentJson(user, batiment, claimed),
    temporaryPassword: initialPassword,
  };
}

export async function updateResident(
  id: string,
  actor: ActorInfo,
  input: Partial<{
    prenom: string;
    nom: string;
    telephone: string;
    email: string;
  }>,
) {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "Résident introuvable");

  if (!isSuperAdminActor(actor)) {
    const scope = scopeOf(actor);
    const allowed = "idResidence" in scope ? user.idResidence?.equals(scope.idResidence) : user.idBatiment?.equals(scope.idBatiment);
    if (!allowed) throw new AppError(403, "Action interdite sur ce résident");
  }

  if (input.email && input.email !== user.email) {
    if (await isLoginEmailTaken(input.email)) throw new AppError(409, "Cet email est déjà utilisé");
    user.email = input.email;
  }
  if (input.prenom !== undefined) user.prenom = input.prenom;
  if (input.nom !== undefined) user.nom = input.nom;
  if (input.telephone !== undefined) user.telephone = input.telephone;

  await user.save();
  return user.toJSON();
}

export async function deleteResident(id: string, actor: ActorInfo) {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "Résident introuvable");

  if (!isSuperAdminActor(actor)) {
    const scope = scopeOf(actor);
    const allowed = "idResidence" in scope ? user.idResidence?.equals(scope.idResidence) : user.idBatiment?.equals(scope.idBatiment);
    if (!allowed) throw new AppError(403, "Action interdite sur ce résident");
  }

  const nameQueries = [
    `${user.prenom} ${user.nom}`,
    user.nom ? `${user.nom} ${user.prenom}` : "",
    user.prenom,
  ].filter(Boolean);

  const chargeOr: Record<string, unknown>[] = [];
  if (nameQueries.length > 0) {
    chargeOr.push({ resident: trusted({ $in: nameQueries }) });
  }
  if (user.telephone) {
    chargeOr.push({ telephone: user.telephone });
  }
  if (user.idAppartement) {
    chargeOr.push({ idAppartement: user.idAppartement });
  }

  const deletions: Promise<unknown>[] = [
    User.findByIdAndDelete(id),
    RefreshToken.deleteMany({ userId: user._id }),
    Appartement.updateMany({ idProprietaire: user._id }, { $set: { idProprietaire: null } }),
  ];

  if (user.idResidence && chargeOr.length > 0) {
    deletions.push(
      Charge.deleteMany({
        idResidence: user.idResidence,
        ...(chargeOr.length > 1 ? trusted({ $or: chargeOr }) : chargeOr[0]),
      }),
    );
  }

  await Promise.all(deletions);

  return { ok: true };
}
