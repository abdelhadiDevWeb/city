import { Router } from "express";
import Joi from "joi";

import * as auth from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { csrfProtection, issueCsrfToken } from "../middleware/csrf";
import { authLimiter } from "../middleware/rateLimiters";
import { validate } from "../middleware/validate";

// No policy checks on login beyond an upper bound, so the policy isn't leaked and
// oversized inputs can't be used to make password hashing expensive.
const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().max(254).required(),
    password: Joi.string().min(1).max(128).required(),
  }).required(),
});

export const authRouter = Router();

authRouter.get("/csrf", issueCsrfToken);

authRouter.use(csrfProtection);

authRouter.post("/login", authLimiter, validate(loginSchema), auth.login);
authRouter.post("/refresh", authLimiter, auth.refresh);
authRouter.post("/logout", auth.logout);
authRouter.post("/logout-all", requireAuth, auth.logoutAll);
