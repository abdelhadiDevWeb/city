import { createAdminAccount, updateAdminAccount, deleteAdminAccount, type CreateAdminInput } from "../services/admin.service";
import { asyncHandler } from "../utils/AppError";

export const create = asyncHandler(async (req, res) => {
  const admin = await createAdminAccount(req.body as CreateAdminInput, req.user);
  res.status(201).json({ ok: true, admin });
});

export const update = asyncHandler(async (req, res) => {
  const admin = await updateAdminAccount(req.params.id as string, req.body, req.user);
  res.status(200).json({ ok: true, admin });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteAdminAccount(req.params.id as string, req.user);
  res.status(200).json({ ok: true });
});
