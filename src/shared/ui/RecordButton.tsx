import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../theme/colors';
import { uiConstants } from '../../utils/constants';
import {
  RecordButtonStatus,
  recordButtonTexts,
} from '../../utils/recordButton';

type RecordButtonProps = {
  status: RecordButtonStatus;
  onPress: () => void;
};

const { recordButtonSize } = uiConstants.homeScreen;

export function RecordButton({ status, onPress }: RecordButtonProps) {
  const isListening = status === 'listening';
  const isProcessing = status === 'processing';

  return (
    <Pressable
      onPress={onPress}
      disabled={isProcessing}
      style={({ pressed }) => [
        styles.button,
        isListening && styles.buttonListening,
        isProcessing && styles.buttonProcessing,
        pressed && !isProcessing && styles.buttonPressed,
      ]}
    >
      <Text style={styles.text}>{recordButtonTexts[status]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: recordButtonSize,
    height: recordButtonSize,
    borderRadius: recordButtonSize / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },
  buttonListening: {
    backgroundColor: colors.accent,
  },
  buttonProcessing: {
    backgroundColor: colors.surfaceSecondary,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
