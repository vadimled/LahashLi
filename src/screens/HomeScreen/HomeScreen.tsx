import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UITextView } from 'react-native-uitextview';

import { useTranslationMode } from '../../shared/hooks/useTranslationMode';
import { useVoiceFlow } from '../../shared/hooks/useVoiceFlow';
import { Header } from '../../shared/ui/Header';
import { ModeSelector } from '../../shared/ui/ModeSelector';
import { Screen } from '../../shared/ui/Screen';
import { TranslationCard } from '../../shared/ui/TranslationCard';
import { colors } from '../../theme/colors';
import { getHighlightedRecognizedSpeech } from '../../utils/helpers';
import { texts } from '../../utils/texts';

const RECOGNIZED_SPEECH_CONTENT_HEIGHT = 116;
const TRANSLATIONS_SCROLL_TOP_OFFSET = 12;
const CONTENT_BOTTOM_PADDING = 32;
const COPY_SUCCESS_TIMEOUT_MS = 1500;

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
  } = useVoiceFlow(selectedMode);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const contentScrollRef = useRef<ScrollView | null>(null);
  const recognizedSpeechScrollRef = useRef<ScrollView | null>(null);
  const translationsSectionYRef = useRef(0);
  const wasListeningRef = useRef(false);
  const copiedResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isListening = recordButtonStatus === 'listening';
  const isProcessing = recordButtonStatus === 'processing';

  const shouldShowEnglish = selectedMode === 'ruToEn' || selectedMode === 'ruToEnHe';
  const shouldShowHebrew = selectedMode === 'ruToHe' || selectedMode === 'ruToEnHe';

  const recognizedSpeechLabel = isListening
    ? texts.home.recognizedSpeech.liveLabel
    : texts.home.recognizedSpeech.finalLabel;

  const recognizedSpeechValue = isListening
    ? liveTranscript || texts.home.recognizedSpeech.emptyLive
    : transcript || texts.home.recognizedSpeech.emptyFinal;

  const isRecognizedSpeechEmpty = isListening ? !liveTranscript : !transcript;

  const { leadingText, highlightedText } = getHighlightedRecognizedSpeech(liveTranscript ?? '');

  const handleRecognizedSpeechContentSizeChange = useCallback((): void => {
    if (!isListening) {
      return;
    }

    recognizedSpeechScrollRef.current?.scrollToEnd({ animated: true });
  }, [isListening]);

  const handleTranslationsSectionLayout = useCallback((event: LayoutChangeEvent): void => {
    translationsSectionYRef.current = event.nativeEvent.layout.y;
  }, []);

  const onPressRecordButton = useCallback((): void => {
    handleRecordButtonPress().catch(error => {
      console.error('handleRecordButtonPress failed', error);
    });
  }, [handleRecordButtonPress]);

  const handleCopy = useCallback((key: string, value?: string): void => {
    if (!value) {
      return;
    }

    Clipboard.setString(value);
    setCopiedKey(key);

    if (copiedResetTimeoutRef.current) {
      clearTimeout(copiedResetTimeoutRef.current);
    }

    copiedResetTimeoutRef.current = setTimeout(() => {
      setCopiedKey(currentKey => (currentKey === key ? null : currentKey));
    }, COPY_SUCCESS_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    const hasSwitchedFromLiveToFinal = wasListeningRef.current && !isListening;

    if (hasSwitchedFromLiveToFinal) {
      requestAnimationFrame(() => {
        recognizedSpeechScrollRef.current?.scrollTo({
          y: 0,
          animated: false,
        });

        contentScrollRef.current?.scrollTo({
          y: Math.max(0, translationsSectionYRef.current - TRANSLATIONS_SCROLL_TOP_OFFSET),
          animated: true,
        });
      });
    }

    wasListeningRef.current = isListening;
  }, [isListening, recognizedSpeechValue]);

  useEffect(() => {
    return () => {
      if (copiedResetTimeoutRef.current) {
        clearTimeout(copiedResetTimeoutRef.current);
      }
    };
  }, []);

  const hasAnyTranslation = useMemo(() => {
    return Boolean(translationEn?.formal || translationEn?.casual || translationHe?.formal || translationHe?.casual);
  }, [translationEn, translationHe]);

  return (
    <Screen>
      <View style={styles.fixedTopSection}>
        <Header recordButtonStatus={recordButtonStatus} onPressRecordButton={onPressRecordButton} />

        <ModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />

        <View style={styles.hintRow}>
          {isProcessing ? <ActivityIndicator size="small" color={colors.textSecondary} style={styles.spinner} /> : null}

          <Text style={styles.hint}>{texts.home.recordButton.hint[recordButtonStatus]}</Text>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>

      <ScrollView
        ref={contentScrollRef}
        style={styles.contentScroll}
        contentContainerStyle={styles.contentScrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
                contentContainerStyle={styles.recognizedSpeechScrollContent}
                onContentSizeChange={handleRecognizedSpeechContentSizeChange}
                showsVerticalScrollIndicator={false}
              >
                {isRecognizedSpeechEmpty ? (
                  <Text style={[styles.recognizedSpeechValue, styles.recognizedSpeechValueEmpty]}>
                    {recognizedSpeechValue}
                  </Text>
                ) : isListening ? (
                  <UITextView style={styles.recognizedSpeechValue}>
                    <Text style={styles.recognizedSpeechValue}>{leadingText}</Text>
                    <Text style={[styles.recognizedSpeechValue, styles.recognizedSpeechValueHighlighted]}>
                      {highlightedText}
                    </Text>
                  </UITextView>
                ) : (
                  <UITextView style={styles.recognizedSpeechValue}>{recognizedSpeechValue}</UITextView>
                )}
              </ScrollView>
            </View>
          </View>
        </View>

        {shouldShowEnglish || shouldShowHebrew ? (
          <View style={styles.translationsSection} onLayout={handleTranslationsSectionLayout}>
            <Text style={styles.translationsSectionTitle}>{texts.home.translationsLabel}</Text>

            {shouldShowEnglish ? (
              <>
                <TranslationCard
                  languageLabel={texts.home.languageLabels.english}
                  variantLabel={texts.home.translationVariants.formal}
                  value={translationEn?.formal}
                  placeholder={texts.home.translationPlaceholders.englishFormal}
                  onCopy={() => {
                    handleCopy('english-formal', translationEn?.formal);
                  }}
                  isCopied={copiedKey === 'english-formal'}
                  isCopyDisabled={!translationEn?.formal}
                />

                <TranslationCard
                  languageLabel={texts.home.languageLabels.english}
                  variantLabel={texts.home.translationVariants.casual}
                  value={translationEn?.casual}
                  placeholder={texts.home.translationPlaceholders.englishCasual}
                  onCopy={() => {
                    handleCopy('english-casual', translationEn?.casual);
                  }}
                  isCopied={copiedKey === 'english-casual'}
                  isCopyDisabled={!translationEn?.casual}
                />
              </>
            ) : null}

            {shouldShowHebrew ? (
              <>
                <TranslationCard
                  languageLabel={texts.home.languageLabels.hebrew}
                  variantLabel={texts.home.translationVariants.formal}
                  value={translationHe?.formal}
                  placeholder={texts.home.translationPlaceholders.hebrewFormal}
                  isRtl
                  onCopy={() => {
                    handleCopy('hebrew-formal', translationHe?.formal);
                  }}
                  isCopied={copiedKey === 'hebrew-formal'}
                  isCopyDisabled={!translationHe?.formal}
                />

                <TranslationCard
                  languageLabel={texts.home.languageLabels.hebrew}
                  variantLabel={texts.home.translationVariants.casual}
                  value={translationHe?.casual}
                  placeholder={texts.home.translationPlaceholders.hebrewCasual}
                  isRtl
                  onCopy={() => {
                    handleCopy('hebrew-casual', translationHe?.casual);
                  }}
                  isCopied={copiedKey === 'hebrew-casual'}
                  isCopyDisabled={!translationHe?.casual}
                />
              </>
            ) : null}

            {!hasAnyTranslation && !isProcessing ? (
              <Text style={styles.translationsHint}>
                {shouldShowEnglish && shouldShowHebrew
                  ? texts.home.translationPlaceholders.bilingualHint
                  : texts.home.translationPlaceholders.singleLanguageHint}
              </Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fixedTopSection: {
    gap: 24,
    paddingBottom: 16,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  contentScroll: {
    flex: 1,
  },
  contentScrollContainer: {
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },
  hintRow: {
    minHeight: 24,
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
    padding: 0,
    margin: 0,
  },
  recognizedSpeechValueHighlighted: {
    color: colors.accent,
    fontWeight: '600',
  },
  recognizedSpeechValueEmpty: {
    color: colors.textMuted,
  },
  translationsSection: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  translationsSectionTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  translationsHint: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});
