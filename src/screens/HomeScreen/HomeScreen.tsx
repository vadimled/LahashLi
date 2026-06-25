import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { UITextView } from 'react-native-uitextview';
import { Header } from '../../shared/ui/Header';
import { ModeSelector } from '../../shared/ui/ModeSelector';
import { Screen } from '../../shared/ui/Screen';
import { TranslationCard } from '../../shared/ui/TranslationCard';
import { colors } from '../../theme/colors';
import { CONTENT_BOTTOM_PADDING, RECOGNIZED_SPEECH_CONTENT_HEIGHT, TranslationCopyKey } from '../../utils/constants';
import { ENGLISH_LANGUAGE, HEBREW_LANGUAGE, RUSSIAN_LANGUAGE } from '../../utils/textToSpeech';
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
    speakingText,
    speakingLanguage,
    displayedErrorMessage,
    copiedKey,
    recognizedSpeechTitle,
    recognizedSpeechLabel,
    recognizedSpeechValue,
    recognizedSpeechPlaceholder,
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
    handlePlaySingleSound,
    handleTranscriptChange,
    handleTranslate,
    handleClearAll,
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
          <View style={styles.recognizedSpeechTitleRow}>
            <Text style={styles.recognizedSpeechTitle}>{recognizedSpeechTitle}</Text>
          </View>

          <View style={styles.recognizedSpeechHeader}>
            <View style={styles.clearButtonContainer} pointerEvents="box-none">
              {!isRecognizedSpeechEmpty && (
                <Pressable
                  onPress={handleClearAll}
                  style={({ pressed }) => [styles.clearButton, pressed && styles.clearButtonPressed]}
                >
                  <Text style={styles.clearButtonText}>{texts.home.clearAllButton}</Text>
                </Pressable>
              )}
            </View>

            <Text
              style={[
                styles.recognizedSpeechLabel,
                isListening ? styles.recognizedSpeechLabelActive : styles.recognizedSpeechLabelFinal,
              ]}
            >
              {recognizedSpeechLabel}
            </Text>

            <View style={styles.recognizedSpeechHeaderActions}>
              <Pressable
                onPress={() => handleCopy(TranslationCopyKey.RecognizedSpeech, recognizedSpeechValue)}
                disabled={isRecognizedSpeechEmpty}
                style={({ pressed }) => [
                  styles.copyButton,
                  copiedKey === TranslationCopyKey.RecognizedSpeech && styles.copyButtonSuccess,
                  isRecognizedSpeechEmpty && styles.copyButtonDisabled,
                  pressed && !isRecognizedSpeechEmpty && styles.copyButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.copyButtonText,
                    copiedKey === TranslationCopyKey.RecognizedSpeech && styles.copyButtonTextSuccess,
                    isRecognizedSpeechEmpty && styles.copyButtonTextDisabled,
                  ]}
                >
                  {copiedKey === TranslationCopyKey.RecognizedSpeech
                    ? texts.home.recognizedSpeech.copyButton.success
                    : texts.home.recognizedSpeech.copyButton.idle}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.recognizedSpeechContentFrame}>
            <ScrollView
              ref={recognizedSpeechScrollRef}
              contentContainerStyle={styles.recognizedSpeechScrollContent}
              onContentSizeChange={handleRecognizedSpeechContentSizeChange}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {isListening ? (
                <UITextView style={styles.recognizedSpeechValue}>
                  {isRecognizedSpeechEmpty ? (
                    <Text style={[styles.recognizedSpeechValue, styles.recognizedSpeechValueEmpty]}>
                      {recognizedSpeechPlaceholder}
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.recognizedSpeechValue}>{leadingText}</Text>
                      <Text style={[styles.recognizedSpeechValue, styles.recognizedSpeechValueHighlighted]}>
                        {highlightedText}
                      </Text>
                    </>
                  )}
                </UITextView>
              ) : (
                <TextInput
                  style={[styles.recognizedSpeechValue, isRecognizedSpeechEmpty && styles.recognizedSpeechValueEmpty]}
                  editable={!isProcessing}
                  onChangeText={handleTranscriptChange}
                  multiline
                  scrollEnabled={false}
                  placeholder={recognizedSpeechPlaceholder}
                  placeholderTextColor={colors.textMuted}
                  value={recognizedSpeechValue}
                />
              )}
            </ScrollView>
          </View>

          {!isListening && !isRecognizedSpeechEmpty && recordButtonStatus === 'idle' && (
            <Pressable
              onPress={handleTranslate}
              style={({ pressed }) => [styles.translateButton, pressed && styles.translateButtonPressed]}
            >
              <Text style={styles.translateButtonText}>{texts.home.recognizedSpeech.translateButton}</Text>
            </Pressable>
          )}
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
                  onPlaySound={() => {
                    handlePlaySingleSound(translationEn?.formalTts || translationEn?.formal || '', ENGLISH_LANGUAGE);
                  }}
                  isPlaySoundDisabled={!translationEn?.formal}
                  isSpeaking={isSpeaking && (speakingText === translationEn?.formal || speakingText === translationEn?.formalTts) && speakingLanguage === ENGLISH_LANGUAGE}
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
                  onPlaySound={() => {
                    handlePlaySingleSound(translationEn?.casualTts || translationEn?.casual || '', ENGLISH_LANGUAGE);
                  }}
                  isPlaySoundDisabled={!translationEn?.casual}
                  isSpeaking={isSpeaking && (speakingText === translationEn?.casual || speakingText === translationEn?.casualTts) && speakingLanguage === ENGLISH_LANGUAGE}
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
                  onPlaySound={() => {
                    handlePlaySingleSound(translationHe?.formalTts || translationHe?.formal || '', HEBREW_LANGUAGE);
                  }}
                  isPlaySoundDisabled={!translationHe?.formal}
                  isSpeaking={isSpeaking && (speakingText === translationHe?.formal || speakingText === translationHe?.formalTts) && speakingLanguage === HEBREW_LANGUAGE}
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
                  onPlaySound={() => {
                    handlePlaySingleSound(translationHe?.casualTts || translationHe?.casual || '', HEBREW_LANGUAGE);
                  }}
                  isPlaySoundDisabled={!translationHe?.casual}
                  isSpeaking={isSpeaking && (speakingText === translationHe?.casual || speakingText === translationHe?.casualTts) && speakingLanguage === HEBREW_LANGUAGE}
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
                  onPlaySound={() => {
                    handlePlaySingleSound(translationRu?.formalTts || translationRu?.formal || '', RUSSIAN_LANGUAGE);
                  }}
                  isPlaySoundDisabled={!translationRu?.formal}
                  isSpeaking={isSpeaking && (speakingText === translationRu?.formal || speakingText === translationRu?.formalTts) && speakingLanguage === RUSSIAN_LANGUAGE}
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
                  onPlaySound={() => {
                    handlePlaySingleSound(translationRu?.casualTts || translationRu?.casual || '', RUSSIAN_LANGUAGE);
                  }}
                  isPlaySoundDisabled={!translationRu?.casual}
                  isSpeaking={isSpeaking && (speakingText === translationRu?.casual || speakingText === translationRu?.casualTts) && speakingLanguage === RUSSIAN_LANGUAGE}
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
  recognizedSpeechTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 32,
    justifyContent: 'center',
  },
  clearButtonPressed: {
    opacity: 0.6,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  recognizedSpeechBlock: {
    gap: 8,
  },
  recognizedSpeechHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  recognizedSpeechHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  translateButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  translateButtonPressed: {
    opacity: 0.8,
  },
  translateButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
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
    textAlignVertical: 'top',
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
  copyButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonSuccess: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSuccess,
  },
  copyButtonDisabled: {
    opacity: 0.5,
  },
  copyButtonPressed: {
    backgroundColor: colors.backgroundSecondary,
  },
  copyButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  copyButtonTextSuccess: {
    color: colors.accent,
  },
  copyButtonTextDisabled: {
    color: colors.textMuted,
  },
});
