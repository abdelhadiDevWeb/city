import type { AbonnementCible } from "../models/Abonnement";
import * as abonnementService from "../services/abonnement.service";
import { asyncHandler } from "../utils/AppError";

export const listPlans = asyncHandler(async (req, res) => {
  const cible = typeof req.query.cible === "string" ? (req.query.cible as AbonnementCible) : undefined;
  res.status(200).json({ ok: true, abonnements: await abonnementService.listPlans(cible) });
});

export const createPlan = asyncHandler(async (req, res) => {
  const abonnement = await abonnementService.createPlan(
    req.body as { nom: string; prix: number; duree: number; cible?: AbonnementCible },
  );
  res.status(201).json({ ok: true, abonnement });
});

export const listAdmins = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, admins: await abonnementService.listAdminsWithSubscriptions() });
});

export const listSousAdmins = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, sousAdmins: await abonnementService.listSousAdminsWithSubscriptions(req.user) });
});

export const getSousAdminKPIs = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, kpis: await abonnementService.getSousAdminKPIs(req.user) });
});

export const createSouscription = asyncHandler(async (req, res) => {
  const souscription = await abonnementService.createSouscription(
    req.body as { idAdmin: string; idAbonnement: string; debut: Date; statutPaiement: boolean },
    req.user,
  );
  res.status(201).json({ ok: true, souscription });
});

export const setPaymentStatus = asyncHandler(async (req, res) => {
  const { statutPaiement } = req.body as { statutPaiement: boolean };
  const souscription = await abonnementService.setPaymentStatus(req.params.id as string, statutPaiement, req.user);
  res.status(200).json({ ok: true, souscription });
});

export const updatePlan = asyncHandler(async (req, res) => {
  const abonnement = await abonnementService.updatePlan(req.params.id as string, req.body);
  res.status(200).json({ ok: true, abonnement });
});

export const deletePlan = asyncHandler(async (req, res) => {
  await abonnementService.deletePlan(req.params.id as string);
  res.status(200).json({ ok: true });
});

export const deleteSouscription = asyncHandler(async (req, res) => {
  await abonnementService.deleteSouscription(req.params.id as string, req.user);
  res.status(200).json({ ok: true });
});
