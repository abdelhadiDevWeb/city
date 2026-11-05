import { apiRequest } from "./api";
import { cachedFetch, invalidateTags } from "./cache";

export type Contrat = {
  id: string;
  objet: string;
  prestataire: string;
  debut: string;
  fin: string;
  statut: "Actif" | "Expire bientôt" | "Expiré";
  montantAnnuel: number;
};

export type DocumentResidence = {
  id: string;
  nom: string;
  categorie: string;
  format: string;
  taille: string;
  ajouteLe: string;
};

export type DocumentsData = {
  contrats: Contrat[];
  documentsResidence: DocumentResidence[];
};

export async function getDocuments(forceRefresh = false): Promise<DocumentsData> {
  return cachedFetch("/documents", () => apiRequest<DocumentsData>("/documents"), {
    tags: ["documents", "dashboard"],
    forceRefresh,
  });
}

export async function createDocument(input: {
  typeDoc: "contrat" | "document";
  nom: string;
  objet?: string;
  prestataire?: string;
  debut?: string;
  fin?: string;
  montantAnnuel?: number;
  categorie?: string;
  format?: string;
  taille?: string;
}): Promise<void> {
  await apiRequest("/documents", { method: "POST", body: input });
  invalidateTags(["documents", "dashboard"]);
}

export async function updateDocument(
  id: string,
  input: {
    nom?: string;
    objet?: string;
    prestataire?: string;
    debut?: string;
    fin?: string;
    montantAnnuel?: number;
    categorie?: string;
    format?: string;
    taille?: string;
    statut?: "Actif" | "Expire bientôt" | "Expiré";
  },
): Promise<void> {
  await apiRequest(`/documents/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["documents", "dashboard"]);
}

export async function deleteDocument(id: string): Promise<void> {
  await apiRequest(`/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["documents", "dashboard"]);
}
