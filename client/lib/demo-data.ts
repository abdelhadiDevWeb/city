// Static demo data for the dashboard. Replace each export with an API call once the
// matching backend tables (Residence, Batiment, Appartement, Paiement, ...) exist.

export type AscenseurEtat = "ok" | "bruit" | "panne";

export type Residence = {
  id: string;
  nom: string;
  quartier: string;
  wilaya: string;
  daira: string;
  baladia: string;
  logements: number;
  batiments: number;
  tauxRecouvrement: number;
  gestionnaire: string;
};

export type Batiment = {
  id: string;
  nom: string;
  appartements: number;
  etages: number;
  ascenseur: AscenseurEtat;
  gestionnaire: { nom: string; telephone: string } | null;
  occupes: number;
  tauxRecouvrement: number;
  impayes: number;
  pannesActives: number;
};

export type GestionnaireBatiment = {
  id: string;
  nom: string;
  batiment: string;
  telephone: string;
  email: string;
  depuis: string;
};

export type Appartement = {
  id: string;
  numero: string;
  batiment: string;
  etage: number;
  type: string;
  occupant: string | null;
  solde: number;
};

export type Resident = {
  id: string;
  nom: string;
  logement: string;
  telephone: string;
  email: string;
  statut: "Propriétaire" | "Locataire";
  depuis: string;
  moisImpayes: number;
};

export type Impaye = {
  id: string;
  logement: string;
  resident: string;
  telephone: string;
  moisImpayes: number;
  dernierReglement: string;
  totalDu: number;
};

export type Paiement = {
  id: string;
  date: string;
  logement: string;
  resident: string;
  mode: "Edahabia" | "CCP" | "Espèces" | "Virement";
  reference: string;
  montant: number;
};

export type Depense = {
  id: string;
  date: string;
  categorie: string;
  fournisseur: string;
  description: string;
  montant: number;
  statut: "Payée" | "En attente";
};

export type Facture = {
  id: string;
  fournisseur: string;
  service: string;
  periode: string;
  echeance: string;
  montant: number;
  statut: "Payée" | "À payer" | "En retard";
};

export type Priorite = "Haute" | "Moyenne" | "Basse";

export type Incident = {
  id: string;
  titre: string;
  lieu: string;
  signaleLe: string;
  signalePar: string;
  priorite: Priorite;
  prestataire: string;
  statut: string;
};

export type PanneEquipement = {
  id: string;
  equipement: string;
  lieu: string;
  depuis: string;
  prestataire: string;
  statut: string;
};

export type InterventionPassee = {
  id: string;
  titre: string;
  lieu: string;
  clotureLe: string;
  prestataire: string;
  cout: number;
};

export type Tache = {
  id: string;
  titre: string;
  assigneA: string;
  lieu: string;
  echeance: string;
  urgente: boolean;
  statut: "À faire" | "En cours" | "Terminée";
};

export type Employe = {
  id: string;
  nom: string;
  poste: string;
  telephone: string;
  horaire: string;
  statut: "En service" | "Repos" | "Congé";
};

export type Annonce = {
  id: string;
  titre: string;
  contenu: string;
  audience: string;
  date: string;
  canaux: string[];
  epinglee: boolean;
};

export type Alerte = {
  id: string;
  titre: string;
  detail: string;
  date: string;
  niveau: "critique" | "attention" | "info";
};

export type Contrat = {
  id: string;
  objet: string;
  prestataire: string;
  debut: string;
  fin: string;
  montantAnnuel: number;
  statut: "Actif" | "Expire bientôt" | "Expiré";
};

export type DocumentResidence = {
  id: string;
  nom: string;
  categorie: string;
  format: "PDF" | "DOCX" | "XLSX";
  taille: string;
  ajouteLe: string;
};

export type Rapport = {
  id: string;
  titre: string;
  description: string;
  formats: ("PDF" | "Excel")[];
};

export type ExportRecent = {
  id: string;
  rapport: string;
  periode: string;
  format: "PDF" | "Excel";
  genereLe: string;
  par: string;
};

export type TypeCharge = { id: string; nom: string; montantMensuel: number; appliqueA: string; actif: boolean };
export type TypeIncident = { id: string; nom: string; delaiIntervention: string; prestataire: string; actif: boolean };
export type ModePaiement = { id: string; nom: string; frais: string; actif: boolean };

