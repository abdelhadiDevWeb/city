import { Schema, model, type Document, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface IncidentDocument extends Document {
  idResidence: Types.ObjectId;
  titre: string;
  description: string;
  lieu: string;
  signalePar: string;
  signaleLe: string;
  priorite: "Haute" | "Moyenne" | "Basse";
  prestataire: string;
  statut: "Nouveau" | "En cours" | "Résolu" | "Planifié";
  cout: number;
  isPanneEquipement: boolean;
  equipement: string;
  clotureLe?: string;
  createdAt: Date;
  updatedAt: Date;
}

const incidentSchema = new Schema<IncidentDocument>(
  {
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, index: true },
    titre: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    lieu: { type: String, required: true, trim: true },
    signalePar: { type: String, required: true, trim: true },
    signaleLe: { type: String, required: true },
    priorite: { type: String, enum: ["Haute", "Moyenne", "Basse"], default: "Moyenne" },
    prestataire: { type: String, default: "À désigner", trim: true },
    statut: {
      type: String,
      enum: ["Nouveau", "En cours", "Résolu", "Planifié"],
      default: "Nouveau",
      index: true,
    },
    cout: { type: Number, default: 0 },
    isPanneEquipement: { type: Boolean, default: false },
    equipement: { type: String, default: "" },
    clotureLe: { type: String },
  },
  {
    timestamps: true,
    toJSON: publicJson,
    toObject: publicJson,
  },
);

export const Incident = model<IncidentDocument>("Incident", incidentSchema);
