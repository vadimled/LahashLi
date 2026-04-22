import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UITextView } from 'react-native-uitextview';
import { Header } from '../../shared/ui/Header';
import { ModeSelector } from '../../shared/ui/ModeSelector';
import { Screen } from '../../shared/ui/Screen';
import { TranslationCard } from '../../shared/ui/TranslationCard';
import { colors } from '../../theme/colors';
import { CONTENT_BOTTOM_PADDING, RECOGNIZED_SPEECH_CONTENT_HEIGHT, TranslationCopyKey } from '../../utils/constants.ts';
import { texts } from '../../utils/texts';
import { useHomeScreenLogic } from '../../shared/hooks/useHomeScreenLogic';

export function HomeScreen(): React.JSX.Element {
  const {
    selectedMode,
    setSelectedMode,
    recordButtonStatus,
    isListening,
    isProcessing,
    isSpeaking,
    isSoundEnabled,
    displayedErrorMessage,
    copiedKey,
    recognizedSpeechLabel,
    recognizedSpeechValue,
    isRecognizedSpeechEmpty,
    leadingText,
    highlightedText,
    translationEn,
    translationHe,
    translationRu,
    shouldShowEnglish,
    shouldShowHebrew,
    shouldShowRussian,
    contentScrollRef,
    recognizedSpeechScrollRef,
    handleRecognizedSpeechContentSizeChange,
    handleTranslationsSectionLayout,
    onPressRecordButton,
    onPressSoundButton,
    handleCopy,
  } = useHomeScreenLogic();

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

        {shouldShowEnglish || shouldShowHebrew || shouldShowRussian ? (
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

            {shouldShowRussian ? (
              <>
                <TranslationCard
                  languageLabel={texts.home.languageLabels.russian}
                  variantLabel={texts.home.translationVariants.formal}
                  value={translationRu?.formal}
                  placeholder={texts.home.translationPlaceholders.russianFormal}
                  onCopy={() => {
                    handleCopy(TranslationCopyKey.RussianFormal, translationRu?.formal);
                  }}
                  isCopied={copiedKey === TranslationCopyKey.RussianFormal}
                  isCopyDisabled={!translationRu?.formal}
                />

                <TranslationCard
                  languageLabel={texts.home.languageLabels.russian}
                  variantLabel={texts.home.translationVariants.casual}
                  value={translationRu?.casual}
                  placeholder={texts.home.translationPlaceholders.russianCasual}
                  onCopy={() => {
                    handleCopy(TranslationCopyKey.RussianCasual, translationRu?.casual);
                  }}
                  isCopied={copiedKey === TranslationCopyKey.RussianCasual}
                  isCopyDisabled={!translationRu?.casual}
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
