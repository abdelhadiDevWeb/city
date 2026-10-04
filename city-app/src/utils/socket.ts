import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { io, type Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;
let currentAccessToken: string | null = null;

export function getSocketUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/?$/, '');
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

  // 3. Android emulator loopback alias
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }

  return 'http://localhost:4000';
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
