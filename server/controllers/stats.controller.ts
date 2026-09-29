import { getStats } from "../services/stats.service";
import { asyncHandler } from "../utils/AppError";

export const overview = asyncHandler(async (req, res) => {
  res.status(200).json({ ok: true, ...(await getStats()) });
});
