import mongoose from "mongoose";
import { Annonce } from "../models/Annonce";
import { broadcastNotification } from "../socket";
import { AppError } from "../utils/AppError";

export async function getAnnonces(idResidence: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);

  const allItems = await Annonce.find({ idResidence: resId }).sort({ epinglee: -1, createdAt: -1 });

  const annoncesList = allItems
    .filter((a) => !a.isAlerte)
    .map((a) => ({
      id: String(a._id),
      titre: a.titre,
      contenu: a.contenu,
      audience: a.audience,
      canaux: a.canaux,
      date: a.date,
      epinglee: a.epinglee,
    }));

  const alertesList = allItems
    .filter((a) => a.isAlerte)
    .map((a) => ({
      id: String(a._id),
      titre: a.titre,
      detail: a.contenu,
      niveau: a.niveauAlerte || "info",
      date: a.date,
    }));

  return { annonces: annoncesList, alertes: alertesList };
}

export async function createAnnonce(
  idResidence: string,
  input: {
    titre: string;
    contenu: string;
    audience?: string;
    canaux?: string[];
    epinglee?: boolean;
    isAlerte?: boolean;
    niveauAlerte?: "critique" | "attention" | "info";
  },
) {
  const now = new Date().toLocaleDateString("fr-FR");
  const annonce = await Annonce.create({
    idResidence,
    titre: input.titre,
    contenu: input.contenu,
    audience: input.audience || "Tous les résidents",
    canaux: input.canaux || ["Application", "Affichage"],
    date: now,
    epinglee: input.epinglee ?? false,
    isAlerte: input.isAlerte ?? false,
    niveauAlerte: input.niveauAlerte || "info",
  });

  broadcastNotification(String(idResidence), {
    id: String(annonce._id),
    titre: annonce.titre,
    detail: annonce.contenu,
    isAlerte: Boolean(annonce.isAlerte),
    niveau: (annonce.niveauAlerte || "info") as "critique" | "attention" | "info",
    audience: annonce.audience,
    canaux: annonce.canaux,
    date: annonce.date,
    idResidence: String(idResidence),
    webUrl: annonce.isAlerte ? "/dashboard/annonces?tab=alertes" : "/dashboard/annonces",
    mobileRoute: "/notifications",
  });

  return annonce.toJSON();
}

export async function renvoyerAnnonce(idResidence: string, id: string) {
  const annonce = await Annonce.findOne({ _id: id, idResidence });
  if (!annonce) throw new AppError(404, "Annonce introuvable");
  annonce.date = `Renvoyée le ${new Date().toLocaleDateString("fr-FR")}`;
  await annonce.save();

  broadcastNotification(String(idResidence), {
    id: String(annonce._id),
    titre: `[Rappel] ${annonce.titre}`,
    detail: annonce.contenu,
    isAlerte: Boolean(annonce.isAlerte),
    niveau: (annonce.niveauAlerte || "info") as "critique" | "attention" | "info",
    audience: annonce.audience,
    canaux: annonce.canaux,
    date: annonce.date,
    idResidence: String(idResidence),
    webUrl: annonce.isAlerte ? "/dashboard/annonces?tab=alertes" : "/dashboard/annonces",
    mobileRoute: "/notifications",
  });

  return annonce.toJSON();
}
