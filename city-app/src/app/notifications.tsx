import { router, Stack, type Href } from 'expo-router';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import type { AppNotification, NotificationKind } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { timeAgo } from '@/utils/format';

const KIND: Record<NotificationKind, { icon: IconName; color: string; href: Href }> = {
  annonce: { icon: 'megaphone', color: '#F97316', href: '/' },
  comment: { icon: 'comment', color: '#2563EB', href: '/' },
  like: { icon: 'heartFill', color: '#E11D48', href: '/' },
  chat: { icon: 'chat', color: '#059669', href: '/chat' },
  paiement: { icon: 'receipt', color: '#D97706', href: '/payments' },
  abonnement: { icon: 'premium', color: '#7C3AED', href: '/profile' },
};

function NotificationRow({ item }: { item: AppNotification }) {
  const theme = useTheme();
  const { markRead } = useAppState();
  const kind = KIND[item.kind];

  return (
    <Pressable
      onPress={() => {
        markRead(item.id);
        router.navigate(kind.href);
      }}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: item.lu ? theme.card : theme.brandSoft, borderColor: item.lu ? theme.border : 'transparent' },
        pressed && { opacity: 0.75 },
      ]}>
      <View style={[styles.icon, { backgroundColor: `${kind.color}1F` }]}>
        <Icon name={kind.icon} size={20} color={kind.color} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.title, { color: theme.text }]}>{item.titre}</Text>
        <Text style={[styles.detail, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.detail}
        </Text>
        <Text style={[styles.time, { color: item.lu ? theme.textMuted : theme.brandText }]}>{timeAgo(item.createdAt)}</Text>
      </View>
      {!item.lu && <View style={[styles.dot, { backgroundColor: theme.brand }]} />}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markAllRead } = useAppState();

  const sections = [
    { title: 'Nouvelles', data: notifications.filter((n) => !n.lu) },
    { title: 'Plus tôt', data: notifications.filter((n) => n.lu) },
  ].filter((s) => s.data.length > 0);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            unreadCount > 0 ? (
              <Pressable onPress={markAllRead} hitSlop={10} style={styles.readAll}>
                <Icon name="doneAll" size={16} color={theme.brandText} />
                <Text style={[styles.readAllText, { color: theme.brandText }]}>Tout lire</Text>
              </Pressable>
            ) : null,
        }}
      />
      <SectionList
        style={{ backgroundColor: theme.background }}
        sections={sections}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => <NotificationRow item={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.section, { color: theme.textSecondary, backgroundColor: theme.background }]}>
            {section.title}
            {section.title === 'Nouvelles' && ` · ${section.data.length}`}
          </Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.backgroundElement }]}>
              <Icon name="bell" size={28} color={theme.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucune notification</Text>
            <Text style={[styles.detail, { color: theme.textSecondary }]}>Vous êtes à jour !</Text>
          </View>
        }
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
        stickySectionHeadersEnabled={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  readAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readAllText: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  detail: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  time: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  separator: {
    height: 10,
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 80,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
});
