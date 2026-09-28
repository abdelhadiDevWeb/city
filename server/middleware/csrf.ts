import type { Request, RequestHandler } from "express";
import { doubleCsrf } from "csrf-csrf";
import { cookieNames, sessionCookieOptions } from "../config/cookies";
import { env } from "../config/env";
import { generateOpaqueToken } from "../services/token.service";

// Signed double-submit cookie pattern (OWASP). Required on every route that relies on
// cookies for authentication (refresh / logout), and on login/register to stop login CSRF.

function getSessionId(req: Request): string | undefined {
  const sid = req.signedCookies?.[cookieNames.session];
  return typeof sid === "string" && sid.length > 0 ? sid : undefined;
}

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => env.csrfSecret,
  getSessionIdentifier: (req) => getSessionId(req) ?? "",
  cookieName: cookieNames.csrf,
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: env.isProd,
    path: "/",
  },
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

export const issueCsrfToken: RequestHandler = (req, res) => {
  if (!getSessionId(req)) {
    const sid = generateOpaqueToken(32);
    res.cookie(cookieNames.session, sid, sessionCookieOptions);
    req.signedCookies[cookieNames.session] = sid;
  }
  const csrfToken = generateCsrfToken(req, res, { overwrite: true });
  res.status(200).json({ ok: true, csrfToken });
};

export const csrfProtection: RequestHandler = (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS" && !getSessionId(req)) {
    return res.status(403).json({ ok: false, message: "Invalid CSRF token" });
  }
  return doubleCsrfProtection(req, res, next);
};
