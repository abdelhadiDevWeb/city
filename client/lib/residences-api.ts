import { apiRequest } from "./api";

export type Responsable = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  role: "admin" | "sub_admin";
  actif: boolean;
};

export type Proprietaire = { id: string; prenom: string; nom: string; email: string; telephone: string };

type ResidenceBase = { id: string; nom: string; localisation: string; createdAt: string; updatedAt: string };

export type ResidenceSummary = ResidenceBase & { batiments: number; admin: Responsable | null };

export type BatimentDetail = {
  id: string;
  nom: string;
  etages: number;
  idResidence: string;
  createdAt: string;
  sousAdmin: Responsable | null;
  appartements: { id: string; nom: string; etage: number; proprietaire: Proprietaire | null }[];
};

export type ResidenceDetails = { residence: ResidenceBase; admin: Responsable | null; batiments: BatimentDetail[] };

export type NewAccount = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  wilaya: string;
  daira: string;
  baladia: string;
  password: string;
} & ({ role: "admin"; idResidence: string } | { role: "sub_admin"; idBatiment: string });

export async function listResidences(): Promise<ResidenceSummary[]> {
  const res = await apiRequest<{ residences: ResidenceSummary[] }>("/residences");
  return res.residences;
}

export async function getResidence(id: string): Promise<ResidenceDetails> {
  const { residence, admin, batiments } = await apiRequest<ResidenceDetails>(`/residences/${encodeURIComponent(id)}`);
  return { residence, admin, batiments };
}

export async function createResidence(input: { nom: string; localisation: string }): Promise<ResidenceSummary> {
  const res = await apiRequest<{ residence: ResidenceSummary }>("/residences", { method: "POST", body: input });
  return res.residence;
}

export async function createBatiment(residenceId: string, input: { nom: string; etages: number }): Promise<void> {
  await apiRequest(`/residences/${encodeURIComponent(residenceId)}/batiments`, { method: "POST", body: input });
}

export type MonEspace = {
  role: "admin" | "sub_admin";
  residence: ResidenceDetails["residence"] | null;
  admin: Responsable | null;
  batiments: BatimentDetail[];
  abonnement: { nom: string | null; debut: string; fin: string } | null;
};

export async function getMonEspace(): Promise<MonEspace> {
  const { role, residence, admin, batiments, abonnement } = await apiRequest<MonEspace>("/mon-espace");
  return { role, residence, admin, batiments, abonnement };
}

export async function createAccount(input: NewAccount): Promise<void> {
  await apiRequest("/admins", { method: "POST", body: input });
}
