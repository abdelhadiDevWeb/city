import type { RequestHandler } from "express";
import { verifyAccessToken, type JwtUser } from "../services/token.service";

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
    req.user = verifyAccessToken(token);
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
