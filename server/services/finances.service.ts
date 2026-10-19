import mongoose from "mongoose";
import { Appartement } from "../models/Appartement";
import { Batiment } from "../models/Batiment";
import { Charge } from "../models/Charge";
import { Depense } from "../models/Depense";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

const trusted = <T extends object>(filter: T) => mongoose.trusted(filter) as T;

export async function getFinances(idResidence: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);

  const [charges, allDepenses] = await Promise.all([
    Charge.find({ idResidence: resId }).sort({ createdAt: -1 }),
    Depense.find({ idResidence: resId }).sort({ createdAt: -1 }),
  ]);

  const impayes = charges
    .filter((c) => c.statut === "impaye")
    .map((c) => ({
      id: String(c._id),
      logement: c.logement,
      resident: c.resident,
      telephone: c.telephone,
      moisImpayes: c.moisImpayes,
      dernierReglement: c.dernierReglement,
      totalDu: c.totalDu,
    }));

  const paiements = charges
    .filter((c) => c.statut === "paye")
    .map((c) => ({
      id: String(c._id),
      date: c.datePaiement ? new Date(c.datePaiement).toLocaleDateString("fr-FR") : "Récemment",
      logement: c.logement,
      resident: c.resident,
      mode: c.modePaiement ?? "Espèces",
      reference: c.reference ?? `REF-${String(c._id).slice(-6)}`,
      montant: c.totalDu,
    }));

  const depensesList = allDepenses
    .filter((d) => d.typeDepense === "depense")
    .map((d) => ({
      id: String(d._id),
      date: d.date,
      categorie: d.categorie,
      fournisseur: d.fournisseur,
      description: d.description,
      statut: d.statut,
      montant: d.montant,
    }));

  const facturesList = allDepenses
    .filter((d) => d.typeDepense === "facture")
    .map((d) => ({
      id: String(d._id),
      fournisseur: d.fournisseur,
      service: d.service,
      periode: d.periode,
      echeance: d.echeance,
      statut: d.statut as "Payée" | "À payer" | "En retard",
      montant: d.montant,
    }));

  return { impayes, paiements, depenses: depensesList, factures: facturesList };
}

export async function encaisser(idResidence: string, chargeId: string, input: { modePaiement?: string; reference?: string }) {
  const charge = await Charge.findOne({ _id: chargeId, idResidence });
  if (!charge) throw new AppError(404, "Charge introuvable");

  charge.statut = "paye";
  charge.moisImpayes = 0;
  charge.datePaiement = new Date();
  charge.modePaiement = input.modePaiement ?? "Espèces";
  charge.reference = input.reference ?? `ENC-${Date.now().toString().slice(-6)}`;
  charge.dernierReglement = new Date().toLocaleDateString("fr-FR");
  await charge.save();

  return charge.toJSON();
}

export async function createPaiement(
  idResidence: string,
  input: { logement: string; resident: string; telephone: string; montant: number; modePaiement: string; reference?: string },
) {
  const charge = await Charge.create({
    idResidence,
    logement: input.logement,
    resident: input.resident,
    telephone: input.telephone,
    moisImpayes: 0,
    totalDu: input.montant,
    statut: "paye",
    modePaiement: input.modePaiement,
    reference: input.reference || `PAY-${Date.now().toString().slice(-6)}`,
    datePaiement: new Date(),
    dernierReglement: new Date().toLocaleDateString("fr-FR"),
  });
  return charge.toJSON();
}

export async function createDepense(
  idResidence: string,
  input: {
    categorie: string;
    fournisseur: string;
    service?: string;
    description: string;
    montant: number;
    statut: "Payée" | "À payer" | "En retard" | "En attente";
    echeance?: string;
    periode?: string;
    typeDepense?: "depense" | "facture";
  },
) {
  const now = new Date().toLocaleDateString("fr-FR");
  const depense = await Depense.create({
    idResidence,
    date: now,
    categorie: input.categorie,
    fournisseur: input.fournisseur,
    service: input.service || "",
    description: input.description,
    montant: input.montant,
    statut: input.statut,
    echeance: input.echeance || now,
    periode: input.periode || "Courante",
    typeDepense: input.typeDepense || "depense",
  });
  return depense.toJSON();
}

