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
