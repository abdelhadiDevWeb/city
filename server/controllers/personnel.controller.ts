import { loadActiveAdmin } from "../services/auth.service";
import * as personnelService from "../services/personnel.service";
import { AppError, asyncHandler } from "../utils/AppError";

export const getPersonnel = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const data = await personnelService.getPersonnel(String(admin.idResidence));
  res.status(200).json({ ok: true, ...data });
});

export const createTache = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const tache = await personnelService.createTache(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, tache });
});

export const updateTacheStatut = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const tache = await personnelService.updateTacheStatut(String(admin.idResidence), req.params.id as string, req.body.statut);
  res.status(200).json({ ok: true, tache });
});
