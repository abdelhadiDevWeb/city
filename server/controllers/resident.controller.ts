import { loadActiveAdmin } from "../services/auth.service";
import * as residentService from "../services/resident.service";
import { asyncHandler } from "../utils/AppError";

export const list = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  res.status(200).json({ ok: true, residents: await residentService.listResidents(admin) });
});

export const create = asyncHandler(async (req, res) => {
  const admin = await loadActiveAdmin(req.user!.sub);
  const resident = await residentService.createResident(admin, req.body as residentService.NewResident);
  res.status(201).json({ ok: true, resident });
});
