import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { useTheme } from '@/hooks/use-theme';

export function InAppNotificationBanner() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { activeBanner, dismissBanner, markRead } = useAppState();
  const [translateY] = useState(() => new Animated.Value(-120));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (activeBanner) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 9,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeBanner, translateY, opacity]);

  if (!activeBanner) return null;

  function handlePress() {
    if (!activeBanner) return;
    markRead(activeBanner.id);
    dismissBanner();
    router.navigate('/notifications');
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: Math.max(insets.top + Spacing.two, 16),
          transform: [{ translateY }],
          opacity,
        },
      ]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.brand,
            shadowColor: '#000000',
          },
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}>
        <View style={[styles.iconWrapper, { backgroundColor: `${theme.brand}1F` }]}>
          <Icon name="megaphone" size={20} color={theme.brand} />
        </View>

        <View style={styles.textWrapper}>
          <View style={styles.headerRow}>
            <Text style={[styles.badge, { color: theme.brandText, backgroundColor: theme.brandSoft }]}>
              {activeBanner.kind === 'annonce' ? 'Nouvelle annonce' : 'Alerte'}
            </Text>
            <Text style={[styles.time, { color: theme.textMuted }]}>{"À l'instant"}</Text>
          </View>
          <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
            {activeBanner.titre}
          </Text>
          <Text numberOfLines={2} style={[styles.detail, { color: theme.textSecondary }]}>
            {activeBanner.detail}
          </Text>
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            dismissBanner();
          }}
          hitSlop={12}
          style={styles.closeBtn}>
          <Icon name="close" size={16} color={theme.textMuted} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    zIndex: 9999,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 600,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    gap: Spacing.two,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  time: {
    fontSize: 11,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  detail: {
    fontSize: 12,
    lineHeight: 16,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 2,
  },
});
