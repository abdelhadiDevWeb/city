import { Router } from "express";
import * as annonces from "../controllers/annonces.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";

export const annoncesRouter = Router();

annoncesRouter.use(requireAuth, csrfProtection);

annoncesRouter.get("/", requireRole("admin", "sub_admin", "resident"), annonces.getAnnonces);
annoncesRouter.post("/", requireRole("admin", "sub_admin"), annonces.createAnnonce);
annoncesRouter.post("/alertes", requireRole("admin", "sub_admin"), annonces.createAlerte);
annoncesRouter.put("/alertes/:id", requireRole("admin", "sub_admin"), annonces.updateAlerte);
annoncesRouter.put("/:id", requireRole("admin", "sub_admin"), annonces.updateAnnonce);
annoncesRouter.delete("/:id", requireRole("admin", "sub_admin"), annonces.deleteAnnonce);
annoncesRouter.post("/:id/renvoyer", requireRole("admin", "sub_admin"), annonces.renvoyerAnnonce);

