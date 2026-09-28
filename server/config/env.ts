import "dotenv/config";
import Joi from "joi";

const secret = Joi.string().min(32).required();

// Optional values: an empty line in .env (`KEY=`) counts as "not set".
const optionalText = (max: number) => Joi.string().trim().max(max).empty("");
const optionalEmail = Joi.string().trim().lowercase().email().max(254).empty("");
const optionalPassword = Joi.string().min(12).max(128).empty("");
const optionalTelephone = Joi.string().trim().pattern(/^\+?[0-9]{8,15}$/).empty("");

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().port().default(4000),

  MONGODB_URI: Joi.string().uri({ scheme: [/mongodb(\+srv)?/] }).required(),

  // Comma-separated list of allowed origins. Example:
  // CORS_ORIGINS=http://localhost:3000,https://app.example.com
  CORS_ORIGINS: Joi.string().default("http://localhost:3000"),

  // JWT access tokens (short-lived, sent as `Authorization: Bearer <token>`)
  JWT_ACCESS_SECRET: secret,
  JWT_ACCESS_TTL_SECONDS: Joi.number().integer().min(60).max(3600).default(900),
  JWT_ISSUER: Joi.string().default("project_city"),
  JWT_AUDIENCE: Joi.string().default("project_city"),

  // Refresh tokens (opaque, httpOnly cookie, rotated on every use)
  REFRESH_TOKEN_TTL_DAYS: Joi.number().integer().min(1).max(90).default(7),

  // Signs cookies (cookie-parser) and CSRF tokens (csrf-csrf)
  COOKIE_SECRET: secret,
  CSRF_SECRET: secret,

  // When behind a proxy (nginx, cloudflare, render, etc) set to 1 (or "true")
  TRUST_PROXY: Joi.alternatives()
    .try(Joi.boolean(), Joi.number().integer().min(0).max(10), Joi.string())
    .default(false),

  // Socket security
  SOCKET_REQUIRE_AUTH: Joi.boolean().default(true),

  // Redis (recommended for scaling across multiple instances)
  REDIS_URL: Joi.string().uri().optional(),
  REDIS_ENABLED: Joi.boolean().default(false),

  // Default accounts, created on startup only when none exist (scripts_for_superadmin_and_admin.ts)
  DEFAULT_SUPER_ADMIN_NOM_COMPLET: optionalText(120),
  DEFAULT_SUPER_ADMIN_EMAIL: optionalEmail,
  DEFAULT_SUPER_ADMIN_PASSWORD: optionalPassword,

  DEFAULT_ADMIN_PRENOM: optionalText(60),
  DEFAULT_ADMIN_NOM: optionalText(60),
  DEFAULT_ADMIN_EMAIL: optionalEmail,
  DEFAULT_ADMIN_TELEPHONE: optionalTelephone,
  DEFAULT_ADMIN_WILAYA: optionalText(80),
  DEFAULT_ADMIN_DAIRA: optionalText(80),
  DEFAULT_ADMIN_BALADIA: optionalText(80),
  DEFAULT_ADMIN_PASSWORD: optionalPassword,
})
  // Passwords are left out so they can be deleted from .env once the accounts exist.
  .and("DEFAULT_SUPER_ADMIN_NOM_COMPLET", "DEFAULT_SUPER_ADMIN_EMAIL")
  .and(
    "DEFAULT_ADMIN_PRENOM",
    "DEFAULT_ADMIN_NOM",
    "DEFAULT_ADMIN_EMAIL",
    "DEFAULT_ADMIN_TELEPHONE",
    "DEFAULT_ADMIN_WILAYA",
    "DEFAULT_ADMIN_DAIRA",
    "DEFAULT_ADMIN_BALADIA",
  )
  .unknown(true);

const { value, error } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  convert: true,
});

if (error) {
  // Fail fast on boot rather than running insecurely/misconfigured.
  throw new Error(`Invalid environment configuration:\n${error.message}`);
}

function parseOrigins(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const corsOrigins = parseOrigins(value.CORS_ORIGINS as string);

const problems: string[] = [];

const secrets = [value.JWT_ACCESS_SECRET, value.COOKIE_SECRET, value.CSRF_SECRET];
if (new Set(secrets).size !== secrets.length) {
  problems.push("JWT_ACCESS_SECRET, COOKIE_SECRET and CSRF_SECRET must all be different");
}

if (value.DEFAULT_SUPER_ADMIN_EMAIL && value.DEFAULT_SUPER_ADMIN_EMAIL === value.DEFAULT_ADMIN_EMAIL) {
  problems.push("DEFAULT_SUPER_ADMIN_EMAIL and DEFAULT_ADMIN_EMAIL must be different");
}

if (value.REDIS_ENABLED && !value.REDIS_URL) {
  problems.push("REDIS_URL is required when REDIS_ENABLED=true");
}

if (value.NODE_ENV === "production") {
  if (!value.SOCKET_REQUIRE_AUTH) problems.push("SOCKET_REQUIRE_AUTH must be true in production");
  if (corsOrigins.some((o) => !o.startsWith("https://"))) {
    problems.push("CORS_ORIGINS must only contain https:// origins in production");
  }
  if (!new URL(value.MONGODB_URI as string).username) {
    problems.push("MONGODB_URI must include credentials in production");
  }
}

if (problems.length > 0) {
  throw new Error(`Invalid environment configuration:\n- ${problems.join("\n- ")}`);
}

export const env = {
  nodeEnv: value.NODE_ENV as "development" | "test" | "production",
  isProd: value.NODE_ENV === "production",
  port: value.PORT as number,
  mongoUri: value.MONGODB_URI as string,
  corsOrigins,
  trustProxy: value.TRUST_PROXY as boolean | number | string,

  jwt: {
    accessSecret: value.JWT_ACCESS_SECRET as string,
    accessTtlSeconds: value.JWT_ACCESS_TTL_SECONDS as number,
    issuer: value.JWT_ISSUER as string,
    audience: value.JWT_AUDIENCE as string,
  },

  refreshTokenTtlDays: value.REFRESH_TOKEN_TTL_DAYS as number,

  cookieSecret: value.COOKIE_SECRET as string,
  csrfSecret: value.CSRF_SECRET as string,

  socketRequireAuth: value.SOCKET_REQUIRE_AUTH as boolean,

  redis: {
    enabled: value.REDIS_ENABLED as boolean,
    url: value.REDIS_URL as string | undefined,
  },

  defaultAccounts: {
    superAdmin: value.DEFAULT_SUPER_ADMIN_EMAIL
      ? {
          nomComplet: value.DEFAULT_SUPER_ADMIN_NOM_COMPLET as string,
          email: value.DEFAULT_SUPER_ADMIN_EMAIL as string,
          password: value.DEFAULT_SUPER_ADMIN_PASSWORD as string | undefined,
        }
      : null,
    admin: value.DEFAULT_ADMIN_EMAIL
      ? {
          prenom: value.DEFAULT_ADMIN_PRENOM as string,
          nom: value.DEFAULT_ADMIN_NOM as string,
          email: value.DEFAULT_ADMIN_EMAIL as string,
          telephone: value.DEFAULT_ADMIN_TELEPHONE as string,
          wilaya: value.DEFAULT_ADMIN_WILAYA as string,
          daira: value.DEFAULT_ADMIN_DAIRA as string,
          baladia: value.DEFAULT_ADMIN_BALADIA as string,
          password: value.DEFAULT_ADMIN_PASSWORD as string | undefined,
        }
      : null,
  },
};
