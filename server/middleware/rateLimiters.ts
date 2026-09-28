import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedis } from "../db/redis";

// Each limiter needs its own prefix, otherwise they share (and add up) the same Redis counters.
function redisStoreIfEnabled(prefix: string): RedisStore | undefined {
  const redis = getRedis();
  if (!redis) return undefined;
  return new RedisStore({
    prefix,
    // `rate-limit-redis` expects a node-redis-like `sendCommand`.
    sendCommand: (...args: string[]) => (redis as any).call(...args),
  });
}

export const globalLimiter = rateLimit({
  limit: 120,
  windowMs: 60 * 1000,
  message: { ok: false, message: "Too many requests" },
  legacyHeaders: false,
  standardHeaders: "draft-7",
  store: redisStoreIfEnabled("rl:global:"),
});

export const authLimiter = rateLimit({
  limit: 10,
  windowMs: 60 * 1000,
  message: { ok: false, message: "Too many auth attempts" },
  legacyHeaders: false,
  standardHeaders: "draft-7",
  store: redisStoreIfEnabled("rl:auth:"),
});
