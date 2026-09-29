import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import { emailField, nameField, publicJson, telephoneField } from "./fields";

export interface IUser {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nin: string;
  idResidence?: Types.ObjectId | null;
  idBatiment?: Types.ObjectId | null;
  idAppartement?: Types.ObjectId | null;
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
    // Numéro d'identification nationale: 18 digits on the Algerian biometric ID card.
    nin: { type: String, required: true, trim: true, match: /^[0-9]{18}$/ },
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", default: null, index: true },
    idBatiment: { type: Schema.Types.ObjectId, ref: "Batiment", default: null, index: true },
    idAppartement: { type: Schema.Types.ObjectId, ref: "Appartement", default: null, index: true },
  },
  { timestamps: true, toJSON: publicJson },
);

userSchema.index({ nin: 1 }, { unique: true, partialFilterExpression: { nin: { $type: "string" } } });

export const User = model<IUser>("User", userSchema);
