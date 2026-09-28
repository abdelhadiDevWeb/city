import type { ToObjectOptions } from "mongoose";

export const emailField = {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  maxlength: 254,
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const telephoneField = {
  type: String,
  required: true,
  trim: true,
  match: /^\+?[0-9]{8,15}$/,
};

export const nameField = { type: String, required: true, trim: true, maxlength: 60 };

export const locationField = { type: String, required: true, trim: true, maxlength: 80 };

// Accounts that can log in (SuperAdmin, Admin). Never selected unless explicitly requested.
export interface AuthFields {
  motDePasseHash: string;
  tentativesEchouees: number;
  verrouilleJusqua?: Date | null;
}

export const authFields = {
  motDePasseHash: { type: String, required: true, select: false },
  tentativesEchouees: { type: Number, default: 0, select: false },
  verrouilleJusqua: { type: Date, default: null, select: false },
};

export const publicJson: ToObjectOptions = {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.motDePasseHash;
    delete ret.tentativesEchouees;
    delete ret.verrouilleJusqua;
    return ret;
  },
};
