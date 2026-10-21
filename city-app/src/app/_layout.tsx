import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { LogBox, useColorScheme } from 'react-native';

import { SplashOverlay } from '@/components/splash-overlay';
import { InAppNotificationBanner } from '@/components/in-app-banner';
import { Brand } from '@/constants/theme';
import { AppStateProvider, useAppState } from '@/context/app-state';
import { useTheme } from '@/hooks/use-theme';

LogBox.ignoreLogs([
  '[expo-notifications] Push notifications (remote notifications) are unavailable in Expo Go',
  '`expo-notifications` functionality is not fully supported in Expo Go',
  '[PushNotifications] setNotificationChannelAsync skipped',
  '[PushNotifications] Could not retrieve Expo push token',
]);

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { signedIn } = useAppState();
  const theme = useTheme();
  const router = useRouter();

  // Open notifications screen when the user taps a system push notification
  useEffect(() => {
    try {
      const sub = Notifications.addNotificationResponseReceivedListener?.((response) => {
        const route = response?.notification?.request?.content?.data?.route;
        if (route && typeof route === 'string') {
          router.push(route as any);
        } else {
          router.push('/notifications');
        }
      });

      return () => {
        sub?.remove?.();
      };
    } catch (e) {
      console.warn('[PushNotifications] addNotificationResponseReceivedListener skipped:', e);
    }
  }, [router]);


  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        headerStyle: { backgroundColor: theme.background },
        headerShadowVisible: false,
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: true, title: 'Modifier le profil', presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = useTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider
      value={{
        ...base,
        colors: { ...base.colors, primary: Brand, background: theme.background, card: theme.card, text: theme.text, border: theme.border },
      }}>
      <AppStateProvider>
        <StatusBar style="auto" />
        <RootNavigator />
        <InAppNotificationBanner />
      </AppStateProvider>
      <SplashOverlay />
    </ThemeProvider>
  );
}
