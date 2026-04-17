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
}: TranslationCardProps): JSX.Element {
  const isEmpty = !value;
  const isCasual = variantLabel.toLowerCase() === texts.home.translationVariants.casual.toLowerCase();

  return (
    <View style={[styles.translationCard, isCasual ? styles.translationCardCasual : styles.translationCardFormal]}>
      <View style={styles.translationCardHeader}>
        <View style={styles.translationCardHeaderLeft}>
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
    padding: 16,
    gap: 14,
  },
  translationCardFormal: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  translationCardCasual: {
    backgroundColor: 'rgba(35, 207, 200, 0.08)',
    borderColor: 'rgba(35, 207, 200, 0.34)',
  },
  translationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  translationCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
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
    color: colors.textSecondary,
    backgroundColor: colors.surfaceSecondary,
  },
  translationVariantBadgeCasual: {
    color: colors.background,
    backgroundColor: colors.accent,
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
  translationValue: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
  },
  translationValuePlaceholder: {
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
