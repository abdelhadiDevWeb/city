import { loadActiveAdmin } from "../services/auth.service";
import * as maintenanceService from "../services/maintenance.service";
import { AppError, asyncHandler } from "../utils/AppError";

export const getMaintenance = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const data = await maintenanceService.getMaintenance(String(admin.idResidence));
  res.status(200).json({ ok: true, ...data });
});

export const createIncident = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const incident = await maintenanceService.createIncident(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, incident });
});

export const updateStatut = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const incident = await maintenanceService.updateIncidentStatut(String(admin.idResidence), req.params.id as string, req.body.statut);
  res.status(200).json({ ok: true, incident });
});
