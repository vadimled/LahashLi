import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setIsSoundEnabled, setSoundErrorMessage } from '../../store/slices/uiSlice';
import { useTranslationMode } from './useTranslationMode.ts';
import { useVoiceFlow } from './useVoiceFlow.ts';
import { useSpeechControl } from './useSpeechControl';
import { useCopyTranslation } from './useCopyTranslation';
import { useHomeScroll } from './useHomeScroll';
import { texts } from '../../utils/texts';
import { TranslationMode } from '../../utils/translationModes';
import { getHighlightedRecognizedSpeech } from '../../utils/helpers';

export function useHomeScreenLogic() {
  const dispatch = useAppDispatch();
  const { soundErrorMessage } = useAppSelector((state) => state.ui);
  const { selectedMode, setSelectedMode } = useTranslationMode();

  const {
    recordButtonStatus,
    transcript,
    liveTranscript,
    translationEn,
    translationHe,
    translationRu,
    errorMessage,
    handleRecordButtonPress,
  } = useVoiceFlow(selectedMode);

  const isListening = recordButtonStatus === 'listening';
  const isProcessing = recordButtonStatus === 'processing';

  const {
    isSpeaking,
    isSoundEnabled,
    stopCurrentSpeech,
    speakCurrentTranslations,
  } = useSpeechControl({
    selectedMode,
    translationEn,
    translationHe,
    translationRu,
    isProcessing,
  });

  const { copiedKey, handleCopy, clearCopiedState } = useCopyTranslation();

  const recognizedSpeechLabel = isListening
    ? texts.home.recognizedSpeech.liveLabel
    : texts.home.recognizedSpeech.finalLabel;

  const recognizedSpeechValue = isListening
    ? liveTranscript || texts.home.recognizedSpeech.emptyLive
    : transcript || texts.home.recognizedSpeech.emptyFinal;

  const {
    contentScrollRef,
    recognizedSpeechScrollRef,
    handleRecognizedSpeechContentSizeChange,
    handleTranslationsSectionLayout,
  } = useHomeScroll({ isListening, recognizedSpeechValue });

  const isRecognizedSpeechEmpty = isListening ? !liveTranscript : !transcript;
  const { leadingText, highlightedText } = getHighlightedRecognizedSpeech(liveTranscript ?? '');

  const displayedErrorMessage = soundErrorMessage ?? errorMessage;

  const onPressRecordButton = useCallback((): void => {
    const run = async (): Promise<void> => {
      dispatch(setSoundErrorMessage(undefined));
      if (isSpeaking) {
        await stopCurrentSpeech();
      }
      await handleRecordButtonPress();
    };

    run().catch(error => {
      console.error('handleRecordButtonPress failed', error);
    });
  }, [handleRecordButtonPress, isSpeaking, stopCurrentSpeech, dispatch]);

  const onPressSoundButton = useCallback((): void => {
    const run = async (): Promise<void> => {
      dispatch(setSoundErrorMessage(undefined));

      if (isSpeaking) {
        await stopCurrentSpeech();
        return;
      }

      if (!isSoundEnabled) {
        dispatch(setIsSoundEnabled(true));
        await speakCurrentTranslations();
        return;
      }

      dispatch(setIsSoundEnabled(false));
      await stopCurrentSpeech();
    };

    run().catch(error => {
      console.error('onPressSoundButton failed', error);
    });
  }, [isSoundEnabled, isSpeaking, speakCurrentTranslations, stopCurrentSpeech, dispatch]);

  useEffect(() => {
    clearCopiedState();
    dispatch(setSoundErrorMessage(undefined));

    stopCurrentSpeech().catch(error => {
      console.error('stopCurrentSpeech on mode change failed', error);
    });
  }, [selectedMode, stopCurrentSpeech, clearCopiedState, dispatch]);

  useEffect(() => {
    return () => {
      stopCurrentSpeech().catch(error => {
        console.error('stopCurrentSpeech on unmount failed', error);
      });
    };
  }, [stopCurrentSpeech]);

  const shouldShowEnglish = selectedMode === TranslationMode.RuToEn || selectedMode === TranslationMode.RuToEnHe;
  const shouldShowHebrew = selectedMode === TranslationMode.RuToHe || selectedMode === TranslationMode.RuToEnHe;
  const shouldShowRussian = selectedMode === TranslationMode.EnToRu || selectedMode === TranslationMode.HeToRu;

  return {
    // State
    selectedMode,
    setSelectedMode,
    recordButtonStatus,
    isListening,
    isProcessing,
    isSpeaking,
    isSoundEnabled,
    displayedErrorMessage,
    copiedKey,
    // Content
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
    // Refs & Handlers
    contentScrollRef,
    recognizedSpeechScrollRef,
    handleRecognizedSpeechContentSizeChange,
    handleTranslationsSectionLayout,
    onPressRecordButton,
    onPressSoundButton,
    handleCopy,
  };
}
