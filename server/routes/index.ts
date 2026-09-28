import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import { accountTypeFromRoles, findAccountById, publicAccount } from "../services/account.service";
import { AppError, asyncHandler } from "../utils/AppError";
import { authRouter } from "./auth.routes";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

apiRouter.use("/auth", authRouter);

apiRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const account = await findAccountById(accountTypeFromRoles(req.user!.roles), req.user!.sub);
    if (!account) throw new AppError(401, "Invalid token");
    res.status(200).json({ ok: true, account: publicAccount(account) });
  }),
);
