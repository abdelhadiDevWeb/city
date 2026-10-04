import { loadActiveAdmin } from "../services/auth.service";
import * as financesService from "../services/finances.service";
import { AppError, asyncHandler } from "../utils/AppError";

export const getFinances = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const data = await financesService.getFinances(String(admin.idResidence));
  res.status(200).json({ ok: true, ...data });
});

export const encaisser = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const charge = await financesService.encaisser(String(admin.idResidence), req.params.id as string, req.body);
  res.status(200).json({ ok: true, charge });
});

export const createPaiement = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const paiement = await financesService.createPaiement(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, paiement });
});

export const createDepense = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const depense = await financesService.createDepense(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, depense });
});

export const payerFacture = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const facture = await financesService.payerFacture(String(admin.idResidence), req.params.id as string);
  res.status(200).json({ ok: true, facture });
});

export const genererCharges = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const result = await financesService.genererCharges(String(admin.idResidence), req.body.moisNom || "Mois courant");
  res.status(200).json({ ok: true, ...result });
});
