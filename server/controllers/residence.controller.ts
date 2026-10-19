import { loadActiveAdmin } from "../services/auth.service";
import * as residenceService from "../services/residence.service";
import { AppError, asyncHandler } from "../utils/AppError";

export const list = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, residences: await residenceService.listResidences() });
});

export const details = asyncHandler(async (req, res) => {
  const roles = req.user?.roles ?? [];
  if (!roles.includes("super_admin")) {
    const admin = await loadActiveAdmin(req.user!.sub);
    if (!admin.idResidence || String(admin.idResidence) !== req.params.id) {
      throw new AppError(403, "Accès interdit à cette résidence");
    }
  }
  res.status(200).json({ ok: true, ...(await residenceService.getResidenceDetails(req.params.id as string)) });
});

export const create = asyncHandler(async (req, res) => {
  const residence = await residenceService.createResidence(req.body as { nom: string; localisation: string });
  res.status(201).json({ ok: true, residence });
});

export const createBatiment = asyncHandler(async (req, res) => {
  const roles = req.user?.roles ?? [];
  if (!roles.includes("super_admin")) {
    const admin = await loadActiveAdmin(req.user!.sub);
    if (admin.role !== "admin" || !admin.idResidence || String(admin.idResidence) !== req.params.id) {
      throw new AppError(403, "Vous ne pouvez ajouter des bâtiments que dans votre résidence");
    }
  }
  const batiment = await residenceService.createBatiment(req.params.id as string, req.body as { nom: string; etages: number });
  res.status(201).json({ ok: true, batiment });
});

export const update = asyncHandler(async (req, res) => {
  const residence = await residenceService.updateResidence(req.params.id as string, req.body as { nom?: string; localisation?: string });
  res.status(200).json({ ok: true, residence });
});

export const remove = asyncHandler(async (req, res) => {
  await residenceService.deleteResidence(req.params.id as string);
  res.status(200).json({ ok: true });
});

export const updateBatiment = asyncHandler(async (req, res) => {
  const roles = req.user?.roles ?? [];
  if (!roles.includes("super_admin")) {
    const admin = await loadActiveAdmin(req.user!.sub);
    if (admin.role !== "admin" || !admin.idResidence || String(admin.idResidence) !== req.params.id) {
      throw new AppError(403, "Vous ne pouvez modifier des bâtiments que dans votre résidence");
    }
  }
  const batiment = await residenceService.updateBatiment(req.params.batimentId as string, req.body as { nom?: string; etages?: number });
  res.status(200).json({ ok: true, batiment });
});

export const removeBatiment = asyncHandler(async (req, res) => {
  const roles = req.user?.roles ?? [];
  if (!roles.includes("super_admin")) {
    const admin = await loadActiveAdmin(req.user!.sub);
    if (admin.role !== "admin" || !admin.idResidence || String(admin.idResidence) !== req.params.id) {
      throw new AppError(403, "Vous ne pouvez supprimer des bâtiments que dans votre résidence");
    }
  }
  await residenceService.deleteBatiment(req.params.batimentId as string);
  res.status(200).json({ ok: true });
});

