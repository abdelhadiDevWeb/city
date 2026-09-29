import { loadActiveAdmin } from "../services/auth.service";
import { getEspace } from "../services/espace.service";
import { asyncHandler } from "../utils/AppError";

export const monEspace = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  res.status(200).json({ ok: true, ...(await getEspace(admin)) });
});
