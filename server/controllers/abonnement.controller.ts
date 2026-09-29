import * as abonnementService from "../services/abonnement.service";
import { asyncHandler } from "../utils/AppError";

export const listPlans = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, abonnements: await abonnementService.listPlans() });
});

export const createPlan = asyncHandler(async (req, res) => {
  const abonnement = await abonnementService.createPlan(req.body as { nom: string; prix: number; duree: number });
  res.status(201).json({ ok: true, abonnement });
});

export const listAdmins = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, admins: await abonnementService.listAdminsWithSubscriptions() });
});

export const createSouscription = asyncHandler(async (req, res) => {
  const souscription = await abonnementService.createSouscription(
    req.body as { idAdmin: string; idAbonnement: string; debut: Date; statutPaiement: boolean },
  );
  res.status(201).json({ ok: true, souscription });
});

export const setPaymentStatus = asyncHandler(async (req, res) => {
  const { statutPaiement } = req.body as { statutPaiement: boolean };
  const souscription = await abonnementService.setPaymentStatus(req.params.id as string, statutPaiement);
  res.status(200).json({ ok: true, souscription });
});
