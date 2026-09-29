/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Same brand as the web dashboard (client/app/globals.css): ink #1C1917 + orange #F97316.
export const Colors = {
  light: {
    text: '#1C1917',
    background: '#FAFAF9',
    backgroundElement: '#F5F5F4',
    backgroundSelected: '#E7E5E4',
    textSecondary: '#78716C',
    textMuted: '#A8A29E',
    card: '#FFFFFF',
    border: '#E7E5E4',
    brand: '#F97316',
    brandSoft: '#FFF7ED',
    brandText: '#C2410C',
    primary: '#1C1917',
    onPrimary: '#FFFFFF',
    success: '#059669',
    successSoft: '#ECFDF5',
    warning: '#D97706',
    warningSoft: '#FFFBEB',
    danger: '#DC2626',
    dangerSoft: '#FEF2F2',
  },
  dark: {
    text: '#FAFAF9',
    background: '#0C0A09',
    backgroundElement: '#1C1917',
    backgroundSelected: '#292524',
    textSecondary: '#A8A29E',
    textMuted: '#57534E',
    card: '#1C1917',
    border: '#292524',
    brand: '#F97316',
    brandSoft: '#431407',
    brandText: '#FDBA74',
    primary: '#FAFAF9',
    onPrimary: '#1C1917',
    success: '#34D399',
    successSoft: '#022C22',
    warning: '#FBBF24',
    warningSoft: '#422006',
    danger: '#F87171',
    dangerSoft: '#450A0A',
  },
} as const;

export const Ink = '#1C1917';
export const Brand = '#F97316';

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
