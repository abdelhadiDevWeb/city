import { loadActiveAdmin } from "../services/auth.service";
import * as documentsService from "../services/documents.service";
import { AppError, asyncHandler } from "../utils/AppError";

export const getDocuments = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const data = await documentsService.getDocuments(String(admin.idResidence));
  res.status(200).json({ ok: true, ...data });
});

export const createDocument = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  if (!admin.idResidence) throw new AppError(403, "Aucune résidence attribuée");
  const doc = await documentsService.createDocument(String(admin.idResidence), req.body);
  res.status(201).json({ ok: true, document: doc });
});
