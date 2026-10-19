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

export const createPersonnel = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const staff = await personnelService.createPersonnel(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, staff });
});

export const updatePersonnel = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const staff = await personnelService.updatePersonnel(String(admin.idResidence), req.params.id as string, req.body);
  res.status(200).json({ ok: true, staff });
});

export const deletePersonnel = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  await personnelService.deletePersonnel(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true });
});

export const updateTache = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const tache = await personnelService.updateTache(String(admin.idResidence), req.params.id as string, req.body);
  res.status(200).json({ ok: true, tache });
});

export const deleteTache = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  await personnelService.deleteTache(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true });
});
