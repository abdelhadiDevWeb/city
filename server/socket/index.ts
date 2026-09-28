import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { getRedis } from "../db/redis";

export function initSocket(server: HttpServer): Server {
  const io = new Server(server, {
    cors: {
      origin: env.corsOrigins,
      credentials: true,
    },
  });

  // Scale Socket.IO across multiple instances via Redis pub/sub.
  const redis = getRedis();
  if (redis) {
    const pubClient = redis;
    const subClient = redis.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.use((socket, next) => {
    if (!env.socketRequireAuth) return next();
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || token.length < 1) return next(new Error("Unauthorized"));

    try {
      jwt.verify(token, env.jwt.accessSecret, { issuer: env.jwt.issuer, audience: env.jwt.audience });
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.emit("connected", { ok: true });
  });

  return io;
}

