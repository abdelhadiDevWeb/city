import { apiRequest } from "./api";

export type Annonce = {
  id: string;
  titre: string;
  contenu: string;
  audience: string;
  canaux: string[];
  date: string;
  epinglee: boolean;
};

export type Alerte = {
  id: string;
  titre: string;
  detail: string;
  niveau: "critique" | "attention" | "info";
  audience?: string;
  canaux?: string[];
  date: string;
};

export type AnnoncesData = {
  annonces: Annonce[];
  alertes: Alerte[];
};

export async function getAnnonces(): Promise<AnnoncesData> {
  return apiRequest<AnnoncesData>("/annonces");
}

export async function createAnnonce(input: {
  titre: string;
  contenu: string;
  audience?: string;
  canaux?: string[];
  epinglee?: boolean;
}): Promise<void> {
  await apiRequest("/annonces", { method: "POST", body: input });
}

export async function renvoyerAnnonce(id: string): Promise<void> {
  await apiRequest(`/annonces/${encodeURIComponent(id)}/renvoyer`, { method: "POST" });
}

export async function updateAnnonce(
  id: string,
  input: { titre?: string; contenu?: string; audience?: string; epinglee?: boolean; canaux?: string[] },
): Promise<void> {
  await apiRequest(`/annonces/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function deleteAnnonce(id: string): Promise<void> {
  await apiRequest(`/annonces/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function createAlerte(input: {
  titre: string;
  detail: string;
  niveau?: "critique" | "attention" | "info";
  audience?: string;
  canaux?: string[];
}): Promise<void> {
  await apiRequest("/annonces/alertes", { method: "POST", body: input });
}

export async function updateAlerte(
  id: string,
  input: {
    titre?: string;
    detail?: string;
    niveau?: "critique" | "attention" | "info";
    audience?: string;
    canaux?: string[];
  },
): Promise<void> {
  await apiRequest(`/annonces/alertes/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function renvoyerAlerte(id: string): Promise<void> {
  await renvoyerAnnonce(id);
}

export async function deleteAlerte(id: string): Promise<void> {
  await deleteAnnonce(id);
}
