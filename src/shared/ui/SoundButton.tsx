import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { texts } from '../../utils/texts';

type SoundButtonProps = {
  isEnabled: boolean;
  isSpeaking: boolean;
  onPress: () => void;
};

export function SoundButton({ isEnabled, isSpeaking, onPress }: SoundButtonProps): React.JSX.Element {
  const stateLabel = isSpeaking
    ? texts.home.soundButton.state.stop
    : isEnabled
    ? texts.home.soundButton.state.on
    : texts.home.soundButton.state.off;

  const accessibilityLabel = `${texts.home.soundButton.text.idle} ${stateLabel}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isEnabled && styles.buttonEnabled,
        isSpeaking && styles.buttonSpeaking,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.label, isSpeaking && styles.labelSpeaking]}>
          {texts.home.soundButton.text.idle}
        </Text>

        <View style={[styles.statePill, isEnabled && styles.statePillEnabled, isSpeaking && styles.statePillSpeaking]}>
          <Text
            style={[styles.stateText, isEnabled && styles.stateTextEnabled, isSpeaking && styles.stateTextSpeaking]}
          >
            {stateLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 38,
    marginTop: 8,
    paddingHorizontal: 12,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
  },
  buttonEnabled: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSlight,
  },
  buttonSpeaking: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSpeaking,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.995 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  labelSpeaking: {
    color: colors.accent,
  },
  statePill: {
    minWidth: 46,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statePillEnabled: {
    backgroundColor: colors.accentSoft,
  },
  statePillSpeaking: {
    backgroundColor: colors.accent,
  },
  stateText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  stateTextEnabled: {
    color: colors.accent,
  },
  stateTextSpeaking: {
    color: colors.background,
  },
});
