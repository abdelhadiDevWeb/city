import { Schema, model, type Document, type Types } from "mongoose";
import { publicJson, telephoneField } from "./fields";

export interface PersonnelDocument extends Document {
  idResidence: Types.ObjectId;
  nom: string;
  poste: string;
  statut: "En service" | "Repos" | "Congé";
  telephone: string;
  horaire: string;
  createdAt: Date;
  updatedAt: Date;
}

const personnelSchema = new Schema<PersonnelDocument>(
  {
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", required: true, index: true },
    nom: { type: String, required: true, trim: true },
    poste: { type: String, required: true, trim: true },
    statut: { type: String, enum: ["En service", "Repos", "Congé"], default: "En service" },
    telephone: telephoneField,
    horaire: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    toJSON: publicJson,
    toObject: publicJson,
  },
);

export const Personnel = model<PersonnelDocument>("Personnel", personnelSchema);
