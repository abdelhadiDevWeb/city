import { User } from "../models/User";
import { loadActiveAdmin } from "../services/auth.service";
import * as annoncesService from "../services/annonces.service";
import { AppError, asyncHandler } from "../utils/AppError";

export const getAnnonces = asyncHandler(async (req, res) => {
  let idResidence: string | null = null;
  if (req.user!.roles.includes("resident")) {
    const user = await User.findById(req.user!.sub);
    if (!user || !user.idResidence) throw new AppError(403, "Aucune résidence attribuée à ce résident");
    idResidence = String(user.idResidence);
  } else {
    const admin = await loadActiveAdmin(req.user!.sub);
    if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
    idResidence = String(admin.idResidence);
  }

  const data = await annoncesService.getAnnonces(idResidence);
  res.status(200).json({ ok: true, ...data });
});

export const createAnnonce = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const annonce = await annoncesService.createAnnonce(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, annonce });
});

export const renvoyerAnnonce = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const annonce = await annoncesService.renvoyerAnnonce(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true, annonce });
});
