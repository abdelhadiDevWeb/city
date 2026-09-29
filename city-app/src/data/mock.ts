import type { AppNotification, Author, ChatMessage, Logement, Paiement, Post, Resident, Souscription } from './types';

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const currentResident: Resident = {
  id: 'u-1',
  prenom: 'Yacine',
  nom: 'Benali',
  email: 'yacine.benali@email.dz',
  telephone: '+213555123456',
  idAppartement: 'apt-b-12',
  idBatiment: 'bat-b',
  createdAt: '2025-03-14T09:00:00.000Z',
};

export const logement: Logement = {
  residence: 'Résidence Les Jasmins',
  localisation: 'Bab Ezzouar, Alger',
  batiment: 'Bâtiment B',
  etage: 3,
  appartement: 'B-12',
};

export const souscription: Souscription = {
  id: 'sub-1',
  abonnement: {
    id: 'plan-premium',
    nom: 'Premium',
    prix: 6000,
    duree: 12,
    avantages: ['Fil d’actualité de la résidence', 'Discussion générale', 'Paiement en ligne des charges', 'Support prioritaire du syndic'],
  },
  debut: '2026-01-01T00:00:00.000Z',
  fin: '2027-01-01T00:00:00.000Z',
  statutPaiement: true,
};

export const paiements: Paiement[] = [
  { id: 'p-9', libelle: 'Charges de copropriété · Octobre', categorie: 'charges', montant: 3500, date: '2026-10-05T00:00:00.000Z', methode: 'CIB', reference: 'CHG-2610-B12', statut: 'en_attente' },
  { id: 'p-8', libelle: 'Charges de copropriété · Septembre', categorie: 'charges', montant: 3500, date: '2026-09-04T10:12:00.000Z', methode: 'Edahabia', reference: 'CHG-2609-B12', statut: 'paye' },
  { id: 'p-7', libelle: 'Réparation ascenseur · Quote-part', categorie: 'travaux', montant: 2200, date: '2026-08-21T15:40:00.000Z', methode: 'CIB', reference: 'TRV-2608-ASC', statut: 'echoue' },
  { id: 'p-6', libelle: 'Charges de copropriété · Août', categorie: 'charges', montant: 3500, date: '2026-08-03T09:05:00.000Z', methode: 'CIB', reference: 'CHG-2608-B12', statut: 'paye' },
  { id: 'p-5', libelle: 'Charges de copropriété · Juillet', categorie: 'charges', montant: 3500, date: '2026-07-02T18:22:00.000Z', methode: 'Espèces', reference: 'CHG-2607-B12', statut: 'paye' },
  { id: 'p-4', libelle: 'Charges de copropriété · Juin', categorie: 'charges', montant: 3500, date: '2026-06-05T11:47:00.000Z', methode: 'Edahabia', reference: 'CHG-2606-B12', statut: 'paye' },
  { id: 'p-3', libelle: 'Peinture cage d’escalier · Quote-part', categorie: 'travaux', montant: 4800, date: '2026-04-18T14:00:00.000Z', methode: 'Virement', reference: 'TRV-2604-PNT', statut: 'paye' },
  { id: 'p-2', libelle: 'Abonnement Premium · 2026', categorie: 'abonnement', montant: 6000, date: '2026-01-02T08:30:00.000Z', methode: 'CIB', reference: 'ABN-2026-PRM', statut: 'paye' },
];

const syndic: Author = { id: 'a-1', prenom: 'Karim', nom: 'Hadjadj', role: 'syndic' };
const amina: Author = { id: 'u-2', prenom: 'Amina', nom: 'Belkacem', role: 'resident', logement: 'Bât. A · A-04' };
const sofiane: Author = { id: 'u-3', prenom: 'Sofiane', nom: 'Rahmani', role: 'resident', logement: 'Bât. B · B-07' };
const lina: Author = { id: 'u-4', prenom: 'Lina', nom: 'Meziane', role: 'resident', logement: 'Bât. C · C-15' };
const nassim: Author = { id: 'u-5', prenom: 'Nassim', nom: 'Ouali', role: 'resident', logement: 'Bât. B · B-02' };

export const me: Author = {
  id: currentResident.id,
  prenom: currentResident.prenom,
  nom: currentResident.nom,
  role: 'resident',
  logement: `Bât. B · ${logement.appartement}`,
};

