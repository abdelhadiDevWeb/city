import mongoose from "mongoose";
import { ConfigResidence, type ModePaiementItem, type TypeChargeItem, type TypeIncidentItem } from "../models/ConfigResidence";

export async function getConfig(idResidence: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);

  let config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) {
    try {
      config = await ConfigResidence.findOneAndUpdate(
        { idResidence: resId },
        {
          $setOnInsert: {
            idResidence: resId,
            typesCharges: [],
            typesIncidents: [],
            modesPaiement: [
              { id: "m1", nom: "Carte Edahabia (Algérie Poste)", frais: "Gratuit", actif: true },
              { id: "m2", nom: "Carte CIB (Banques algériennes)", frais: "Gratuit", actif: true },
              { id: "m3", nom: "Virement bancaire / CCP", frais: "Selon opérateur", actif: true },
              { id: "m4", nom: "Paiement en espèces au bureau du syndic", frais: "Sans frais", actif: true },
            ],
          },
        },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
      );
    } catch (err: unknown) {
      if ((err as { code?: number })?.code === 11000) {
        config = await ConfigResidence.findOne({ idResidence: resId });
      } else {
        throw err;
      }
    }
  }

  return {
    typesCharges: config?.typesCharges ?? [],
    typesIncidents: config?.typesIncidents ?? [],
    modesPaiement: config?.modesPaiement ?? [],
  };
}

export async function addChargeType(idResidence: string, input: { nom: string; montantMensuel: number; appliqueA: string }) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  let config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) {
    await getConfig(idResidence);
    config = await ConfigResidence.findOne({ idResidence: resId });
  }
  if (!config) return;
  const newItem: TypeChargeItem = {
    id: `c_${Date.now()}`,
    nom: input.nom,
    montantMensuel: input.montantMensuel,
    appliqueA: input.appliqueA,
    actif: true,
  };
  config.typesCharges.push(newItem);
  await config.save();
  return newItem;
}

export async function toggleChargeType(idResidence: string, chargeId: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) return;
  const item = config.typesCharges.find((c) => c.id === chargeId);
  if (item) {
    item.actif = !item.actif;
    await config.save();
  }
  return item;
}
