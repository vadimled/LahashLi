import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../theme/colors';
import { texts } from '../../utils/texts';

type SoundButtonProps = {
  isEnabled: boolean;
  isSpeaking: boolean;
  onPress: () => void;
};

export function SoundButton({ isEnabled, isSpeaking, onPress }: SoundButtonProps): React.JSX.Element {
  const label = isSpeaking
    ? texts.home.soundButton.text.stop
    : isEnabled
    ? texts.home.soundButton.text.enabled
    : texts.home.soundButton.text.idle;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isEnabled && styles.buttonEnabled,
        isSpeaking && styles.buttonSpeaking,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    minWidth: 108,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEnabled: {
    backgroundColor: colors.surfaceSecondary,
    borderColor: colors.border,
  },
  buttonSpeaking: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