export const residences: Residence[] = [
  {
    id: "r1",
    nom: "Cité 1500 Logements AADL",
    quartier: "Bab Ezzouar",
    wilaya: "Alger",
    daira: "Dar El Beïda",
    baladia: "Bab Ezzouar",
    logements: 480,
    batiments: 12,
    tauxRecouvrement: 75,
    gestionnaire: "Abdelhadi Mansouri",
  },
  {
    id: "r2",
    nom: "Résidence Les Oliviers",
    quartier: "Chéraga",
    wilaya: "Alger",
    daira: "Chéraga",
    baladia: "Chéraga",
    logements: 220,
    batiments: 6,
    tauxRecouvrement: 88,
    gestionnaire: "Samira Boudiaf",
  },
  {
    id: "r3",
    nom: "Cité 800 Logements LPP",
    quartier: "Bir El Djir",
    wilaya: "Oran",
    daira: "Bir El Djir",
    baladia: "Bir El Djir",
    logements: 800,
    batiments: 20,
    tauxRecouvrement: 69,
    gestionnaire: "Karim Belkacem",
  },
];

export const batiments: Batiment[] = [
  {
    id: "b-a1",
    nom: "Bâtiment A1",
    appartements: 36,
    etages: 9,
    ascenseur: "ok",
    gestionnaire: { nom: "Mourad Taguine", telephone: "0555 11 22 33" },
    occupes: 35,
    tauxRecouvrement: 92,
    impayes: 8000,
    pannesActives: 0,
  },
  {
    id: "b-a2",
    nom: "Bâtiment A2",
    appartements: 36,
    etages: 9,
    ascenseur: "bruit",
    gestionnaire: { nom: "Rachid Mebarki", telephone: "0662 88 99 00" },
    occupes: 36,
    tauxRecouvrement: 68,
    impayes: 36000,
    pannesActives: 1,
  },
  {
    id: "b-b1",
    nom: "Bâtiment B1",
    appartements: 36,
    etages: 9,
    ascenseur: "panne",
    gestionnaire: { nom: "Abdelkader Zenati", telephone: "0770 44 55 66" },
    occupes: 34,
    tauxRecouvrement: 85,
    impayes: 22000,
    pannesActives: 1,
  },
  {
    id: "b-b2",
    nom: "Bâtiment B2",
    appartements: 36,
    etages: 9,
    ascenseur: "ok",
    gestionnaire: null,
    occupes: 33,
    tauxRecouvrement: 94,
    impayes: 6000,
    pannesActives: 0,
  },
];

export const gestionnairesBatiment: GestionnaireBatiment[] = [
  { id: "g1", nom: "Mourad Taguine", batiment: "Bâtiment A1", telephone: "0555 11 22 33", email: "m.taguine@city.dz", depuis: "Janvier 2024" },
  { id: "g2", nom: "Rachid Mebarki", batiment: "Bâtiment A2", telephone: "0662 88 99 00", email: "r.mebarki@city.dz", depuis: "Mars 2024" },
  { id: "g3", nom: "Abdelkader Zenati", batiment: "Bâtiment B1", telephone: "0770 44 55 66", email: "a.zenati@city.dz", depuis: "Septembre 2025" },
];

export const appartements: Appartement[] = [
  { id: "ap1", numero: "Apt 14", batiment: "Bâtiment A1", etage: 4, type: "F3", occupant: "Sofiane Cherif", solde: 2000 },
  { id: "ap2", numero: "Apt 04", batiment: "Bâtiment A2", etage: 1, type: "F4", occupant: "Youcef Belhadj", solde: 8000 },
  { id: "ap3", numero: "Apt 08", batiment: "Bâtiment A2", etage: 2, type: "F3", occupant: "Rachid Mebarki", solde: 4000 },
  { id: "ap4", numero: "Apt 12", batiment: "Bâtiment B1", etage: 3, type: "F3", occupant: "Farida Meziane", solde: 6000 },
  { id: "ap5", numero: "Apt 21", batiment: "Bâtiment B2", etage: 6, type: "F2", occupant: null, solde: 0 },
];

