import { SuperAdmin } from "../models/SuperAdmin";
import { AppError } from "../utils/AppError";
import { isDuplicateKeyError } from "../utils/mongo";
import { isLoginEmailTaken } from "./account.service";
import { hashPassword } from "./auth.service";

export async function listSuperAdmins() {
  const superAdmins = await SuperAdmin.find().sort({ createdAt: 1 });
  return superAdmins.map((s) => s.toJSON());
}

export async function createSuperAdmin(input: { nomComplet: string; email: string; password: string }) {
  if (await isLoginEmailTaken(input.email)) throw new AppError(409, "Cet email est déjà utilisé");

  try {
    const superAdmin = await SuperAdmin.create({
      nomComplet: input.nomComplet,
      email: input.email,
      motDePasseHash: await hashPassword(input.password),
    });
    return superAdmin.toJSON();
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new AppError(409, "Cet email est déjà utilisé");
  }
}

export async function updateSuperAdmin(id: string, input: { nomComplet?: string; email?: string; password?: string }) {
  const superAdmin = await SuperAdmin.findById(id);
  if (!superAdmin) throw new AppError(404, "Super Admin introuvable");
  if (input.email && input.email.toLowerCase() !== superAdmin.email) {
    if (await isLoginEmailTaken(input.email)) throw new AppError(409, "Cet email est déjà utilisé");
    superAdmin.email = input.email.toLowerCase();
  }
  if (input.nomComplet !== undefined) superAdmin.nomComplet = input.nomComplet;
  if (input.password) superAdmin.motDePasseHash = await hashPassword(input.password);
  await superAdmin.save();
  return superAdmin.toJSON();
}

export async function deleteSuperAdmin(id: string, currentId?: string) {
  if (id === currentId) {
    throw new AppError(400, "Vous ne pouvez pas supprimer votre propre compte.");
  }
  const count = await SuperAdmin.countDocuments();
  if (count <= 1) {
    throw new AppError(400, "Impossible de supprimer le seul Super Admin existant.");
  }
  const deleted = await SuperAdmin.findByIdAndDelete(id);
  if (!deleted) throw new AppError(404, "Super Admin introuvable");
  return { ok: true };
}
