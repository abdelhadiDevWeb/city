import { apiRequest } from "./api";
import { cachedFetch, invalidateTags } from "./cache";

export type Priorite = "Haute" | "Moyenne" | "Basse";

export type Incident = {
  id: string;
  titre: string;
  lieu: string;
  signaleLe: string;
  priorite: Priorite;
  prestataire: string;
  statut: string;
  signalePar: string;
  photoUrl?: string;
};

export type PanneEquipement = {
  id: string;
  equipement: string;
  lieu: string;
  depuis: string;
  prestataire: string;
  statut: string;
  photoUrl?: string;
};

export type InterventionPassee = {
  id: string;
  titre: string;
  lieu: string;
  clotureLe: string;
  prestataire: string;
  cout: number;
  photoUrl?: string;
};

export type MaintenanceData = {
  incidents: Incident[];
  pannesEquipement: PanneEquipement[];
  historiqueInterventions: InterventionPassee[];
};

export async function getMaintenance(forceRefresh = false): Promise<MaintenanceData> {
  return cachedFetch("/maintenance", () => apiRequest<MaintenanceData>("/maintenance"), {
    tags: ["maintenance", "dashboard"],
    forceRefresh,
  });
}

export async function createIncident(input: {
  titre: string;
  description?: string;
  lieu: string;
  signalePar: string;
  priorite: Priorite;
  prestataire?: string;
  isPanneEquipement?: boolean;
  equipement?: string;
  cout?: number;
  statut?: "Nouveau" | "En cours" | "Résolu" | "Planifié";
  photoUrl?: string;
  clotureLe?: string;
}): Promise<void> {
  await apiRequest("/maintenance/incidents", { method: "POST", body: input });
  invalidateTags(["maintenance", "dashboard"]);
}

export async function updateIncidentStatut(id: string, statut: "Nouveau" | "En cours" | "Résolu" | "Planifié"): Promise<void> {
  await apiRequest(`/maintenance/incidents/${encodeURIComponent(id)}/statut`, { method: "PATCH", body: { statut } });
  invalidateTags(["maintenance", "dashboard"]);
}

export async function updateIncident(id: string, input: { titre?: string; description?: string; lieu?: string; priorite?: Priorite; prestataire?: string; statut?: string; cout?: number; photoUrl?: string; clotureLe?: string }): Promise<void> {
  await apiRequest(`/maintenance/incidents/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["maintenance", "dashboard"]);
}

export async function deleteIncident(id: string): Promise<void> {
  await apiRequest(`/maintenance/incidents/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["maintenance", "dashboard"]);
}
