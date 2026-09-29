import { Router } from "express";

import * as stats from "../controllers/stats.controller";
import { requireAuth, requireRole } from "../middleware/auth";

export const statsRouter = Router();

statsRouter.use(requireAuth, requireRole("super_admin"));

statsRouter.get("/", stats.overview);
