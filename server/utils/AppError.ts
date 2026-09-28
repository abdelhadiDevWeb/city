import type { RequestHandler } from "express";

// Errors whose message is safe to send to the client.
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Express 4 does not forward rejected promises to the error handler.
export function asyncHandler(fn: (...args: Parameters<RequestHandler>) => Promise<unknown>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
