import mongoose from "mongoose";
import { ConfigResidence, type ModePaiementItem, type TypeChargeItem, type TypeIncidentItem } from "../models/ConfigResidence";
import { AppError } from "../utils/AppError";

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

export async function updateChargeType(
  idResidence: string,
  chargeId: string,
  input: Partial<{ nom: string; montantMensuel: number; appliqueA: string; actif: boolean }>,
) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) throw new AppError(404, "Configuration introuvable");
  const item = config.typesCharges.find((c) => c.id === chargeId);
  if (!item) throw new AppError(404, "Type de charge introuvable");
  if (input.nom !== undefined) item.nom = input.nom;
  if (input.montantMensuel !== undefined) item.montantMensuel = input.montantMensuel;
  if (input.appliqueA !== undefined) item.appliqueA = input.appliqueA;
  if (input.actif !== undefined) item.actif = input.actif;
  await config.save();
  return item;
}

export async function deleteChargeType(idResidence: string, chargeId: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) throw new AppError(404, "Configuration introuvable");
  config.typesCharges = config.typesCharges.filter((c) => c.id !== chargeId);
  await config.save();
  return { ok: true };
}

// -------------------------------------------------------------
// TYPES D'INCIDENTS
// -------------------------------------------------------------
export async function addIncidentType(
  idResidence: string,
  input: { nom: string; delaiIntervention: string; prestataire: string },
) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  let config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) {
    await getConfig(idResidence);
    config = await ConfigResidence.findOne({ idResidence: resId });
  }
  if (!config) return;
  const newItem: TypeIncidentItem = {
    id: `inc_${Date.now()}`,
    nom: input.nom,
    delaiIntervention: input.delaiIntervention || "24h",
    prestataire: input.prestataire || "À désigner",
    actif: true,
  };
  config.typesIncidents.push(newItem);
  await config.save();
  return newItem;
}

export async function toggleIncidentType(idResidence: string, incidentId: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) return;
  const item = config.typesIncidents.find((i) => i.id === incidentId);
  if (item) {
    item.actif = !item.actif;
    await config.save();
  }
  return item;
}

export async function updateIncidentType(
  idResidence: string,
  incidentId: string,
  input: Partial<{ nom: string; delaiIntervention: string; prestataire: string; actif: boolean }>,
) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) throw new AppError(404, "Configuration introuvable");
  const item = config.typesIncidents.find((i) => i.id === incidentId);
  if (!item) throw new AppError(404, "Type d'incident introuvable");
  if (input.nom !== undefined) item.nom = input.nom;
  if (input.delaiIntervention !== undefined) item.delaiIntervention = input.delaiIntervention;
  if (input.prestataire !== undefined) item.prestataire = input.prestataire;
  if (input.actif !== undefined) item.actif = input.actif;
  await config.save();
  return item;
}

export async function deleteIncidentType(idResidence: string, incidentId: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) throw new AppError(404, "Configuration introuvable");
  config.typesIncidents = config.typesIncidents.filter((i) => i.id !== incidentId);
  await config.save();
  return { ok: true };
}

// -------------------------------------------------------------
// MODES DE PAIEMENT
// -------------------------------------------------------------
export async function addPaymentMode(
  idResidence: string,
  input: { nom: string; frais: string },
) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  let config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) {
    await getConfig(idResidence);
    config = await ConfigResidence.findOne({ idResidence: resId });
  }
  if (!config) return;
  const newItem: ModePaiementItem = {
    id: `pay_${Date.now()}`,
    nom: input.nom,
    frais: input.frais || "Sans frais",
    actif: true,
  };
  config.modesPaiement.push(newItem);
  await config.save();
  return newItem;
}

export async function togglePaymentMode(idResidence: string, paymentId: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) return;
  const item = config.modesPaiement.find((p) => p.id === paymentId);
  if (item) {
    item.actif = !item.actif;
    await config.save();
  }
  return item;
}

export async function updatePaymentMode(
  idResidence: string,
  paymentId: string,
  input: Partial<{ nom: string; frais: string; actif: boolean }>,
) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) throw new AppError(404, "Configuration introuvable");
  const item = config.modesPaiement.find((p) => p.id === paymentId);
  if (!item) throw new AppError(404, "Mode de paiement introuvable");
  if (input.nom !== undefined) item.nom = input.nom;
  if (input.frais !== undefined) item.frais = input.frais;
  if (input.actif !== undefined) item.actif = input.actif;
  await config.save();
  return item;
}

export async function deletePaymentMode(idResidence: string, paymentId: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const config = await ConfigResidence.findOne({ idResidence: resId });
  if (!config) throw new AppError(404, "Configuration introuvable");
  config.modesPaiement = config.modesPaiement.filter((p) => p.id !== paymentId);
  await config.save();
  return { ok: true };
}
