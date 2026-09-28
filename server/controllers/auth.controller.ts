import type { Request, Response } from "express";
import { authHintCookieOptions, cookieNames, refreshCookieOptions } from "../config/cookies";
import { publicAccount } from "../services/account.service";
import * as authService from "../services/auth.service";
import { AppError, asyncHandler } from "../utils/AppError";

function clientMeta(req: Request): authService.ClientMeta {
  return { ip: req.ip, userAgent: req.get("user-agent") };
}

function sendSession(res: Response, session: authService.Session): void {
  res.cookie(cookieNames.refreshToken, session.refreshToken, refreshCookieOptions);
  res.cookie(cookieNames.authHint, "1", authHintCookieOptions);
  res.status(200).json({ ok: true, account: publicAccount(session.account), accessToken: session.accessToken });
}

function clearRefreshCookie(res: Response): void {
  const { maxAge: _maxAge, ...options } = refreshCookieOptions;
  res.clearCookie(cookieNames.refreshToken, options);
  const { maxAge: _hintMaxAge, ...hintOptions } = authHintCookieOptions;
  res.clearCookie(cookieNames.authHint, hintOptions);
}

function getRefreshCookie(req: Request): string | undefined {
  const token = req.cookies?.[cookieNames.refreshToken];
  return typeof token === "string" && token.length > 0 ? token : undefined;
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const account = await authService.login(email, password);
  sendSession(res, await authService.createSession(account, clientMeta(req)));
});

export const refresh = asyncHandler(async (req, res) => {
  const token = getRefreshCookie(req);
  if (!token) throw new AppError(401, "Invalid session");

  try {
    sendSession(res, await authService.rotateSession(token, clientMeta(req)));
  } catch (err) {
    clearRefreshCookie(res);
    throw err;
  }
});

export const logout = asyncHandler(async (req, res) => {
  const token = getRefreshCookie(req);
  if (token) await authService.revokeSession(token);
  clearRefreshCookie(res);
  res.status(204).end();
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.revokeAllSessions(req.user!.sub);
  clearRefreshCookie(res);
  res.status(204).end();
});
