import mongoose from "mongoose";
import { Incident } from "../models/Incident";
import { AppError } from "../utils/AppError";

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
    statut: "Nouveau",
    isPanneEquipement: input.isPanneEquipement ?? false,
    equipement: input.equipement || "",
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
