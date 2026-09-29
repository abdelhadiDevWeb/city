import { StyleSheet, Text, View } from 'react-native';

import { Brand, Ink } from '@/constants/theme';
import type { Author } from '@/data/types';
import { initials } from '@/utils/format';

const PALETTE = [
  { bg: '#FFEDD5', fg: '#C2410C' },
  { bg: '#DBEAFE', fg: '#1D4ED8' },
  { bg: '#DCFCE7', fg: '#15803D' },
  { bg: '#F3E8FF', fg: '#7E22CE' },
  { bg: '#FCE7F3', fg: '#BE185D' },
  { bg: '#E0F2FE', fg: '#0369A1' },
];

function colorsFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length]!;
}

export function Avatar({
  person,
  size = 44,
  ring = false,
}: {
  person: Pick<Author, 'id' | 'prenom' | 'nom'> & { role?: Author['role'] };
  size?: number;
  ring?: boolean;
}) {
  const colors = person.role === 'syndic' ? { bg: Ink, fg: Brand } : colorsFor(person.id);
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.bg },
        ring && { borderWidth: 3, borderColor: Brand },
      ]}>
      <Text style={[styles.letters, { color: colors.fg, fontSize: size * 0.36 }]}>{initials(person)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letters: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
