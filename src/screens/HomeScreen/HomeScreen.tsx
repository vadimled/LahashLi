import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useVoiceFlow } from '../../shared/hooks/useVoiceFlow';
import { useTranslationMode } from '../../shared/hooks/useTranslationMode';
import { ModeSelector } from '../../shared/ui/ModeSelector';
import { RecordButton } from '../../shared/ui/RecordButton';
import { Screen } from '../../shared/ui/Screen';
import { TranslationPreviewBlock } from '../../shared/ui/TranslationPreviewBlock';
import { colors } from '../../theme/colors';
import { getHomeScreenPreviewState } from '../../utils/helpers';
import { texts } from '../../utils/texts';

export function HomeScreen(): React.JSX.Element {
  const { selectedMode, setSelectedMode } = useTranslationMode();
  const {
    recordButtonStatus,
    transcript,
    translationEn,
    translationHe,
    errorMessage,
    handleRecordButtonPress,
  } = useVoiceFlow(selectedMode);

  const { previewContent, shouldShowEnglish, shouldShowHebrew, isProcessing, hasResolvedContent } =
    getHomeScreenPreviewState({
      selectedMode,
      recordButtonStatus,
      transcript,
      translationEn,
      translationHe,
    });

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{texts.app.name}</Text>
        <Text style={styles.subtitle}>{texts.app.subtitle}</Text>
      </View>

      <ModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />

      <View style={styles.center}>
        <RecordButton status={recordButtonStatus} onPress={handleRecordButtonPress} />

        <View style={styles.hintRow}>
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.accent} style={styles.spinner} />
          ) : null}

          <Text style={styles.hint}>{texts.home.recordButton.hint[recordButtonStatus]}</Text>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>{texts.home.previewLabel}</Text>

        <Text style={[styles.resultSource, !hasResolvedContent && styles.resultSourcePlaceholder]}>
          {previewContent.source}
        </Text>

        {shouldShowEnglish ? (
          <TranslationPreviewBlock
            label={texts.home.previewEnglishLabel}
            value={previewContent.targetEn}
          />
        ) : null}

        {shouldShowHebrew ? (
          <TranslationPreviewBlock
            label={texts.home.previewHebrewLabel}
            value={previewContent.targetHe}
            isRtl
          />
        ) : null}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintRow: {
    minHeight: 24,
    marginTop: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  hint: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: colors.textSecondary,
    flexShrink: 1,
  },
  errorText: {
    marginTop: 12,
    paddingHorizontal: 24,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.danger,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 12,
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
  resultSourcePlaceholder: {
    color: colors.textMuted,
  },
});
