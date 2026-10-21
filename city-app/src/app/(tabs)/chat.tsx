import { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Pill } from '@/components/ui';
import { Brand, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import type { Author, ChatMessage } from '@/data/types';
import { neighbors } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';
import { dayLabel, formatTime, fullName, timeAgo } from '@/utils/format';

type ChatMode = 'batiment' | 'individuel';

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
    const isMine = message.author.id === myId || message.author.id === 'me' || message.author.id === 'u-1';
    rows.push({
      type: 'message',
      id: message.id,
      message,
      mine: isMine,
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

  const [mode, setMode] = useState<ChatMode>('batiment');
  const [activeContact, setActiveContact] = useState<Author | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [draft, setDraft] = useState('');
  const [showRules, setShowRules] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const myBatiment = resident.logement?.batiment || 'Bâtiment B';

  // Filter messages for Building Group Chat
  const batimentMessages = useMemo(() => {
    return messages.filter((m) => (!m.recipientId && m.channelId !== 'direct') || m.channelId === 'batiment');
  }, [messages]);

  // Filter messages for active 1-on-1 Contact
  const directMessages = useMemo(() => {
    if (!activeContact) return [];
    const myId = resident.id || 'u-1';
    return messages.filter((m) => {
      const isFromMeToContact = (m.author.id === myId || m.author.id === 'me') && m.recipientId === activeContact.id;
      const isFromContactToMe = m.author.id === activeContact.id && (m.recipientId === myId || m.recipientId === 'u-1' || m.recipientId === 'me');
      return isFromMeToContact || isFromContactToMe;
    });
  }, [messages, activeContact, resident.id]);

  const activeMessages = mode === 'batiment' ? batimentMessages : directMessages;
  const rows = buildRows(activeMessages, resident.id || 'u-1');

  function send() {
    const text = draft.trim();
    if (!text) return;
    if (mode === 'batiment') {
      sendMessage(text, 'batiment');
    } else if (activeContact) {
      sendMessage(text, 'direct', activeContact.id);
    }
    setDraft('');
  }

  // Get last message for each neighbor in individual list
  const neighborPreviews = useMemo(() => {
    const myId = resident.id || 'u-1';
    return neighbors.map((n) => {
      const msgs = messages.filter(
        (m) =>
          ((m.author.id === myId || m.author.id === 'me') && m.recipientId === n.id) ||
          (m.author.id === n.id && (m.recipientId === myId || m.recipientId === 'u-1' || m.recipientId === 'me'))
      );
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      return { neighbor: n, lastMessage: lastMsg };
    });
  }, [messages, resident.id]);

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Top Main Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.headerInner}>
          {mode === 'individuel' && activeContact ? (
            <View style={styles.directHeaderRow}>
              <Pressable
                accessibilityLabel="Retour aux conversations"
                onPress={() => setActiveContact(null)}
                style={styles.backButton}
                hitSlop={8}
              >
                <Icon name="chevronRight" size={20} color={theme.text} style={{ transform: [{ rotate: '180deg' }] }} />
              </Pressable>
              <Avatar person={activeContact} size={38} />
              <View style={styles.headerText}>
                <View style={styles.directNameRow}>
                  <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                    {fullName(activeContact)}
                  </Text>
                  {activeContact.role === 'syndic' && <Pill label="Syndic" tone="brand" />}
                </View>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                  {activeContact.logement || 'Résident'} · En ligne
                </Text>
              </View>
            </View>
          ) : (
            <>
              <View style={[styles.groupIcon, { backgroundColor: mode === 'batiment' ? theme.brandSoft : theme.backgroundElement }]}>
                <Icon name={mode === 'batiment' ? 'building' : 'chat'} size={22} color={theme.brand} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {mode === 'batiment' ? `Groupe ${myBatiment}` : 'Discussions privées'}
                </Text>
                <View style={styles.presence}>
                  <View style={[styles.onlineDot, { backgroundColor: theme.success }]} />
                  <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {mode === 'batiment' ? 'Voisins de votre bâtiment · En direct' : 'Échanges directs avec vos voisins'}
                  </Text>
                </View>
              </View>
            </>
          )}

          {mode === 'individuel' && !activeContact && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Nouvelle discussion"
              onPress={() => setShowNewChatModal(true)}
              style={[styles.newChatBtn, { backgroundColor: theme.brandSoft }]}
              hitSlop={8}
            >
              <Icon name="plus" size={18} color={theme.brand} />
            </Pressable>
          )}
        </View>

        {/* Mode Selector Tabs: Mon Bâtiment vs Chats Individuels */}
        {!activeContact && (
          <View style={[styles.tabBar, { backgroundColor: theme.backgroundElement }]}>
            <Pressable
              onPress={() => setMode('batiment')}
              style={[styles.tabItem, mode === 'batiment' && [styles.tabItemActive, { backgroundColor: theme.card, shadowColor: '#000' }]]}
            >
              <Icon name="building" size={16} color={mode === 'batiment' ? theme.brand : theme.textMuted} />
              <Text style={[styles.tabLabel, { color: mode === 'batiment' ? theme.text : theme.textMuted, fontWeight: mode === 'batiment' ? '800' : '600' }]}>
                Mon Bâtiment
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMode('individuel')}
              style={[styles.tabItem, mode === 'individuel' && [styles.tabItemActive, { backgroundColor: theme.card, shadowColor: '#000' }]]}
            >
              <Icon name="person" size={16} color={mode === 'individuel' ? theme.brand : theme.textMuted} />
              <Text style={[styles.tabLabel, { color: mode === 'individuel' ? theme.text : theme.textMuted, fontWeight: mode === 'individuel' ? '800' : '600' }]}>
                Chats Individuels
              </Text>
            </Pressable>
          </View>
        )}

        {/* Pinned Info Banner for Building Chat */}
        {mode === 'batiment' && showRules && (
          <View style={[styles.pinned, { backgroundColor: theme.backgroundElement }]}>
            <Icon name="megaphone" size={16} color={theme.brand} />
            <Text style={[styles.pinnedText, { color: theme.textSecondary }]} numberOfLines={2}>
              <Text style={{ fontWeight: '800', color: theme.text }}>Groupe Bâtiment · </Text>
              Échanges réservés aux résidents du {myBatiment}. Restez courtois 🙏
            </Text>
            <Pressable accessibilityLabel="Masquer le message épinglé" onPress={() => setShowRules(false)} hitSlop={10}>
              <Icon name="close" size={16} color={theme.textMuted} />
            </Pressable>
          </View>
        )}
      </View>

      {/* BODY CONTENT: If individual mode without active contact, show conversations list. Otherwise show message thread. */}
      {mode === 'individuel' && !activeContact ? (
        <ScrollView contentContainerStyle={styles.directoryList}>
          <View style={styles.directoryHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Vos voisins & contacts</Text>
            <Text style={[styles.sectionCount, { color: theme.textMuted }]}>{neighbors.length} contacts</Text>
          </View>

          {neighborPreviews.map(({ neighbor, lastMessage }) => (
            <Pressable
              key={neighbor.id}
              onPress={() => setActiveContact(neighbor)}
              style={({ pressed }) => [
                styles.contactCard,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Avatar person={neighbor} size={46} />
              <View style={styles.contactDetails}>
                <View style={styles.contactTopRow}>
                  <Text style={[styles.contactName, { color: theme.text }]} numberOfLines={1}>
                    {fullName(neighbor)}
                  </Text>
                  {neighbor.role === 'syndic' && <Pill label="Syndic" tone="brand" />}
                  {lastMessage && (
                    <Text style={[styles.contactTime, { color: theme.textMuted }]}>
                      {timeAgo(lastMessage.createdAt)}
                    </Text>
                  )}
                </View>
                <Text style={[styles.contactApartment, { color: theme.textSecondary }]} numberOfLines={1}>
                  {neighbor.logement || 'Résident'}
                </Text>
                <Text style={[styles.contactSnippet, { color: lastMessage ? theme.textSecondary : theme.brand }]} numberOfLines={1}>
                  {lastMessage ? lastMessage.text : 'Envoyer un premier message 👋'}
                </Text>
              </View>
              <Icon name="chevronRight" size={16} color={theme.textMuted} />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <>
          <FlatList
            inverted={rows.length > 0}
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
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucun message pour le moment</Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                  {mode === 'batiment'
                    ? `Discutez directement avec vos voisins du ${myBatiment}.`
                    : `Démarrez votre conversation privée avec ${activeContact ? fullName(activeContact) : 'votre voisin'}.`}
                </Text>
              </View>
            }
            contentContainerStyle={[styles.list, rows.length === 0 && { flexGrow: 1, justifyContent: 'center' }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          />

          <View style={[styles.composer, { backgroundColor: theme.card, borderColor: theme.border, paddingBottom: keyboardVisible ? 10 : Math.max(insets.bottom, 10) }]}>
            <View style={[styles.inputWrap, { backgroundColor: theme.backgroundElement }]}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={
                  mode === 'batiment'
                    ? `Message au groupe ${myBatiment}…`
                    : `Écrire à ${activeContact ? activeContact.prenom : 'votre voisin'}…`
                }
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
        </>
      )}

      {/* Directory Modal to pick a neighbor */}
      <Modal
        visible={showNewChatModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewChatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Nouvelle discussion privée</Text>
                <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                  Choisissez un voisin ou le syndic pour échanger en tête-à-tête
                </Text>
              </View>
              <Pressable onPress={() => setShowNewChatModal(false)} style={styles.closeBtn} hitSlop={8}>
                <Icon name="close" size={20} color={theme.textMuted} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalDirectoryList}>
              {neighbors.map((n) => (
                <Pressable
                  key={n.id}
                  onPress={() => {
                    setActiveContact(n);
                    setShowNewChatModal(false);
                  }}
                  style={({ pressed }) => [
                    styles.directoryItem,
                    { backgroundColor: theme.backgroundElement },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Avatar person={n} size={42} />
                  <View style={styles.directoryInfo}>
                    <View style={styles.directNameRow}>
                      <Text style={[styles.directoryName, { color: theme.text }]}>{fullName(n)}</Text>
                      {n.role === 'syndic' && <Pill label="Syndic" tone="brand" />}
                    </View>
                    <Text style={[styles.directorySub, { color: theme.textSecondary }]}>{n.logement || 'Résident'}</Text>
                  </View>
                  <Icon name="chat" size={18} color={theme.brand} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  directHeaderRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: Radius.full,
  },
  directNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newChatBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
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
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: Radius.lg,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  tabItemActive: {
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabLabel: {
    fontSize: 12.5,
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
    fontSize: 12,
    lineHeight: 16,
  },
  directoryList: {
    padding: Spacing.three,
    gap: 10,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  directoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  contactDetails: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  contactTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactName: {
    fontSize: 14.5,
    fontWeight: '700',
    flexShrink: 1,
  },
  contactTime: {
    fontSize: 11,
    marginLeft: 'auto',
  },
  contactApartment: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactSnippet: {
    fontSize: 12.5,
    marginTop: 2,
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
  emptyContainer: {
    padding: Spacing.five,
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    maxHeight: '80%',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  modalDirectoryList: {
    gap: 8,
    paddingBottom: 20,
  },
  directoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
  },
  directoryInfo: {
    flex: 1,
    gap: 2,
  },
  directoryName: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  directorySub: {
    fontSize: 12,
  },
});
