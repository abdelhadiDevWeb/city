import { Router } from "express";
import * as documents from "../controllers/documents.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";

export const documentsRouter = Router();

documentsRouter.use(requireAuth, requireRole("admin", "sub_admin"), csrfProtection);

documentsRouter.get("/", documents.getDocuments);
documentsRouter.post("/", documents.createDocument);
documentsRouter.put("/:id", documents.updateDocument);
documentsRouter.delete("/:id", documents.deleteDocument);
