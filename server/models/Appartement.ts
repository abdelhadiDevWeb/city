import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface IAppartement {
  idBatiment: Types.ObjectId;
  nom: string;
  etage: number;
  idProprietaire?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AppartementDocument = HydratedDocument<IAppartement>;

const appartementSchema = new Schema<IAppartement>(
  {
    idBatiment: { type: Schema.Types.ObjectId, ref: "Batiment", required: true, index: true },
    nom: { type: String, required: true, trim: true, maxlength: 20 },
    // 0 is the ground floor; capped by the building's number of floors in the service.
    etage: { type: Number, required: true, min: 0, max: 200, validate: Number.isInteger },
    idProprietaire: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  },
  { timestamps: true, toJSON: publicJson },
);

// Flat names are unique per building, ignoring case and accents ("a12" = "A12").
appartementSchema.index(
  { idBatiment: 1, nom: 1 },
  { unique: true, collation: { locale: "fr", strength: 1 }, partialFilterExpression: { nom: { $type: "string" } } },
);

export const Appartement = model<IAppartement>("Appartement", appartementSchema);
