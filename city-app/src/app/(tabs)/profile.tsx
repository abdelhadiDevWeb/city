import { router, type Href } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Icon, type IconName } from '@/components/icon';
import { Button, Card, Pill, SectionTitle } from '@/components/ui';
import { Brand, Ink, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { logement } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, formatDZD, fullName } from '@/utils/format';

const DAY_MS = 24 * 60 * 60 * 1000;
const COVER_BARS = [40, 70, 52, 96, 60, 84, 46, 110, 66, 90, 54, 76];

function InfoRow({ icon, label, value, last }: { icon: IconName; label: string; value: string; last?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.border }]}>
      <View style={[styles.infoIcon, { backgroundColor: theme.backgroundElement }]}>
        <Icon name={icon} size={17} color={theme.textSecondary} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  );
}

function LinkRow({ icon, label, href, badge, last }: { icon: IconName; label: string; href: Href; badge?: number; last?: boolean }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => router.navigate(href)}
      style={({ pressed }) => [styles.infoRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.border }, pressed && { opacity: 0.6 }]}>
      <View style={[styles.infoIcon, { backgroundColor: theme.brandSoft }]}>
        <Icon name={icon} size={17} color={theme.brand} />
      </View>
      <Text style={[styles.linkLabel, { color: theme.text }]}>{label}</Text>
      {!!badge && (
        <View style={[styles.badge, { backgroundColor: theme.brand }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Icon name="chevronRight" size={16} color={theme.textMuted} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { resident, souscription, posts, unreadCount, signOut } = useAppState();

  const { abonnement } = souscription;
  const start = new Date(souscription.debut).getTime();
  const end = new Date(souscription.fin).getTime();
  const now = Date.now();
  const elapsed = Math.min(Math.max((now - start) / (end - start), 0), 1);
  const daysLeft = Math.max(Math.ceil((end - now) / DAY_MS), 0);
  const active = now >= start && now < end;

  const myPosts = posts.filter((p) => p.author.id === resident.id);
  const likesReceived = myPosts.reduce((sum, p) => sum + p.likes, 0);
  const commentsWritten = posts.reduce((sum, p) => sum + p.comments.filter((c) => c.author.id === resident.id).length, 0);

  function confirmSignOut() {
    if (Platform.OS === 'web') {
      signOut();
      return;
    }
    Alert.alert('Se déconnecter', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.scroll}>
      <View style={[styles.cover, { paddingTop: insets.top + 56 }]}>
        <View style={styles.coverGlow} />
        <View style={styles.coverSkyline}>
          {COVER_BARS.map((h, i) => (
            <View key={i} style={[styles.coverBar, { height: h, opacity: i % 3 === 0 ? 0.35 : 0.18 }]} />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.identity}>
          <View style={[styles.avatarWrap, { backgroundColor: theme.background }]}>
            <Avatar person={resident} size={92} />
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{fullName(resident)}</Text>
          <Text style={[styles.role, { color: theme.textSecondary }]}>
            Résident · {logement.batiment} · Appt {logement.appartement}
          </Text>
          <View style={styles.identityPills}>
            <Pill label={logement.residence} tone="neutral" icon="location" />
            {active && <Pill label={abonnement.nom} tone="brand" icon="premium" />}
          </View>
        </View>

        <Card style={styles.stats}>
          {[
            { value: myPosts.length, label: 'Publications' },
            { value: likesReceived, label: 'J’aime reçus' },
            { value: commentsWritten, label: 'Commentaires' },
          ].map((s, i) => (
            <View key={s.label} style={[styles.stat, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </Card>

        <View>
          <SectionTitle title="Mon abonnement" />
          <View style={styles.subscription}>
            <View style={styles.subscriptionGlow} />
            <View style={styles.subscriptionHead}>
              <View style={styles.crown}>
                <Icon name="premium" size={22} color={Ink} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.planLabel}>Formule</Text>
                <Text style={styles.planName}>{abonnement.nom}</Text>
              </View>
              <View style={[styles.statusChip, { backgroundColor: souscription.statutPaiement ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)' }]}>
                <Icon name={souscription.statutPaiement ? 'check' : 'error'} size={13} color={souscription.statutPaiement ? '#34D399' : '#F87171'} />
                <Text style={[styles.statusText, { color: souscription.statutPaiement ? '#34D399' : '#F87171' }]}>{souscription.statutPaiement ? 'Payé' : 'Impayé'}</Text>
              </View>
            </View>

            <Text style={styles.price}>
              {formatDZD(abonnement.prix)}
              <Text style={styles.priceUnit}> / {abonnement.duree} mois</Text>
            </Text>

            <View style={styles.periodRow}>
              <View>
                <Text style={styles.periodLabel}>Début</Text>
                <Text style={styles.periodValue}>{formatDate(souscription.debut)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.periodLabel}>Fin</Text>
                <Text style={styles.periodValue}>{formatDate(souscription.fin)}</Text>
              </View>
            </View>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${elapsed * 100}%` }]} />
            </View>
            <Text style={styles.daysLeft}>{active ? `${daysLeft} jours restants` : now < start ? 'Pas encore commencé' : 'Abonnement expiré'}</Text>

            <View style={styles.perks}>
              {abonnement.avantages.map((a) => (
                <View key={a} style={styles.perk}>
                  <Icon name="check" size={15} color={Brand} />
                  <Text style={styles.perkText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View>
          <SectionTitle
            title="Informations du compte"
            action={
              <Pressable onPress={() => router.push('/edit-profile')} hitSlop={8} style={styles.editLink}>
                <Icon name="edit" size={14} color={theme.brandText} />
                <Text style={[styles.editText, { color: theme.brandText }]}>Modifier</Text>
              </Pressable>
            }
          />
          <Card style={styles.listCard}>
            <InfoRow icon="mail" label="Email" value={resident.email} />
            <InfoRow icon="phone" label="Téléphone" value={resident.telephone} />
            <InfoRow icon="building" label="Résidence" value={`${logement.residence} · ${logement.localisation}`} />
            <InfoRow icon="home" label="Logement" value={`${logement.batiment} · ${logement.etage}e étage · Appt ${logement.appartement}`} />
            <InfoRow icon="calendar" label="Membre depuis" value={formatDate(resident.createdAt)} last />
          </Card>
        </View>

        <View>
          <SectionTitle title="Raccourcis" />
          <Card style={styles.listCard}>
            <LinkRow icon="person" label="Modifier mes informations" href="/edit-profile" />
            <LinkRow icon="receipt" label="Historique des paiements" href="/payments" />
            <LinkRow icon="bell" label="Notifications" href="/notifications" badge={unreadCount} />
            <LinkRow icon="key" label="Changer mon mot de passe" href="/edit-profile" last />
          </Card>
        </View>

        <Button label="Se déconnecter" icon="logout" variant="danger" onPress={confirmSignOut} />
        <Text style={[styles.version, { color: theme.textMuted }]}>City · v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingBottom: Spacing.five,
  },
  cover: {
    height: 170,
    backgroundColor: Ink,
    overflow: 'hidden',
  },
  coverGlow: {
    position: 'absolute',
    top: -100,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Brand,
    opacity: 0.22,
  },
  coverSkyline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },
  coverBar: {
    flex: 1,
    backgroundColor: Brand,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  identity: {
    alignItems: 'center',
    marginTop: -52,
  },
  avatarWrap: {
    padding: 5,
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 8,
  },
  role: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  identityPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  stats: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  subscription: {
    backgroundColor: Ink,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    overflow: 'hidden',
  },
  subscriptionGlow: {
    position: 'absolute',
    bottom: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Brand,
    opacity: 0.2,
  },
  subscriptionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crown: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planLabel: {
    color: '#A8A29E',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  price: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: Spacing.three,
  },
  priceUnit: {
    color: '#A8A29E',
    fontSize: 14,
    fontWeight: '600',
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.three,
  },
  periodLabel: {
    color: '#78716C',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  periodValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#44403C',
    marginTop: 12,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Brand,
  },
  daysLeft: {
    color: '#FDBA74',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 8,
  },
  perks: {
    gap: 8,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#44403C',
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    color: '#E7E5E4',
    fontSize: 13.5,
    fontWeight: '500',
  },
  editLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listCard: {
    paddingVertical: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14.5,
    fontWeight: '600',
    marginTop: 1,
  },
  linkLabel: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
});
