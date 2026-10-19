import { apiRequest } from "./api";

export type Impaye = {
  id: string;
  logement: string;
  resident: string;
  telephone: string;
  moisImpayes: number;
  totalDu: number;
  dernierReglement: string;
};

export type Paiement = {
  id: string;
  date: string;
  logement: string;
  resident: string;
  mode: string;
  reference: string;
  montant: number;
};

export type Depense = {
  id: string;
  date: string;
  categorie: string;
  fournisseur: string;
  description: string;
  statut: "Payée" | "À payer" | "En retard" | "En attente";
  montant: number;
};

export type Facture = {
  id: string;
  fournisseur: string;
  service: string;
  periode: string;
  echeance: string;
  statut: "Payée" | "À payer" | "En retard";
  montant: number;
};

export type FinancesData = {
  impayes: Impaye[];
  paiements: Paiement[];
  depenses: Depense[];
  factures: Facture[];
};

export async function getFinances(): Promise<FinancesData> {
  return apiRequest<FinancesData>("/finances");
}

export async function encaisserCharge(id: string, input?: { modePaiement?: string; reference?: string }): Promise<void> {
  await apiRequest(`/finances/encaisser/${encodeURIComponent(id)}`, { method: "POST", body: input ?? {} });
}

export async function createPaiement(input: {
  logement: string;
  resident: string;
  telephone: string;
  montant: number;
  modePaiement: string;
  reference?: string;
}): Promise<void> {
  await apiRequest("/finances/paiements", { method: "POST", body: input });
}

export async function createDepense(input: {
  categorie: string;
  fournisseur: string;
  description: string;
  montant: number;
  statut: "Payée" | "À payer" | "En retard" | "En attente";
  echeance?: string;
  periode?: string;
  typeDepense?: "depense" | "facture";
}): Promise<void> {
  await apiRequest("/finances/depenses", { method: "POST", body: input });
}

export async function payerFacture(id: string): Promise<void> {
  await apiRequest(`/finances/factures/${encodeURIComponent(id)}/payer`, { method: "POST" });
}

export async function genererCharges(moisNom: string): Promise<{ generated: number }> {
  return apiRequest<{ generated: number }>("/finances/generer", { method: "POST", body: { moisNom } });
}

export async function updateDepense(id: string, input: { categorie?: string; fournisseur?: string; description?: string; montant?: number; statut?: "Payée" | "À payer" | "En retard" | "En attente" }): Promise<void> {
  await apiRequest(`/finances/depenses/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function deleteDepense(id: string): Promise<void> {
  await apiRequest(`/finances/depenses/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function updateCharge(id: string, input: { statut?: "Payée" | "À payer" | "En retard"; montant?: number }): Promise<void> {
  await apiRequest(`/finances/charges/${encodeURIComponent(id)}`, { method: "PUT", body: input });
}

export async function deleteCharge(id: string): Promise<void> {
  await apiRequest(`/finances/charges/${encodeURIComponent(id)}`, { method: "DELETE" });
}
