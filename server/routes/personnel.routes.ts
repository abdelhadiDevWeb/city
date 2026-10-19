import { Router } from "express";
import * as personnel from "../controllers/personnel.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";

export const personnelRouter = Router();

personnelRouter.use(requireAuth, requireRole("admin", "sub_admin"), csrfProtection);

personnelRouter.get("/", personnel.getPersonnel);

personnelRouter.post("/", personnel.createPersonnel);
personnelRouter.put("/:id", personnel.updatePersonnel);
personnelRouter.delete("/:id", personnel.deletePersonnel);

personnelRouter.post("/taches", personnel.createTache);
personnelRouter.patch("/taches/:id/statut", personnel.updateTacheStatut);
personnelRouter.put("/taches/:id", personnel.updateTache);
personnelRouter.delete("/taches/:id", personnel.deleteTache);