export const posts: Post[] = [
  {
    id: 'post-1',
    author: syndic,
    kind: 'annonce',
    text: 'Coupure d’eau programmée demain de 9h à 13h pour le nettoyage des bâches à eau des bâtiments A et B. Pensez à faire vos réserves. Merci de votre compréhension.',
    createdAt: ago(35),
    likes: 24,
    liked: false,
    comments: [
      { id: 'c-1', author: amina, text: 'Merci pour l’info, c’est noté !', createdAt: ago(28) },
      { id: 'c-2', author: nassim, text: 'Le bâtiment C est concerné aussi ?', createdAt: ago(20) },
      { id: 'c-3', author: syndic, text: 'Non, uniquement A et B cette fois.', createdAt: ago(15) },
    ],
  },
  {
    id: 'post-2',
    author: lina,
    kind: 'post',
    text: 'On organise un goûter pour les enfants de la résidence ce samedi dans le jardin central. Chacun ramène un petit quelque chose 🍰 Qui est partant ?',
    createdAt: ago(3 * 60),
    likes: 41,
    liked: true,
    comments: [
      { id: 'c-4', author: sofiane, text: 'Super idée, on sera là avec les petits !', createdAt: ago(2 * 60) },
      { id: 'c-5', author: amina, text: 'Je ramène du jus 🧃', createdAt: ago(90) },
    ],
    event: { titre: 'Goûter des enfants', date: 'Samedi · 16h00', lieu: 'Jardin central' },
  },
  {
    id: 'post-3',
    author: sofiane,
    kind: 'post',
    text: 'Quelqu’un a trouvé un trousseau de clés avec un porte-clés bleu près du parking du bâtiment B ? Je l’ai perdu hier soir.',
    createdAt: ago(7 * 60),
    likes: 6,
    liked: false,
    comments: [{ id: 'c-6', author: nassim, text: 'Je crois que le gardien a récupéré des clés ce matin, demande-lui.', createdAt: ago(6 * 60) }],
  },
  {
    id: 'post-4',
    author: syndic,
    kind: 'annonce',
    text: 'L’ascenseur du bâtiment B est de nouveau opérationnel. Merci à tous pour votre patience pendant les travaux de maintenance.',
    createdAt: ago(26 * 60),
    likes: 58,
    liked: false,
    comments: [],
  },
  {
    id: 'post-5',
    author: amina,
    kind: 'post',
    text: 'Je recommande vivement le plombier qui est intervenu chez moi : rapide, propre et prix correct. Je partage son numéro en message privé à ceux qui veulent.',
    createdAt: ago(2 * 24 * 60),
    likes: 17,
    liked: false,
    comments: [],
  },
];

export const chatMembers = 128;
export const chatOnline = 14;

export const chatMessages: ChatMessage[] = [
  { id: 'm-1', author: nassim, text: 'Bonsoir tout le monde 👋', createdAt: ago(26 * 60) },
  { id: 'm-2', author: amina, text: 'Bonsoir ! Quelqu’un sait si la collecte des encombrants passe cette semaine ?', createdAt: ago(25 * 60 + 50) },
  { id: 'm-3', author: syndic, text: 'Oui, jeudi matin. Merci de déposer les objets devant le local poubelles la veille.', createdAt: ago(25 * 60 + 30) },
  { id: 'm-4', author: me, text: 'Parfait, merci Karim !', createdAt: ago(25 * 60 + 25) },
  { id: 'm-5', author: lina, text: 'Rappel : goûter des enfants samedi 16h au jardin 🎈', createdAt: ago(3 * 60) },
  { id: 'm-6', author: sofiane, text: 'On y sera 🙌', createdAt: ago(2 * 60 + 40) },
  { id: 'm-7', author: nassim, text: 'La porte du parking reste bloquée ouverte depuis ce matin, c’est normal ?', createdAt: ago(55) },
  { id: 'm-8', author: syndic, text: 'Le technicien passe cet après-midi, merci pour le signalement.', createdAt: ago(48) },
  { id: 'm-9', author: amina, text: 'Merci pour la réactivité 👏', createdAt: ago(12) },
];

export const notifications: AppNotification[] = [
  { id: 'n-1', kind: 'annonce', titre: 'Nouvelle annonce du syndic', detail: 'Coupure d’eau programmée demain de 9h à 13h.', createdAt: ago(35), lu: false },
  { id: 'n-2', kind: 'comment', titre: 'Nassim Ouali a commenté', detail: '« Le bâtiment C est concerné aussi ? »', createdAt: ago(20), lu: false },
  { id: 'n-3', kind: 'paiement', titre: 'Charges d’octobre à régler', detail: '3 500 DA à payer avant le 10 octobre.', createdAt: ago(3 * 60), lu: false },
  { id: 'n-4', kind: 'like', titre: 'Lina Meziane et 12 autres', detail: 'ont aimé votre commentaire.', createdAt: ago(5 * 60), lu: true },
  { id: 'n-5', kind: 'chat', titre: 'Discussion générale', detail: 'Karim Hadjadj vous a répondu.', createdAt: ago(25 * 60), lu: true },
  { id: 'n-6', kind: 'paiement', titre: 'Paiement refusé', detail: 'Quote-part ascenseur · 2 200 DA. Réessayez le paiement.', createdAt: ago(3 * 24 * 60), lu: true },
  { id: 'n-7', kind: 'abonnement', titre: 'Abonnement Premium actif', detail: 'Votre abonnement est valable jusqu’au 1 janv. 2027.', createdAt: ago(9 * 24 * 60), lu: true },
];
