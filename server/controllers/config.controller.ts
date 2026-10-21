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

export const updateChargeType = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.updateChargeType(String(admin.idResidence), req.params.id as string, req.body);
  res.status(200).json({ ok: true, item });
});

export const deleteChargeType = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  await configService.deleteChargeType(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true });
});

// Incidents
export const addIncidentType = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.addIncidentType(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, item });
});

export const toggleIncidentType = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.toggleIncidentType(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true, item });
});

export const updateIncidentType = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.updateIncidentType(String(admin.idResidence), req.params.id as string, req.body);
  res.status(200).json({ ok: true, item });
});

export const deleteIncidentType = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  await configService.deleteIncidentType(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true });
});

// Paiements
export const addPaymentMode = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.addPaymentMode(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, item });
});

export const togglePaymentMode = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.togglePaymentMode(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true, item });
});

export const updatePaymentMode = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const item = await configService.updatePaymentMode(String(admin.idResidence), req.params.id as string, req.body);
  res.status(200).json({ ok: true, item });
});

export const deletePaymentMode = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  await configService.deletePaymentMode(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true });
});
