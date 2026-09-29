import { Router } from "express";
import Joi from "joi";

import * as residences from "../controllers/residence.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";
import { validate } from "../middleware/validate";

const objectId = Joi.string().hex().length(24);

const idParams = Joi.object({ id: objectId.required() }).required();

const createResidenceSchema = Joi.object({
  body: Joi.object({
    nom: Joi.string().trim().min(2).max(120).required(),
    localisation: Joi.string().trim().min(2).max(200).required(),
  }).required(),
});

const createBatimentSchema = Joi.object({
  params: idParams,
  body: Joi.object({
    nom: Joi.string().trim().min(1).max(60).required(),
    etages: Joi.number().integer().min(0).max(200).required(),
  }).required(),
});

export const residenceRouter = Router();

residenceRouter.use(requireAuth, requireRole("super_admin"), csrfProtection);

residenceRouter.get("/", residences.list);
residenceRouter.post("/", validate(createResidenceSchema), residences.create);
residenceRouter.get("/:id", validate(Joi.object({ params: idParams })), residences.details);
residenceRouter.post("/:id/batiments", validate(createBatimentSchema), residences.createBatiment);
