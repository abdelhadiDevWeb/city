import type { Request } from "express";
import { Batiment } from "../models/Batiment";
import { Residence } from "../models/Residence";
import { loadActiveAdmin } from "../services/auth.service";
import * as personnelService from "../services/personnel.service";
import { AppError, asyncHandler } from "../utils/AppError";

async function resolvePersonnelScope(req: Request): Promise<string | null> {
  const roles = req.user?.roles ?? [];
  if (roles.includes("super_admin")) {
    let resId = (req.query.idResidence as string) || (req.body?.idResidence as string);
    if (!resId) {
      const firstRes = await Residence.findOne().sort({ createdAt: -1 });
      if (firstRes) resId = String(firstRes._id);
    }
    return resId ? String(resId) : null;
  }

  const admin = await loadActiveAdmin(req.user!.sub);
  if (admin.idResidence) return String(admin.idResidence);

  if (admin.role === "sub_admin" && admin.idBatiment) {
    const batiment = await Batiment.findById(admin.idBatiment);
    if (batiment?.idResidence) return String(batiment.idResidence);
  }

  return null;
}

export const getPersonnel = asyncHandler(async (req, res) => {
  const idResidence = await resolvePersonnelScope(req);
  if (!idResidence) {
    return res.status(200).json({ ok: true, personnel: [], taches: [] });
  }
  const data = await personnelService.getPersonnel(idResidence);
  res.status(200).json({ ok: true, ...data });
});

export const createTache = asyncHandler(async (req, res) => {
  const idResidence = await resolvePersonnelScope(req);
  if (!idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const tache = await personnelService.createTache(idResidence, req.body);
  res.status(201).json({ ok: true, tache });
});

export const updateTacheStatut = asyncHandler(async (req, res) => {
  const idResidence = await resolvePersonnelScope(req);
  if (!idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const tache = await personnelService.updateTacheStatut(idResidence, req.params.id as string, req.body.statut);
  res.status(200).json({ ok: true, tache });
});

export const createPersonnel = asyncHandler(async (req, res) => {
  const idResidence = await resolvePersonnelScope(req);
  if (!idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const staff = await personnelService.createPersonnel(idResidence, req.body);
  res.status(201).json({ ok: true, staff });
});

export const updatePersonnel = asyncHandler(async (req, res) => {
  const idResidence = await resolvePersonnelScope(req);
  if (!idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const staff = await personnelService.updatePersonnel(idResidence, req.params.id as string, req.body);
  res.status(200).json({ ok: true, staff });
});

export const deletePersonnel = asyncHandler(async (req, res) => {
  const idResidence = await resolvePersonnelScope(req);
  if (!idResidence) throw new AppError(403, "Aucune résidence attribuée");
  await personnelService.deletePersonnel(idResidence, req.params.id as string);
  res.status(200).json({ ok: true });
});

export const updateTache = asyncHandler(async (req, res) => {
  const idResidence = await resolvePersonnelScope(req);
  if (!idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const tache = await personnelService.updateTache(idResidence, req.params.id as string, req.body);
  res.status(200).json({ ok: true, tache });
});

export const deleteTache = asyncHandler(async (req, res) => {
  const idResidence = await resolvePersonnelScope(req);
  if (!idResidence) throw new AppError(403, "Aucune résidence attribuée");
  await personnelService.deleteTache(idResidence, req.params.id as string);
  res.status(200).json({ ok: true });
});
