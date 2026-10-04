import { Schema, model, type Document, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface DepenseDocument extends Document {
  idResidence: Types.ObjectId;
  date: string;
  categorie: string;
  fournisseur: string;
  service: string;
  description: string;
  statut: "Payée" | "À payer" | "En retard" | "En attente";
  periode: string;
  echeance: string;
  montant: number;
  typeDepense: "depense" | "facture";
  createdAt: Date;
  updatedAt: Date;
}

const depenseSchema = new Schema<DepenseDocument>(
  {
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, index: true },
    date: { type: String, required: true },
    categorie: { type: String, required: true, trim: true },
    fournisseur: { type: String, required: true, trim: true },
    service: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    statut: {
      type: String,
      enum: ["Payée", "À payer", "En retard", "En attente"],
      default: "À payer",
      index: true,
    },
    periode: { type: String, default: "" },
    echeance: { type: String, default: "" },
    montant: { type: Number, required: true },
    typeDepense: { type: String, enum: ["depense", "facture"], default: "depense", index: true },
  },
  {
    timestamps: true,
    toJSON: publicJson,
    toObject: publicJson,
  },
);

export const Depense = model<DepenseDocument>("Depense", depenseSchema);
