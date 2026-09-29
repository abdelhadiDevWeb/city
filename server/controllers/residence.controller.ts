import * as residenceService from "../services/residence.service";
import { asyncHandler } from "../utils/AppError";

export const list = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, residences: await residenceService.listResidences() });
});

export const details = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, ...(await residenceService.getResidenceDetails(req.params.id as string)) });
});

export const create = asyncHandler(async (req, res) => {
  const residence = await residenceService.createResidence(req.body as { nom: string; localisation: string });
  res.status(201).json({ ok: true, residence });
});

export const createBatiment = asyncHandler(async (req, res) => {
  const batiment = await residenceService.createBatiment(req.params.id as string, req.body as { nom: string; etages: number });
  res.status(201).json({ ok: true, batiment });
});
