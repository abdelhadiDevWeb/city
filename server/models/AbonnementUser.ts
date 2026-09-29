import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import { publicJson } from "./fields";

// A subscription held by an admin (the account responsible for a residence).
export interface IAbonnementUser {
  idAbonnement: Types.ObjectId;
  idAdmin: Types.ObjectId;
  debut: Date;
  fin: Date;
  statutPaiement: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AbonnementUserDocument = HydratedDocument<IAbonnementUser>;

const abonnementUserSchema = new Schema<IAbonnementUser>(
  {
    idAbonnement: { type: Schema.Types.ObjectId, ref: "Abonnement", required: true, index: true },
    idAdmin: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    debut: { type: Date, required: true },
    fin: { type: Date, required: true },
    statutPaiement: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: publicJson },
);

abonnementUserSchema.pre("validate", function () {
  if (this.debut && this.fin && this.fin <= this.debut) this.invalidate("fin", "La date de fin doit être après la date de début");
});

abonnementUserSchema.index({ idAdmin: 1, debut: -1 });

export const AbonnementUser = model<IAbonnementUser>("AbonnementUser", abonnementUserSchema, "abonnement_users");
