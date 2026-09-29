import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

type SymbolName = Extract<SymbolViewProps['name'], object>;

const ICONS = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  chat: { ios: 'bubble.left.and.bubble.right.fill', android: 'forum', web: 'forum' },
  payments: { ios: 'creditcard.fill', android: 'payments', web: 'payments' },
  profile: { ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' },
  bell: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
  heart: { ios: 'heart', android: 'favorite', web: 'favorite' },
  heartFill: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  comment: { ios: 'bubble.left', android: 'mode_comment', web: 'mode_comment' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  send: { ios: 'paperplane.fill', android: 'send', web: 'send' },
  more: { ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' },
  megaphone: { ios: 'megaphone.fill', android: 'campaign', web: 'campaign' },
  check: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  clock: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
  error: { ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
  mail: { ios: 'envelope.fill', android: 'mail', web: 'mail' },
  phone: { ios: 'phone.fill', android: 'call', web: 'call' },
  building: { ios: 'building.2.fill', android: 'apartment', web: 'apartment' },
  receipt: { ios: 'doc.text.fill', android: 'receipt_long', web: 'receipt_long' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  premium: { ios: 'crown.fill', android: 'workspace_premium', web: 'workspace_premium' },
  verified: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  eyeOff: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  download: { ios: 'arrow.down.circle', android: 'download', web: 'download' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  location: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  image: { ios: 'photo', android: 'image', web: 'image' },
  card: { ios: 'creditcard', android: 'credit_card', web: 'credit_card' },
  group: { ios: 'person.3.fill', android: 'group', web: 'group' },
  person: { ios: 'person.fill', android: 'person', web: 'person' },
  key: { ios: 'key.fill', android: 'key', web: 'key' },
  doneAll: { ios: 'checkmark', android: 'done_all', web: 'done_all' },
  info: { ios: 'info.circle.fill', android: 'info', web: 'info' },
  shield: { ios: 'checkmark.shield.fill', android: 'shield', web: 'shield' },
} satisfies Record<string, SymbolName>;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 22,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} style={style} />;
}