export async function payerFacture(idResidence: string, factureId: string) {
  const facture = await Depense.findOne({ _id: factureId, idResidence });
  if (!facture) throw new AppError(404, "Facture introuvable");
  facture.statut = "Payée";
  await facture.save();
  return facture.toJSON();
}

export async function genererCharges(idResidence: string, moisNom: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);
  const batiments = await Batiment.find({ idResidence: resId });
  const batimentIds = batiments.map((b) => b._id);
  const appartements = await Appartement.find({ idBatiment: trusted({ $in: batimentIds }) });
  const batimentMap = new Map(batiments.map((b) => [String(b._id), b.nom]));

  const ownerIds = appartements.flatMap((a) => (a.idProprietaire ? [a.idProprietaire] : []));
  const owners = ownerIds.length ? await User.find({ _id: trusted({ $in: ownerIds }) }) : [];
  const ownerMap = new Map(owners.map((u) => [String(u._id), u]));

  let count = 0;
  for (const apt of appartements) {
    const batNom = batimentMap.get(String(apt.idBatiment)) ?? "Bloc A";
    const owner = apt.idProprietaire ? ownerMap.get(String(apt.idProprietaire)) : null;
    const residentName = owner ? `${owner.prenom} ${owner.nom}` : `Résident ${apt.nom}`;
    const tel = owner ? owner.telephone : "0550123456";

    await Charge.create({
      idResidence: resId,
      idBatiment: apt.idBatiment,
      idAppartement: apt._id,
      logement: `Logement ${apt.nom} (${batNom})`,
      resident: residentName,
      telephone: tel,
      moisImpayes: 1,
      totalDu: 3500,
      dernierReglement: moisNom,
      statut: "impaye",
    });
    count++;
  }

  return { generated: count };
}

export async function updateDepense(
  idResidence: string,
  id: string,
  input: Partial<{
    montant: number;
    categorie: string;
    fournisseur: string;
    description: string;
    date: string;
    service: string;
    periode: string;
    echeance: string;
    statut: "Payée" | "À payer" | "En retard" | "En attente";
  }>,
) {
  const depense = await Depense.findOne({ _id: id, idResidence });
  if (!depense) throw new AppError(404, "Dépense ou facture introuvable");
  if (input.montant !== undefined) depense.montant = input.montant;
  if (input.categorie !== undefined) depense.categorie = input.categorie;
  if (input.fournisseur !== undefined) depense.fournisseur = input.fournisseur;
  if (input.description !== undefined) depense.description = input.description;
  if (input.date !== undefined) depense.date = input.date;
  if (input.service !== undefined) depense.service = input.service;
  if (input.periode !== undefined) depense.periode = input.periode;
  if (input.echeance !== undefined) depense.echeance = input.echeance;
  if (input.statut !== undefined) depense.statut = input.statut;
  await depense.save();
  return depense.toJSON();
}

export async function deleteDepense(idResidence: string, id: string) {
  const depense = await Depense.findOneAndDelete({ _id: id, idResidence });
  if (!depense) throw new AppError(404, "Dépense ou facture introuvable");
  return { ok: true };
}

export async function updateCharge(
  idResidence: string,
  id: string,
  input: Partial<{
    totalDu: number;
    moisImpayes: number;
    statut: "impaye" | "paye";
    logement: string;
    resident: string;
    telephone: string;
  }>,
) {
  const charge = await Charge.findOne({ _id: id, idResidence });
  if (!charge) throw new AppError(404, "Charge introuvable");
  if (input.totalDu !== undefined) charge.totalDu = input.totalDu;
  if (input.moisImpayes !== undefined) charge.moisImpayes = input.moisImpayes;
  if (input.statut !== undefined) charge.statut = input.statut;
  if (input.logement !== undefined) charge.logement = input.logement;
  if (input.resident !== undefined) charge.resident = input.resident;
  if (input.telephone !== undefined) charge.telephone = input.telephone;
  await charge.save();
  return charge.toJSON();
}

export async function deleteCharge(idResidence: string, id: string) {
  const charge = await Charge.findOneAndDelete({ _id: id, idResidence });
  if (!charge) throw new AppError(404, "Charge introuvable");
  return { ok: true };
}
