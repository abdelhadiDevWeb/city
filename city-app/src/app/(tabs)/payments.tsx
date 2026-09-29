import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { Button, Card, Chip, Pill, SectionTitle, type PillTone } from '@/components/ui';
import { Brand, Ink, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import type { Paiement, PaiementStatut } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, formatDZD } from '@/utils/format';

type Filter = 'tous' | PaiementStatut;

const STATUS: Record<PaiementStatut, { label: string; tone: PillTone; icon: IconName }> = {
  paye: { label: 'Payé', tone: 'success', icon: 'check' },
  en_attente: { label: 'En attente', tone: 'warning', icon: 'clock' },
  echoue: { label: 'Échoué', tone: 'danger', icon: 'error' },
};

const CATEGORY_ICON: Record<Paiement['categorie'], IconName> = {
  charges: 'building',
  abonnement: 'premium',
  travaux: 'receipt',
};

const MONTH_INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

function monthlyTotals(paiements: Paiement[], reference: Date) {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(reference.getFullYear(), reference.getMonth() - 5 + i, 1);
    const total = paiements
      .filter((p) => p.statut === 'paye')
      .filter((p) => {
        const pd = new Date(p.date);
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
      })
      .reduce((sum, p) => sum + p.montant, 0);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_INITIALS[d.getMonth()]!, total };
  });
}

function PaymentRow({ paiement, expanded, onToggle, last }: { paiement: Paiement; expanded: boolean; onToggle: () => void; last: boolean }) {
  const theme = useTheme();
  const status = STATUS[paiement.statut];

  return (
    <View style={[!last && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.border }]}>
      <Pressable onPress={onToggle} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]} accessibilityRole="button" accessibilityState={{ expanded }}>
        <View style={[styles.rowIcon, { backgroundColor: theme.backgroundElement }]}>
          <Icon name={CATEGORY_ICON[paiement.categorie]} size={20} color={theme.text} />
        </View>
        <View style={styles.rowText}>
          <Text numberOfLines={1} style={[styles.rowTitle, { color: theme.text }]}>
            {paiement.libelle}
          </Text>
          <Text style={[styles.rowMeta, { color: theme.textSecondary }]}>
            {formatDate(paiement.date)} · {paiement.methode}
          </Text>
        </View>
        <View style={styles.rowRight}>
          <Text style={[styles.amount, { color: paiement.statut === 'echoue' ? theme.textMuted : theme.text }, paiement.statut === 'echoue' && styles.strike]}>
            {formatDZD(paiement.montant)}
          </Text>
          <Pill label={status.label} tone={status.tone} />
        </View>
      </Pressable>

      {expanded && (
        <View style={[styles.details, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.detailLine}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Référence</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{paiement.reference}</Text>
          </View>
          <View style={styles.detailLine}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Moyen de paiement</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{paiement.methode}</Text>
          </View>
          {paiement.statut === 'paye' ? (
            <Button label="Télécharger le reçu" icon="download" variant="secondary" onPress={() => Alert.alert('Reçu', `Le reçu ${paiement.reference} sera disponible une fois le serveur connecté.`)} />
          ) : (
            <Button label={paiement.statut === 'echoue' ? 'Réessayer le paiement' : 'Payer maintenant'} icon="card" variant="brand" onPress={() => Alert.alert('Paiement', 'Le paiement en ligne sera disponible une fois le serveur connecté.')} />
          )}
        </View>
      )}
    </View>
  );
}

