import { apiRequest } from "./api";

export type Stats = {
  totaux: {
    residences: number;
    batiments: number;
    appartements: number;
    appartementsAvecProprietaire: number;
    admins: number;
    sousAdmins: number;
    superAdmins: number;
    users: number;
    formules: number;
    souscriptions: number;
    souscriptionsActives: number;
    souscriptionsPayees: number;
    souscriptionsImpayees: number;
  };
  revenus: { encaisse: number; enAttente: number };
  baseline: { residences: number; batiments: number; comptes: number };
  mensuel: { mois: string; residences: number; batiments: number; comptes: number; souscriptions: number; revenus: number }[];
  batimentsParResidence: { nom: string; batiments: number }[];
  abonnementsParFormule: { nom: string; souscriptions: number }[];
};

export type Formule = { id: string; nom: string; prix: number; duree: number; souscriptions: number; createdAt: string };

export type Souscription = {
  id: string;
  abonnement: { id: string; nom: string; prix: number; duree: number } | null;
  debut: string;
  fin: string;
  statutPaiement: boolean;
};

export type AdminAbonne = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  residence: { id: string; nom: string } | null;
  actif: boolean;
  souscriptions: Souscription[];
};

export type SuperAdminAccount = { id: string; nomComplet: string; email: string; createdAt: string };

export async function getStats(): Promise<Stats> {
  return apiRequest<Stats>("/stats");
}

export async function listFormules(): Promise<Formule[]> {
  return (await apiRequest<{ abonnements: Formule[] }>("/abonnements")).abonnements;
}

export async function createFormule(input: { nom: string; prix: number; duree: number }): Promise<void> {
  await apiRequest("/abonnements", { method: "POST", body: input });
}

export async function listAdminsAbonnes(): Promise<AdminAbonne[]> {
  return (await apiRequest<{ admins: AdminAbonne[] }>("/abonnements/admins")).admins;
}

export async function createSouscription(input: { idAdmin: string; idAbonnement: string; debut: string; statutPaiement: boolean }): Promise<void> {
  await apiRequest("/abonnements/souscriptions", { method: "POST", body: input });
}

export async function setStatutPaiement(id: string, statutPaiement: boolean): Promise<void> {
  await apiRequest(`/abonnements/souscriptions/${encodeURIComponent(id)}`, { method: "PATCH", body: { statutPaiement } });
}

export async function listSuperAdmins(): Promise<SuperAdminAccount[]> {
  return (await apiRequest<{ superAdmins: SuperAdminAccount[] }>("/super-admins")).superAdmins;
}

export async function createSuperAdmin(input: { nomComplet: string; email: string; password: string }): Promise<void> {
  await apiRequest("/super-admins", { method: "POST", body: input });
}
