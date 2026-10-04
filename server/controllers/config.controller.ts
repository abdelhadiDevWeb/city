import { loadActiveAdmin } from "../services/auth.service";
import * as configService from "../services/config.service";
import { AppError, asyncHandler } from "../utils/AppError";

export const getConfig = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const data = await configService.getConfig(String(admin.idResidence));
  res.status(200).json({ ok: true, ...data });
});

export const addChargeType = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.addChargeType(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, item });
});

export const toggleChargeType = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.toggleChargeType(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true, item });
});
