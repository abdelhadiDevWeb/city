import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "./api";

let socketInstance: Socket | null = null;

export interface RealtimeNotification {
  id: string;
  titre: string;
  detail: string;
  isAlerte: boolean;
  niveau: "critique" | "attention" | "info";
  audience: string;
  date: string;
  idResidence: string;
  webUrl: string;
  mobileRoute: string;
}

export function getSocket(): Socket {
  if (!socketInstance) {
    const wsUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    socketInstance = io(wsUrl, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: (cb) => {
        const token = getAccessToken();
        cb({ token });
      },
    });

    socketInstance.on("connect", () => {
      const token = getAccessToken();
      if (token) {
        socketInstance?.emit("authenticate", token);
      }
    });
  }
  return socketInstance;
}

export function refreshSocketAuth(): void {
  if (socketInstance) {
    const token = getAccessToken();
    socketInstance.auth = { token };
    if (!socketInstance.connected) {
      socketInstance.connect();
    } else if (token) {
      socketInstance.emit("authenticate", token);
    }
  }
}

