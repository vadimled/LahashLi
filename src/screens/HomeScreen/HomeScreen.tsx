import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useVoiceFlow } from '../../shared/hooks/useVoiceFlow';
import { useTranslationMode } from '../../shared/hooks/useTranslationMode';
import { ModeSelector } from '../../shared/ui/ModeSelector';
import { RecordButton } from '../../shared/ui/RecordButton';
import { Screen } from '../../shared/ui/Screen';
import { TranslationPreviewBlock } from '../../shared/ui/TranslationPreviewBlock';
import { colors } from '../../theme/colors';
import { getHomeScreenPreviewState } from '../../utils/helpers';
import { texts } from '../../utils/texts';

const RECOGNIZED_SPEECH_CONTENT_HEIGHT = 116;

export function HomeScreen(): React.JSX.Element {
  const { selectedMode, setSelectedMode } = useTranslationMode();
  const {
    recordButtonStatus,
    transcript,
    liveTranscript,
    translationEn,
    translationHe,
    errorMessage,
    handleRecordButtonPress,
  } = useVoiceFlow();

  const recognizedSpeechScrollRef = useRef<ScrollView | null>(null);
  const wasListeningRef = useRef(false);

  const {
    previewContent,
    shouldShowEnglish,
    shouldShowHebrew,
    isListening,
    isProcessing,
    hasResolvedContent,
  } = getHomeScreenPreviewState({
    selectedMode,
    recordButtonStatus,
    transcript,
    translationEn,
    translationHe,
  });

  const recognizedSpeechLabel = isListening
    ? texts.home.recognizedSpeech.liveLabel
    : texts.home.recognizedSpeech.finalLabel;

  const recognizedSpeechValue = isListening
    ? liveTranscript || texts.home.recognizedSpeech.emptyLive
    : transcript || texts.home.recognizedSpeech.emptyFinal;

  const isRecognizedSpeechEmpty = isListening ? !liveTranscript : !transcript;

  const handleRecognizedSpeechContentSizeChange = useCallback(() => {
    if (!isListening) {
      return;
    }

    recognizedSpeechScrollRef.current?.scrollToEnd({ animated: true });
  }, [isListening]);

  useEffect(() => {
    const hasSwitchedFromLiveToFinal = wasListeningRef.current && !isListening;

    if (hasSwitchedFromLiveToFinal) {
      requestAnimationFrame(() => {
        recognizedSpeechScrollRef.current?.scrollTo({
          y: 0,
          animated: false,
        });
      });
    }

    wasListeningRef.current = isListening;
  }, [isListening, recognizedSpeechValue]);

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

      <View style={styles.recognizedSpeechCard}>
        <Text style={styles.recognizedSpeechTitle}>{texts.home.recognizedSpeech.title}</Text>

        <View style={styles.recognizedSpeechBlock}>
          <Text
            style={[
              styles.recognizedSpeechLabel,
              isListening ? styles.recognizedSpeechLabelActive : styles.recognizedSpeechLabelFinal,
            ]}
          >
            {recognizedSpeechLabel}
          </Text>

          <View style={styles.recognizedSpeechContentFrame}>
            <ScrollView
              ref={recognizedSpeechScrollRef}
              showsVerticalScrollIndicator
              nestedScrollEnabled
              onContentSizeChange={handleRecognizedSpeechContentSizeChange}
              contentContainerStyle={styles.recognizedSpeechScrollContent}
            >
              <Text
                style={[
                  styles.recognizedSpeechValue,
                  isRecognizedSpeechEmpty && styles.recognizedSpeechValueEmpty,
                ]}
              >
                {recognizedSpeechValue}
              </Text>
            </ScrollView>
          </View>
        </View>
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
  recognizedSpeechCard: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  recognizedSpeechTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recognizedSpeechBlock: {
    gap: 8,
  },
  recognizedSpeechLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  recognizedSpeechLabelActive: {
    color: colors.accent,
  },
  recognizedSpeechLabelFinal: {
    color: colors.textSecondary,
  },
  recognizedSpeechContentFrame: {
    height: RECOGNIZED_SPEECH_CONTENT_HEIGHT,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  recognizedSpeechScrollContent: {
    padding: 12,
  },
  recognizedSpeechValue: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  recognizedSpeechValueEmpty: {
    color: colors.textMuted,
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
