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
    throw err;
  }
}
