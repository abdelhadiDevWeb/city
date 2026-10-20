import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { io, type Socket } from 'socket.io-client';

const STORAGE_KEY = '@city_server_url';
export const DEFAULT_HOST_IP = '192.168.100.2';
export const DEFAULT_SERVER_URL = `http://${DEFAULT_HOST_IP}:4000`;

let customServerUrl: string | null = null;
let socketInstance: Socket | null = null;
let currentAccessToken: string | null = null;

export function cleanUrl(url: string): string {
  let cleaned = url.trim().replace(/\/api\/?$/, '').replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `http://${cleaned}`;
  }
  return cleaned;
}

export async function loadSavedServerUrl(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
      customServerUrl = cleanUrl(saved);
      return customServerUrl;
    }
  } catch (err) {
    console.warn('[Socket] Impossible de charger l\'URL enregistrée:', err);
  }
  return getSocketUrl();
}

export async function setCustomServerUrl(rawUrl: string): Promise<string> {
  const url = cleanUrl(rawUrl);
  customServerUrl = url;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, url);
  } catch (err) {
    console.warn('[Socket] Impossible d\'enregistrer l\'URL du serveur:', err);
  }

  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    getAppSocket();
  }
  return url;
}

export async function resetServerUrl(): Promise<string> {
  customServerUrl = null;
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Socket] Impossible de réinitialiser l\'URL:', err);
  }
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    getAppSocket();
  }
  return getSocketUrl();
}

export async function testServerConnection(rawUrl: string): Promise<{ ok: boolean; message: string }> {
  const url = cleanUrl(rawUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${url}/api/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      return { ok: true, message: 'Connexion réussie avec le serveur !' };
    }
    return { ok: false, message: `Réponse inattendue (Code HTTP ${res.status}).` };
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === 'AbortError') {
      return { ok: false, message: `Délai d'attente dépassé (6s). Le serveur à ${url} ne répond pas.` };
    }
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `Impossible de contacter le serveur (${msg}). Vérifiez votre Wi-Fi.` };
  }
}

export function getSocketUrl(): string {
  if (customServerUrl) {
    return customServerUrl;
  }

  if (process.env.EXPO_PUBLIC_API_URL) {
    return cleanUrl(process.env.EXPO_PUBLIC_API_URL);
  }

  // 1. If running in a web browser, use the current host's IP/domain
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:4000`;
  }

  // 2. If running via Expo Go or dev client on a physical device, get the computer's LAN IP
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as unknown as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })?.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:4000`;
    }
  }

  // 3. Physical phone / APK fallback to host computer IP on LAN
  // (10.0.2.2 only exists in Android emulator, whereas 192.168.100.2 is reachable by both)
  return DEFAULT_SERVER_URL;
}

export function setSocketToken(token: string | null): void {
  currentAccessToken = token;
  if (socketInstance) {
    socketInstance.auth = { token };
    if (token) {
      if (!socketInstance.connected) {
        socketInstance.connect();
      } else {
        socketInstance.emit('authenticate', token);
      }
    }
  }
}

export function getSocketToken(): string | null {
  return currentAccessToken;
}

export function getAppSocket(): Socket {
  if (!socketInstance) {
    const url = getSocketUrl();
    socketInstance = io(url, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      timeout: 10000,
      auth: (cb) => {
        cb({ token: currentAccessToken });
      },
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to server, socketId:', socketInstance?.id);
      if (currentAccessToken) {
        socketInstance?.emit('authenticate', currentAccessToken);
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected from server:', reason);
    });
  }
  return socketInstance;
}