export default function PaymentsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { paiements } = useAppState();
  const [filter, setFilter] = useState<Filter>('tous');
  const [expanded, setExpanded] = useState<string | null>(null);

  const latest = new Date(Math.max(...paiements.map((p) => new Date(p.date).getTime())));
  const year = latest.getFullYear();
  const paidThisYear = paiements.filter((p) => p.statut === 'paye' && new Date(p.date).getFullYear() === year).reduce((s, p) => s + p.montant, 0);
  const toSettle = paiements.filter((p) => p.statut !== 'paye');
  const nextDue = paiements.find((p) => p.statut === 'en_attente');
  const months = monthlyTotals(paiements, latest);
  const maxMonth = Math.max(...months.map((m) => m.total), 1);
  const visible = paiements.filter((p) => filter === 'tous' || p.statut === filter);
  const count = (s: PaiementStatut) => paiements.filter((p) => p.statut === s).length;

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.two }]}>
      <View>
        <Text style={[styles.title, { color: theme.text }]}>Paiements</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Historique de vos charges et abonnements</Text>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryGlow} />
        <Text style={styles.summaryLabel}>Total payé en {year}</Text>
        <Text style={styles.summaryAmount}>{formatDZD(paidThisYear)}</Text>

        <View style={styles.chart}>
          {months.map((m, i) => (
            <View key={m.key} style={styles.chartCol}>
              <View style={styles.chartTrack}>
                <View style={[styles.chartBar, { height: `${Math.max((m.total / maxMonth) * 100, 4)}%`, backgroundColor: i === months.length - 1 ? Brand : '#57534E' }]} />
              </View>
              <Text style={styles.chartLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{formatDZD(toSettle.reduce((s, p) => s + p.montant, 0))}</Text>
            <Text style={styles.summaryStatLabel}>À régulariser</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{paiements.length}</Text>
            <Text style={styles.summaryStatLabel}>Transactions</Text>
          </View>
        </View>
      </View>

      {nextDue && (
        <Card style={[styles.due, { borderColor: theme.warning, borderWidth: 1 }]}>
          <View style={[styles.dueIcon, { backgroundColor: theme.warningSoft }]}>
            <Icon name="calendar" size={22} color={theme.warning} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.dueLabel, { color: theme.warning }]}>Prochaine échéance · {formatDate(nextDue.date)}</Text>
            <Text numberOfLines={1} style={[styles.rowTitle, { color: theme.text }]}>
              {nextDue.libelle}
            </Text>
            <Text style={[styles.dueAmount, { color: theme.text }]}>{formatDZD(nextDue.montant)}</Text>
          </View>
          <Pressable
            onPress={() => Alert.alert('Paiement', 'Le paiement en ligne sera disponible une fois le serveur connecté.')}
            style={({ pressed }) => [styles.payButton, { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 }]}>
            <Text style={[styles.payLabel, { color: theme.onPrimary }]}>Payer</Text>
          </Pressable>
        </Card>
      )}

      <View>
        <SectionTitle title="Historique" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Chip label="Tous" count={paiements.length} active={filter === 'tous'} onPress={() => setFilter('tous')} />
          <Chip label="Payés" count={count('paye')} active={filter === 'paye'} onPress={() => setFilter('paye')} />
          <Chip label="En attente" count={count('en_attente')} active={filter === 'en_attente'} onPress={() => setFilter('en_attente')} />
          <Chip label="Échoués" count={count('echoue')} active={filter === 'echoue'} onPress={() => setFilter('echoue')} />
        </ScrollView>
      </View>

      <Card style={styles.list}>
        {visible.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>Aucun paiement dans cette catégorie.</Text>
        ) : (
          visible.map((p, i) => (
            <PaymentRow key={p.id} paiement={p} expanded={expanded === p.id} onToggle={() => setExpanded((id) => (id === p.id ? null : p.id))} last={i === visible.length - 1} />
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  summary: {
    backgroundColor: Ink,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    overflow: 'hidden',
  },
  summaryGlow: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Brand,
    opacity: 0.18,
  },
  summaryLabel: {
    color: '#A8A29E',
    fontSize: 13,
    fontWeight: '600',
  },
  summaryAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 4,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    height: 96,
    marginTop: Spacing.four,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    height: '100%',
  },
  chartTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    borderRadius: 6,
  },
  chartLabel: {
    color: '#78716C',
    fontSize: 11,
    fontWeight: '700',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#44403C',
  },
  summaryStat: {
    flex: 1,
  },
  summaryStatValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  summaryStatLabel: {
    color: '#A8A29E',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: '#44403C',
    marginHorizontal: Spacing.three,
  },
  due: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dueIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueLabel: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  payButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  payLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  filters: {
    gap: 8,
  },
  list: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  rowMeta: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  amount: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  details: {
    gap: 10,
    marginHorizontal: 14,
    marginBottom: 14,
    padding: 14,
    borderRadius: Radius.md,
  },
  detailLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  empty: {
    textAlign: 'center',
    padding: Spacing.four,
  },
});
