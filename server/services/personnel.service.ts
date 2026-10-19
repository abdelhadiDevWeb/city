import mongoose from "mongoose";
import { Personnel } from "../models/Personnel";
import { Tache } from "../models/Tache";
import { AppError } from "../utils/AppError";

export async function getPersonnel(idResidence: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);

  const [staff, taches] = await Promise.all([
    Personnel.find({ idResidence: resId }).sort({ nom: 1 }),
    Tache.find({ idResidence: resId }).sort({ createdAt: -1 }),
  ]);

  return {
    personnel: staff.map((s) => ({
      id: String(s._id),
      nom: s.nom,
      poste: s.poste,
      statut: s.statut,
      telephone: s.telephone,
      horaire: s.horaire,
    })),
    taches: taches.map((t) => ({
      id: String(t._id),
      titre: t.titre,
      assigneA: t.assigneA,
      lieu: t.lieu,
      echeance: t.echeance,
      statut: t.statut,
      urgente: t.urgente,
    })),
  };
}

export async function createTache(
  idResidence: string,
  input: {
    titre: string;
    assigneA: string;
    lieu: string;
    echeance: string;
    urgente?: boolean;
  },
) {
  const tache = await Tache.create({
    idResidence,
    titre: input.titre,
    assigneA: input.assigneA,
    lieu: input.lieu,
    echeance: input.echeance,
    urgente: input.urgente ?? false,
    statut: "À faire",
  });
  return tache.toJSON();
}

export async function updateTacheStatut(idResidence: string, tacheId: string, statut: "À faire" | "En cours" | "Terminée") {
  const tache = await Tache.findOne({ _id: tacheId, idResidence });
  if (!tache) throw new AppError(404, "Tâche introuvable");
  tache.statut = statut;
  await tache.save();
  return tache.toJSON();
}

export async function createPersonnel(
  idResidence: string,
  input: { nom: string; poste: string; telephone?: string; horaire?: string; statut?: "En service" | "Repos" | "Congé" },
) {
  const staff = await Personnel.create({
    idResidence,
    nom: input.nom,
    poste: input.poste,
    telephone: input.telephone || "0550000000",
    horaire: input.horaire || "8h - 16h",
    statut: input.statut || "En service",
  });
  return staff.toJSON();
}

export async function updatePersonnel(
  idResidence: string,
  id: string,
  input: Partial<{ nom: string; poste: string; telephone: string; horaire: string; statut: "En service" | "Repos" | "Congé" }>,
) {
  const staff = await Personnel.findOne({ _id: id, idResidence });
  if (!staff) throw new AppError(404, "Personnel introuvable");
  if (input.nom !== undefined) staff.nom = input.nom;
  if (input.poste !== undefined) staff.poste = input.poste;
  if (input.telephone !== undefined) staff.telephone = input.telephone;
  if (input.horaire !== undefined) staff.horaire = input.horaire;
  if (input.statut !== undefined) staff.statut = input.statut;
  await staff.save();
  return staff.toJSON();
}

export async function deletePersonnel(idResidence: string, id: string) {
  const staff = await Personnel.findOneAndDelete({ _id: id, idResidence });
  if (!staff) throw new AppError(404, "Personnel introuvable");
  return { ok: true };
}

export async function updateTache(
  idResidence: string,
  tacheId: string,
  input: Partial<{ titre: string; assigneA: string; lieu: string; echeance: string; urgente: boolean; statut: string }>,
) {
  const tache = await Tache.findOne({ _id: tacheId, idResidence });
  if (!tache) throw new AppError(404, "Tâche introuvable");
  if (input.titre !== undefined) tache.titre = input.titre;
  if (input.assigneA !== undefined) tache.assigneA = input.assigneA;
  if (input.lieu !== undefined) tache.lieu = input.lieu;
  if (input.echeance !== undefined) tache.echeance = input.echeance;
  if (input.urgente !== undefined) tache.urgente = input.urgente;
  if (input.statut !== undefined) tache.statut = input.statut as any;
  await tache.save();
  return tache.toJSON();
}

export async function deleteTache(idResidence: string, tacheId: string) {
  const tache = await Tache.findOneAndDelete({ _id: tacheId, idResidence });
  if (!tache) throw new AppError(404, "Tâche introuvable");
  return { ok: true };
}
