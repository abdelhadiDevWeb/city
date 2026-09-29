import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Button, Card, SectionTitle, TextField } from '@/components/ui';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { useTheme } from '@/hooks/use-theme';

// Same rules as the server (server/models/fields.ts and the admin Joi schema).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;
const NAME_MAX = 60;
const PASSWORD_MIN = 12;

type ProfileErrors = Partial<Record<'prenom' | 'nom' | 'email' | 'telephone', string>>;
type PasswordErrors = Partial<Record<'current' | 'next' | 'confirm', string>>;

export default function EditProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { resident, updateProfile, changePassword } = useAppState();

  const [prenom, setPrenom] = useState(resident.prenom);
  const [nom, setNom] = useState(resident.nom);
  const [email, setEmail] = useState(resident.email);
  const [telephone, setTelephone] = useState(resident.telephone);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwErrors, setPwErrors] = useState<PasswordErrors>({});
  const [pwSaving, setPwSaving] = useState(false);
  const [pwDone, setPwDone] = useState(false);

  const dirty = prenom !== resident.prenom || nom !== resident.nom || email !== resident.email || telephone !== resident.telephone;

  async function saveProfile() {
    const e: ProfileErrors = {};
    if (!prenom.trim()) e.prenom = 'Le prénom est requis.';
    else if (prenom.trim().length > NAME_MAX) e.prenom = `${NAME_MAX} caractères maximum.`;
    if (!nom.trim()) e.nom = 'Le nom est requis.';
    else if (nom.trim().length > NAME_MAX) e.nom = `${NAME_MAX} caractères maximum.`;
    if (!EMAIL_PATTERN.test(email.trim())) e.email = 'Adresse email invalide.';
    if (!PHONE_PATTERN.test(telephone.trim())) e.telephone = 'Format attendu : +213XXXXXXXXX (8 à 15 chiffres).';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    try {
      await updateProfile({ prenom: prenom.trim(), nom: nom.trim(), email: email.trim(), telephone: telephone.trim() });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  async function savePassword() {
    const e: PasswordErrors = {};
    if (!current) e.current = 'Entrez votre mot de passe actuel.';
    if (next.length < PASSWORD_MIN) e.next = `${PASSWORD_MIN} caractères minimum.`;
    else if (next === current) e.next = 'Le nouveau mot de passe doit être différent.';
    if (confirm !== next) e.confirm = 'Les mots de passe ne correspondent pas.';
    setPwErrors(e);
    setPwDone(false);
    if (Object.keys(e).length) return;

    setPwSaving(true);
    try {
      await changePassword(current, next);
      setCurrent('');
      setNext('');
      setConfirm('');
      setPwDone(true);
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarBlock}>
          <View>
            <Avatar person={{ id: resident.id, prenom: prenom || resident.prenom, nom: nom || resident.nom }} size={88} />
            <Pressable
              accessibilityLabel="Changer la photo"
              onPress={() => Alert.alert('Photo de profil', 'L’envoi de photo sera disponible une fois le serveur connecté.')}
              style={[styles.cameraButton, { backgroundColor: theme.primary, borderColor: theme.background }]}>
              <Icon name="image" size={15} color={theme.onPrimary} />
            </Pressable>
          </View>
          <Text style={[styles.avatarHint, { color: theme.textSecondary }]}>Ces informations sont visibles par le syndic et vos voisins.</Text>
        </View>

        <View>
          <SectionTitle title="Informations personnelles" />
          <Card style={styles.form}>
            <View style={styles.twoCols}>
              <View style={styles.flex}>
                <TextField label="Prénom" value={prenom} onChangeText={setPrenom} maxLength={NAME_MAX} autoComplete="given-name" error={errors.prenom} />
              </View>
              <View style={styles.flex}>
                <TextField label="Nom" value={nom} onChangeText={setNom} maxLength={NAME_MAX} autoComplete="family-name" error={errors.nom} />
              </View>
            </View>
            <TextField label="Email" icon="mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" maxLength={254} error={errors.email} />
            <TextField label="Téléphone" icon="phone" value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" autoComplete="tel" maxLength={16} error={errors.telephone} />
            <Button label="Enregistrer les modifications" icon="check" onPress={saveProfile} loading={saving} disabled={!dirty} />
          </Card>
        </View>

        <View>
          <SectionTitle title="Sécurité" />
          <Card style={styles.form}>
            <TextField label="Mot de passe actuel" icon="lock" secure value={current} onChangeText={setCurrent} autoComplete="current-password" maxLength={128} error={pwErrors.current} />
            <TextField label="Nouveau mot de passe" icon="key" secure value={next} onChangeText={setNext} autoComplete="new-password" maxLength={128} error={pwErrors.next} />
            <TextField label="Confirmer le mot de passe" icon="key" secure value={confirm} onChangeText={setConfirm} autoComplete="new-password" maxLength={128} error={pwErrors.confirm} />
            {pwDone && (
              <View style={[styles.success, { backgroundColor: theme.successSoft }]}>
                <Icon name="shield" size={16} color={theme.success} />
                <Text style={[styles.successText, { color: theme.success }]}>Mot de passe mis à jour.</Text>
              </View>
            )}
            <Button label="Mettre à jour le mot de passe" variant="secondary" onPress={savePassword} loading={pwSaving} />
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  avatarBlock: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: Spacing.two,
  },
  cameraButton: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 13,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  twoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  success: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: Radius.md,
  },
  successText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
