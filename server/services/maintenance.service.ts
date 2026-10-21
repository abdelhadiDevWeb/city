import mongoose from "mongoose";
import { Incident } from "../models/Incident";
import { AppError } from "../utils/AppError";
import { broadcastNotification } from "../socket";
import { dispatchMobilePushForResidence } from "./push.service";

export async function getMaintenance(idResidence: string) {
  const resId = new mongoose.Types.ObjectId(idResidence);

  const allIncidents = await Incident.find({ idResidence: resId }).sort({ createdAt: -1 });

  const activeIncidents = allIncidents
    .filter((i) => !i.isPanneEquipement && i.statut !== "Résolu")
    .map((i) => ({
      id: String(i._id),
      titre: i.titre,
      lieu: i.lieu,
      signaleLe: i.signaleLe,
      priorite: i.priorite,
      prestataire: i.prestataire,
      statut: i.statut,
      signalePar: i.signalePar,
    }));

  const pannes = allIncidents
    .filter((i) => i.isPanneEquipement && i.statut !== "Résolu")
    .map((i) => ({
      id: String(i._id),
      equipement: i.equipement || i.titre,
      lieu: i.lieu,
      depuis: i.signaleLe,
      prestataire: i.prestataire,
      statut: i.statut,
    }));

  const historique = allIncidents
    .filter((i) => i.statut === "Résolu")
    .map((i) => ({
      id: String(i._id),
      titre: i.titre,
      lieu: i.lieu,
      clotureLe: i.clotureLe || "Récemment",
      prestataire: i.prestataire,
      cout: i.cout,
    }));

  return {
    incidents: activeIncidents,
    pannesEquipement: pannes,
    historiqueInterventions: historique,
  };
}

export async function createIncident(
  idResidence: string,
  input: {
    titre: string;
    description?: string;
    lieu: string;
    signalePar: string;
    priorite: "Haute" | "Moyenne" | "Basse";
    prestataire?: string;
    isPanneEquipement?: boolean;
    equipement?: string;
    cout?: number;
    statut?: "Nouveau" | "En cours" | "Résolu" | "Planifié";
    clotureLe?: string;
  },
) {
  const now = new Date().toLocaleDateString("fr-FR");
  const incident = await Incident.create({
    idResidence,
    titre: input.titre,
    description: input.description || "",
    lieu: input.lieu,
    signalePar: input.signalePar,
    signaleLe: now,
    priorite: input.priorite,
    prestataire: input.prestataire || "À désigner",
    statut: input.statut || "Nouveau",
    cout: input.cout || 0,
    isPanneEquipement: input.isPanneEquipement ?? false,
    equipement: input.equipement || "",
    clotureLe: input.clotureLe || (input.statut === "Résolu" ? now : undefined),
  });
  const isAlerte = input.priorite === "Haute";
  const notifTitle = isAlerte ? `🚨 [Maintenance Urgente] ${input.titre}` : `🔧 [Maintenance] ${input.titre}`;
  const notifDetail = `${input.lieu} · Priorité: ${input.priorite}${input.prestataire && input.prestataire !== "À désigner" ? ` · Prestataire: ${input.prestataire}` : ""}`;

  // 1. In-app real-time Socket.IO notification (Web & open mobile app)
  broadcastNotification(String(idResidence), {
    id: String(incident._id),
    titre: notifTitle,
    detail: notifDetail,
    isAlerte,
    niveau: isAlerte ? "critique" : input.priorite === "Moyenne" ? "attention" : "info",
    audience: "Tous les résidents",
    canaux: ["Application"],
    date: now,
    idResidence: String(idResidence),
    webUrl: "/dashboard/maintenance",
    mobileRoute: "/notifications",
    kind: "maintenance",
  });

  // 2. Mobile push notification out of the application (Lock screen & Notification center)
  void dispatchMobilePushForResidence(String(idResidence), {
    id: String(incident._id),
    titre: notifTitle,
    detail: notifDetail,
    isAlerte,
    kind: "maintenance",
    route: "/notifications",
  });

  return incident.toJSON();
}

export async function updateIncidentStatut(idResidence: string, incidentId: string, statut: "Nouveau" | "En cours" | "Résolu" | "Planifié") {
  const incident = await Incident.findOne({ _id: incidentId, idResidence });
  if (!incident) throw new AppError(404, "Incident introuvable");

  incident.statut = statut;
  if (statut === "Résolu") {
    incident.clotureLe = new Date().toLocaleDateString("fr-FR");
  }
  await incident.save();
  return incident.toJSON();
}

export async function updateIncident(
  idResidence: string,
  incidentId: string,
  input: Partial<{
    titre: string;
    description: string;
    lieu: string;
    priorite: "Haute" | "Moyenne" | "Basse";
    prestataire: string;
    statut: "Nouveau" | "En cours" | "Résolu" | "Planifié";
    cout: number;
  }>,
) {
  const incident = await Incident.findOne({ _id: incidentId, idResidence });
  if (!incident) throw new AppError(404, "Incident introuvable");
  if (input.titre !== undefined) incident.titre = input.titre;
  if (input.description !== undefined) incident.description = input.description;
  if (input.lieu !== undefined) incident.lieu = input.lieu;
  if (input.priorite !== undefined) incident.priorite = input.priorite;
  if (input.prestataire !== undefined) incident.prestataire = input.prestataire;
  if (input.cout !== undefined) incident.cout = input.cout;
  if (input.statut !== undefined) {
    incident.statut = input.statut;
    if (input.statut === "Résolu" && !incident.clotureLe) {
      incident.clotureLe = new Date().toLocaleDateString("fr-FR");
    }
  }
  await incident.save();
  return incident.toJSON();
}

export async function deleteIncident(idResidence: string, incidentId: string) {
  const incident = await Incident.findOneAndDelete({ _id: incidentId, idResidence });
  if (!incident) throw new AppError(404, "Incident introuvable");
  return { ok: true };
}
