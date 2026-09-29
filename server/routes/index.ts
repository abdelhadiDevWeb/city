import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import { accountTypeFromRoles, findAccountById, publicAccount } from "../services/account.service";
import { assertActive } from "../services/auth.service";
import { AppError, asyncHandler } from "../utils/AppError";
import { abonnementRouter } from "./abonnement.routes";
import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { espaceRouter } from "./espace.routes";
import { residenceRouter } from "./residence.routes";
import { statsRouter } from "./stats.routes";
import { superAdminRouter } from "./superAdmin.routes";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/residences", residenceRouter);
apiRouter.use("/admins", adminRouter);
apiRouter.use("/super-admins", superAdminRouter);
apiRouter.use("/abonnements", abonnementRouter);
apiRouter.use("/stats", statsRouter);
apiRouter.use("/mon-espace", espaceRouter);
apiRouter.use("/residents", residentRouter);

apiRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const account = await findAccountById(accountTypeFromRoles(req.user!.roles), req.user!.sub);
    if (!account) throw new AppError(401, "Invalid token");
    await assertActive(account);
    res.status(200).json({ ok: true, account: publicAccount(account) });
  }),
);
