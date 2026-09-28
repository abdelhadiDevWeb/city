import pinoHttp from "pino-http";
import { env } from "../config/env";

export const httpLogger = pinoHttp({
  enabled: env.nodeEnv !== "test",
  level: env.isProd ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers.set-cookie",
      "res.headers.set-cookie",
    ],
    remove: true,
  },
});

