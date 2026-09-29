import { createAdminAccount, type CreateAdminInput } from "../services/admin.service";
import { asyncHandler } from "../utils/AppError";

export const create = asyncHandler(async (req, res) => {
  const admin = await createAdminAccount(req.body as CreateAdminInput);
  res.status(201).json({ ok: true, admin });
});
