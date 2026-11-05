import { apiRequest } from "./api";
import { cachedFetch, invalidateTags } from "./cache";

export type Employe = {
  id: string;
  nom: string;
  poste: string;
  statut: "En service" | "Repos" | "Congé";
  telephone: string;
  horaire: string;
};

export type Tache = {
  id: string;
  titre: string;
  assigneA: string;
  lieu: string;
  echeance: string;
  statut: "À faire" | "En cours" | "Terminée";
  urgente: boolean;
};

export type PersonnelData = {
  personnel: Employe[];
  taches: Tache[];
};

export async function getPersonnel(forceRefresh = false): Promise<PersonnelData> {
  return cachedFetch("/personnel", () => apiRequest<PersonnelData>("/personnel"), {
    tags: ["personnel", "dashboard"],
    forceRefresh,
  });
}

export async function createTache(input: {
  titre: string;
  assigneA: string;
  lieu: string;
  echeance: string;
  urgente?: boolean;
}): Promise<void> {
  await apiRequest("/personnel/taches", { method: "POST", body: input });
  invalidateTags(["personnel", "dashboard"]);
}

export async function updateTacheStatut(id: string, statut: "À faire" | "En cours" | "Terminée"): Promise<void> {
  await apiRequest(`/personnel/taches/${encodeURIComponent(id)}/statut`, { method: "PATCH", body: { statut } });
  invalidateTags(["personnel", "dashboard"]);
}

export async function createPersonnel(input: { nom: string; poste: string; statut?: "En service" | "Repos" | "Congé"; telephone?: string; horaire?: string }): Promise<void> {
  await apiRequest("/personnel", { method: "POST", body: input });
  invalidateTags(["personnel", "dashboard"]);
}

export async function updatePersonnel(id: string, input: { nom?: string; poste?: string; statut?: "En service" | "Repos" | "Congé"; telephone?: string; horaire?: string }): Promise<void> {
  await apiRequest(`/personnel/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["personnel", "dashboard"]);
}

export async function deletePersonnel(id: string): Promise<void> {
  await apiRequest(`/personnel/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["personnel", "dashboard"]);
}

export async function updateTache(id: string, input: { titre?: string; assigneA?: string; lieu?: string; echeance?: string; statut?: "À faire" | "En cours" | "Terminée"; urgente?: boolean }): Promise<void> {
  await apiRequest(`/personnel/taches/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["personnel", "dashboard"]);
}

export async function deleteTache(id: string): Promise<void> {
  await apiRequest(`/personnel/taches/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["personnel", "dashboard"]);
}
