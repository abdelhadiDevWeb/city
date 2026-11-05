import { apiRequest } from "./api";
import { cachedFetch, invalidateTags } from "./cache";

export type TypeCharge = {
  id: string;
  nom: string;
  montantMensuel: number;
  appliqueA: string;
  actif: boolean;
};

export type TypeIncident = {
  id: string;
  nom: string;
  delaiIntervention: string;
  prestataire: string;
  actif: boolean;
};

export type ModePaiement = {
  id: string;
  nom: string;
  frais: string;
  actif: boolean;
};

export type ConfigData = {
  typesCharges: TypeCharge[];
  typesIncidents: TypeIncident[];
  modesPaiement: ModePaiement[];
};

export async function getConfig(forceRefresh = false): Promise<ConfigData> {
  return cachedFetch("/configuration", () => apiRequest<ConfigData>("/configuration"), {
    tags: ["configuration", "dashboard"],
    forceRefresh,
  });
}

export async function addChargeType(input: { nom: string; montantMensuel: number; appliqueA: string }): Promise<void> {
  await apiRequest("/configuration/charges", { method: "POST", body: input });
  invalidateTags(["configuration", "dashboard"]);
}

export async function toggleChargeType(id: string): Promise<void> {
  await apiRequest(`/configuration/charges/${encodeURIComponent(id)}/toggle`, { method: "PATCH" });
  invalidateTags(["configuration", "dashboard"]);
}

export async function updateChargeType(id: string, input: { nom?: string; montantMensuel?: number; appliqueA?: string }): Promise<void> {
  await apiRequest(`/configuration/charges/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["configuration", "dashboard"]);
}

export async function deleteChargeType(id: string): Promise<void> {
  await apiRequest(`/configuration/charges/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["configuration", "dashboard"]);
}

// Incidents
export async function addIncidentType(input: { nom: string; delaiIntervention: string; prestataire: string }): Promise<void> {
  await apiRequest("/configuration/incidents", { method: "POST", body: input });
  invalidateTags(["configuration", "dashboard"]);
}

export async function toggleIncidentType(id: string): Promise<void> {
  await apiRequest(`/configuration/incidents/${encodeURIComponent(id)}/toggle`, { method: "PATCH" });
  invalidateTags(["configuration", "dashboard"]);
}

export async function updateIncidentType(id: string, input: { nom?: string; delaiIntervention?: string; prestataire?: string }): Promise<void> {
  await apiRequest(`/configuration/incidents/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["configuration", "dashboard"]);
}

export async function deleteIncidentType(id: string): Promise<void> {
  await apiRequest(`/configuration/incidents/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["configuration", "dashboard"]);
}

// Modes de paiement
export async function addPaymentMode(input: { nom: string; frais: string }): Promise<void> {
  await apiRequest("/configuration/paiements", { method: "POST", body: input });
  invalidateTags(["configuration", "dashboard"]);
}

export async function togglePaymentMode(id: string): Promise<void> {
  await apiRequest(`/configuration/paiements/${encodeURIComponent(id)}/toggle`, { method: "PATCH" });
  invalidateTags(["configuration", "dashboard"]);
}

export async function updatePaymentMode(id: string, input: { nom?: string; frais?: string }): Promise<void> {
  await apiRequest(`/configuration/paiements/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["configuration", "dashboard"]);
}

export async function deletePaymentMode(id: string): Promise<void> {
  await apiRequest(`/configuration/paiements/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["configuration", "dashboard"]);
}

export async function toggleModePaiement(id: string): Promise<void> {
  await apiRequest(`/configuration/modes-paiement/${encodeURIComponent(id)}/toggle`, { method: "PATCH" });
  invalidateTags(["configuration", "dashboard"]);
}
