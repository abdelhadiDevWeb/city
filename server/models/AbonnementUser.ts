import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import { publicJson } from "./fields";

export interface IAbonnementUser {
  idAbonnement: Types.ObjectId;
  idAdmin: Types.ObjectId;
  roleAbonne: "admin" | "sub_admin";
  idResidence?: Types.ObjectId | null;
  idBatiment?: Types.ObjectId | null;
  debut: Date;
  fin: Date;
  statutPaiement: boolean;
  modePaiement?: string;
  montantPaye?: number;
  notesPaiement?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AbonnementUserDocument = HydratedDocument<IAbonnementUser>;

const abonnementUserSchema = new Schema<IAbonnementUser>(
  {
    idAbonnement: { type: Schema.Types.ObjectId, ref: "Abonnement", required: true, index: true },
    idAdmin: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    roleAbonne: { type: String, enum: ["admin", "sub_admin"], required: true, default: "admin", index: true },
    idResidence: { type: Schema.Types.ObjectId, ref: "Residence", default: null, index: true },
    idBatiment: { type: Schema.Types.ObjectId, ref: "Batiment", default: null, index: true },
    debut: { type: Date, required: true },
    fin: { type: Date, required: true },
    statutPaiement: { type: Boolean, default: false, index: true },
    modePaiement: { type: String, trim: true, default: "Virement bancaire" },
    montantPaye: { type: Number, min: 0 },
    notesPaiement: { type: String, trim: true },
  },
  { timestamps: true, toJSON: publicJson },
);

abonnementUserSchema.pre("validate", function () {
  if (this.debut && this.fin && this.fin <= this.debut) {
    this.invalidate("fin", "La date de fin doit être après la date de début");
  }
});

abonnementUserSchema.index({ idAdmin: 1, debut: -1 });
abonnementUserSchema.index({ idResidence: 1, roleAbonne: 1, statutPaiement: 1 });

export const AbonnementUser = model<IAbonnementUser>("AbonnementUser", abonnementUserSchema, "abonnement_users");
