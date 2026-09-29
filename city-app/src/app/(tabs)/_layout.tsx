import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { useAppState } from '@/context/app-state';
import { useTheme } from '@/hooks/use-theme';

function tabIcon(name: IconName) {
  return function TabIcon({ color }: { color: ColorValue }) {
    return <Icon name={name} size={24} color={color} />;
  };
}

export default function TabsLayout() {
  const theme = useTheme();
  const { paiements } = useAppState();
  const toSettle = paiements.filter((p) => p.statut !== 'paye').length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.brand,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarBadgeStyle: { backgroundColor: theme.brand, color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="chat" options={{ title: 'Discussion', tabBarIcon: tabIcon('chat') }} />
      <Tabs.Screen name="payments" options={{ title: 'Paiements', tabBarIcon: tabIcon('payments'), tabBarBadge: toSettle || undefined }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: tabIcon('profile') }} />
    </Tabs>
  );
}
