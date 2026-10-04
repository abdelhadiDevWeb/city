import { Schema, model, type Document, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface TypeChargeItem {
  id: string;
  nom: string;
  montantMensuel: number;
  appliqueA: string;
  actif: boolean;
}

export interface TypeIncidentItem {
  id: string;
  nom: string;
  delaiIntervention: string;
  prestataire: string;
  actif: boolean;
}

export interface ModePaiementItem {
  id: string;
  nom: string;
  frais: string;
  actif: boolean;
}

export interface ConfigResidenceDocument extends Document {
  idResidence: Types.ObjectId;
  typesCharges: TypeChargeItem[];
  typesIncidents: TypeIncidentItem[];
  modesPaiement: ModePaiementItem[];
  createdAt: Date;
  updatedAt: Date;
}

const configResidenceSchema = new Schema<ConfigResidenceDocument>(
  {
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, unique: true, index: true },
    typesCharges: {
      type: [
        {
          id: { type: String, required: true },
          nom: { type: String, required: true },
          montantMensuel: { type: Number, required: true },
          appliqueA: { type: String, required: true },
          actif: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    typesIncidents: {
      type: [
        {
          id: { type: String, required: true },
          nom: { type: String, required: true },
          delaiIntervention: { type: String, required: true },
          prestataire: { type: String, required: true },
          actif: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    modesPaiement: {
      type: [
        {
          id: { type: String, required: true },
          nom: { type: String, required: true },
          frais: { type: String, required: true },
          actif: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: publicJson,
    toObject: publicJson,
  },
);

export const ConfigResidence = model<ConfigResidenceDocument>("ConfigResidence", configResidenceSchema);
