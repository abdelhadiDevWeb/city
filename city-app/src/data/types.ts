// Field names follow the server models (server/models/*.ts) so the mock data can later be
// swapped for real API responses without touching the screens.

export type Resident = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  idAppartement: string | null;
  idBatiment: string | null;
  createdAt: string;
};

export type Logement = {
  residence: string;
  localisation: string;
  batiment: string;
  etage: number;
  appartement: string;
};

export type Abonnement = {
  id: string;
  nom: string;
  prix: number;
  duree: number;
  avantages: string[];
};

export type Souscription = {
  id: string;
  abonnement: Abonnement;
  debut: string;
  fin: string;
  statutPaiement: boolean;
};

export type PaiementStatut = 'paye' | 'en_attente' | 'echoue';

export type Paiement = {
  id: string;
  libelle: string;
  categorie: 'charges' | 'abonnement' | 'travaux';
  montant: number;
  date: string;
  methode: 'CIB' | 'Edahabia' | 'Espèces' | 'Virement';
  reference: string;
  statut: PaiementStatut;
};

export type Author = {
  id: string;
  prenom: string;
  nom: string;
  role: 'syndic' | 'resident';
  logement?: string;
};

export type Comment = {
  id: string;
  author: Author;
  text: string;
  createdAt: string;
};

export type Post = {
  id: string;
  author: Author;
  kind: 'annonce' | 'post';
  text: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  event?: { titre: string; date: string; lieu: string };
};

export type ChatMessage = {
  id: string;
  author: Author;
  text: string;
  createdAt: string;
};

export type NotificationKind = 'like' | 'comment' | 'annonce' | 'paiement' | 'chat' | 'abonnement';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  titre: string;
  detail: string;
  createdAt: string;
  lu: boolean;
};
