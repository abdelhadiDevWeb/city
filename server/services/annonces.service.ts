import mongoose from "mongoose";
import { Annonce } from "../models/Annonce";
import { broadcastNotification } from "../socket";
import { dispatchMobilePushForResidence } from "./push.service";
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
      niveau: (a.niveauAlerte || "info") as "critique" | "attention" | "info",
      audience: a.audience,
      canaux: a.canaux,
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

  // 1. In-app real-time Socket.IO notification (Web & open mobile app)
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

  // 2. Mobile push notification out of the application (Lock screen & Notification center)
  void dispatchMobilePushForResidence(String(idResidence), {
    id: String(annonce._id),
    titre: annonce.titre,
    detail: annonce.contenu,
    isAlerte: Boolean(annonce.isAlerte),
  });

  return annonce.toJSON();
}

export async function renvoyerAnnonce(idResidence: string, id: string) {
  const annonce = await Annonce.findOne({ _id: id, idResidence });
  if (!annonce) throw new AppError(404, "Annonce introuvable");
  annonce.date = `Renvoyée le ${new Date().toLocaleDateString("fr-FR")}`;
  await annonce.save();

  // 1. In-app real-time Socket.IO notification
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

  // 2. Mobile push notification
  void dispatchMobilePushForResidence(String(idResidence), {
    id: String(annonce._id),
    titre: annonce.titre,
    detail: annonce.contenu,
    isAlerte: Boolean(annonce.isAlerte),
    isRappel: true,
  });

  return annonce.toJSON();
}

export async function updateAnnonce(
  idResidence: string,
  id: string,
  input: Partial<{
    titre: string;
    contenu: string;
    audience: string;
    canaux: string[];
    epinglee: boolean;
    isAlerte: boolean;
    niveauAlerte: "critique" | "attention" | "info";
  }>,
) {
  const annonce = await Annonce.findOne({ _id: id, idResidence });
  if (!annonce) throw new AppError(404, "Annonce introuvable");
  if (input.titre !== undefined) annonce.titre = input.titre;
  if (input.contenu !== undefined) annonce.contenu = input.contenu;
  if (input.audience !== undefined) annonce.audience = input.audience;
  if (input.canaux !== undefined) annonce.canaux = input.canaux;
  if (input.epinglee !== undefined) annonce.epinglee = input.epinglee;
  if (input.isAlerte !== undefined) annonce.isAlerte = input.isAlerte;
  if (input.niveauAlerte !== undefined) annonce.niveauAlerte = input.niveauAlerte;
  await annonce.save();
  return annonce.toJSON();
}

export async function deleteAnnonce(idResidence: string, id: string) {
  const annonce = await Annonce.findOneAndDelete({ _id: id, idResidence });
  if (!annonce) throw new AppError(404, "Annonce introuvable");
  return { ok: true };
}

export async function createAlerte(
  idResidence: string,
  input: {
    titre: string;
    detail: string;
    niveau?: "critique" | "attention" | "info";
    audience?: string;
    canaux?: string[];
  },
) {
  return createAnnonce(idResidence, {
    titre: input.titre,
    contenu: input.detail,
    isAlerte: true,
    niveauAlerte: input.niveau || "info",
    audience: input.audience || "Tous les résidents",
    canaux: input.canaux || ["Application", "Notification Push"],
  });
}

export async function updateAlerte(
  idResidence: string,
  id: string,
  input: {
    titre?: string;
    detail?: string;
    niveau?: "critique" | "attention" | "info";
    audience?: string;
    canaux?: string[];
  },
) {
  return updateAnnonce(idResidence, id, {
    titre: input.titre,
    contenu: input.detail,
    niveauAlerte: input.niveau,
    audience: input.audience,
    canaux: input.canaux,
  });
}