export const residents: Resident[] = [
  { id: "rs1", nom: "Youcef Belhadj", logement: "A2 - Apt 04", telephone: "0770 45 67 89", email: "y.belhadj@mail.dz", statut: "Propriétaire", depuis: "2019", moisImpayes: 4 },
  { id: "rs2", nom: "Farida Meziane", logement: "B1 - Apt 12", telephone: "0662 33 44 55", email: "f.meziane@mail.dz", statut: "Locataire", depuis: "2023", moisImpayes: 3 },
  { id: "rs3", nom: "Rachid Mebarki", logement: "A2 - Apt 08", telephone: "0555 78 90 12", email: "r.mebarki@mail.dz", statut: "Propriétaire", depuis: "2019", moisImpayes: 2 },
  { id: "rs4", nom: "Sofiane Cherif", logement: "A1 - Apt 14", telephone: "0558 11 22 33", email: "s.cherif@mail.dz", statut: "Locataire", depuis: "2024", moisImpayes: 1 },
  { id: "rs5", nom: "Nadia Hamidi", logement: "A1 - Apt 03", telephone: "0661 20 30 40", email: "n.hamidi@mail.dz", statut: "Propriétaire", depuis: "2019", moisImpayes: 0 },
  { id: "rs6", nom: "Omar Kaci", logement: "B2 - Apt 07", telephone: "0771 50 60 70", email: "o.kaci@mail.dz", statut: "Locataire", depuis: "2022", moisImpayes: 0 },
  { id: "rs7", nom: "Lynda Saïdi", logement: "A2 - Apt 11", telephone: "0550 90 80 70", email: "l.saidi@mail.dz", statut: "Propriétaire", depuis: "2020", moisImpayes: 0 },
];

export const impayes: Impaye[] = [
  { id: "i1", logement: "A2 - Apt 04", resident: "Youcef Belhadj", telephone: "0770 45 67 89", moisImpayes: 4, dernierReglement: "Novembre 2025", totalDu: 8000 },
  { id: "i2", logement: "B1 - Apt 12", resident: "Farida Meziane", telephone: "0662 33 44 55", moisImpayes: 3, dernierReglement: "Décembre 2025", totalDu: 6000 },
  { id: "i3", logement: "A2 - Apt 08", resident: "Rachid Mebarki", telephone: "0555 78 90 12", moisImpayes: 2, dernierReglement: "Janvier 2026", totalDu: 4000 },
  { id: "i4", logement: "A1 - Apt 14", resident: "Sofiane Cherif", telephone: "0558 11 22 33", moisImpayes: 1, dernierReglement: "Février 2026", totalDu: 2000 },
];

export const paiements: Paiement[] = [
  { id: "p1", date: "12 Mars 2026", logement: "A1 - Apt 03", resident: "Nadia Hamidi", mode: "Edahabia", reference: "EDH-260312-481", montant: 4000 },
  { id: "p2", date: "10 Mars 2026", logement: "B2 - Apt 07", resident: "Omar Kaci", mode: "CCP", reference: "CCP-88213", montant: 8000 },
  { id: "p3", date: "08 Mars 2026", logement: "A2 - Apt 11", resident: "Lynda Saïdi", mode: "Espèces", reference: "REC-00419", montant: 2000 },
];

export const depenses: Depense[] = [
  { id: "d1", date: "05 Mars 2026", categorie: "Ascenseurs", fournisseur: "Maintenance SARL", description: "Contrat mensuel + pièces Bloc B1", montant: 35000, statut: "Payée" },
  { id: "d2", date: "07 Mars 2026", categorie: "Plomberie", fournisseur: "Plomberie Benali", description: "Réparation pompes surpresseur", montant: 28000, statut: "Payée" },
  { id: "d3", date: "11 Mars 2026", categorie: "Entretien", fournisseur: "Droguerie El Amel", description: "Fournitures d'entretien", montant: 14500, statut: "En attente" },
];

export const factures: Facture[] = [
  { id: "f1", fournisseur: "Sonelgaz", service: "Électricité parties communes", periode: "Février 2026", echeance: "05 Mars 2026", montant: 48500, statut: "En retard" },
  { id: "f2", fournisseur: "SEAAL", service: "Eau parties communes", periode: "Février 2026", echeance: "15 Mars 2026", montant: 32000, statut: "À payer" },
  { id: "f3", fournisseur: "Algérie Télécom", service: "Interphonie & internet loge", periode: "Mars 2026", echeance: "20 Mars 2026", montant: 4200, statut: "Payée" },
];

export const recouvrement = {
  periode: "Mars 2026",
  totalAttendu: 960000,
  encaisse: 720000,
  detteHistorique: 72000,
};

export const soldeTresorerie = 642500;

export const equipements = {
  ascenseurs: { operationnels: 3, total: 4 },
  pompes: { operationnels: 2, total: 2 },
  groupeElectrogene: "Opérationnel",
};

