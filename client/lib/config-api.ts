import { apiRequest } from "./api";

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

export async function getConfig(): Promise<ConfigData> {
  return apiRequest<ConfigData>("/configuration");
}

export async function addChargeType(input: { nom: string; montantMensuel: number; appliqueA: string }): Promise<void> {
  await apiRequest("/configuration/charges", { method: "POST", body: input });
}

export async function toggleChargeType(id: string): Promise<void> {
  await apiRequest(`/configuration/charges/${encodeURIComponent(id)}/toggle`, { method: "PATCH" });
}

export async function updateChargeType(id: string, input: { nom?: string; montantMensuel?: number; appliqueA?: string }): Promise<void> {
  await apiRequest(`/configuration/charges/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function deleteChargeType(id: string): Promise<void> {
  await apiRequest(`/configuration/charges/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// Incidents
export async function addIncidentType(input: { nom: string; delaiIntervention: string; prestataire: string }): Promise<void> {
  await apiRequest("/configuration/incidents", { method: "POST", body: input });
}

export async function toggleIncidentType(id: string): Promise<void> {
  await apiRequest(`/configuration/incidents/${encodeURIComponent(id)}/toggle`, { method: "PATCH" });
}

export async function updateIncidentType(id: string, input: { nom?: string; delaiIntervention?: string; prestataire?: string }): Promise<void> {
  await apiRequest(`/configuration/incidents/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function deleteIncidentType(id: string): Promise<void> {
  await apiRequest(`/configuration/incidents/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// Modes de paiement
export async function addPaymentMode(input: { nom: string; frais: string }): Promise<void> {
  await apiRequest("/configuration/paiements", { method: "POST", body: input });
}

export async function togglePaymentMode(id: string): Promise<void> {
  await apiRequest(`/configuration/paiements/${encodeURIComponent(id)}/toggle`, { method: "PATCH" });
}

export async function updatePaymentMode(id: string, input: { nom?: string; frais?: string }): Promise<void> {
  await apiRequest(`/configuration/paiements/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function deletePaymentMode(id: string): Promise<void> {
  await apiRequest(`/configuration/paiements/${encodeURIComponent(id)}`, { method: "DELETE" });
}
