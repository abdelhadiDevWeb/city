import type { Request, Response } from "express";
import { User } from "../models/User";
import { isExpoPushToken } from "../services/push.service";
import { AppError, asyncHandler } from "../utils/AppError";

/**
 * Register an Expo push token for the authenticated user/resident.
 */
export const registerPushToken = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) {
    throw new AppError(401, "Authentification requise");
  }

  const { token } = req.body as { token?: string };
  if (!token || typeof token !== "string" || !isExpoPushToken(token)) {
    throw new AppError(400, "Push token Expo invalide");
  }

  const trimmedToken = token.trim();

  // Save the token to the user document without duplicates
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { pushTokens: trimmedToken } },
    { new: true },
  );

  if (!updatedUser) {
    throw new AppError(404, "Utilisateur introuvable");
  }

  console.log(`[NotificationsController] Registered push token for user ${userId}: ${trimmedToken}`);
  res.status(200).json({ ok: true, message: "Token push enregistré avec succès" });
});

/**
 * Unregister an Expo push token upon logout or toggle.
 */
export const unregisterPushToken = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) {
    throw new AppError(401, "Authentification requise");
  }

  const { token } = req.body as { token?: string };
  if (!token || typeof token !== "string") {
    throw new AppError(400, "Push token requis");
  }

  const trimmedToken = token.trim();

  await User.findByIdAndUpdate(userId, { $pull: { pushTokens: trimmedToken } });

  console.log(`[NotificationsController] Unregistered push token for user ${userId}: ${trimmedToken}`);
  res.status(200).json({ ok: true, message: "Token push supprimé avec succès" });
});
