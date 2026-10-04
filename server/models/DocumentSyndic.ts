import { Schema, model, type Document, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface DocumentSyndicDocument extends Document {
  idResidence: Types.ObjectId;
  typeDoc: "contrat" | "document";
  nom: string;
  objet?: string;
  prestataire?: string;
  debut?: string;
  fin?: string;
  statut?: "Actif" | "Expire bientôt" | "Expiré";
  montantAnnuel?: number;
  categorie?: string;
  format?: string;
  taille?: string;
  ajouteLe: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSyndicSchema = new Schema<DocumentSyndicDocument>(
  {
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, index: true },
    typeDoc: { type: String, enum: ["contrat", "document"], required: true, index: true },
    nom: { type: String, required: true, trim: true },
    objet: { type: String, trim: true },
    prestataire: { type: String, trim: true },
    debut: { type: String },
    fin: { type: String },
    statut: { type: String, enum: ["Actif", "Expire bientôt", "Expiré"], default: "Actif" },
    montantAnnuel: { type: Number, default: 0 },
    categorie: { type: String, trim: true },
    format: { type: String, default: "PDF" },
    taille: { type: String, default: "1.2 Mo" },
    ajouteLe: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: publicJson,
    toObject: publicJson,
  },
);

export const DocumentSyndic = model<DocumentSyndicDocument>("DocumentSyndic", documentSyndicSchema);
