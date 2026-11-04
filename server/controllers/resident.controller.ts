import { loadActiveAdmin } from "../services/auth.service";
import * as residentService from "../services/resident.service";
import { asyncHandler } from "../utils/AppError";

async function getActor(req: any): Promise<residentService.ActorInfo> {
  const roles = req.user?.roles ?? [];
  if (roles.includes("super_admin")) {
    return req.user;
  }
  return await loadActiveAdmin(req.user!.sub);
}

export const list = asyncHandler(async (req, res) => {
  const actor = await getActor(req);
  const residenceFilter = req.query.idResidence as string | undefined;
  res.status(200).json({ ok: true, residents: await residentService.listResidents(actor, residenceFilter) });
});

export const create = asyncHandler(async (req, res) => {
  const actor = await getActor(req);
  const resident = await residentService.createResident(actor, req.body as residentService.NewResident);
  res.status(201).json({ ok: true, resident });
});

export const update = asyncHandler(async (req, res) => {
  const actor = await getActor(req);
  const resident = await residentService.updateResident(req.params.id as string, actor, req.body);
  res.status(200).json({ ok: true, resident });
});

export const remove = asyncHandler(async (req, res) => {
  const actor = await getActor(req);
  await residentService.deleteResident(req.params.id as string, actor);
  res.status(200).json({ ok: true });
});
