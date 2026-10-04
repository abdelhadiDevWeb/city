import mongoose from "mongoose";
import { DocumentSyndic } from "../models/DocumentSyndic";

export async function getDocuments(idResidence: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);

  const docs = await DocumentSyndic.find({ idResidence: resId }).sort({ createdAt: -1 });

  const contrats = docs
    .filter((d) => d.typeDoc === "contrat")
    .map((c) => ({
      id: String(c._id),
      objet: c.objet || c.nom,
      prestataire: c.prestataire || "Prestataire",
      debut: c.debut || "—",
      fin: c.fin || "—",
      statut: c.statut || "Actif",
      montantAnnuel: c.montantAnnuel || 0,
    }));

  const documentsResidence = docs
    .filter((d) => d.typeDoc === "document")
    .map((d) => ({
      id: String(d._id),
      nom: d.nom,
      categorie: d.categorie || "Général",
      format: d.format || "PDF",
      taille: d.taille || "1 Mo",
      ajouteLe: d.ajouteLe,
    }));

  return { contrats, documentsResidence };
}

export async function createDocument(
  idResidence: string,
  input: {
    typeDoc: "contrat" | "document";
    nom: string;
    objet?: string;
    prestataire?: string;
    debut?: string;
    fin?: string;
    montantAnnuel?: number;
    categorie?: string;
    format?: string;
    taille?: string;
  },
) {
  const now = new Date().toLocaleDateString("fr-FR");
  const doc = await DocumentSyndic.create({
    idResidence,
    typeDoc: input.typeDoc,
    nom: input.nom,
    objet: input.objet,
    prestataire: input.prestataire,
    debut: input.debut,
    fin: input.fin,
    statut: "Actif",
    montantAnnuel: input.montantAnnuel || 0,
    categorie: input.categorie,
    format: input.format || "PDF",
    taille: input.taille || "1.5 Mo",
    ajouteLe: now,
  });
  return doc.toJSON();
}
