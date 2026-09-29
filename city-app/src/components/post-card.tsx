import { useState, type ReactNode } from 'react';
import { Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Avatar } from '@/components/avatar';
import { Icon, type IconName } from '@/components/icon';
import { Card } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import type { Post } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { fullName, timeAgo } from '@/utils/format';

function Action({ icon, label, color, onPress, children }: { icon?: IconName; label: string; color: string; onPress: () => void; children?: ReactNode }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6} style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}>
      {children ?? (icon && <Icon name={icon} size={19} color={color} />)}
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function PostCard({ post, residence }: { post: Post; residence: string }) {
  const theme = useTheme();
  const { resident, toggleLike, addComment } = useAppState();
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState('');
  const [going, setGoing] = useState(false);
  const heart = useSharedValue(1);
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heart.get() }] }));

  const isAnnonce = post.kind === 'annonce';
  const subtitle = post.author.role === 'syndic' ? `Syndic · ${residence}` : post.author.logement;

  function like() {
    heart.set(withSequence(withTiming(1.35, { duration: 110 }), withSpring(1, { damping: 6, stiffness: 220 })));
    toggleLike(post.id);
  }

  function sendComment() {
    const text = draft.trim();
    if (!text) return;
    addComment(post.id, text);
    setDraft('');
  }

  return (
    <Card style={[styles.card, isAnnonce && { borderColor: theme.brand, borderWidth: 1 }]}>
      {isAnnonce && (
        <View style={[styles.annonceBanner, { backgroundColor: theme.brandSoft }]}>
          <Icon name="megaphone" size={14} color={theme.brandText} />
          <Text style={[styles.annonceText, { color: theme.brandText }]}>Annonce officielle</Text>
        </View>
      )}

      <View style={styles.header}>
        <Avatar person={post.author} size={42} />
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
              {fullName(post.author)}
            </Text>
            {post.author.role === 'syndic' && <Icon name="verified" size={15} color={theme.brand} />}
          </View>
          <Text numberOfLines={1} style={[styles.meta, { color: theme.textSecondary }]}>
            {subtitle} · {timeAgo(post.createdAt)}
          </Text>
        </View>
        <Pressable accessibilityLabel="Plus d’options" hitSlop={10}>
          <Icon name="more" size={20} color={theme.textMuted} />
        </Pressable>
      </View>

      <Text style={[styles.body, { color: theme.text }]}>{post.text}</Text>

      {post.event && (
        <View style={[styles.event, { backgroundColor: theme.backgroundElement }]}>
          <View style={[styles.eventIcon, { backgroundColor: theme.card }]}>
            <Icon name="calendar" size={20} color={theme.brand} />
          </View>
          <View style={styles.eventText}>
            <Text style={[styles.eventTitle, { color: theme.text }]}>{post.event.titre}</Text>
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {post.event.date} · {post.event.lieu}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setGoing((g) => !g)}
            style={[styles.eventButton, going ? { backgroundColor: theme.successSoft } : { backgroundColor: theme.primary }]}>
            <Text style={[styles.eventButtonText, { color: going ? theme.success : theme.onPrimary }]}>{going ? 'Inscrit ✓' : 'Je participe'}</Text>
          </Pressable>
        </View>
      )}

      <View style={[styles.stats, { borderColor: theme.border }]}>
        <View style={styles.statsLeft}>
          <View style={[styles.statsHeart, { backgroundColor: theme.brand }]}>
            <Icon name="heartFill" size={10} color="#FFFFFF" />
          </View>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>{post.likes}</Text>
        </View>
        <Pressable onPress={() => setShowComments((s) => !s)} hitSlop={6}>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {post.comments.length} commentaire{post.comments.length > 1 ? 's' : ''}
          </Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Action label="J’aime" color={post.liked ? theme.danger : theme.textSecondary} onPress={like}>
          <Animated.View style={heartStyle}>
            <Icon name={post.liked ? 'heartFill' : 'heart'} size={19} color={post.liked ? theme.danger : theme.textSecondary} />
          </Animated.View>
        </Action>
        <Action icon="comment" label="Commenter" color={showComments ? theme.brand : theme.textSecondary} onPress={() => setShowComments((s) => !s)} />
        <Action icon="share" label="Partager" color={theme.textSecondary} onPress={() => Share.share({ message: `${fullName(post.author)} : ${post.text}` }).catch(() => {})} />
      </View>

      {showComments && (
        <View style={[styles.comments, { borderColor: theme.border }]}>
          {post.comments.map((c) => (
            <View key={c.id} style={styles.comment}>
              <Avatar person={c.author} size={30} />
              <View style={styles.commentBody}>
                <View style={[styles.commentBubble, { backgroundColor: theme.backgroundElement }]}>
                  <Text style={[styles.commentName, { color: theme.text }]}>{fullName(c.author)}</Text>
                  <Text style={[styles.commentText, { color: theme.text }]}>{c.text}</Text>
                </View>
                <Text style={[styles.commentTime, { color: theme.textMuted }]}>{timeAgo(c.createdAt)}</Text>
              </View>
            </View>
          ))}

          <View style={styles.comment}>
            <Avatar person={resident} size={30} />
            <View style={[styles.commentInput, { backgroundColor: theme.backgroundElement }]}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Écrire un commentaire…"
                placeholderTextColor={theme.textMuted}
                onSubmitEditing={sendComment}
                returnKeyType="send"
                maxLength={500}
                style={[styles.commentTextInput, { color: theme.text }]}
              />
              <Pressable accessibilityLabel="Envoyer le commentaire" onPress={sendComment} disabled={!draft.trim()} hitSlop={8}>
                <Icon name="send" size={18} color={draft.trim() ? theme.brand : theme.textMuted} />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  annonceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
  },
  annonceText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  meta: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing.three,
    marginTop: 12,
    padding: 12,
    borderRadius: Radius.md,
  },
  eventIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventText: {
    flex: 1,
    minWidth: 0,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  eventButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  eventButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.three,
    marginTop: 14,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsHeart: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  comments: {
    gap: 12,
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
    paddingBottom: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  comment: {
    flexDirection: 'row',
    gap: 10,
  },
  commentBody: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  commentBubble: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  commentName: {
    fontSize: 13,
    fontWeight: '700',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 19,
  },
  commentTime: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 12,
  },
  commentInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
  },
  commentTextInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 9,
  },
});
