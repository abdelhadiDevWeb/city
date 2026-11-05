import { apiRequest } from "./api";
import { cachedFetch, invalidateTags } from "./cache";

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

export type Formule = {
  id: string;
  nom: string;
  prix: number;
  duree: number;
  cible?: "admin" | "sub_admin";
  souscriptions: number;
  createdAt: string;
};

export type Souscription = {
  id: string;
  abonnement: { id: string; nom: string; prix: number; duree: number } | null;
  debut: string;
  fin: string;
  statutPaiement: boolean;
  modePaiement?: string;
  montantPaye?: number;
  notesPaiement?: string;
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

export type SousAdminAbonne = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  residence: { id: string; nom: string } | null;
  batiment: { id: string; nom: string } | null;
  actif: boolean;
  aJour: boolean;
  souscriptions: Souscription[];
};

export type SuperAdminAccount = { id: string; nomComplet: string; email: string; createdAt: string };

export async function getStats(forceRefresh = false): Promise<Stats> {
  return cachedFetch("/stats", () => apiRequest<Stats>("/stats"), {
    tags: ["stats", "dashboard"],
    forceRefresh,
  });
}

export async function listFormules(cible?: "admin" | "sub_admin", forceRefresh = false): Promise<Formule[]> {
  const query = cible ? `?cible=${encodeURIComponent(cible)}` : "";
  const key = `/abonnements${query}`;
  return cachedFetch(
    key,
    async () => {
      const res = await apiRequest<{ abonnements: Formule[] }>(key);
      return res.abonnements;
    },
    { tags: ["abonnements", "dashboard"], forceRefresh },
  );
}

export async function createFormule(input: { nom: string; prix: number; duree: number; cible?: "admin" | "sub_admin" }): Promise<void> {
  await apiRequest("/abonnements", { method: "POST", body: input });
  invalidateTags(["abonnements", "stats", "dashboard"]);
}

export async function listAdminsAbonnes(forceRefresh = false): Promise<AdminAbonne[]> {
  return cachedFetch(
    "/abonnements/admins",
    async () => {
      const res = await apiRequest<{ admins: AdminAbonne[] }>("/abonnements/admins");
      return res.admins;
    },
    { tags: ["abonnements", "dashboard"], forceRefresh },
  );
}

export async function listSousAdminsAbonnes(forceRefresh = false): Promise<SousAdminAbonne[]> {
  return cachedFetch(
    "/abonnements/sous-admins",
    async () => {
      const res = await apiRequest<{ sousAdmins: SousAdminAbonne[] }>("/abonnements/sous-admins");
      return res.sousAdmins;
    },
    { tags: ["abonnements", "dashboard"], forceRefresh },
  );
}

export async function getSousAdminKPIs(): Promise<{ total: number; payes: number; impayes: number }> {
  return (await apiRequest<{ kpis: { total: number; payes: number; impayes: number } }>("/abonnements/sous-admins/kpis")).kpis;
}

export async function createSouscription(input: {
  idAdmin: string;
  idAbonnement: string;
  debut: string;
  statutPaiement: boolean;
  modePaiement?: string;
  montantPaye?: number;
  notesPaiement?: string;
}): Promise<void> {
  await apiRequest("/abonnements/souscriptions", { method: "POST", body: input });
  invalidateTags(["abonnements", "stats", "dashboard"]);
}

export async function setStatutPaiement(id: string, statutPaiement: boolean): Promise<void> {
  await apiRequest(`/abonnements/souscriptions/${encodeURIComponent(id)}`, { method: "PATCH", body: { statutPaiement } });
  invalidateTags(["abonnements", "stats", "dashboard"]);
}

export async function listSuperAdmins(): Promise<SuperAdminAccount[]> {
  return (await apiRequest<{ superAdmins: SuperAdminAccount[] }>("/super-admins")).superAdmins;
}

export async function createSuperAdmin(input: { nomComplet: string; email: string; password: string }): Promise<void> {
  await apiRequest("/super-admins", { method: "POST", body: input });
  invalidateTags(["super-admins", "stats", "dashboard"]);
}

export async function updateFormule(id: string, input: { nom?: string; prix?: number; duree?: number; cible?: "admin" | "sub_admin" }): Promise<void> {
  await apiRequest(`/abonnements/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["abonnements", "stats", "dashboard"]);
}

export async function deleteFormule(id: string): Promise<void> {
  await apiRequest(`/abonnements/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["abonnements", "stats", "dashboard"]);
}

export async function deleteSouscription(id: string): Promise<void> {
  await apiRequest(`/abonnements/souscriptions/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["abonnements", "stats", "dashboard"]);
}

export async function updateSuperAdmin(id: string, input: { nomComplet?: string; email?: string; password?: string }): Promise<void> {
  await apiRequest(`/super-admins/${encodeURIComponent(id)}`, { method: "PUT", body: input });
  invalidateTags(["super-admins", "dashboard"]);
}

export async function deleteSuperAdmin(id: string): Promise<void> {
  await apiRequest(`/super-admins/${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidateTags(["super-admins", "dashboard"]);
}
