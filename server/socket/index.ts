import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { env } from "../config/env";
import { getRedis } from "../db/redis";
import { verifyAccessToken } from "../services/token.service";

let ioInstance: Server | null = null;

export interface NotificationEventPayload {
  id: string;
  titre: string;
  detail: string;
  isAlerte: boolean;
  niveau: "critique" | "attention" | "info";
  audience: string;
  canaux: string[];
  date: string;
  idResidence: string;
  webUrl: string;
  mobileRoute: string;
}

export function getIO(): Server | null {
  return ioInstance;
}

export function broadcastNotification(idResidence: string, payload: NotificationEventPayload): void {
  if (!ioInstance) return;
  // Send to the specific residence room and as a fallback broadcast
  console.log(`[Socket] Broadcasting notification to residence:${idResidence}:`, payload.titre);
  ioInstance.to(`residence:${idResidence}`).emit("new_notification", payload);
  ioInstance.emit("new_notification", payload);
}

export function initSocket(server: HttpServer): Server {
  const io = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (env.corsOrigins.includes(origin)) return callback(null, true);
        if (env.nodeEnv === "development") {
          if (/^http:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2|192\.168\.\d+\.\d+|172\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)) {
            return callback(null, true);
          }
        }
        return callback(new Error("Origin not allowed"));
      },
      credentials: true,
    },
    maxHttpBufferSize: 64 * 1024,
  });

  ioInstance = io;

  // Scale Socket.IO across multiple instances via Redis pub/sub.
  const redis = getRedis();
  if (redis) {
    const pubClient = redis;
    const subClient = redis.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token && typeof token === "string") {
      try {
        socket.data.user = verifyAccessToken(token);
      } catch {
        if (env.isProd && env.socketRequireAuth) return next(new Error("Unauthorized"));
      }
    } else if (env.isProd && env.socketRequireAuth) {
      return next(new Error("Unauthorized"));
    }
    return next();
  });

  io.on("connection", (socket) => {
    socket.emit("connected", { ok: true, socketId: socket.id });

    const user = socket.data.user;
    if (user?.idResidence) {
      void socket.join(`residence:${user.idResidence}`);
      console.log(`[Socket] Client ${socket.id} auto-joined residence:${user.idResidence}`);
    }

    socket.on("authenticate", (token: string, cb?: (res: { ok: boolean; idResidence?: string }) => void) => {
      if (typeof token === "string" && token.length > 0) {
        try {
          const authUser = verifyAccessToken(token);
          socket.data.user = authUser;
          if (authUser.idResidence) {
            void socket.join(`residence:${authUser.idResidence}`);
            console.log(`[Socket] Client ${socket.id} authenticated and joined residence:${authUser.idResidence}`);
          }
          if (typeof cb === "function") cb({ ok: true, idResidence: authUser.idResidence });
        } catch (err) {
          console.warn(`[Socket] Authentication failed for ${socket.id}:`, err);
          if (typeof cb === "function") cb({ ok: false });
        }
      }
    });

    socket.on("join_residence", (residenceId: string) => {
      if (typeof residenceId === "string" && residenceId.trim().length > 0) {
        const room = `residence:${residenceId.trim()}`;
        void socket.join(room);
        console.log(`[Socket] Client ${socket.id} joined room ${room}`);
      }
    });

    socket.on("leave_residence", (residenceId: string) => {
      if (typeof residenceId === "string" && residenceId.trim().length > 0) {
        void socket.leave(`residence:${residenceId.trim()}`);
      }
    });

    socket.on("send_message", (data: { idResidence?: string; message: unknown }) => {
      const residenceId = data?.idResidence || socket.data.user?.idResidence;
      if (residenceId && data?.message) {
        io.to(`residence:${residenceId}`).emit("new_chat_message", data.message);
      }
    });
  });

  return io;
}
