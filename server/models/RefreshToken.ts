import { Schema, model, type Types } from "mongoose";

export const ACCOUNT_TYPES = ["SuperAdmin", "Admin"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export interface IRefreshToken {
  accountId: Types.ObjectId;
  accountType: AccountType;
  // SHA-256 of the raw token; the raw token only ever lives in the client's cookie.
  tokenHash: string;
  // All tokens produced by rotating the same login share a family, so reuse can revoke them together.
  family: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  replacedByHash?: string | null;
  createdByIp?: string;
  userAgent?: string;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    accountId: { type: Schema.Types.ObjectId, refPath: "accountType", required: true, index: true },
    accountType: { type: String, enum: ACCOUNT_TYPES, required: true },
    tokenHash: { type: String, required: true, unique: true },
    family: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    revokedAt: { type: Date, default: null },
    replacedByHash: { type: String, default: null },
    createdByIp: { type: String, maxlength: 64 },
    userAgent: { type: String, maxlength: 512 },
  },
  { timestamps: true },
);

export const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
