import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../theme/colors';
import { RecordButtonStatus } from '../../utils/recordButton';
import { texts } from '../../utils/texts';

type RecordButtonProps = {
  status: RecordButtonStatus;
  onPress: () => void;
};

export function RecordButton({ status, onPress }: RecordButtonProps): React.JSX.Element {
  const isListening = status === 'listening';
  const isProcessing = status === 'processing';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={texts.home.recordButton.text[status]}
      disabled={isProcessing}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isListening && styles.buttonListening,
        isProcessing && styles.buttonProcessing,
        pressed && !isProcessing && styles.buttonPressed,
      ]}
    >
      <Text style={styles.text}>{texts.home.recordButton.text[status]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 76,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },
  buttonListening: {
    backgroundColor: colors.accent,
  },
  buttonProcessing: {
    backgroundColor: colors.surfaceSecondary,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.985 }],
  },
  text: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
