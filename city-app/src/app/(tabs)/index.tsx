import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { CityLogo } from '@/components/city-logo';
import { Icon, type IconName } from '@/components/icon';
import { NotificationBell } from '@/components/notification-bell';
import { PostCard } from '@/components/post-card';
import { Card, Chip } from '@/components/ui';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { chatOnline, logement } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';
import { formatDZD } from '@/utils/format';

type Filter = 'tout' | 'annonces' | 'voisins';

function Highlight({ icon, label, value, tint, href }: { icon: IconName; label: string; value: string; tint: string; href: Href }) {
  const theme = useTheme();
  return (
    <Pressable onPress={() => router.navigate(href)} style={({ pressed }) => [styles.highlight, { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.8 : 1 }]}>
      <View style={[styles.highlightIcon, { backgroundColor: `${tint}1A` }]}>
        <Icon name={icon} size={18} color={tint} />
      </View>
      <Text style={[styles.highlightLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text numberOfLines={1} style={[styles.highlightValue, { color: theme.text }]}>
        {value}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { resident, posts, paiements, souscription, publishPost } = useAppState();
  const [filter, setFilter] = useState<Filter>('tout');
  const [draft, setDraft] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const visible = posts.filter((p) => filter === 'tout' || (filter === 'annonces' ? p.kind === 'annonce' : p.kind === 'post'));
  const nextDue = paiements.find((p) => p.statut === 'en_attente');

  function publish() {
    const text = draft.trim();
    if (!text) return;
    publishPost(text);
    setDraft('');
    setFilter('tout');
  }

  function refresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }

  const header = (
    <View style={styles.headerBlock}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <CityLogo size={38} />
          <View>
            <Text style={[styles.brandName, { color: theme.text }]}>City</Text>
            <Text style={[styles.brandSub, { color: theme.textSecondary }]}>{logement.residence}</Text>
          </View>
        </View>
        <NotificationBell />
      </View>

      <View>
        <Text style={[styles.greeting, { color: theme.text }]}>Bonjour {resident.prenom} 👋</Text>
        <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>Quoi de neuf dans la résidence aujourd’hui ?</Text>
      </View>

      <Card style={styles.composer}>
        <View style={styles.composerRow}>
          <Avatar person={resident} size={40} />
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Partagez quelque chose avec vos voisins…"
            placeholderTextColor={theme.textMuted}
            multiline
            maxLength={1000}
            style={[styles.composerInput, { color: theme.text }]}
          />
        </View>
        <View style={[styles.composerActions, { borderColor: theme.border }]}>
          <View style={styles.composerTools}>
            <Pressable style={styles.tool} hitSlop={6}>
              <Icon name="image" size={18} color={theme.success} />
              <Text style={[styles.toolLabel, { color: theme.textSecondary }]}>Photo</Text>
            </Pressable>
            <Pressable style={styles.tool} hitSlop={6}>
              <Icon name="calendar" size={18} color={theme.brand} />
              <Text style={[styles.toolLabel, { color: theme.textSecondary }]}>Événement</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={publish}
            disabled={!draft.trim()}
            style={[styles.publish, { backgroundColor: draft.trim() ? theme.brand : theme.backgroundSelected }]}>
            <Text style={[styles.publishLabel, { color: draft.trim() ? '#FFFFFF' : theme.textMuted }]}>Publier</Text>
          </Pressable>
        </View>
      </Card>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlights}>
        {nextDue && <Highlight icon="receipt" label="Prochain paiement" value={formatDZD(nextDue.montant)} tint={theme.warning} href="/payments" />}
        <Highlight icon="chat" label="Discussion" value={`${chatOnline} en ligne`} tint={theme.success} href="/chat" />
        <Highlight icon="premium" label="Abonnement" value={souscription.abonnement.nom} tint={theme.brand} href="/profile" />
      </ScrollView>

      <View style={styles.filters}>
        <Chip label="Tout" active={filter === 'tout'} onPress={() => setFilter('tout')} />
        <Chip label="Annonces" active={filter === 'annonces'} onPress={() => setFilter('annonces')} count={posts.filter((p) => p.kind === 'annonce').length} />
        <Chip label="Voisins" active={filter === 'voisins'} onPress={() => setFilter('voisins')} />
      </View>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <FlatList
        data={visible}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostCard post={item} residence={logement.residence} />}
        ListHeaderComponent={header}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.textSecondary }]}>Aucune publication pour le moment.</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.two }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.brand} colors={[theme.brand]} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  headerBlock: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 12,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  greetingSub: {
    fontSize: 14,
    marginTop: 2,
  },
  composer: {
    padding: 0,
  },
  composerRow: {
    flexDirection: 'row',
    gap: 12,
    padding: Spacing.three,
    paddingBottom: 12,
  },
  composerInput: {
    flex: 1,
    fontSize: 15,
    minHeight: 40,
    maxHeight: 140,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  composerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  composerTools: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  publish: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: Radius.full,
  },
  publishLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  highlights: {
    gap: 10,
  },
  highlight: {
    width: 150,
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  highlightIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  separator: {
    height: Spacing.three,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.five,
  },
});
