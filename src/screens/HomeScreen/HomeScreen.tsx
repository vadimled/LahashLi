import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../shared/ui/Screen';
import { colors } from '../../theme/colors';
import { uiConstants } from '../../utils/constants';
import { texts } from '../../utils/texts';

const { recordButtonSize } = uiConstants.homeScreen;

export function HomeScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{texts.app.name}</Text>
        <Text style={styles.subtitle}>{texts.app.subtitle}</Text>
      </View>

      <View style={styles.modeCard}>
        <Text style={styles.modeLabel}>{texts.home.modeLabel}</Text>
        <Text style={styles.modeValue}>{texts.home.modeValue}</Text>
      </View>

      <View style={styles.center}>
        <Pressable
          style={({ pressed }) => [
            styles.recordButton,
            pressed && styles.recordButtonPressed,
          ]}
        >
          <Text style={styles.recordButtonText}>{texts.home.speakButton}</Text>
        </Pressable>

        <Text style={styles.hint}>{texts.home.hint}</Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>{texts.home.previewLabel}</Text>
        <Text style={styles.resultSource}>{texts.home.previewSource}</Text>
        <Text style={styles.resultTarget}>{texts.home.previewTarget}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modeCard: {
    marginTop: 24,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
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
  recordButtonPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.98 }],
  },
  recordButtonText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  hint: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: 24,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  resultLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  resultSource: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  resultTarget: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
