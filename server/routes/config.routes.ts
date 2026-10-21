import { Router } from "express";
import * as config from "../controllers/config.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";

export const configRouter = Router();

configRouter.use(requireAuth, requireRole("admin", "sub_admin"), csrfProtection);

configRouter.get("/", config.getConfig);

// Charges
configRouter.post("/charges", config.addChargeType);
configRouter.patch("/charges/:id/toggle", config.toggleChargeType);
configRouter.put("/charges/:id", config.updateChargeType);
configRouter.delete("/charges/:id", config.deleteChargeType);

// Incidents
configRouter.post("/incidents", config.addIncidentType);
configRouter.patch("/incidents/:id/toggle", config.toggleIncidentType);
configRouter.put("/incidents/:id", config.updateIncidentType);
configRouter.delete("/incidents/:id", config.deleteIncidentType);

// Modes de paiement
configRouter.post("/paiements", config.addPaymentMode);
configRouter.patch("/paiements/:id/toggle", config.togglePaymentMode);
configRouter.put("/paiements/:id", config.updatePaymentMode);
configRouter.delete("/paiements/:id", config.deletePaymentMode);
