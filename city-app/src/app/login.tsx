import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CityLogo } from '@/components/city-logo';
import { Button, TextField } from '@/components/ui';
import { Brand, Ink, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { useTheme } from '@/hooks/use-theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SKYLINE = [46, 78, 58, 110, 70, 50, 96, 64, 124, 82, 56, 100, 72, 60, 88];

export default function LoginScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { signIn } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    const next: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Entrez une adresse email valide.';
    if (!password) next.password = 'Entrez votre mot de passe.';
    setErrors(next);
    if (next.email || next.password) return;

    setSubmitting(true);
    try {
      await signIn(email, password);
    } finally {
      setSubmitting(false);
    }
  }

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

            <Pressable onPress={() => Alert.alert('Mot de passe oublié', 'Contactez le syndic de votre résidence pour réinitialiser votre mot de passe.')} style={styles.forgot} hitSlop={8}>
              <Text style={[styles.link, { color: theme.brandText }]}>Mot de passe oublié ?</Text>
            </Pressable>

            <Button label={submitting ? 'Connexion…' : 'Se connecter'} onPress={submit} loading={submitting} />
          </View>

          <Text style={[styles.footnote, { color: theme.textMuted }]}>Pas encore de compte ? Votre syndic crée votre accès résident.</Text>
        </View>
      </ScrollView>
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
});
