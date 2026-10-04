import { apiRequest } from "./api";

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

export async function getPersonnel(): Promise<PersonnelData> {
  return apiRequest<PersonnelData>("/personnel");
}

export async function createTache(input: {
  titre: string;
  assigneA: string;
  lieu: string;
  echeance: string;
  urgente?: boolean;
}): Promise<void> {
  await apiRequest("/personnel/taches", { method: "POST", body: input });
}

export async function updateTacheStatut(id: string, statut: "À faire" | "En cours" | "Terminée"): Promise<void> {
  await apiRequest(`/personnel/taches/${encodeURIComponent(id)}/statut`, { method: "PATCH", body: { statut } });
}
