import { StyleSheet, View } from 'react-native';

import { Brand, Ink } from '@/constants/theme';

// Same mark as the web client's SVG logo (viewBox 32): three rising buildings in a rounded square.
export const LOGO_BARS = [
  { left: 9 / 32, height: 10 / 32 },
  { left: 14.5 / 32, height: 15 / 32 },
  { left: 20 / 32, height: 7 / 32 },
] as const;
export const LOGO_BAR_WIDTH = 4 / 32;
export const LOGO_BAR_BOTTOM = 9 / 32;
export const LOGO_RADIUS = 9 / 32;

export function CityLogo({ size = 40, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <View style={[styles.square, { width: size, height: size, borderRadius: size * LOGO_RADIUS, backgroundColor: inverted ? Brand : Ink }]}>
      {LOGO_BARS.map((bar) => (
        <View
          key={bar.left}
          style={[
            styles.bar,
            {
              left: size * bar.left,
              width: size * LOGO_BAR_WIDTH,
              height: size * bar.height,
              bottom: size * LOGO_BAR_BOTTOM,
              backgroundColor: inverted ? Ink : Brand,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
});
