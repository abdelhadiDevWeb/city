import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtUser = {
  sub: string;
  roles?: string[];
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

function getBearerToken(authHeader: unknown): string | null {
  if (typeof authHeader !== "string") return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return null;
  if (!token) return null;
  return token;
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ ok: false, message: "Missing token" });

  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret, {
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
    }) as jwt.JwtPayload;

    if (!decoded.sub) return res.status(401).json({ ok: false, message: "Invalid token" });
    req.user = { sub: decoded.sub, roles: Array.isArray(decoded.roles) ? (decoded.roles as string[]) : undefined };
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
};

export function requireRole(role: string): RequestHandler {
  return (req, res, next) => {
    const roles = req.user?.roles ?? [];
    if (!roles.includes(role)) return res.status(403).json({ ok: false, message: "Forbidden" });
    return next();
  };
}

