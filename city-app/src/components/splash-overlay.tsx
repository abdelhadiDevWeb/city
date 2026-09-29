import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { LOGO_BAR_BOTTOM, LOGO_BAR_WIDTH, LOGO_BARS, LOGO_RADIUS } from '@/components/city-logo';
import { Brand, Ink } from '@/constants/theme';

// Must match `imageWidth` of the expo-splash-screen plugin in app.json, so the hand-off is seamless.
const LOGO_SIZE = 96;
const EXIT_DELAY = 2100;

function RisingBar({ index, started }: { index: number; started: boolean }) {
  const bar = LOGO_BARS[index]!;
  const grow = useSharedValue(0);

  useEffect(() => {
    if (started) grow.set(withDelay(150 + index * 140, withSpring(1, { damping: 10, stiffness: 150 })));
  }, [started, grow, index]);

  const animatedStyle = useAnimatedStyle(() => ({ height: LOGO_SIZE * bar.height * grow.get() }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { left: LOGO_SIZE * bar.left, width: LOGO_SIZE * LOGO_BAR_WIDTH, bottom: LOGO_SIZE * LOGO_BAR_BOTTOM },
        animatedStyle,
      ]}
    />
  );
}

function Ripple({ delay, started }: { delay: number; started: boolean }) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (started) t.set(withDelay(delay, withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) })));
  }, [started, t, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(t.get(), [0, 0.15, 1], [0, 0.55, 0]),
    transform: [{ scale: interpolate(t.get(), [0, 1], [1, 2.8]) }],
  }));

  return <Animated.View style={[styles.ripple, animatedStyle]} />;
}

export function SplashOverlay() {
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);

  const exit = useSharedValue(0);
  const pop = useSharedValue(1);
  const reveal = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!started) return;
    pop.set(withDelay(620, withSequence(withTiming(1.08, { duration: 160 }), withSpring(1, { damping: 7, stiffness: 180 }))));
    reveal.set(withDelay(650, withTiming(1, { duration: 550, easing: Easing.out(Easing.cubic) })));
    progress.set(withTiming(1, { duration: EXIT_DELAY - 150, easing: Easing.inOut(Easing.quad) }));
    exit.set(
      withDelay(
        EXIT_DELAY,
        withTiming(1, { duration: 420, easing: Easing.in(Easing.cubic) }, (finished) => {
          'worklet';
          if (finished) scheduleOnRN(setVisible, false);
        }),
      ),
    );
  }, [started, pop, reveal, progress, exit]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: 1 - exit.get() }));
  const contentStyle = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(exit.get(), [0, 1], [1, 1.12]) }] }));
  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: reveal.get(),
    transform: [{ translateY: interpolate(reveal.get(), [0, 1], [16, 0]) }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.get(), [0.35, 1], [0, 1], 'clamp'),
    transform: [{ translateY: interpolate(reveal.get(), [0, 1], [22, 0]) }],
  }));
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.overlay, overlayStyle]}
      onLayout={() => {
        SplashScreen.hideAsync()
          .catch(() => {})
          .finally(() => setStarted(true));
      }}>
      <StatusBar style="light" />
      <View style={styles.glow} />

      <Animated.View style={[styles.center, contentStyle]}>
        <Ripple delay={400} started={started} />
        <Ripple delay={750} started={started} />
        <Animated.View style={[styles.logo, logoStyle]}>
          {LOGO_BARS.map((bar, index) => (
            <RisingBar key={bar.left} index={index} started={started} />
          ))}
        </Animated.View>

        <View style={styles.texts}>
          <Animated.Text style={[styles.title, titleStyle]}>City</Animated.Text>
          <Animated.Text style={[styles.tagline, taglineStyle]}>Votre résidence, connectée.</Animated.Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.track}>
          <Animated.View style={[styles.progress, progressStyle]} />
        </View>
        <Text style={styles.footerText}>Voisins · Annonces · Paiements</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Ink,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: Brand,
    opacity: 0.07,
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE * LOGO_RADIUS,
    borderWidth: 2,
    borderColor: Brand,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE * LOGO_RADIUS,
    backgroundColor: Brand,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    backgroundColor: Ink,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  texts: {
    position: 'absolute',
    top: '50%',
    marginTop: LOGO_SIZE / 2 + 28,
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  tagline: {
    color: '#A8A29E',
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 64,
    alignItems: 'center',
    gap: 14,
  },
  track: {
    width: 140,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#292524',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Brand,
  },
  footerText: {
    color: '#57534E',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
