import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Pill } from '@/components/ui';
import { Brand, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { chatMembers, chatOnline, logement } from '@/data/mock';
import type { ChatMessage } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { dayLabel, formatTime, fullName } from '@/utils/format';

type Row = { type: 'day'; id: string; label: string } | { type: 'message'; id: string; message: ChatMessage; mine: boolean; first: boolean; last: boolean };

// Chronological rows (day separators + author grouping), reversed for the inverted list.
function buildRows(messages: ChatMessage[], myId: string): Row[] {
  const rows: Row[] = [];
  messages.forEach((message, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const day = dayLabel(message.createdAt);
    const newDay = !prev || dayLabel(prev.createdAt) !== day;
    if (newDay) rows.push({ type: 'day', id: `day-${message.id}`, label: day });
    rows.push({
      type: 'message',
      id: message.id,
      message,
      mine: message.author.id === myId,
      first: newDay || prev?.author.id !== message.author.id,
      last: !next || next.author.id !== message.author.id || dayLabel(next.createdAt) !== day,
    });
  });
  return rows.reverse();
}

function Bubble({ row }: { row: Extract<Row, { type: 'message' }> }) {
  const theme = useTheme();
  const { message, mine, first, last } = row;
  const isSyndic = message.author.role === 'syndic';

  return (
    <View style={[styles.messageRow, mine && styles.messageRowMine, { marginTop: first ? 12 : 3 }]}>
      {!mine && <View style={styles.avatarSlot}>{last && <Avatar person={message.author} size={32} />}</View>}
      <View style={[styles.bubbleColumn, mine && { alignItems: 'flex-end' }]}>
        {!mine && first && (
          <View style={styles.authorRow}>
            <Text style={[styles.author, { color: isSyndic ? theme.brandText : theme.textSecondary }]}>{fullName(message.author)}</Text>
            {isSyndic && <Pill label="Syndic" tone="brand" />}
          </View>
        )}
        <View
          style={[
            styles.bubble,
            mine
              ? { backgroundColor: Brand, borderBottomRightRadius: last ? 6 : 18, borderTopRightRadius: first ? 18 : 6 }
              : { backgroundColor: theme.card, borderColor: theme.border, borderWidth: StyleSheet.hairlineWidth, borderBottomLeftRadius: last ? 6 : 18, borderTopLeftRadius: first ? 18 : 6 },
          ]}>
          <Text style={[styles.bubbleText, { color: mine ? '#FFFFFF' : theme.text }]}>{message.text}</Text>
          <Text style={[styles.time, { color: mine ? 'rgba(255,255,255,0.75)' : theme.textMuted }]}>{formatTime(message.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { resident, messages, sendMessage } = useAppState();
  const [draft, setDraft] = useState('');
  const [showRules, setShowRules] = useState(true);

  const rows = buildRows(messages, resident.id);

  function send() {
    const text = draft.trim();
    if (!text) return;
    sendMessage(text);
    setDraft('');
  }

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.headerInner}>
          <View style={[styles.groupIcon, { backgroundColor: theme.brandSoft }]}>
            <Icon name="group" size={22} color={theme.brand} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.text }]}>Discussion générale</Text>
            <View style={styles.presence}>
              <View style={[styles.onlineDot, { backgroundColor: theme.success }]} />
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {chatMembers} membres · {chatOnline} en ligne
              </Text>
            </View>
          </View>
          <Pressable accessibilityLabel="Informations" hitSlop={10}>
            <Icon name="info" size={22} color={theme.textMuted} />
          </Pressable>
        </View>

        {showRules && (
          <View style={[styles.pinned, { backgroundColor: theme.backgroundElement }]}>
            <Icon name="megaphone" size={16} color={theme.brand} />
            <Text style={[styles.pinnedText, { color: theme.textSecondary }]} numberOfLines={2}>
              <Text style={{ fontWeight: '800', color: theme.text }}>Épinglé · </Text>
              Espace réservé aux résidents de {logement.residence}. Restez courtois 🙏
            </Text>
            <Pressable accessibilityLabel="Masquer le message épinglé" onPress={() => setShowRules(false)} hitSlop={10}>
              <Icon name="close" size={16} color={theme.textMuted} />
            </Pressable>
          </View>
        )}
      </View>

      <FlatList
        inverted
        data={rows}
        keyExtractor={(row) => row.id}
        renderItem={({ item }) =>
          item.type === 'day' ? (
            <View style={styles.day}>
              <Text style={[styles.dayText, { color: theme.textSecondary, backgroundColor: theme.backgroundElement }]}>{item.label}</Text>
            </View>
          ) : (
            <Bubble row={item} />
          )
        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      />

      <View style={[styles.composer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.inputWrap, { backgroundColor: theme.backgroundElement }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Écrire un message…"
            placeholderTextColor={theme.textMuted}
            multiline
            maxLength={1000}
            style={[styles.input, { color: theme.text }]}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Envoyer"
          onPress={send}
          disabled={!draft.trim()}
          style={({ pressed }) => [styles.send, { backgroundColor: draft.trim() ? Brand : theme.backgroundSelected, transform: [{ scale: pressed ? 0.92 : 1 }] }]}>
          <Icon name="send" size={18} color={draft.trim() ? '#FFFFFF' : theme.textMuted} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  presence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  pinned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  pinnedText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  day: {
    alignItems: 'center',
    marginVertical: Spacing.three,
  },
  dayText: {
    fontSize: 11.5,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  avatarSlot: {
    width: 32,
  },
  bubbleColumn: {
    maxWidth: '78%',
    gap: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 4,
  },
  author: {
    fontSize: 12,
    fontWeight: '700',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 18,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  time: {
    fontSize: 10.5,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrap: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: 10,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
