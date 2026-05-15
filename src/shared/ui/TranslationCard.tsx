import { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UITextView } from 'react-native-uitextview';

import { colors } from '../../theme/colors.ts';
import { texts } from '../../utils/texts.ts';

type TranslationCardProps = {
  languageLabel: string;
  variantLabel: string;
  value?: string;
  placeholder: string;
  isRtl?: boolean;
  onCopy: () => void;
  isCopied: boolean;
  isCopyDisabled: boolean;
  onPlaySound: () => void;
  isPlaySoundDisabled: boolean;
};

export function TranslationCard({
  languageLabel,
  variantLabel,
  value,
  placeholder,
  isRtl = false,
  onCopy,
  isCopied,
  isCopyDisabled,
  onPlaySound,
  isPlaySoundDisabled,
}: TranslationCardProps): JSX.Element {
  const isEmpty = !value;
  const isCasual = variantLabel.toLowerCase() === texts.home.translationVariants.casual.toLowerCase();

  return (
    <View style={styles.translationCard}>
      <View style={styles.translationCardHeader}>
        <View style={styles.translationCardHeaderLeft}>
          <View style={styles.translationMetaBlock}>
            <View style={styles.translationTitleRow}>
              <Text style={styles.translationLanguageLabel}>{languageLabel}</Text>

              <Text
                style={[
                  styles.translationVariantBadge,
                  isCasual ? styles.translationVariantBadgeCasual : styles.translationVariantBadgeFormal,
                ]}
              >
                {variantLabel}
              </Text>
            </View>

            {isCasual ? (
              <Text style={styles.translationVariantHint}>{texts.home.translationVariantHints.casual}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={onPlaySound}
            disabled={isPlaySoundDisabled}
            style={({ pressed }) => [
              styles.soundButton,
              isPlaySoundDisabled && styles.copyButtonDisabled,
              pressed && !isPlaySoundDisabled && styles.copyButtonPressed,
            ]}
          >
            <Text style={[styles.soundButtonIcon, isPlaySoundDisabled && styles.copyButtonTextDisabled]}>🔊</Text>
          </Pressable>

          <Pressable
            onPress={onCopy}
            disabled={isCopyDisabled}
            style={({ pressed }) => [
              styles.copyButton,
              isCopied && styles.copyButtonSuccess,
              isCopyDisabled && styles.copyButtonDisabled,
              pressed && !isCopyDisabled && styles.copyButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.copyButtonText,
                isCopied && styles.copyButtonTextSuccess,
                isCopyDisabled && styles.copyButtonTextDisabled,
              ]}
            >
              {isCopied ? texts.home.copyButton.success : texts.home.copyButton.idle}
            </Text>
          </Pressable>
        </View>
      </View>

      {isEmpty ? (
        <Text
          style={[
            styles.translationValue,
            styles.translationValuePlaceholder,
            isRtl ? styles.translationValueRtl : styles.translationValueLtr,
          ]}
        >
          {placeholder}
        </Text>
      ) : (
        <UITextView
          selectable
          uiTextView
          style={[styles.translationValue, isRtl ? styles.translationValueRtl : styles.translationValueLtr]}
        >
          {value}
        </UITextView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  translationCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.formalCardBorder,
    backgroundColor: colors.formalCardBackground,
    padding: 16,
    gap: 14,
    overflow: 'hidden',
  },
  translationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  translationCardHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  translationMetaBlock: {
    gap: 4,
  },
  translationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  translationLanguageLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  translationVariantBadge: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  translationVariantBadgeFormal: {
    color: colors.textPrimary,
    backgroundColor: colors.surfaceSecondary,
  },
  translationVariantBadgeCasual: {
    color: colors.casualBadgeText,
    backgroundColor: colors.casualBadgeBackground,
  },
  translationVariantHint: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  copyButton: {
    minWidth: 72,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonPressed: {
    opacity: 0.82,
  },
  copyButtonDisabled: {
    opacity: 0.45,
  },
  copyButtonSuccess: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(35, 207, 200, 0.14)',
  },
  copyButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  copyButtonTextDisabled: {
    color: colors.textMuted,
  },
  copyButtonTextSuccess: {
    color: colors.accent,
  },
  soundButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundButtonIcon: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  translationValue: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
  },
  translationValuePlaceholder: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '500',
    color: colors.textMuted,
  },
  translationValueLtr: {
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  translationValueRtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