export const incidents: Incident[] = [
  { id: "in1", titre: "Fuite d'eau cage d'escalier", lieu: "Bâtiment A2 · 3e étage", signaleLe: "11 Mars 2026", signalePar: "Lynda Saïdi", priorite: "Haute", prestataire: "Plomberie Benali", statut: "Intervention planifiée" },
  { id: "in2", titre: "Fuite colonne d'eau", lieu: "Bâtiment B1 · Sous-sol", signaleLe: "12 Mars 2026", signalePar: "Abdelkader Zenati", priorite: "Moyenne", prestataire: "Plomberie Benali", statut: "Diagnostic en cours" },
];

export const pannesEquipement: PanneEquipement[] = [
  { id: "pe1", equipement: "Ascenseur Otis", lieu: "Bâtiment B1", depuis: "09 Mars 2026", prestataire: "Maintenance SARL", statut: "Dépannage en cours" },
];

export const historiqueInterventions: InterventionPassee[] = [
  { id: "h1", titre: "Remplacement éclairage hall", lieu: "Bâtiment A1", clotureLe: "02 Mars 2026", prestataire: "Karim Haddad", cout: 6500 },
  { id: "h2", titre: "Débouchage vide-ordures", lieu: "Bâtiment B2", clotureLe: "24 Février 2026", prestataire: "Clean Pro", cout: 9000 },
  { id: "h3", titre: "Révision surpresseur", lieu: "Local technique", clotureLe: "15 Février 2026", prestataire: "Plomberie Benali", cout: 18000 },
];

export const taches: Tache[] = [
  { id: "t1", titre: "Éclairage entrée cité", assigneA: "Karim Haddad", lieu: "Entrée principale", echeance: "14 Mars 2026", urgente: true, statut: "En cours" },
  { id: "t2", titre: "Nettoyage vide-ordures", assigneA: "Fatima Zohra Belaïd", lieu: "Bâtiment A1", echeance: "15 Mars 2026", urgente: false, statut: "À faire" },
  { id: "t3", titre: "Contrôle des extincteurs", assigneA: "Mohamed Aït Ali", lieu: "Tous les bâtiments", echeance: "20 Mars 2026", urgente: false, statut: "À faire" },
];

export const personnel: Employe[] = [
  { id: "e1", nom: "Karim Haddad", poste: "Agent technique", telephone: "0551 23 45 67", horaire: "08:00 - 16:00", statut: "En service" },
  { id: "e2", nom: "Fatima Zohra Belaïd", poste: "Agent d'entretien", telephone: "0660 12 34 56", horaire: "07:00 - 13:00", statut: "En service" },
  { id: "e3", nom: "Mohamed Aït Ali", poste: "Agent de sécurité", telephone: "0772 98 76 54", horaire: "20:00 - 08:00", statut: "Repos" },
  { id: "e4", nom: "Hocine Rahmani", poste: "Jardinier", telephone: "0553 44 33 22", horaire: "07:00 - 12:00", statut: "Congé" },
];

export const annonces: Annonce[] = [
  {
    id: "an1",
    titre: "Coupure d'eau programmée",
    contenu: "La SEAAL interviendra sur le réseau le 18 mars de 09:00 à 14:00. Pensez à faire des réserves.",
    audience: "Tous les résidents",
    date: "13 Mars 2026",
    canaux: ["SMS", "Application"],
    epinglee: true,
  },
  {
    id: "an2",
    titre: "Assemblée générale annuelle",
    contenu: "L'assemblée générale se tiendra le 28 mars à 17:00 dans la salle polyvalente. Ordre du jour disponible à la loge.",
    audience: "Propriétaires",
    date: "10 Mars 2026",
    canaux: ["Application", "Affichage"],
    epinglee: false,
  },
  {
    id: "an3",
    titre: "Ascenseur B1 à l'arrêt",
    contenu: "L'ascenseur du Bâtiment B1 est en cours de réparation. Remise en service prévue sous 48h.",
    audience: "Bâtiment B1",
    date: "09 Mars 2026",
    canaux: ["SMS"],
    epinglee: false,
  },
];

export const alertes: Alerte[] = [
  { id: "al1", titre: "Facture Sonelgaz en retard", detail: "48 500 DZD dus depuis le 05 Mars 2026", date: "Il y a 2 h", niveau: "critique" },
  { id: "al2", titre: "Ascenseur B1 hors service", detail: "Dépannage en cours par Maintenance SARL", date: "Il y a 5 h", niveau: "attention" },
  { id: "al3", titre: "Contrat gardiennage bientôt expiré", detail: "Échéance le 30 Avril 2026", date: "Hier", niveau: "info" },
];

