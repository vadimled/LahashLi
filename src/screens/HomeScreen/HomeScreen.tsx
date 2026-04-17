import Speech from '@mhpdev/react-native-speech';
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
import {
  CONTENT_BOTTOM_PADDING,
  COPY_SUCCESS_TIMEOUT_MS,
  RECOGNIZED_SPEECH_CONTENT_HEIGHT,
  TRANSLATIONS_SCROLL_TOP_OFFSET,
  TranslationCopyKey,
} from '../../utils/constants.ts';
import { getHighlightedRecognizedSpeech } from '../../utils/helpers';
import { buildSpeechQueue, createSpeechSignature, speakSpeechQueue, stopSpeaking } from '../../utils/textToSpeech';
import { texts } from '../../utils/texts';
import { TranslationMode } from '../../utils/translationModes';

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

  const [copiedKey, setCopiedKey] = useState<TranslationCopyKey | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundErrorMessage, setSoundErrorMessage] = useState<string | undefined>(undefined);

  const contentScrollRef = useRef<ScrollView | null>(null);
  const recognizedSpeechScrollRef = useRef<ScrollView | null>(null);
  const translationsSectionYRef = useRef(0);
  const wasListeningRef = useRef(false);
  const copiedResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSpeechIdsRef = useRef<Set<string>>(new Set());
  const lastAutoSpokenSignatureRef = useRef('');

  const isListening = recordButtonStatus === 'listening';
  const isProcessing = recordButtonStatus === 'processing';

  const shouldShowEnglish = selectedMode === TranslationMode.RuToEn || selectedMode === TranslationMode.RuToEnHe;
  const shouldShowHebrew = selectedMode === TranslationMode.RuToHe || selectedMode === TranslationMode.RuToEnHe;

  const recognizedSpeechLabel = isListening
    ? texts.home.recognizedSpeech.liveLabel
    : texts.home.recognizedSpeech.finalLabel;

  const recognizedSpeechValue = isListening
    ? liveTranscript || texts.home.recognizedSpeech.emptyLive
    : transcript || texts.home.recognizedSpeech.emptyFinal;

  const isRecognizedSpeechEmpty = isListening ? !liveTranscript : !transcript;

  const { leadingText, highlightedText } = getHighlightedRecognizedSpeech(liveTranscript ?? '');

  const currentSpeechQueue = useMemo(() => {
    return buildSpeechQueue({
      selectedMode,
      translationEn,
      translationHe,
    });
  }, [selectedMode, translationEn, translationHe]);

  const currentSpeechSignature = useMemo(() => {
    return createSpeechSignature(currentSpeechQueue);
  }, [currentSpeechQueue]);

  const displayedErrorMessage = soundErrorMessage ?? errorMessage;

  const clearSpeechState = useCallback((): void => {
    activeSpeechIdsRef.current.clear();
    setIsSpeaking(false);
  }, []);

  const stopCurrentSpeech = useCallback(async (): Promise<void> => {
    clearSpeechState();

    try {
      await stopSpeaking();
    } catch (error) {
      console.error('stopSpeaking failed', error);
    }
  }, [clearSpeechState]);

  const speakCurrentTranslations = useCallback(async (): Promise<boolean> => {
    if (!currentSpeechQueue.length) {
      return false;
    }

    setSoundErrorMessage(undefined);

    try {
      await stopSpeaking();
      clearSpeechState();

      const utteranceIds = await speakSpeechQueue(currentSpeechQueue);
      activeSpeechIdsRef.current = new Set(utteranceIds);

      if (!utteranceIds.length) {
        setIsSpeaking(false);
        return false;
      }

      setIsSpeaking(true);
      return true;
    } catch (error) {
      clearSpeechState();
      setSoundErrorMessage(texts.home.soundButton.error.playbackFailed);
      console.error('speakCurrentTranslations failed', error);
      return false;
    }
  }, [clearSpeechState, currentSpeechQueue]);

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
    const run = async (): Promise<void> => {
      setSoundErrorMessage(undefined);

      if (isSpeaking) {
        await stopCurrentSpeech();
      }

      await handleRecordButtonPress();
    };

    run().catch(error => {
      console.error('handleRecordButtonPress failed', error);
    });
  }, [handleRecordButtonPress, isSpeaking, stopCurrentSpeech]);

  const onPressSoundButton = useCallback((): void => {
    const run = async (): Promise<void> => {
      setSoundErrorMessage(undefined);

      if (isSpeaking) {
        await stopCurrentSpeech();
        return;
      }

      if (!isSoundEnabled) {
        setIsSoundEnabled(true);

        if (currentSpeechSignature) {
          lastAutoSpokenSignatureRef.current = currentSpeechSignature;
          await speakCurrentTranslations();
        }

        return;
      }

      setIsSoundEnabled(false);
      await stopCurrentSpeech();
    };

    run().catch(error => {
      console.error('onPressSoundButton failed', error);
    });
  }, [currentSpeechSignature, isSoundEnabled, isSpeaking, speakCurrentTranslations, stopCurrentSpeech]);

  const handleCopy = useCallback((key: TranslationCopyKey, value?: string): void => {
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
    const startSubscription = Speech.onStart(({ id }) => {
      if (activeSpeechIdsRef.current.has(id)) {
        setIsSpeaking(true);
      }
    });

    const finishSubscription = Speech.onFinish(({ id }) => {
      if (!activeSpeechIdsRef.current.has(id)) {
        return;
      }

      activeSpeechIdsRef.current.delete(id);

      if (activeSpeechIdsRef.current.size === 0) {
        setIsSpeaking(false);
      }
    });

    const stoppedSubscription = Speech.onStopped(({ id }) => {
      if (activeSpeechIdsRef.current.has(id)) {
        activeSpeechIdsRef.current.delete(id);
      }

      if (activeSpeechIdsRef.current.size === 0) {
        setIsSpeaking(false);
      }
    });

    const errorSubscription = Speech.onError(({ id }) => {
      if (activeSpeechIdsRef.current.has(id)) {
        activeSpeechIdsRef.current.delete(id);
      }

      if (activeSpeechIdsRef.current.size === 0) {
        setIsSpeaking(false);
      }

      setSoundErrorMessage(texts.home.soundButton.error.playbackFailed);
    });

    return () => {
      startSubscription.remove();
      finishSubscription.remove();
      stoppedSubscription.remove();
      errorSubscription.remove();
    };
  }, []);

  useEffect(() => {
    setCopiedKey(null);
    setSoundErrorMessage(undefined);
    lastAutoSpokenSignatureRef.current = '';

    if (copiedResetTimeoutRef.current) {
      clearTimeout(copiedResetTimeoutRef.current);
    }

    stopCurrentSpeech().catch(error => {
      console.error('stopCurrentSpeech on mode change failed', error);
    });
  }, [selectedMode, stopCurrentSpeech]);

  useEffect(() => {
    if (!isSoundEnabled) {
      return;
    }

    if (isProcessing) {
      return;
    }

    if (!currentSpeechSignature) {
      return;
    }

    if (currentSpeechSignature === lastAutoSpokenSignatureRef.current) {
      return;
    }

    lastAutoSpokenSignatureRef.current = currentSpeechSignature;

    speakCurrentTranslations().catch(error => {
      console.error('auto speak failed', error);
    });
  }, [currentSpeechSignature, isProcessing, isSoundEnabled, speakCurrentTranslations]);

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

      stopCurrentSpeech().catch(error => {
        console.error('stopCurrentSpeech on unmount failed', error);
      });
    };
  }, [stopCurrentSpeech]);

  return (
    <Screen>
      <View style={styles.fixedTopSection}>
        <Header
          recordButtonStatus={recordButtonStatus}
          onPressRecordButton={onPressRecordButton}
          isSoundEnabled={isSoundEnabled}
          isSpeaking={isSpeaking}
          onPressSoundButton={onPressSoundButton}
        />

        <ModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />

        <View style={styles.hintRow}>
          {isProcessing ? <ActivityIndicator size="small" color={colors.textSecondary} style={styles.spinner} /> : null}
          <Text style={styles.hint}>{texts.home.recordButton.hint[recordButtonStatus]}</Text>
        </View>

        {displayedErrorMessage ? <Text style={styles.errorText}>{displayedErrorMessage}</Text> : null}
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
                    handleCopy(TranslationCopyKey.EnglishFormal, translationEn?.formal);
                  }}
                  isCopied={copiedKey === TranslationCopyKey.EnglishFormal}
                  isCopyDisabled={!translationEn?.formal}
                />

                <TranslationCard
                  languageLabel={texts.home.languageLabels.english}
                  variantLabel={texts.home.translationVariants.casual}
                  value={translationEn?.casual}
                  placeholder={texts.home.translationPlaceholders.englishCasual}
                  onCopy={() => {
                    handleCopy(TranslationCopyKey.EnglishCasual, translationEn?.casual);
                  }}
                  isCopied={copiedKey === TranslationCopyKey.EnglishCasual}
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
                    handleCopy(TranslationCopyKey.HebrewFormal, translationHe?.formal);
                  }}
                  isCopied={copiedKey === TranslationCopyKey.HebrewFormal}
                  isCopyDisabled={!translationHe?.formal}
                />

                <TranslationCard
                  languageLabel={texts.home.languageLabels.hebrew}
                  variantLabel={texts.home.translationVariants.casual}
                  value={translationHe?.casual}
                  placeholder={texts.home.translationPlaceholders.hebrewCasual}
                  isRtl
                  onCopy={() => {
                    handleCopy(TranslationCopyKey.HebrewCasual, translationHe?.casual);
                  }}
                  isCopied={copiedKey === TranslationCopyKey.HebrewCasual}
                  isCopyDisabled={!translationHe?.casual}
                />
              </>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fixedTopSection: {
    gap: 18,
    paddingBottom: 12,
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
    minHeight: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.textSecondary,
    flexShrink: 1,
  },
  errorText: {
    marginTop: 2,
    paddingHorizontal: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.danger,
  },
  recognizedSpeechCard: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
    gap: 12,
    marginBottom: 14,
  },
  recognizedSpeechTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recognizedSpeechBlock: {
    gap: 8,
  },
  recognizedSpeechLabel: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  recognizedSpeechLabelActive: {
    color: colors.accent,
  },
  recognizedSpeechLabelFinal: {
    color: colors.textSecondary,
  },
  recognizedSpeechContentFrame: {
    height: RECOGNIZED_SPEECH_CONTENT_HEIGHT,
    borderRadius: 16,
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
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 14,
    gap: 14,
  },
  translationsSectionTitle: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
