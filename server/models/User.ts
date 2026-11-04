import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import { emailField, nameField, publicJson, telephoneField } from "./fields";

export interface IUser {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nin?: string | null;
  motDePasseHash?: string;
  tentativesEchouees?: number;
  verrouilleJusqua?: Date | null;
  idResidence?: Types.ObjectId | null;
  idBatiment?: Types.ObjectId | null;
  idAppartement?: Types.ObjectId | null;
  pushTokens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    prenom: nameField,
    nom: nameField,
    email: emailField,
    telephone: telephoneField,
    nin: { type: String, required: false, trim: true, default: null },
    motDePasseHash: { type: String, select: false },
    tentativesEchouees: { type: Number, default: 0, select: false },
    verrouilleJusqua: { type: Date, default: null, select: false },
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", default: null, index: true },
    idBatiment: { type: Schema.Types.ObjectId, ref: "Batiment", default: null, index: true },
    idAppartement: { type: Schema.Types.ObjectId, ref: "Appartement", default: null, index: true },
    pushTokens: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: publicJson },
);

userSchema.index({ nin: 1 }, { unique: true, partialFilterExpression: { nin: { $type: "string", $gt: "" } } });

export const User = model<IUser>("User", userSchema);
