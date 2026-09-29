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
  }).required(),
});

const createSouscriptionSchema = Joi.object({
  body: Joi.object({
    idAdmin: objectId.required(),
    idAbonnement: objectId.required(),
    debut: Joi.date().iso().min("2000-01-01").max("2100-01-01").required(),
    statutPaiement: Joi.boolean().strict().required(),
  }).required(),
});

const paymentStatusSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
  body: Joi.object({ statutPaiement: Joi.boolean().strict().required() }).required(),
});

export const abonnementRouter = Router();

abonnementRouter.use(requireAuth, requireRole("super_admin"), csrfProtection);

abonnementRouter.get("/", abonnements.listPlans);
abonnementRouter.post("/", validate(createPlanSchema), abonnements.createPlan);
abonnementRouter.get("/admins", abonnements.listAdmins);
abonnementRouter.post("/souscriptions", validate(createSouscriptionSchema), abonnements.createSouscription);
abonnementRouter.patch("/souscriptions/:id", validate(paymentStatusSchema), abonnements.setPaymentStatus);
