import { Schema, model, type Document, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface ChargeDocument extends Document {
  idResidence: Types.ObjectId;
  idBatiment?: Types.ObjectId;
  idAppartement?: Types.ObjectId;
  logement: string;
  resident: string;
  telephone: string;
  moisImpayes: number;
  totalDu: number;
  dernierReglement: string;
  statut: "impaye" | "paye";
  modePaiement?: string;
  reference?: string;
  datePaiement?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chargeSchema = new Schema<ChargeDocument>(
  {
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, index: true },
    idBatiment: { type: Schema.Types.ObjectId, ref: "Batiment" },
    idAppartement: { type: Schema.Types.ObjectId, ref: "Appartement" },
    logement: { type: String, required: true, trim: true },
    resident: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    moisImpayes: { type: Number, default: 0 },
    totalDu: { type: Number, required: true },
    dernierReglement: { type: String, default: "Jamais" },
    statut: { type: String, enum: ["impaye", "paye"], default: "impaye", index: true },
    modePaiement: { type: String, trim: true },
    reference: { type: String, trim: true },
    datePaiement: { type: Date },
  },
  {
    timestamps: true,
    toJSON: publicJson,
    toObject: publicJson,
  },
);

export const Charge = model<ChargeDocument>("Charge", chargeSchema);
