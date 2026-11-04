import { Schema, model, type HydratedDocument } from "mongoose";
import { publicJson } from "./fields";

export const ABONNEMENT_CIBLES = ["admin", "sub_admin"] as const;
export type AbonnementCible = (typeof ABONNEMENT_CIBLES)[number];

export interface IAbonnement {
  nom: string;
  prix: number;
  // Duration in months.
  duree: number;
  cible: AbonnementCible;
  createdAt: Date;
  updatedAt: Date;
}

export type AbonnementDocument = HydratedDocument<IAbonnement>;

const abonnementSchema = new Schema<IAbonnement>(
  {
    nom: { type: String, required: true, trim: true, maxlength: 60 },
    prix: { type: Number, required: true, min: 0, max: 100_000_000 },
    duree: { type: Number, required: true, min: 1, max: 120, validate: Number.isInteger },
    cible: { type: String, enum: ABONNEMENT_CIBLES, default: "admin", required: true },
  },
  { timestamps: true, toJSON: publicJson },
);

abonnementSchema.index({ nom: 1, cible: 1 }, { unique: true, collation: { locale: "fr", strength: 1 } });

export const Abonnement = model<IAbonnement>("Abonnement", abonnementSchema);
