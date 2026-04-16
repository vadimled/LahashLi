import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import {
  TranslationMode,
  translationModeOptions,
} from '../../utils/translationModes';

type ModeSelectorProps = {
  selectedMode: TranslationMode;
  onSelectMode: (mode: TranslationMode) => void;
};

export function ModeSelector({
  selectedMode,
  onSelectMode,
}: ModeSelectorProps) {
  return (
    <View style={styles.container}>
      {translationModeOptions.map(option => {
        const isSelected = option.id === selectedMode;

        return (
          <Pressable
            key={option.id}
            onPress={() => onSelectMode(option.id)}
            style={({ pressed }) => [
              styles.option,
              isSelected && styles.optionSelected,
              pressed && styles.optionPressed,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 6,
    gap: 6,
  },
  option: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: colors.primary,
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.textPrimary,
  },
});
