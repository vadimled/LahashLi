import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

type TranslationPreviewBlockProps = {
  label: string;
  value?: string;
};

export function TranslationPreviewBlock({
  label,
  value,
}: TranslationPreviewBlockProps) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.translationBlock}>
      <Text style={styles.translationLabel}>{label}</Text>
      <Text style={styles.resultTarget}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  translationBlock: {
    gap: 4,
  },
  translationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'uppercase',
  },
  resultTarget: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
