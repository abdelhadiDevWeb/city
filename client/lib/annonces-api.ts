import { apiRequest } from "./api";
import { cachedFetch, invalidateTags } from "./cache";

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

export async function getAnnonces(forceRefresh = false): Promise<AnnoncesData> {
  return cachedFetch("/annonces", () => apiRequest<AnnoncesData>("/annonces"), {
    tags: ["annonces", "dashboard"],
    forceRefresh,
  });
}

export async function createAnnonce(input: {
  titre: string;
  contenu: string;
  audience?: string;
  canaux?: string[];
  epinglee?: boolean;
}): Promise<void> {
  await apiRequest("/annonces", { method: "POST", body: input });
  invalidateTags(["annonces", "dashboard"]);
}

export async function renvoyerAnnonce(id: string): Promise<void> {
  await apiRequest(`/annonces/${encodeURIComponent(id)}/renvoyer`, { method: "POST" });
  invalidateTags(["annonces", "dashboard"]);
}

export async function updateAnnonce(
  id: string,
  input: { titre?: string; contenu?: string; audience?: string; epinglee?: boolean; canaux?: string[] },
): Promise<void> {
  await apiRequest(`/annonces/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["annonces", "dashboard"]);
}

export async function deleteAnnonce(id: string): Promise<void> {
  await apiRequest(`/annonces/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["annonces", "dashboard"]);
}

export async function createAlerte(input: {
  titre: string;
  detail: string;
  niveau?: "critique" | "attention" | "info";
  audience?: string;
  canaux?: string[];
}): Promise<void> {
  await apiRequest("/annonces/alertes", { method: "POST", body: input });
  invalidateTags(["annonces", "dashboard"]);
}

export async function leverAlerte(id: string): Promise<void> {
  await apiRequest(`/annonces/alertes/${encodeURIComponent(id)}/lever`, { method: "POST" });
  invalidateTags(["annonces", "dashboard"]);
}

export async function renvoyerAlerte(id: string): Promise<void> {
  await apiRequest(`/annonces/alertes/${encodeURIComponent(id)}/renvoyer`, { method: "POST" });
  invalidateTags(["annonces", "dashboard"]);
}

export async function updateAlerte(
  id: string,
  input: { titre?: string; detail?: string; niveau?: "critique" | "attention" | "info"; audience?: string; canaux?: string[] },
): Promise<void> {
  await apiRequest(`/annonces/alertes/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["annonces", "dashboard"]);
}

export async function deleteAlerte(id: string): Promise<void> {
  await apiRequest(`/annonces/alertes/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["annonces", "dashboard"]);
}
