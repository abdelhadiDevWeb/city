import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtUser = {
  sub: string;
  roles: string[];
};

const ALGORITHM = "HS256";

export function signAccessToken(accountId: string, roles: string[]): string {
  return jwt.sign({ roles }, env.jwt.accessSecret, {
    algorithm: ALGORITHM,
    subject: accountId,
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
    expiresIn: env.jwt.accessTtlSeconds,
    jwtid: crypto.randomUUID(),
  });
}

// Throws if the token is invalid, expired, or signed with any other algorithm.
export function verifyAccessToken(token: string): JwtUser {
  const decoded = jwt.verify(token, env.jwt.accessSecret, {
    algorithms: [ALGORITHM],
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
  });

  if (typeof decoded === "string" || !decoded.sub) throw new Error("Invalid token payload");
  const roles = Array.isArray(decoded.roles) ? decoded.roles.filter((r): r is string => typeof r === "string") : [];
  return { sub: decoded.sub, roles };
}

export function generateOpaqueToken(bytes = 48): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
