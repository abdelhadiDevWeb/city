import { Router } from "express";

import * as espace from "../controllers/espace.controller";
import { requireAuth, requireRole } from "../middleware/auth";

export const espaceRouter = Router();

// GET only, so no CSRF check is needed.
espaceRouter.get("/", requireAuth, requireRole("admin", "sub_admin"), espace.monEspace);
