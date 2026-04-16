import { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { texts } from '../../utils/texts.ts';
import { UITextView } from 'react-native-uitextview';
import { colors } from '../../theme/colors.ts';

type TranslationCardProps = {
  languageLabel: string;
  variantLabel: string;
  value?: string;
  placeholder: string;
  isRtl?: boolean;
  variant: 'formal' | 'casual';
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
  variant,
  onCopy,
  isCopied,
  isCopyDisabled,
}: TranslationCardProps): JSX.Element {
  const isEmpty = !value;

  return (
    <View
      style={[
        styles.translationCard,
        variant === 'formal' ? styles.translationCardFormal : styles.translationCardCasual,
      ]}
    >
      <View style={styles.translationCardHeader}>
        <View style={styles.translationCardHeaderLeft}>
          <Text style={styles.translationLanguageLabel}>{languageLabel}</Text>
          <Text
            style={[
              styles.translationVariantBadge,
              variant === 'formal' ? styles.translationVariantBadgeFormal : styles.translationVariantBadgeCasual,
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  translationCardFormal: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
  },
  translationCardCasual: {
    backgroundColor: 'rgba(35, 207, 200, 0.08)',
    borderColor: colors.accent,
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
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  translationVariantBadge: {
    fontSize: 11,
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
    minWidth: 68,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonPressed: {
    opacity: 0.8,
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
    fontSize: 18,
    lineHeight: 26,
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
