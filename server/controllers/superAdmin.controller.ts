import * as superAdminService from "../services/superAdmin.service";
import { asyncHandler } from "../utils/AppError";

export const list = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, superAdmins: await superAdminService.listSuperAdmins() });
});

export const create = asyncHandler(async (req, res) => {
  const superAdmin = await superAdminService.createSuperAdmin(req.body as { nomComplet: string; email: string; password: string });
  res.status(201).json({ ok: true, superAdmin });
});
