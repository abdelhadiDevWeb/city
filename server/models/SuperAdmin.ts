import { Schema, model, type HydratedDocument } from "mongoose";
import { authFields, emailField, publicJson, type AuthFields } from "./fields";

export interface ISuperAdmin extends AuthFields {
  nomComplet: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SuperAdminDocument = HydratedDocument<ISuperAdmin>;

const superAdminSchema = new Schema<ISuperAdmin>(
  {
    nomComplet: { type: String, required: true, trim: true, maxlength: 120 },
    email: emailField,
    ...authFields,
  },
  { timestamps: true, toJSON: publicJson },
);

export const SuperAdmin = model<ISuperAdmin>("SuperAdmin", superAdminSchema);
