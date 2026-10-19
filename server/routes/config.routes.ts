import { Router } from "express";
import * as config from "../controllers/config.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";

export const configRouter = Router();

configRouter.use(requireAuth, requireRole("admin", "sub_admin"), csrfProtection);

configRouter.get("/", config.getConfig);
configRouter.post("/charges", config.addChargeType);
configRouter.patch("/charges/:id/toggle", config.toggleChargeType);
configRouter.put("/charges/:id", config.updateChargeType);
configRouter.delete("/charges/:id", config.deleteChargeType);
