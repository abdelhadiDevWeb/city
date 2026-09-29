import mongoose, { type Types } from "mongoose";
import type { AdminDocument } from "../models/Admin";
import { Appartement, type AppartementDocument } from "../models/Appartement";
import { Batiment, type BatimentDocument } from "../models/Batiment";
import { User, type UserDocument } from "../models/User";
import { AppError } from "../utils/AppError";
import { isDuplicateKeyError } from "../utils/mongo";

// `sanitizeFilter` rejects raw `$` operators in filters; these ids come from our own queries.
const inIds = (ids: Types.ObjectId[]) => mongoose.trusted({ $in: ids });
const FLAT_COLLATION = { locale: "fr", strength: 1 };

export type NewResident = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nin: string;
  idBatiment: string;
  etage: number;
  appartement: string;
};

const etageLabel = (etage: number) => (etage === 0 ? "rez-de-chaussée" : etage === 1 ? "1er étage" : `${etage}e étage`);

// An admin manages the users of his residence; a sub_admin only those of his building.
function scopeOf(actor: AdminDocument) {
  if (actor.role === "admin") {
    if (!actor.idResidence) throw new AppError(403, "Aucune résidence ne vous est attribuée");
    return { idResidence: actor.idResidence };
  }
  if (!actor.idBatiment) throw new AppError(403, "Aucun bâtiment ne vous est attribué");
  return { idBatiment: actor.idBatiment };
}

function residentJson(user: UserDocument, batiment: BatimentDocument | undefined, appartement: AppartementDocument | undefined) {
  return {
    ...user.toJSON(),
    id: user.id as string,
    batiment: batiment ? { id: batiment.id as string, nom: batiment.nom } : null,
    appartement: appartement ? { id: appartement.id as string, nom: appartement.nom, etage: appartement.etage } : null,
  };
}

export async function listResidents(actor: AdminDocument) {
  const users = await User.find(scopeOf(actor)).sort({ createdAt: -1 });
  const batimentIds = users.flatMap((u) => (u.idBatiment ? [u.idBatiment] : []));
  const appartementIds = users.flatMap((u) => (u.idAppartement ? [u.idAppartement] : []));

  const [batiments, appartements] = await Promise.all([
    batimentIds.length ? Batiment.find({ _id: inIds(batimentIds) }) : [],
    appartementIds.length ? Appartement.find({ _id: inIds(appartementIds) }) : [],
  ]);
  const batimentById = new Map(batiments.map((b) => [b.id as string, b]));
  const appartementById = new Map(appartements.map((a) => [a.id as string, a]));

  return users.map((u) =>
    residentJson(u, batimentById.get(String(u.idBatiment)), appartementById.get(String(u.idAppartement))),
  );
}

// Reuses the flat if it already exists in the building and is free; creates it otherwise.
async function findOrCreateFlat(batiment: BatimentDocument, nom: string, etage: number): Promise<AppartementDocument> {
  const existing = await Appartement.findOne({ idBatiment: batiment._id, nom }).collation(FLAT_COLLATION);
  if (existing) {
    if (existing.idProprietaire) throw new AppError(409, `L'appartement ${existing.nom} a déjà un propriétaire`);
    if (existing.etage !== etage) {
      throw new AppError(409, `L'appartement ${existing.nom} existe déjà au ${etageLabel(existing.etage)} de ce bâtiment`);
    }
    return existing;
  }

  try {
    return await Appartement.create({ idBatiment: batiment._id, nom, etage });
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new AppError(409, "Cet appartement vient d'être créé par quelqu'un d'autre, réessayez");
    throw err;
  }
}

export async function createResident(actor: AdminDocument, input: NewResident) {
  const batiment = await Batiment.findById(input.idBatiment);
  if (!batiment) throw new AppError(404, "Bâtiment introuvable");

  const scope = scopeOf(actor);
  const allowed = "idResidence" in scope ? batiment.idResidence.equals(scope.idResidence) : batiment._id.equals(scope.idBatiment);
  if (!allowed) {
    throw new AppError(
      403,
      actor.role === "admin" ? "Ce bâtiment n'appartient pas à votre résidence" : "Vous ne pouvez ajouter des résidents que dans votre bâtiment",
    );
  }

  if (input.etage > batiment.etages) {
    throw new AppError(400, `Le bâtiment ${batiment.nom} a ${batiment.etages} étage(s) : choisissez un étage entre 0 (rez-de-chaussée) et ${batiment.etages}`);
  }

  const [emailTaken, ninTaken] = await Promise.all([User.exists({ email: input.email }), User.exists({ nin: input.nin })]);
  if (emailTaken) throw new AppError(409, "Cet email est déjà utilisé par un autre résident");
  if (ninTaken) throw new AppError(409, "Ce NIN est déjà enregistré pour un autre résident");

  const appartement = await findOrCreateFlat(batiment, input.appartement, input.etage);

  let user: UserDocument;
  try {
    user = await User.create({
      prenom: input.prenom,
      nom: input.nom,
      email: input.email,
      telephone: input.telephone,
      nin: input.nin,
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

  return residentJson(user, batiment, claimed);
}
