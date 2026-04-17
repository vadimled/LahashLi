import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { TranslationMode, translationModeOptions } from '../../utils/translationModes';

type ModeSelectorProps = {
  selectedMode: TranslationMode;
  onSelectMode: (mode: TranslationMode) => void;
};

export function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps): React.JSX.Element {
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
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },
  optionPressed: {
    opacity: 0.88,
  },
  optionText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.textPrimary,
  },
});
