import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import { emailField, nameField, publicJson, telephoneField } from "./fields";

export interface IUser {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  // The Appartement / Batiment collections don't exist yet, so these references are optional for now.
  idAppartement?: Types.ObjectId | null;
  idBatiment?: Types.ObjectId | null;
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
    idAppartement: { type: Schema.Types.ObjectId, ref: "Appartement", default: null, index: true },
    idBatiment: { type: Schema.Types.ObjectId, ref: "Batiment", default: null, index: true },
  },
  { timestamps: true, toJSON: publicJson },
);

export const User = model<IUser>("User", userSchema);
