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
