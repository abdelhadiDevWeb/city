import { Router } from "express";
import Joi from "joi";

import * as admins from "../controllers/admin.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";
import { validate } from "../middleware/validate";
import { ADMIN_ROLES } from "../models/Admin";

const objectId = Joi.string().hex().length(24);
const name = Joi.string().trim().min(1).max(60).required();
const location = Joi.string().trim().min(1).max(80).required();

// An admin is attached to a residence, a sub_admin to a building; never both.
const createAdminSchema = Joi.object({
  body: Joi.object({
    prenom: name,
    nom: name,
    email: Joi.string().trim().lowercase().email().max(254).required(),
    telephone: Joi.string().trim().pattern(/^\+?[0-9]{8,15}$/).required(),
    wilaya: location,
    daira: location,
    baladia: location,
    role: Joi.string().valid(...ADMIN_ROLES).required(),
    idResidence: Joi.when("role", { is: "admin", then: objectId.required(), otherwise: Joi.forbidden() }),
    idBatiment: Joi.when("role", { is: "sub_admin", then: objectId.required(), otherwise: Joi.forbidden() }),
    password: Joi.string().min(12).max(128).required(),
  }).required(),
});

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("super_admin"), csrfProtection);

adminRouter.post("/", validate(createAdminSchema), admins.create);
