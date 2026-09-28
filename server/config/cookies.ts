import type { CookieOptions } from "express";
import { env } from "./env";

// `__Host-` / `__Secure-` prefixes require the Secure flag, so they are only used in production.
export const cookieNames = {
  refreshToken: env.isProd ? "__Secure-city.rt" : "city.rt",
  csrf: env.isProd ? "__Host-city.csrf" : "city.csrf",
  session: env.isProd ? "__Host-city.sid" : "city.sid",
  // Not a credential: only tells the frontend server a session probably exists, so it can
  // redirect anonymous visitors before rendering protected pages. Real checks use the JWT.
  authHint: env.isProd ? "__Host-city.auth" : "city.auth",
};

export const authHintCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: "strict",
  path: "/",
  maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
};

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: "strict",
  path: "/api/auth",
  maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
};

export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: "strict",
  path: "/",
  signed: true,
};
