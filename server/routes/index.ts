import { Router } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimiters";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// Example auth endpoint (replace with your real user lookup + bcrypt compare).
apiRouter.post(
  "/auth/token",
  authLimiter,
  validate(
    Joi.object({
      body: Joi.object({
        userId: Joi.string().min(1).required(),
        roles: Joi.array().items(Joi.string()).default([]),
      }).required(),
    })
  ),
  (req, res) => {
    const { userId, roles } = req.body as { userId: string; roles: string[] };

    const token = jwt.sign({ roles }, env.jwt.accessSecret, {
      subject: userId,
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
      expiresIn: "15m",
    });

    res.status(200).json({ ok: true, accessToken: token });
  }
);

apiRouter.get("/me", requireAuth, (req, res) => {
  res.status(200).json({ ok: true, user: req.user });
});

