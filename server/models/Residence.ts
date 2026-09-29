import { Schema, model, type HydratedDocument } from "mongoose";
import { publicJson } from "./fields";

export interface IResidence {
  nom: string;
  localisation: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ResidenceDocument = HydratedDocument<IResidence>;

const residenceSchema = new Schema<IResidence>(
  {
    nom: { type: String, required: true, trim: true, maxlength: 120 },
    localisation: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { timestamps: true, toJSON: publicJson },
);

export const Residence = model<IResidence>("Residence", residenceSchema);
