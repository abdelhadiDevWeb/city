import { Router } from "express";
import Joi from "joi";

import * as abonnements from "../controllers/abonnement.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";
import { validate } from "../middleware/validate";

const objectId = Joi.string().hex().length(24);

const createPlanSchema = Joi.object({
  body: Joi.object({
    nom: Joi.string().trim().min(2).max(60).required(),
    prix: Joi.number().min(0).max(100_000_000).precision(2).required(),
    duree: Joi.number().integer().min(1).max(120).required(),
    cible: Joi.string().valid("admin", "sub_admin").default("admin"),
  }).required(),
});

const createSouscriptionSchema = Joi.object({
  body: Joi.object({
    idAdmin: objectId.required(),
    idAbonnement: objectId.required(),
    debut: Joi.date().iso().min("2000-01-01").max("2100-01-01").required(),
    statutPaiement: Joi.boolean().strict().required(),
    modePaiement: Joi.string().trim().allow("", null).optional(),
    montantPaye: Joi.number().min(0).optional(),
    notesPaiement: Joi.string().trim().allow("", null).optional(),
  }).required(),
});

const paymentStatusSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
  body: Joi.object({ statutPaiement: Joi.boolean().strict().required() }).required(),
});

export const abonnementRouter = Router();

abonnementRouter.use(requireAuth, csrfProtection);

// Plans management
abonnementRouter.get("/", requireRole("super_admin", "admin"), abonnements.listPlans);
abonnementRouter.post("/", requireRole("super_admin"), validate(createPlanSchema), abonnements.createPlan);
abonnementRouter.put("/:id", requireRole("super_admin"), abonnements.updatePlan);
abonnementRouter.delete("/:id", requireRole("super_admin"), abonnements.deletePlan);

// Admin subscriptions (Super Admin only)
abonnementRouter.get("/admins", requireRole("super_admin"), abonnements.listAdmins);

// Sous-Admin subscriptions & KPIs (Super Admin & Admin)
abonnementRouter.get("/sous-admins", requireRole("super_admin", "admin"), abonnements.listSousAdmins);
abonnementRouter.get("/sous-admins/kpis", requireRole("super_admin", "admin"), abonnements.getSousAdminKPIs);

// Subscriptions assignments and payments
abonnementRouter.post("/souscriptions", requireRole("super_admin", "admin"), validate(createSouscriptionSchema), abonnements.createSouscription);
abonnementRouter.patch("/souscriptions/:id", requireRole("super_admin", "admin"), validate(paymentStatusSchema), abonnements.setPaymentStatus);
abonnementRouter.delete("/souscriptions/:id", requireRole("super_admin", "admin"), abonnements.deleteSouscription);
