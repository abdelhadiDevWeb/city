import mongoose from "mongoose";
import { User } from "../models/User";

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  priority?: "default" | "normal" | "high";
  channelId?: string;
  badge?: number;
}

interface ExpoPushTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: {
    error?: "DeviceNotRegistered" | "MessageTooBig" | "MessageRateExceeded" | "InvalidCredentials" | string;
  };
}

interface ExpoPushResponse {
  data?: ExpoPushTicket[];
  errors?: Array<{ message: string; code?: string }>;
}

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

/**
 * Checks whether a string conforms to the Expo push token format.
 */
export function isExpoPushToken(token: string): boolean {
  if (typeof token !== "string") return false;
  return /^(ExponentPushToken|ExpoPushToken)\[.+\]$/.test(token.trim());
}

/**
 * Splits an array into chunks of the specified size.
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Sends push notifications to a list of Expo push tokens.
 * Automatically chunks requests into batches of 100 (Expo limit)
 * and purges invalid or expired tokens (DeviceNotRegistered) from the database.
 */
export async function sendPushNotifications(
  tokens: string[],
  payload: PushNotificationPayload,
): Promise<{ sent: number; failed: number }> {
  // Deduplicate and validate tokens
  const validTokens = Array.from(new Set(tokens.map((t) => t.trim()))).filter(isExpoPushToken);

  if (validTokens.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const chunks = chunkArray(validTokens, 100);
  let totalSent = 0;
  let totalFailed = 0;
  const staleTokens: string[] = [];

  for (const chunk of chunks) {
    const messages = chunk.map((token) => ({
      to: token,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      sound: payload.sound ?? "default",
      priority: payload.priority ?? "high",
      channelId: payload.channelId ?? "default",
      badge: payload.badge,
    }));

    try {
      const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        console.error(`[PushService] HTTP Error from Expo: ${response.status} ${response.statusText}`);
        totalFailed += chunk.length;
        continue;
      }

      const result = (await response.json()) as ExpoPushResponse;
      const tickets = result.data || [];

      tickets.forEach((ticket, index) => {
        const token = chunk[index];
        if (ticket.status === "ok") {
          totalSent += 1;
        } else {
          totalFailed += 1;
          console.warn(`[PushService] Failed to send push to token: ${ticket.message}`);
          if (ticket.details?.error === "DeviceNotRegistered") {
            staleTokens.push(token);
          }
        }
      });
    } catch (err) {
      console.error("[PushService] Network error sending push notification batch:", err);
      totalFailed += chunk.length;
    }
  }

  // Purge any tokens that Expo reported as unregistered (app uninstalled / token expired)
  if (staleTokens.length > 0) {
    try {
      await User.updateMany({ pushTokens: { $in: staleTokens } }, { $pull: { pushTokens: { $in: staleTokens } } });
      console.log(`[PushService] Cleaned up ${staleTokens.length} unregistered push tokens from database.`);
    } catch (cleanErr) {
      console.error("[PushService] Error cleaning up stale push tokens:", cleanErr);
    }
  }

  console.log(`[PushService] Sent ${totalSent} push notifications (${totalFailed} failed).`);
  return { sent: totalSent, failed: totalFailed };
}

/**
 * Sends a push notification to all residents of a given residence who have registered mobile devices.
 */
export async function dispatchMobilePushForResidence(
  idResidence: string,
  data: {
    id: string;
    titre: string;
    detail: string;
    isAlerte?: boolean;
    isRappel?: boolean;
    kind?: "annonce" | "alerte" | "maintenance";
    route?: string;
  },
): Promise<{ sent: number; failed: number }> {
  try {
    const resId = new mongoose.Types.ObjectId(idResidence);
    const users = await User.find(
      { idResidence: resId, pushTokens: { $exists: true, $not: { $size: 0 } } },
      { pushTokens: 1 },
    ).lean();

    const tokens = users.flatMap((u) => u.pushTokens || []);
    if (tokens.length === 0) {
      console.log(`[PushService] No mobile push tokens registered for residence ${idResidence}`);
      return { sent: 0, failed: 0 };
    }

    let title = data.titre;
    if (data.kind === "maintenance") {
      title = data.titre.startsWith("🔧") || data.titre.startsWith("🚨") ? data.titre : `🔧 [Maintenance] ${data.titre}`;
    } else if (!data.titre.startsWith("🚨") && !data.titre.startsWith("📢")) {
      const titlePrefix = data.isAlerte ? "🚨 [Alerte] " : data.isRappel ? "📢 [Rappel] " : "📢 ";
      title = `${titlePrefix}${data.titre}`;
    }

    return await sendPushNotifications(tokens, {
      title,
      body: data.detail,
      data: {
        id: data.id,
        kind: data.kind || (data.isAlerte ? "alerte" : "annonce"),
        route: data.route || "/notifications",
      },
      priority: data.isAlerte ? "high" : "default",
      sound: "default",
    });
  } catch (pushErr) {
    console.error("[PushService] Error dispatching push notifications:", pushErr);
    return { sent: 0, failed: 0 };
  }
}

