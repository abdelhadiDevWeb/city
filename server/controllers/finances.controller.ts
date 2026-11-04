import type { Request } from "express";
import { Residence } from "../models/Residence";
import { loadActiveAdmin } from "../services/auth.service";
import * as financesService from "../services/finances.service";
import { AppError, asyncHandler } from "../utils/AppError";

async function resolveFinanceScope(req: Request) {
  const roles = req.user?.roles ?? [];
  if (roles.includes("super_admin")) {
    let resId = (req.query.idResidence as string) || (req.body?.idResidence as string);
    if (!resId) {
      const firstRes = await Residence.findOne().sort({ createdAt: -1 });
      if (firstRes) resId = String(firstRes._id);
    }
    if (!resId) throw new AppError(404, "Aucune résidence trouvée");
    return { idResidence: resId, idBatiment: undefined };
  }

  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  return {
    idResidence: String(admin.idResidence),
    idBatiment: admin.role === "sub_admin" && admin.idBatiment ? String(admin.idBatiment) : undefined,
  };
}

async function resolveActorName(req: Request): Promise<string> {
  const roles = req.user?.roles ?? [];
  if (roles.includes("super_admin")) return "Super Admin";
  try {
    const admin = await loadActiveAdmin(req.user!.sub);
    const roleLabel = admin.role === "sub_admin" ? "Sous-Admin" : "Admin";
    return `${admin.prenom} ${admin.nom} (${roleLabel})`;
  } catch {
    return "Syndic";
  }
}

export const getFinances = asyncHandler(async (req, res) => {
  const { idResidence, idBatiment } = await resolveFinanceScope(req);
  const data = await financesService.getFinances(idResidence, idBatiment);
  res.status(200).json({ ok: true, ...data });
});

export const encaisser = asyncHandler(async (req, res) => {
  const { idResidence, idBatiment } = await resolveFinanceScope(req);
  const encaissePar = await resolveActorName(req);
  const charge = await financesService.encaisser(idResidence, req.params.id as string, { ...req.body, encaissePar }, idBatiment);
  res.status(200).json({ ok: true, charge });
});

export const createPaiement = asyncHandler(async (req, res) => {
  const { idResidence, idBatiment } = await resolveFinanceScope(req);
  const encaissePar = await resolveActorName(req);
  const paiement = await financesService.createPaiement(idResidence, { ...req.body, idBatiment, encaissePar });
  res.status(201).json({ ok: true, paiement });
});

export const createDepense = asyncHandler(async (req, res) => {
  const { idResidence } = await resolveFinanceScope(req);
  const depense = await financesService.createDepense(idResidence, req.body);
  res.status(201).json({ ok: true, depense });
});

export const payerFacture = asyncHandler(async (req, res) => {
  const { idResidence } = await resolveFinanceScope(req);
  const facture = await financesService.payerFacture(idResidence, req.params.id as string);
  res.status(200).json({ ok: true, facture });
});

export const genererCharges = asyncHandler(async (req, res) => {
  const { idResidence, idBatiment } = await resolveFinanceScope(req);
  const result = await financesService.genererCharges(idResidence, req.body.moisNom || "Mois courant", idBatiment);
  res.status(200).json({ ok: true, ...result });
});

export const updateDepense = asyncHandler(async (req, res) => {
  const { idResidence } = await resolveFinanceScope(req);
  const depense = await financesService.updateDepense(idResidence, req.params.id as string, req.body);
  res.status(200).json({ ok: true, depense });
});

export const deleteDepense = asyncHandler(async (req, res) => {
  const { idResidence } = await resolveFinanceScope(req);
  await financesService.deleteDepense(idResidence, req.params.id as string);
  res.status(200).json({ ok: true });
});

export const updateCharge = asyncHandler(async (req, res) => {
  const { idResidence } = await resolveFinanceScope(req);
  const charge = await financesService.updateCharge(idResidence, req.params.id as string, req.body);
  res.status(200).json({ ok: true, charge });
});

export const deleteCharge = asyncHandler(async (req, res) => {
  const { idResidence } = await resolveFinanceScope(req);
  await financesService.deleteCharge(idResidence, req.params.id as string);
  res.status(200).json({ ok: true });
});
