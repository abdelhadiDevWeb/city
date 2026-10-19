import { Router } from "express";
import * as finances from "../controllers/finances.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";

export const financesRouter = Router();

financesRouter.use(requireAuth, requireRole("admin", "sub_admin"), csrfProtection);

financesRouter.get("/", finances.getFinances);
financesRouter.post("/encaisser/:id", finances.encaisser);
financesRouter.post("/paiements", finances.createPaiement);
financesRouter.post("/depenses", finances.createDepense);
financesRouter.put("/depenses/:id", finances.updateDepense);
financesRouter.delete("/depenses/:id", finances.deleteDepense);

financesRouter.put("/charges/:id", finances.updateCharge);
financesRouter.delete("/charges/:id", finances.deleteCharge);

financesRouter.post("/factures/:id/payer", finances.payerFacture);
financesRouter.post("/generer", finances.genererCharges);
