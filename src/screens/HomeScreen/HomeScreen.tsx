import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { UITextView } from 'react-native-uitextview';

import { useTranslationMode } from '../../shared/hooks/useTranslationMode';
import { useVoiceFlow } from '../../shared/hooks/useVoiceFlow';
import { ModeSelector } from '../../shared/ui/ModeSelector';
import { RecordButton } from '../../shared/ui/RecordButton';
import { Screen } from '../../shared/ui/Screen';
import { colors } from '../../theme/colors';
import { getHighlightedRecognizedSpeech } from '../../utils/helpers';
import { texts } from '../../utils/texts';

const RECOGNIZED_SPEECH_CONTENT_HEIGHT = 116;
const TRANSLATIONS_SCROLL_TOP_OFFSET = 12;
const CONTENT_BOTTOM_PADDING = 32;
const COPY_SUCCESS_TIMEOUT_MS = 1500;

type TranslationCardProps = {
  languageLabel: string;
  variantLabel: string;
  value?: string;
  placeholder: string;
  isRtl?: boolean;
  variant: 'formal' | 'casual';
  onCopy: () => void;
  isCopied: boolean;
  isCopyDisabled: boolean;
};

function TranslationCard({
                           languageLabel,
                           variantLabel,
                           value,
                           placeholder,
                           isRtl = false,
                           variant,
                           onCopy,
                           isCopied,
                           isCopyDisabled,
                         }: TranslationCardProps): React.JSX.Element {
  const isEmpty = !value;

  return (
    <View
      style={[
        styles.translationCard,
        variant === 'formal'
          ? styles.translationCardFormal
          : styles.translationCardCasual,
      ]}
    >
      <View style={styles.translationCardHeader}>
        <View style={styles.translationCardHeaderLeft}>
          <Text style={styles.translationLanguageLabel}>{languageLabel}</Text>
          <Text
            style={[
              styles.translationVariantBadge,
              variant === 'formal'
                ? styles.translationVariantBadgeFormal
                : styles.translationVariantBadgeCasual,
            ]}
          >
            {variantLabel}
          </Text>
        </View>

        <Pressable
          onPress={onCopy}
          disabled={isCopyDisabled}
          style={({ pressed }) => [
            styles.copyButton,
            isCopied && styles.copyButtonSuccess,
            isCopyDisabled && styles.copyButtonDisabled,
            pressed && !isCopyDisabled && styles.copyButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.copyButtonText,
              isCopied && styles.copyButtonTextSuccess,
              isCopyDisabled && styles.copyButtonTextDisabled,
            ]}
          >
            {isCopied
              ? texts.home.copyButton.success
              : texts.home.copyButton.idle}
          </Text>
        </Pressable>
      </View>

      {isEmpty ? (
        <Text
          style={[
            styles.translationValue,
            styles.translationValuePlaceholder,
            isRtl ? styles.translationValueRtl : styles.translationValueLtr,
          ]}
        >
          {placeholder}
        </Text>
      ) : (
        <UITextView
          selectable
          uiTextView
          style={[
            styles.translationValue,
            isRtl ? styles.translationValueRtl : styles.translationValueLtr,
          ]}
        >
          {value}
        </UITextView>
      )}
    </View>
  );
}

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
  const copiedResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const isListening = recordButtonStatus === 'listening';
  const isProcessing = recordButtonStatus === 'processing';

  const shouldShowEnglish =
    selectedMode === 'ruToEn' || selectedMode === 'ruToEnHe';
  const shouldShowHebrew =
    selectedMode === 'ruToHe' || selectedMode === 'ruToEnHe';

  const recognizedSpeechLabel = isListening
    ? texts.home.recognizedSpeech.liveLabel
    : texts.home.recognizedSpeech.finalLabel;

  const recognizedSpeechValue = isListening
    ? liveTranscript || texts.home.recognizedSpeech.emptyLive
    : transcript || texts.home.recognizedSpeech.emptyFinal;

  const isRecognizedSpeechEmpty = isListening ? !liveTranscript : !transcript;

  const { leadingText, highlightedText } = getHighlightedRecognizedSpeech(
    liveTranscript ?? '',
  );

  const handleRecognizedSpeechContentSizeChange = useCallback(() => {
    if (!isListening) {
      return;
    }

    recognizedSpeechScrollRef.current?.scrollToEnd({ animated: true });
  }, [isListening]);

  const handleTranslationsSectionLayout = useCallback(
    (event: LayoutChangeEvent) => {
      translationsSectionYRef.current = event.nativeEvent.layout.y;
    },
    [],
  );

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
          y: Math.max(
            0,
            translationsSectionYRef.current - TRANSLATIONS_SCROLL_TOP_OFFSET,
          ),
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
    return Boolean(
      translationEn?.formal ||
      translationEn?.casual ||
      translationHe?.formal ||
      translationHe?.casual,
    );
  }, [translationEn, translationHe]);

  return (
    <Screen>
      <View style={styles.fixedTopSection}>
        <View style={styles.header}>
          <Text style={styles.title}>{texts.app.name}</Text>
          <Text style={styles.subtitle}>{texts.app.subtitle}</Text>
        </View>

        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
        />
      </View>

      <ScrollView
        ref={contentScrollRef}
        style={styles.contentScroll}
        contentContainerStyle={styles.contentScrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.center}>
          <RecordButton
            status={recordButtonStatus}
            onPress={onPressRecordButton}
          />

          <View style={styles.hintRow}>
            {isProcessing ? (
              <ActivityIndicator
                size="small"
                color={colors.accent}
                style={styles.spinner}
              />
            ) : null}

            <Text style={styles.hint}>
              {texts.home.recordButton.hint[recordButtonStatus]}
            </Text>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={styles.recognizedSpeechCard}>
          <Text style={styles.recognizedSpeechTitle}>
            {texts.home.recognizedSpeech.title}
          </Text>

          <View style={styles.recognizedSpeechBlock}>
            <Text
              style={[
                styles.recognizedSpeechLabel,
                isListening
                  ? styles.recognizedSpeechLabelActive
                  : styles.recognizedSpeechLabelFinal,
              ]}
            >
              {recognizedSpeechLabel}
            </Text>

            <View style={styles.recognizedSpeechContentFrame}>
              <ScrollView
                ref={recognizedSpeechScrollRef}
                showsVerticalScrollIndicator={!isListening}
                onContentSizeChange={handleRecognizedSpeechContentSizeChange}
                contentContainerStyle={styles.recognizedSpeechScrollContent}
              >
                {isRecognizedSpeechEmpty ? (
                  <Text
                    style={[
                      styles.recognizedSpeechValue,
                      styles.recognizedSpeechValueEmpty,
                    ]}
                  >
                    {recognizedSpeechValue}
                  </Text>
                ) : isListening ? (
                  <Text style={styles.recognizedSpeechValue}>
                    {leadingText}
                    <Text style={styles.recognizedSpeechValueHighlighted}>
                      {highlightedText}
                    </Text>
                  </Text>
                ) : (
                  <UITextView
                    selectable
                    uiTextView
                    style={styles.recognizedSpeechValue}
                  >
                    {recognizedSpeechValue}
                  </UITextView>
                )}
              </ScrollView>
            </View>
          </View>
        </View>

        {shouldShowEnglish || shouldShowHebrew ? (
          <View
            style={styles.translationsSection}
            onLayout={handleTranslationsSectionLayout}
          >
            <Text style={styles.translationsSectionTitle}>
              {texts.home.translationsLabel}
            </Text>

            {shouldShowEnglish ? (
              <>
                <TranslationCard
                  languageLabel={texts.home.languageLabels.english}
                  variantLabel={texts.home.translationVariants.formal}
                  value={translationEn?.formal}
                  placeholder={texts.home.translationPlaceholders.englishFormal}
                  variant="formal"
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
                  variant="casual"
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
                  variant="formal"
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
                  variant="casual"
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
                  ? 'Formal and casual translations will appear here.'
                  : 'Translation variants will appear here.'}
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
  contentScroll: {
    flex: 1,
  },
  contentScrollContainer: {
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 24,
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
  translationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  translationCardFormal: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
  },
  translationCardCasual: {
    backgroundColor: 'rgba(35, 207, 200, 0.08)',
    borderColor: colors.accent,
  },
  translationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  translationCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  translationLanguageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  translationVariantBadge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  translationVariantBadgeFormal: {
    color: colors.textSecondary,
    backgroundColor: colors.surfaceSecondary,
  },
  translationVariantBadgeCasual: {
    color: colors.background,
    backgroundColor: colors.accent,
  },
  copyButton: {
    minWidth: 68,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonPressed: {
    opacity: 0.8,
  },
  copyButtonDisabled: {
    opacity: 0.45,
  },
  copyButtonSuccess: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(35, 207, 200, 0.14)',
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  copyButtonTextDisabled: {
    color: colors.textMuted,
  },
  copyButtonTextSuccess: {
    color: colors.accent,
  },
  translationValue: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
  },
  translationValuePlaceholder: {
    color: colors.textMuted,
  },
  translationValueLtr: {
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  translationValueRtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  translationsHint: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});