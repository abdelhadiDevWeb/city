import { Router } from "express";
import Joi from "joi";

import * as superAdmins from "../controllers/superAdmin.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";
import { validate } from "../middleware/validate";

const createSuperAdminSchema = Joi.object({
  body: Joi.object({
    nomComplet: Joi.string().trim().min(2).max(120).required(),
    email: Joi.string().trim().lowercase().email().max(254).required(),
    password: Joi.string().min(12).max(128).required(),
  }).required(),
});

export const superAdminRouter = Router();

superAdminRouter.use(requireAuth, requireRole("super_admin"), csrfProtection);

superAdminRouter.get("/", superAdmins.list);
superAdminRouter.post("/", validate(createSuperAdminSchema), superAdmins.create);
