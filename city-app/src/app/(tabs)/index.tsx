import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { Avatar } from '@/components/avatar';
import { CityLogo } from '@/components/city-logo';
import { Icon, type IconName } from '@/components/icon';
import { NotificationBell } from '@/components/notification-bell';
import { PostCard } from '@/components/post-card';
import { Card, Chip } from '@/components/ui';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
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
  const { resident, posts, paiements, publishPost } = useAppState();
  const [filter, setFilter] = useState<Filter>('tout');
  const [draft, setDraft] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Photo & Event attachments
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventData, setEventData] = useState<{ titre: string; date: string; lieu: string; imageUrl?: string } | null>(null);
  const [eventTitre, setEventTitre] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLieu, setEventLieu] = useState('');
  const [eventImage, setEventImage] = useState<string | null>(null);

  const visible = posts.filter((p) => filter === 'tout' || (filter === 'annonces' ? p.kind === 'annonce' : p.kind === 'post'));
  const nextDue = paiements.find((p) => p.statut === 'en_attente');

  async function pickImage() {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets[0]?.uri) {
        setSelectedImage(res.assets[0].uri);
      }
    } catch (err) {
      console.warn('Erreur sélection photo:', err);
    }
  }

  async function pickEventImage() {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets[0]?.uri) {
        setEventImage(res.assets[0].uri);
      }
    } catch (err) {
      console.warn('Erreur sélection image événement:', err);
    }
  }

  function handleSaveEvent() {
    if (!eventTitre.trim()) return;
    setEventData({
      titre: eventTitre.trim(),
      date: eventDate.trim() || 'À venir',
      lieu: eventLieu.trim() || 'Résidence',
      imageUrl: eventImage || undefined,
    });
    setEventTitre('');
    setEventDate('');
    setEventLieu('');
    setEventImage(null);
    setShowEventModal(false);
  }

  function publish() {
    const text = draft.trim();
    if (!text && !selectedImage && !eventData) return;
    publishPost(text || (eventData ? `Événement : ${eventData.titre}` : 'Photo partagée'), {
      imageUrl: selectedImage || undefined,
      event: eventData || undefined,
    });
    setDraft('');
    setSelectedImage(null);
    setEventData(null);
    setFilter('tout');
  }

  function refresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }

  const residenceName = resident.logement?.residence || 'Ma Résidence';

  const canPublish = Boolean(draft.trim() || selectedImage || eventData);

  const header = (
    <View style={styles.headerBlock}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <CityLogo size={38} />
          <View>
            <Text style={[styles.brandName, { color: theme.text }]}>City</Text>
            <Text style={[styles.brandSub, { color: theme.textSecondary }]}>{residenceName}</Text>
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

        {/* Selected Image Attachment Preview */}
        {selectedImage && (
          <View style={styles.attachmentRow}>
            <View style={styles.imagePreviewWrap}>
              <Image source={{ uri: selectedImage }} style={styles.previewThumb} contentFit="cover" />
              <Pressable
                accessibilityLabel="Supprimer la photo"
                onPress={() => setSelectedImage(null)}
                style={styles.removeBadge}
                hitSlop={8}
              >
                <Icon name="close" size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Selected Event Preview */}
        {eventData && (
          <View style={styles.attachmentRow}>
            <View style={[styles.eventBadge, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <View style={[styles.eventIconWrap, { backgroundColor: theme.brandSoft }]}>
                <Icon name="calendar" size={16} color={theme.brand} />
              </View>
              <View style={styles.eventBadgeText}>
                <Text numberOfLines={1} style={[styles.eventBadgeTitle, { color: theme.text }]}>
                  {eventData.titre}
                </Text>
                <Text numberOfLines={1} style={[styles.eventBadgeSub, { color: theme.textSecondary }]}>
                  {eventData.date} · {eventData.lieu}
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Retirer l'événement"
                onPress={() => setEventData(null)}
                style={styles.eventRemoveBtn}
                hitSlop={8}
              >
                <Icon name="close" size={16} color={theme.textMuted} />
              </Pressable>
            </View>
          </View>
        )}

        <View style={[styles.composerActions, { borderColor: theme.border }]}>
          <View style={styles.composerTools}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ajouter une photo"
              onPress={pickImage}
              style={styles.tool}
              hitSlop={6}
            >
              <Icon name="image" size={18} color={theme.success} />
              <Text style={[styles.toolLabel, { color: theme.textSecondary }]}>Photo</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Créer un événement"
              onPress={() => setShowEventModal(true)}
              style={styles.tool}
              hitSlop={6}
            >
              <Icon name="calendar" size={18} color={theme.brand} />
              <Text style={[styles.toolLabel, { color: theme.textSecondary }]}>Événement</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={publish}
            disabled={!canPublish}
            style={[styles.publish, { backgroundColor: canPublish ? theme.brand : theme.backgroundSelected }]}>
            <Text style={[styles.publishLabel, { color: canPublish ? '#FFFFFF' : theme.textMuted }]}>Publier</Text>
          </Pressable>
        </View>
      </Card>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlights}>
        {nextDue && <Highlight icon="receipt" label="Prochain paiement" value={formatDZD(nextDue.montant)} tint={theme.warning} href="/payments" />}
        <Highlight icon="chat" label="Discussion" value="Résidents" tint={theme.success} href="/chat" />
        <Highlight icon="premium" label="Espace" value={resident.logement?.appartement ? `Appt ${resident.logement.appartement}` : 'Résident'} tint={theme.brand} href="/profile" />
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
        renderItem={({ item }) => <PostCard post={item} residence={residenceName} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucune publication pour le moment</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Les alertes du syndic et les messages de vos voisins s’afficheront directement ici.
            </Text>
          </Card>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.two }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.brand} colors={[theme.brand]} />}
      />

      {/* Event Creation Modal */}
      <Modal
        visible={showEventModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEventModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border, maxHeight: '88%' }]}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
              <View style={styles.modalHeader}>
                <View style={[styles.modalIconWrap, { backgroundColor: theme.brandSoft }]}>
                  <Icon name="calendar" size={22} color={theme.brand} />
                </View>
                <View style={styles.modalHeaderText}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Créer un Événement</Text>
                  <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                    Activité ou rencontre pour les résidents
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Fermer"
                  onPress={() => setShowEventModal(false)}
                  hitSlop={8}
                  style={styles.modalCloseBtn}
                >
                  <Icon name="close" size={20} color={theme.textMuted} />
                </Pressable>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Titre de l&apos;événement *</Text>
                  <TextInput
                    value={eventTitre}
                    onChangeText={setEventTitre}
                    placeholder="Ex: Goûter des enfants, Tournoi de foot..."
                    placeholderTextColor={theme.textMuted}
                    style={[styles.modalInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Date et heure</Text>
                  <TextInput
                    value={eventDate}
                    onChangeText={setEventDate}
                    placeholder="Ex: Samedi 16h00, Demain 18h..."
                    placeholderTextColor={theme.textMuted}
                    style={[styles.modalInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Lieu</Text>
                  <TextInput
                    value={eventLieu}
                    onChangeText={setEventLieu}
                    placeholder="Ex: Jardin central, Hall Bâtiment A..."
                    placeholderTextColor={theme.textMuted}
                    style={[styles.modalInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
                  />
                </View>

                {/* Event Image Picker */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Photo / Affiche (optionnel)</Text>
                  {eventImage ? (
                    <View style={styles.eventImagePreviewRow}>
                      <Image source={{ uri: eventImage }} style={styles.eventPreviewImg} contentFit="cover" />
                      <Pressable
                        onPress={() => setEventImage(null)}
                        style={[styles.removeEventImgBtn, { backgroundColor: theme.danger }]}
                      >
                        <Text style={styles.removeEventImgText}>Supprimer</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={pickEventImage}
                      style={[styles.pickImgButton, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
                    >
                      <Icon name="image" size={18} color={theme.brand} />
                      <Text style={[styles.pickImgText, { color: theme.brand }]}>Choisir une affiche / photo</Text>
                    </Pressable>
                  )}
                </View>
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setShowEventModal(false)}
                  style={[styles.modalBtnCancel, { borderColor: theme.border }]}
                >
                  <Text style={[styles.modalBtnCancelText, { color: theme.textSecondary }]}>Annuler</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveEvent}
                  disabled={!eventTitre.trim()}
                  style={[styles.modalBtnConfirm, { backgroundColor: eventTitre.trim() ? theme.brand : theme.backgroundSelected }]}
                >
                  <Text style={[styles.modalBtnConfirmText, { color: eventTitre.trim() ? '#FFFFFF' : theme.textMuted }]}>
                    Ajouter l&apos;événement
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  emptyCard: {
    padding: Spacing.four,
    alignItems: 'center',
    textAlign: 'center',
    gap: 6,
    marginVertical: Spacing.two,
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
  attachmentRow: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 10,
  },
  imagePreviewWrap: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  previewThumb: {
    width: '100%',
    height: '100%',
  },
  removeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  eventIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBadgeText: {
    flex: 1,
    minWidth: 0,
  },
  eventBadgeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  eventBadgeSub: {
    fontSize: 11.5,
    marginTop: 1,
  },
  eventRemoveBtn: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.three,
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBody: {
    gap: 12,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalInput: {
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  eventImagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventPreviewImg: {
    width: 60,
    height: 60,
    borderRadius: Radius.md,
  },
  removeEventImgBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  removeEventImgText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pickImgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  pickImgText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.full,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalBtnCancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalBtnConfirm: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  modalBtnConfirmText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
