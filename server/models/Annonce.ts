import { Schema, model, type Document, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface AnnonceDocument extends Document {
  idResidence: Types.ObjectId;
  titre: string;
  contenu: string;
  audience: string;
  canaux: string[];
  date: string;
  epinglee: boolean;
  isAlerte: boolean;
  niveauAlerte?: "critique" | "attention" | "info";
  createdAt: Date;
  updatedAt: Date;
}

const annonceSchema = new Schema<AnnonceDocument>(
  {
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, index: true },
    titre: { type: String, required: true, trim: true },
    contenu: { type: String, required: true, trim: true },
    audience: { type: String, default: "Tous les résidents", trim: true },
    canaux: { type: [String], default: ["Application", "Affichage"] },
    date: { type: String, required: true },
    epinglee: { type: Boolean, default: false },
    isAlerte: { type: Boolean, default: false },
    niveauAlerte: { type: String, enum: ["critique", "attention", "info"], default: "info" },
  },
  {
    timestamps: true,
    toJSON: publicJson,
    toObject: publicJson,
  },
);

export const Annonce = model<AnnonceDocument>("Annonce", annonceSchema);
