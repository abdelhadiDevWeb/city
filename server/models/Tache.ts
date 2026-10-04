import { Schema, model, type Document, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface TacheDocument extends Document {
  idResidence: Types.ObjectId;
  titre: string;
  assigneA: string;
  lieu: string;
  echeance: string;
  statut: "À faire" | "En cours" | "Terminée";
  urgente: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tacheSchema = new Schema<TacheDocument>(
  {
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, index: true },
    titre: { type: String, required: true, trim: true },
    assigneA: { type: String, required: true, trim: true },
    lieu: { type: String, required: true, trim: true },
    echeance: { type: String, required: true },
    statut: { type: String, enum: ["À faire", "En cours", "Terminée"], default: "À faire", index: true },
    urgente: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: publicJson,
    toObject: publicJson,
  },
);

export const Tache = model<TacheDocument>("Tache", tacheSchema);
