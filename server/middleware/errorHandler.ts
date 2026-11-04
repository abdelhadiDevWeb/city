import type { ErrorRequestHandler, RequestHandler } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ ok: false, message: "Not found" });
};

// Errors from http-errors (body-parser, csrf-csrf) carry `status` and `expose`.
function isExposableHttpError(err: unknown): err is { status: number; message: string } {
  return (
    !!err &&
    typeof err === "object" &&
    "status" in err &&
    typeof err.status === "number" &&
    err.status >= 400 &&
    err.status < 500 &&
    "expose" in err &&
    err.expose === true
  );
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (
    err instanceof AppError ||
    (err && typeof err === "object" && "statusCode" in err && typeof (err as any).statusCode === "number")
  ) {
    const statusCode = (err as any).statusCode;
    return res.status(statusCode).json({ ok: false, message: (err as any).message });
  }

  if (isExposableHttpError(err)) {
    return res.status(err.status).json({ ok: false, message: err.message });
  }

  if (err && typeof err === "object" && "name" in err && (err.name === "CastError" || err.name === "BSONError" || err.name === "ValidationError")) {
    return res.status(400).json({ ok: false, message: (err as any).message || "Invalid input data" });
  }

  req.log?.error({ err }, "unhandled error");
  const message = env.isProd ? "Internal Server Error" : err instanceof Error ? err.message : String(err);
  return res.status(500).json({ ok: false, message });
};
