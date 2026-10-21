import mongoose from "mongoose";
import { DocumentSyndic } from "../models/DocumentSyndic";
import { AppError } from "../utils/AppError";

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

export async function updateDocument(
  idResidence: string,
  id: string,
  input: Partial<{
    nom: string;
    objet: string;
    prestataire: string;
    debut: string;
    fin: string;
    statut: "Actif" | "Expire bientôt" | "Expiré";
    montantAnnuel: number;
    categorie: string;
    format: string;
    taille: string;
  }>,
) {
  const doc = await DocumentSyndic.findOne({ _id: id, idResidence });
  if (!doc) throw new AppError(404, "Document introuvable");
  if (input.nom !== undefined) doc.nom = input.nom;
  if (input.objet !== undefined) doc.objet = input.objet;
  if (input.prestataire !== undefined) doc.prestataire = input.prestataire;
  if (input.debut !== undefined) doc.debut = input.debut;
  if (input.fin !== undefined) doc.fin = input.fin;
  if (input.statut !== undefined) doc.statut = input.statut;
  if (input.montantAnnuel !== undefined) doc.montantAnnuel = input.montantAnnuel;
  if (input.categorie !== undefined) doc.categorie = input.categorie;
  if (input.format !== undefined) doc.format = input.format;
  if (input.taille !== undefined) doc.taille = input.taille;
  await doc.save();
  return doc.toJSON();
}

export async function deleteDocument(idResidence: string, id: string) {
  const doc = await DocumentSyndic.findOneAndDelete({ _id: id, idResidence });
  if (!doc) throw new AppError(404, "Document introuvable");
  return { ok: true };
}
