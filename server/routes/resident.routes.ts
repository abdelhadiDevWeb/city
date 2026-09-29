import { Router } from "express";
import Joi from "joi";

import * as residents from "../controllers/resident.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";
import { validate } from "../middleware/validate";

const createResidentSchema = Joi.object({
  body: Joi.object({
    prenom: Joi.string().trim().min(1).max(60).required(),
    nom: Joi.string().trim().min(1).max(60).required(),
    email: Joi.string().trim().lowercase().email().max(254).required(),
    telephone: Joi.string()
      .trim()
      .pattern(/^\+?[0-9]{8,15}$/)
      .required()
      .messages({ "string.pattern.base": "Le téléphone doit contenir 8 à 15 chiffres (+ facultatif)" }),
    nin: Joi.string()
      .trim()
      .pattern(/^[0-9]{18}$/)
      .required()
      .messages({ "string.pattern.base": "Le NIN doit contenir exactement 18 chiffres" }),
    idBatiment: Joi.string().hex().length(24).required(),
    etage: Joi.number().integer().min(0).max(200).required(),
    appartement: Joi.string().trim().min(1).max(20).required(),
  }).required(),
});

export const residentRouter = Router();

residentRouter.use(requireAuth, requireRole("admin", "sub_admin"), csrfProtection);

residentRouter.get("/", residents.list);
residentRouter.post("/", validate(createResidentSchema), residents.create);
