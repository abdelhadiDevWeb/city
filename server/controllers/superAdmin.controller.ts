import * as superAdminService from "../services/superAdmin.service";
import { asyncHandler } from "../utils/AppError";

export const list = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, superAdmins: await superAdminService.listSuperAdmins() });
});

export const create = asyncHandler(async (req, res) => {
  const superAdmin = await superAdminService.createSuperAdmin(req.body as { nomComplet: string; email: string; password: string });
  res.status(201).json({ ok: true, superAdmin });
});

export const update = asyncHandler(async (req, res) => {
  const superAdmin = await superAdminService.updateSuperAdmin(req.params.id as string, req.body);
  res.status(200).json({ ok: true, superAdmin });
});

export const remove = asyncHandler(async (req, res) => {
  const currentId = req.user?.sub;
  await superAdminService.deleteSuperAdmin(req.params.id as string, currentId);
  res.status(200).json({ ok: true });
});