export const contrats: Contrat[] = [
  { id: "c1", objet: "Maintenance ascenseurs", prestataire: "Maintenance SARL", debut: "01/01/2026", fin: "31/12/2026", montantAnnuel: 420000, statut: "Actif" },
  { id: "c2", objet: "Gardiennage & sécurité", prestataire: "Sécurité Plus", debut: "01/05/2025", fin: "30/04/2026", montantAnnuel: 960000, statut: "Expire bientôt" },
  { id: "c3", objet: "Nettoyage parties communes", prestataire: "Clean Pro", debut: "01/09/2025", fin: "31/08/2026", montantAnnuel: 540000, statut: "Actif" },
];

export const documentsResidence: DocumentResidence[] = [
  { id: "doc1", nom: "Règlement intérieur de la cité", categorie: "Règlement", format: "PDF", taille: "2,4 Mo", ajouteLe: "12/01/2025" },
  { id: "doc2", nom: "PV Assemblée générale 2025", categorie: "Procès-verbal", format: "DOCX", taille: "860 Ko", ajouteLe: "30/03/2025" },
  { id: "doc3", nom: "Budget prévisionnel 2026", categorie: "Finances", format: "XLSX", taille: "310 Ko", ajouteLe: "15/12/2025" },
];

export const rapports: Rapport[] = [
  { id: "rp1", titre: "Recouvrement mensuel", description: "Charges attendues, encaissées et restantes par bâtiment.", formats: ["PDF", "Excel"] },
  { id: "rp2", titre: "État des impayés", description: "Liste des logements en retard avec ancienneté de la dette.", formats: ["PDF", "Excel"] },
  { id: "rp3", titre: "Journal des dépenses", description: "Toutes les dépenses de la résidence par catégorie.", formats: ["Excel"] },
  { id: "rp4", titre: "Rapport d'incidents", description: "Incidents, délais d'intervention et coûts de maintenance.", formats: ["PDF"] },
  { id: "rp5", titre: "Registre des résidents", description: "Propriétaires, locataires et coordonnées par logement.", formats: ["Excel"] },
  { id: "rp6", titre: "Bilan annuel", description: "Synthèse financière et opérationnelle pour l'assemblée générale.", formats: ["PDF"] },
];

export const exportsRecents: ExportRecent[] = [
  { id: "x1", rapport: "Recouvrement mensuel", periode: "Février 2026", format: "PDF", genereLe: "01/03/2026", par: "Abdelhadi M." },
  { id: "x2", rapport: "État des impayés", periode: "Février 2026", format: "Excel", genereLe: "01/03/2026", par: "Abdelhadi M." },
  { id: "x3", rapport: "Journal des dépenses", periode: "T4 2025", format: "Excel", genereLe: "05/01/2026", par: "Samira B." },
];

export const typesCharges: TypeCharge[] = [
  { id: "tc1", nom: "Charges communes", montantMensuel: 2000, appliqueA: "Tous les logements", actif: true },
  { id: "tc2", nom: "Maintenance ascenseur", montantMensuel: 500, appliqueA: "Étages 2 et plus", actif: true },
  { id: "tc3", nom: "Gardiennage", montantMensuel: 800, appliqueA: "Tous les logements", actif: true },
  { id: "tc4", nom: "Fonds de travaux", montantMensuel: 300, appliqueA: "Propriétaires", actif: false },
];

export const typesIncidents: TypeIncident[] = [
  { id: "ti1", nom: "Plomberie / fuite", delaiIntervention: "24 h", prestataire: "Plomberie Benali", actif: true },
  { id: "ti2", nom: "Ascenseur", delaiIntervention: "48 h", prestataire: "Maintenance SARL", actif: true },
  { id: "ti3", nom: "Électricité", delaiIntervention: "24 h", prestataire: "Karim Haddad", actif: true },
  { id: "ti4", nom: "Propreté", delaiIntervention: "72 h", prestataire: "Clean Pro", actif: true },
];

export const modesPaiement: ModePaiement[] = [
  { id: "mp1", nom: "Edahabia", frais: "Gratuit", actif: true },
  { id: "mp2", nom: "CCP", frais: "Gratuit", actif: true },
  { id: "mp3", nom: "Espèces (loge)", frais: "Gratuit", actif: true },
  { id: "mp4", nom: "Virement bancaire", frais: "Selon banque", actif: false },
];

export function formatDZD(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} DZD`;
}
