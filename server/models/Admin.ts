import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import { authFields, emailField, locationField, nameField, publicJson, telephoneField, type AuthFields } from "./fields";

export const ADMIN_ROLES = ["admin", "sub_admin"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface IAdmin extends AuthFields {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  wilaya: string;
  daira: string;
  baladia: string;
  role: AdminRole;
  // The Residence collection doesn't exist yet, so this reference is optional for now.
  idResidence?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminDocument = HydratedDocument<IAdmin>;

const adminSchema = new Schema<IAdmin>(
  {
    prenom: nameField,
    nom: nameField,
    email: emailField,
    telephone: telephoneField,
    wilaya: locationField,
    daira: locationField,
    baladia: locationField,
    role: { type: String, enum: ADMIN_ROLES, required: true },
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", default: null, index: true },
    ...authFields,
  },
  { timestamps: true, toJSON: publicJson },
);

export const Admin = model<IAdmin>("Admin", adminSchema);
