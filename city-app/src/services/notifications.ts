import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

/**
 * Configure Android notification channels with high importance and custom vibration/sound.
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Annonces & Alertes Syndic',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#EA580C',
      sound: 'default',
      enableVibrate: true,
    });
  }
}

/**
 * Request system permissions and retrieve the Expo Push Token for this physical device.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  await setupNotificationChannels();

  if (!Device.isDevice) {
    console.log('[PushNotifications] Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[PushNotifications] Push notification permission denied by user');
    return null;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );

    console.log('[PushNotifications] Expo Push Token obtained:', tokenData.data);
    return tokenData.data;
  } catch (error) {
    console.warn('[PushNotifications] Could not retrieve Expo push token:', error);
    return null;
  }
}

/**
 * Register the device push token with the backend server.
 */
export async function syncPushTokenWithBackend(
  baseUrl: string,
  token: string,
  accessToken: string,
): Promise<void> {
  try {
    const res = await fetch(`${baseUrl}/api/notifications/push-token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        'x-mobile-app': 'true',
      },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      console.log('[PushNotifications] Push token successfully registered on server');
    } else {
      console.warn('[PushNotifications] Server returned error when registering push token:', res.status);
    }
  } catch (err) {
    console.error('[PushNotifications] Network error registering push token:', err);
  }
}

/**
 * Remove the device push token from the backend server (called upon logout).
 */
export async function removePushTokenFromBackend(
  baseUrl: string,
  token: string,
  accessToken: string,
): Promise<void> {
  try {
    await fetch(`${baseUrl}/api/notifications/push-token`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        'x-mobile-app': 'true',
      },
      body: JSON.stringify({ token }),
    });
    console.log('[PushNotifications] Push token removed from server');
  } catch (err) {
    console.error('[PushNotifications] Network error removing push token:', err);
  }
}
