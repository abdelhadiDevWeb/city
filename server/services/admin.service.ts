import type { Types } from "mongoose";
import { Admin, type AdminRole } from "../models/Admin";
import { Batiment } from "../models/Batiment";
import { Residence } from "../models/Residence";
import { AppError } from "../utils/AppError";
import { isDuplicateKeyError } from "../utils/mongo";
import { isLoginEmailTaken } from "./account.service";
import { hashPassword } from "./auth.service";

export type CreateAdminInput = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  wilaya: string;
  daira: string;
  baladia: string;
  password: string;
} & ({ role: Extract<AdminRole, "admin">; idResidence: string } | { role: Extract<AdminRole, "sub_admin">; idBatiment: string });

// Resolves where the new account is responsible, rejecting posts that are already taken.
async function resolveAssignment(input: CreateAdminInput): Promise<{ idResidence: Types.ObjectId; idBatiment: Types.ObjectId | null }> {
  if (input.role === "admin") {
    const residence = await Residence.findById(input.idResidence);
    if (!residence) throw new AppError(404, "Résidence introuvable");
    if (await Admin.exists({ role: "admin", idResidence: residence._id })) {
      throw new AppError(409, "Cette résidence a déjà un admin responsable");
    }
    return { idResidence: residence._id, idBatiment: null };
  }

  const batiment = await Batiment.findById(input.idBatiment);
  if (!batiment) throw new AppError(404, "Bâtiment introuvable");
  if (await Admin.exists({ role: "sub_admin", idBatiment: batiment._id })) {
    throw new AppError(409, "Ce bâtiment a déjà un sub admin responsable");
  }
  return { idResidence: batiment.idResidence, idBatiment: batiment._id };
}

export async function createAdminAccount(input: CreateAdminInput) {
  const assignment = await resolveAssignment(input);
  if (await isLoginEmailTaken(input.email)) throw new AppError(409, "Cet email est déjà utilisé");

  try {
    const admin = await Admin.create({
      prenom: input.prenom,
      nom: input.nom,
      email: input.email,
      telephone: input.telephone,
      wilaya: input.wilaya,
      daira: input.daira,
      baladia: input.baladia,
      role: input.role,
      ...assignment,
      motDePasseHash: await hashPassword(input.password),
    });
    return admin.toJSON();
  } catch (err) {
    // Lost a race with a concurrent request: same email, or the post was just filled.
    if (isDuplicateKeyError(err)) throw new AppError(409, "Cet email est déjà utilisé ou ce poste vient d'être attribué");
    throw err;
  }
}
