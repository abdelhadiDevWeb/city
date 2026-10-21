import { apiRequest } from "./api";

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

export async function getDocuments(): Promise<DocumentsData> {
  return apiRequest<DocumentsData>("/documents");
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
}

export async function updateDocument(
  id: string,
  input: {
    nom?: string;
    objet?: string;
    prestataire?: string;
    statut?: "Actif" | "Expire bientôt" | "Expiré";
    debut?: string;
    fin?: string;
    montantAnnuel?: number;
    categorie?: string;
    format?: string;
    taille?: string;
  },
): Promise<void> {
  await apiRequest(`/documents/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function deleteDocument(id: string): Promise<void> {
  await apiRequest(`/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
}
