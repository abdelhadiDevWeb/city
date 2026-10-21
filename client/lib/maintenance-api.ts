import { apiRequest } from "./api";

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
};

export type PanneEquipement = {
  id: string;
  equipement: string;
  lieu: string;
  depuis: string;
  prestataire: string;
  statut: string;
};

export type InterventionPassee = {
  id: string;
  titre: string;
  lieu: string;
  clotureLe: string;
  prestataire: string;
  cout: number;
};

export type MaintenanceData = {
  incidents: Incident[];
  pannesEquipement: PanneEquipement[];
  historiqueInterventions: InterventionPassee[];
};

export async function getMaintenance(): Promise<MaintenanceData> {
  return apiRequest<MaintenanceData>("/maintenance");
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
  clotureLe?: string;
}): Promise<void> {
  await apiRequest("/maintenance/incidents", { method: "POST", body: input });
}

export async function updateIncidentStatut(id: string, statut: "Nouveau" | "En cours" | "Résolu" | "Planifié"): Promise<void> {
  await apiRequest(`/maintenance/incidents/${encodeURIComponent(id)}/statut`, { method: "PATCH", body: { statut } });
}

export async function updateIncident(id: string, input: { titre?: string; description?: string; lieu?: string; priorite?: Priorite; prestataire?: string; statut?: string; cout?: number; clotureLe?: string }): Promise<void> {
  await apiRequest(`/maintenance/incidents/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function deleteIncident(id: string): Promise<void> {
  await apiRequest(`/maintenance/incidents/${encodeURIComponent(id)}`, { method: "DELETE" });
}
