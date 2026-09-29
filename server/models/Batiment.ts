import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import { nameField, publicJson } from "./fields";

export interface IBatiment {
  nom: string;
  idResidence: Types.ObjectId;
  etages: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BatimentDocument = HydratedDocument<IBatiment>;

const batimentSchema = new Schema<IBatiment>(
  {
    nom: nameField,
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, index: true },
    etages: { type: Number, required: true, min: 0, max: 200, validate: Number.isInteger },
  },
  { timestamps: true, toJSON: publicJson },
);

// Building names are unique within a residence, ignoring case and accents ("A1" = "a1").
batimentSchema.index({ idResidence: 1, nom: 1 }, { unique: true, collation: { locale: "fr", strength: 1 } });

export const Batiment = model<IBatiment>("Batiment", batimentSchema);
