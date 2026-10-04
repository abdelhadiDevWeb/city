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
