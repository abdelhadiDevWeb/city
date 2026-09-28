import http from "node:http";

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";

import { env } from "./config/env";
import { connectMongo, disconnectMongo } from "./db/mongoose";
import { connectRedis, disconnectRedis } from "./db/redis";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { httpLogger } from "./middleware/logger";
import { globalLimiter } from "./middleware/rateLimiters";
import { Admin } from "./models/Admin";
import { RefreshToken } from "./models/RefreshToken";
import { SuperAdmin } from "./models/SuperAdmin";
import { User } from "./models/User";
import { apiRouter } from "./routes";
import { ensureDefaultAccounts } from "./scripts_for_superadmin_and_admin";
import { initSocket } from "./socket";
import { AppError } from "./utils/AppError";

const app = express();
app.set("trust proxy", env.trustProxy);

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // allow same-origin / server-to-server / curl
    if (!origin) return callback(null, true);
    if (env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new AppError(403, "Origin not allowed"));
  },
  credentials: true,
};

app.use(httpLogger);
// For an API-only server, Helmet's defaults are generally sufficient.
// If you later serve HTML, add a full CSP policy (with default-src) at that time.
app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(globalLimiter);

// Responses under /api/auth carry secrets (tokens); compressing them exposes them to BREACH.
app.use(compression({ filter: (req, res) => !req.path.startsWith("/api/auth") && compression.filter(req, res) }));
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: false, limit: "64kb" }));
app.use(cookieParser(env.cookieSecret));
app.use(hpp());
app.use(mongoSanitize({ replaceWith: "_" }));

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
// Reasonable defaults for high-throughput proxies/load balancers.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 70_000;
initSocket(server);

async function start(): Promise<void> {
  await connectRedis();
  await connectMongo();
  // `autoIndex` is off in production, but the unique indexes are security-relevant.
  await Promise.all([
    SuperAdmin.createIndexes(),
    Admin.createIndexes(),
    User.createIndexes(),
    RefreshToken.createIndexes(),
  ]);
  await ensureDefaultAccounts();
  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`server running on port ${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Startup error", err);
  process.exitCode = 1;
});

async function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}, shutting down...`);
  server.close(async () => {
    await disconnectMongo().catch(() => {});
    await disconnectRedis().catch(() => {});
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
