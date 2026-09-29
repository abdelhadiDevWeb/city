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
  // An admin is responsible for a residence; a sub_admin for one building (and belongs to its residence).
  // Both stay null for the bootstrap accounts created by scripts_for_superadmin_and_admin.ts.
  idResidence?: Types.ObjectId | null;
  idBatiment?: Types.ObjectId | null;
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
    idBatiment: { type: Schema.Types.ObjectId, ref: "Batiment", default: null, index: true },
    ...authFields,
  },
  { timestamps: true, toJSON: publicJson },
);

// One responsible admin per residence and one sub_admin per building, enforced by the database.
adminSchema.index(
  { idResidence: 1, role: 1 },
  { name: "one_admin_per_residence", unique: true, partialFilterExpression: { role: "admin", idResidence: { $type: "objectId" } } },
);
adminSchema.index(
  { idBatiment: 1, role: 1 },
  { name: "one_sub_admin_per_batiment", unique: true, partialFilterExpression: { role: "sub_admin", idBatiment: { $type: "objectId" } } },
);

export const Admin = model<IAdmin>("Admin", adminSchema);
