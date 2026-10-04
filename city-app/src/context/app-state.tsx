import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import type { AppNotification, ChatMessage, Paiement, Post, Resident, Souscription } from '@/data/types';
import { getAppSocket, getSocketUrl, setSocketToken } from '@/utils/socket';

type ProfileUpdate = Pick<Resident, 'prenom' | 'nom' | 'email' | 'telephone'>;

type AppState = {
  signedIn: boolean;
  resident: Resident;
  souscription: Souscription;
  paiements: Paiement[];
  posts: Post[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  unreadCount: number;
  activeBanner: AppNotification | null;
  dismissBanner: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (update: ProfileUpdate) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  publishPost: (text: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  sendMessage: (text: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const AppStateContext = createContext<AppState | null>(null);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const defaultResident: Resident = {
  id: '',
  prenom: 'Résident',
  nom: '',
  email: '',
  telephone: '',
  idAppartement: null,
  idBatiment: null,
  idResidence: null,
  createdAt: new Date().toISOString(),
  logement: {
    residence: 'Ma Résidence',
    localisation: '',
    batiment: 'Bâtiment',
    etage: 0,
    appartement: '—',
  },
};

const defaultSouscription: Souscription = {
  id: 'sub-residence',
  abonnement: {
    id: 'plan-standard',
    nom: 'Copropriété',
    prix: 0,
    duree: 12,
    avantages: ['Accès aux annonces du syndic', 'Discussion générale des résidents', 'Historique des charges', 'Notifications en temps réel'],
  },
  debut: new Date().toISOString(),
  fin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  statutPaiement: true,
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [resident, setResident] = useState<Resident>(defaultResident);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [souscription, setSouscription] = useState<Souscription>(defaultSouscription);
  const [activeBanner, setActiveBanner] = useState<AppNotification | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissBanner = useCallback(() => {
    setActiveBanner(null);
    if (bannerTimer.current) {
      clearTimeout(bannerTimer.current);
      bannerTimer.current = null;
    }
  }, []);

  // Maintain residence room joining across socket connections & reconnects
  useEffect(() => {
    if (!resident.idResidence) return;
    const socket = getAppSocket();
    const joinRoom = () => {
      if (resident.idResidence) {
        socket.emit('join_residence', resident.idResidence);
        console.log('[AppState] Socket connected/reconnected, joined room for residence:', resident.idResidence);
      }
    };

    if (socket.connected) {
      joinRoom();
    }
    socket.on('connect', joinRoom);

    return () => {
      socket.off('connect', joinRoom);
    };
  }, [resident.idResidence]);

  useEffect(() => {
    const socket = getAppSocket();

    const onNotification = (data: {
      id?: string;
      titre: string;
      detail?: string;
      contenu?: string;
      isAlerte?: boolean;
      idResidence?: string;
    }) => {
      console.log('[AppState] Received new_notification:', data);
      const textDetail = data.detail || data.contenu || '';
      const notifId = data.id || newId('notif');

      const newNotif: AppNotification = {
        id: notifId,
        kind: data.isAlerte ? 'alerte' : 'annonce',
        titre: data.titre,
        detail: textDetail,
        lu: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => {
        if (data.id && prev.some((n) => n.id === data.id)) return prev;
        return [newNotif, ...prev];
      });

      const newPost: Post = {
        id: `ann-${notifId}`,
        author: {
          id: 'syndic',
          prenom: 'Syndic',
          nom: 'Administration',
          role: 'syndic',
          logement: 'Administration',
        },
        kind: 'annonce',
        text: `${data.titre}\n\n${textDetail}`,
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false,
        comments: [],
      };

      setPosts((prev) => {
        if (prev.some((p) => p.id === `ann-${notifId}`)) return prev;
        return [newPost, ...prev];
      });

      setActiveBanner(newNotif);

      if (bannerTimer.current) clearTimeout(bannerTimer.current);
      bannerTimer.current = setTimeout(() => {
        setActiveBanner(null);
      }, 7000);
    };

    const onChatMessage = (msg: ChatMessage) => {
      if (msg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on('new_notification', onNotification);
    socket.on('new_chat_message', onChatMessage);

    return () => {
      socket.off('new_notification', onNotification);
      socket.off('new_chat_message', onChatMessage);
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const meAuthor = {
    id: resident.id || 'me',
    prenom: resident.prenom,
    nom: resident.nom,
    role: 'resident' as const,
    logement: resident.logement ? `${resident.logement.batiment} · Appt ${resident.logement.appartement}` : undefined,
  };

  const value: AppState = {
    signedIn,
    resident,
    souscription,
    paiements,
    posts,
    messages,
    notifications,
    unreadCount: notifications.filter((n) => !n.lu).length,
    activeBanner,
    dismissBanner,

    async signIn(email, password) {
      const baseUrl = getSocketUrl();
      const url = `${baseUrl}/api/auth/login`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let res: Response;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'x-mobile-app': 'true',
          },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
          signal: controller.signal,
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error(`Délai d'attente dépassé (10s). Impossible de joindre le serveur à ${baseUrl}.`);
        }
        throw new Error(`Impossible de contacter le serveur (${baseUrl}). Vérifiez votre connexion.`);
      } finally {
        clearTimeout(timeoutId);
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || 'Identifiants incorrects.');
      }

      const data = await res.json();
      const acc = data.account;
      const accessToken = data.accessToken;

      const loggedResident: Resident = {
        id: acc.id,
        prenom: acc.prenom || 'Résident',
        nom: acc.nom || '',
        email: acc.email,
        telephone: acc.telephone || '',
        idResidence: acc.idResidence || null,
        idBatiment: acc.idBatiment || null,
        idAppartement: acc.idAppartement || null,
        createdAt: acc.createdAt || new Date().toISOString(),
        logement: {
          residence: acc.residence?.nom || 'Ma Résidence',
          localisation: acc.residence?.localisation || '',
          batiment: acc.batiment?.nom || 'Bâtiment',
          etage: acc.appartement?.etage ?? 0,
          appartement: acc.appartement?.nom || '',
        },
      };

      setResident(loggedResident);
      setSignedIn(true);

      // Authenticate socket connection
      setSocketToken(accessToken);
      const socket = getAppSocket();
      if (!socket.connected) {
        socket.connect();
      } else {
        socket.emit('authenticate', accessToken);
      }
      if (acc.idResidence) {
        socket.emit('join_residence', acc.idResidence);
      }

      // Load real announcements from the server
      try {
        const annoncesRes = await fetch(`${getSocketUrl()}/api/annonces`, {
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${accessToken}`,
            'x-mobile-app': 'true',
          },
        });
        if (annoncesRes.ok) {
          const annData = await annoncesRes.json();
          const annoncesList = annData.annonces || [];
          const alertesList = annData.alertes || [];

          const realPosts: Post[] = annoncesList.map((ann: { _id?: string; id?: string; titre: string; contenu?: string; detail?: string; date?: string; createdAt?: string }) => ({
            id: String(ann._id || ann.id),
            author: {
              id: 'syndic',
              prenom: 'Syndic',
              nom: 'Administration',
              role: 'syndic',
              logement: 'Administration',
            },
            kind: 'annonce',
            text: `${ann.titre}\n\n${ann.contenu || ann.detail || ''}`,
            createdAt: ann.date || ann.createdAt || new Date().toISOString(),
            likes: 0,
            liked: false,
            comments: [],
          }));
          setPosts(realPosts);

          const realNotifs: AppNotification[] = [
            ...annoncesList.map((ann: { _id?: string; id?: string; titre: string; contenu?: string; detail?: string; date?: string; createdAt?: string }) => ({
              id: `notif-${ann._id || ann.id}`,
              kind: 'annonce' as const,
              titre: ann.titre,
              detail: ann.contenu || ann.detail || '',
              createdAt: ann.date || ann.createdAt || new Date().toISOString(),
              lu: false,
            })),
            ...alertesList.map((alt: { _id?: string; id?: string; titre: string; detail?: string; contenu?: string; date?: string; createdAt?: string }) => ({
              id: `alert-${alt._id || alt.id}`,
              kind: 'alerte' as const,
              titre: alt.titre,
              detail: alt.detail || alt.contenu || '',
              createdAt: alt.date || alt.createdAt || new Date().toISOString(),
              lu: false,
            })),
          ];
          setNotifications(realNotifs);
        }
      } catch {
        // Network fallback
      }
    },

    signOut() {
      const socket = getAppSocket();
      if (resident.idResidence) {
        socket.emit('leave_residence', resident.idResidence);
      }
      setSocketToken(null);
      setSignedIn(false);
      setResident(defaultResident);
      setPosts([]);
      setMessages([]);
      setNotifications([]);
      setPaiements([]);
      setSouscription(defaultSouscription);
    },

    async updateProfile(update) {
      await wait(600);
      setResident((r) => ({ ...r, ...update, email: update.email.trim().toLowerCase() }));
    },

    async changePassword() {
      await wait(600);
    },

    publishPost(text) {
      const post: Post = {
        id: newId('post'),
        author: meAuthor,
        kind: 'post',
        text,
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false,
        comments: [],
      };
      setPosts((list) => [post, ...list]);
    },

    toggleLike(postId) {
      setPosts((list) => list.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));
    },

    addComment(postId, text) {
      const comment = { id: newId('c'), author: meAuthor, text, createdAt: new Date().toISOString() };
      setPosts((list) => list.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)));
    },

    sendMessage(text) {
      const msg: ChatMessage = {
        id: newId('m'),
        author: meAuthor,
        text,
        createdAt: new Date().toISOString(),
      };
      setMessages((list) => [...list, msg]);
      const socket = getAppSocket();
      if (resident.idResidence) {
        socket.emit('send_message', { idResidence: resident.idResidence, message: msg });
      }
    },

    markRead(id) {
      setNotifications((list) => list.map((n) => (n.id === id ? { ...n, lu: true } : n)));
    },

    markAllRead() {
      setNotifications((list) => list.map((n) => ({ ...n, lu: true })));
    },
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}
