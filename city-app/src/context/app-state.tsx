import { createContext, useContext, useState, type ReactNode } from 'react';

import * as mock from '@/data/mock';
import type { AppNotification, ChatMessage, Paiement, Post, Resident, Souscription } from '@/data/types';

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

// Mock implementation: every action resolves locally until the resident endpoints exist on the server.
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [resident, setResident] = useState<Resident>(mock.currentResident);
  const [posts, setPosts] = useState<Post[]>(mock.posts);
  const [messages, setMessages] = useState<ChatMessage[]>(mock.chatMessages);
  const [notifications, setNotifications] = useState<AppNotification[]>(mock.notifications);

  const me = { ...mock.me, prenom: resident.prenom, nom: resident.nom };

  const value: AppState = {
    signedIn,
    resident,
    souscription: mock.souscription,
    paiements: mock.paiements,
    posts,
    messages,
    notifications,
    unreadCount: notifications.filter((n) => !n.lu).length,

    async signIn(email) {
      await wait(700);
      setResident((r) => ({ ...r, email: email.trim().toLowerCase() || r.email }));
      setSignedIn(true);
    },

    signOut() {
      setSignedIn(false);
    },

    async updateProfile(update) {
      await wait(600);
      setResident((r) => ({ ...r, ...update, email: update.email.trim().toLowerCase() }));
    },

    async changePassword() {
      await wait(600);
    },

    publishPost(text) {
      const post: Post = { id: newId('post'), author: me, kind: 'post', text, createdAt: new Date().toISOString(), likes: 0, liked: false, comments: [] };
      setPosts((list) => [post, ...list]);
    },

    toggleLike(postId) {
      setPosts((list) => list.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));
    },

    addComment(postId, text) {
      const comment = { id: newId('c'), author: me, text, createdAt: new Date().toISOString() };
      setPosts((list) => list.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)));
    },

    sendMessage(text) {
      setMessages((list) => [...list, { id: newId('m'), author: me, text, createdAt: new Date().toISOString() }]);
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
