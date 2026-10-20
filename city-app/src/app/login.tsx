import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CityLogo } from '@/components/city-logo';
import { Icon } from '@/components/icon';
import { Button, TextField } from '@/components/ui';
import { Brand, Ink, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { useTheme } from '@/hooks/use-theme';
import {
  DEFAULT_HOST_IP,
  DEFAULT_SERVER_URL,
  getSocketUrl,
  loadSavedServerUrl,
  setCustomServerUrl,
  testServerConnection,
} from '@/utils/socket';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SKYLINE = [46, 78, 58, 110, 70, 50, 96, 64, 124, 82, 56, 100, 72, 60, 88];

export default function LoginScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { signIn } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Server configuration modal state
  const [serverModalVisible, setServerModalVisible] = useState(false);
  const [activeServerUrl, setActiveServerUrl] = useState(getSocketUrl());
  const [serverInput, setServerInput] = useState(activeServerUrl);
  const [testingServer, setTestingServer] = useState(false);
  const [testStatus, setTestStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    loadSavedServerUrl().then((url) => {
      setActiveServerUrl(url);
      setServerInput(url);
    });
  }, []);

  async function submit() {
    setGeneralError(null);
    const next: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Entrez une adresse email valide.';
    if (!password) next.password = 'Entrez votre mot de passe.';
    setErrors(next);
    if (next.email || next.password) return;

    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Identifiants incorrects.';
      setGeneralError(msg);
      if (Platform.OS !== 'web') {
        Alert.alert('Erreur de connexion', msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const isConnectionError =
    Boolean(generalError) &&
    (generalError?.toLowerCase().includes('serveur') ||
      generalError?.toLowerCase().includes('connexion') ||
      generalError?.toLowerCase().includes('délai') ||
      generalError?.toLowerCase().includes('network'));

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: Ink }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
        <View style={[styles.hero, { paddingTop: insets.top + Spacing.four }]}>
          <View style={styles.glow} />
          <View style={styles.brandRow}>
            <CityLogo size={44} inverted />
            <Text style={styles.brandName}>City</Text>
          </View>
          <Text style={styles.headline}>Votre résidence,{'\n'}connectée.</Text>
          <Text style={styles.subline}>Annonces du syndic, discussions entre voisins et paiements des charges au même endroit.</Text>

          <View style={styles.skyline}>
            {SKYLINE.map((height, i) => (
              <View key={i} style={[styles.building, { height, opacity: i % 3 === 1 ? 1 : 0.55 }]}>
                {i % 2 === 0 && <View style={styles.window} />}
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sheet, { backgroundColor: theme.background, paddingBottom: insets.bottom + Spacing.four }]}>
          <Text style={[styles.title, { color: theme.text }]}>Connexion</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Connectez-vous avec le compte fourni par votre syndic.</Text>

          <View style={styles.form}>
            {generalError && (
              <View style={styles.errorContainer}>
                <View style={styles.errorBanner}>
                  <Icon name="error" size={18} color="#DC2626" />
                  <Text style={styles.errorBannerText}>{generalError}</Text>
                </View>
                {isConnectionError && (
                  <Pressable
                    style={styles.serverFixButton}
                    onPress={() => {
                      setServerInput(activeServerUrl);
                      setTestStatus(null);
                      setServerModalVisible(true);
                    }}>
                    <Text style={styles.serverFixButtonText}>⚙️ Changer l'adresse du serveur</Text>
                  </Pressable>
                )}
              </View>
            )}
            <TextField
              label="Adresse email"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              placeholder="vous@email.dz"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              maxLength={254}
              error={errors.email}
            />
            <TextField
              label="Mot de passe"
              icon="lock"
              secure
              value={password}
              onChangeText={setPassword}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              maxLength={128}
              onSubmitEditing={submit}
              returnKeyType="go"
              error={errors.password}
            />

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Mot de passe oublié',
                  'Contactez le syndic de votre résidence pour réinitialiser votre mot de passe.',
                )
              }
              style={styles.forgot}
              hitSlop={8}>
              <Text style={[styles.link, { color: theme.brandText }]}>Mot de passe oublié ?</Text>
            </Pressable>

            <Button label={submitting ? 'Connexion…' : 'Se connecter'} onPress={submit} loading={submitting} />
          </View>

          <Text style={[styles.footnote, { color: theme.textMuted }]}>
            Pas encore de compte ? Votre syndic crée votre accès résident.
          </Text>

          {/* Server Config Badge */}
          <Pressable
            style={styles.serverBadge}
            onPress={() => {
              setServerInput(activeServerUrl);
              setTestStatus(null);
              setServerModalVisible(true);
            }}>
            <Icon name="location" size={13} color={theme.textMuted} />
            <Text style={[styles.serverBadgeText, { color: theme.textMuted }]}>
              Serveur : <Text style={{ color: theme.brand, fontWeight: '700' }}>{activeServerUrl}</Text>
            </Text>
            <Text style={[styles.serverBadgeAction, { color: theme.brand }]}>Modifier</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Server Config Modal */}
      <Modal
        visible={serverModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setServerModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Icon name="shield" size={20} color={theme.brand} />
                <Text style={[styles.modalTitle, { color: theme.text }]}>Adresse du serveur</Text>
              </View>
              <Pressable
                onPress={() => setServerModalVisible(false)}
                hitSlop={10}
                style={styles.modalCloseButton}>
                <Icon name="close" size={18} color={theme.textMuted} />
              </Pressable>
            </View>

            <Text style={[styles.modalDescription, { color: theme.textSecondary }]}>
              Indiquez l'adresse IP de votre ordinateur (sur le même Wi-Fi) ou votre URL de serveur backend.
            </Text>

            <TextField
              label="URL du serveur"
              value={serverInput}
              onChangeText={(txt) => {
                setServerInput(txt);
                setTestStatus(null);
              }}
              placeholder={DEFAULT_SERVER_URL}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.quickPresets}>
              <Text style={[styles.presetsLabel, { color: theme.textMuted }]}>Raccourcis :</Text>
              <Pressable
                style={[styles.presetChip, { borderColor: theme.border }]}
                onPress={() => {
                  setServerInput(DEFAULT_SERVER_URL);
                  setTestStatus(null);
                }}>
                <Text style={[styles.presetChipText, { color: theme.brand }]}>Mon PC ({DEFAULT_HOST_IP})</Text>
              </Pressable>
              <Pressable
                style={[styles.presetChip, { borderColor: theme.border }]}
                onPress={() => {
                  setServerInput('http://10.0.2.2:4000');
                  setTestStatus(null);
                }}>
                <Text style={[styles.presetChipText, { color: theme.textSecondary }]}>Émulateur (10.0.2.2)</Text>
              </Pressable>
            </View>

            {testStatus && (
              <View
                style={[
                  styles.testStatusBox,
                  {
                    backgroundColor: testStatus.ok ? '#ECFDF5' : '#FEF2F2',
                    borderColor: testStatus.ok ? '#A7F3D0' : '#FECACA',
                  },
                ]}>
                <Icon
                  name={testStatus.ok ? 'check' : 'error'}
                  size={16}
                  color={testStatus.ok ? '#059669' : '#DC2626'}
                />
                <Text
                  style={[
                    styles.testStatusText,
                    { color: testStatus.ok ? '#065F46' : '#991B1B' },
                  ]}>
                  {testStatus.message}
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <Button
                variant="secondary"
                label={testingServer ? 'Test…' : 'Tester'}
                onPress={async () => {
                  setTestingServer(true);
                  setTestStatus(null);
                  try {
                    const res = await testServerConnection(serverInput);
                    setTestStatus(res);
                  } finally {
                    setTestingServer(false);
                  }
                }}
                loading={testingServer}
                style={{ flex: 1 }}
              />
              <Button
                variant="brand"
                label="Enregistrer"
                onPress={async () => {
                  const saved = await setCustomServerUrl(serverInput);
                  setActiveServerUrl(saved);
                  setGeneralError(null);
                  setServerModalVisible(false);
                  Alert.alert('Serveur configuré', `L'application est connectée à :\n${saved}`);
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: Spacing.four,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -120,
    right: -140,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: Brand,
    opacity: 0.16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: Spacing.five,
  },
  subline: {
    color: '#A8A29E',
    fontSize: 15,
    lineHeight: 22,
    marginTop: Spacing.two,
    maxWidth: 340,
  },
  skyline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 130,
    marginTop: Spacing.four,
    marginHorizontal: -Spacing.four,
  },
  building: {
    flex: 1,
    backgroundColor: Brand,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
    paddingTop: 10,
  },
  window: {
    width: 6,
    height: 8,
    borderRadius: 1,
    backgroundColor: Ink,
    opacity: 0.5,
  },
  sheet: {
    flex: 1,
    marginTop: -Radius.xl,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  errorContainer: {
    gap: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  errorBannerText: {
    flex: 1,
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  serverFixButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  serverFixButtonText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '700',
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  link: {
    fontSize: 13,
    fontWeight: '700',
  },
  footnote: {
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: Spacing.four,
  },
  serverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.three,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  serverBadgeText: {
    fontSize: 12,
  },
  serverBadgeAction: {
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  quickPresets: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetsLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  presetChip: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  testStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  testStatusText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
});
