import { Router } from "express";
import * as maintenance from "../controllers/maintenance.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";

export const maintenanceRouter = Router();

maintenanceRouter.use(requireAuth, requireRole("admin", "sub_admin"), csrfProtection);

maintenanceRouter.get("/", maintenance.getMaintenance);
maintenanceRouter.post("/incidents", maintenance.createIncident);
maintenanceRouter.patch("/incidents/:id/statut", maintenance.updateStatut);
