import React, { useCallback, useEffect } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { setIsSoundEnabled, setSoundErrorMessage } from '../../store/slices/uiSlice';
import { useTranslationMode } from './useTranslationMode';
import { useVoiceFlow } from './useVoiceFlow';
import { useSpeechControl } from './useSpeechControl';
import { useCopyTranslation } from './useCopyTranslation';
import { useHomeScroll } from './useHomeScroll';
import { texts } from '../../utils/texts';
import { TranslationMode } from '../../utils/translationModes';
import { getHighlightedRecognizedSpeech } from '../../utils/helpers';
import { TranslationVariant } from '../../utils/openAiTranslation';
import { RecordButtonStatus } from '../../utils/recordButton';
import { TranslationCopyKey } from '../../utils/constants';

export interface HomeScreenLogic {
  selectedMode: TranslationMode;
  setSelectedMode: (mode: TranslationMode) => void;
  recordButtonStatus: RecordButtonStatus;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isSoundEnabled: boolean;
  speakingText?: string;
  speakingLanguage?: string;
  displayedErrorMessage?: string;
  copiedKey: TranslationCopyKey | null;
  recognizedSpeechLabel: string;
  recognizedSpeechValue: string;
  recognizedSpeechPlaceholder: string;
  isRecognizedSpeechEmpty: boolean;
  leadingText: string;
  highlightedText: string;
  translationEn?: TranslationVariant;
  translationHe?: TranslationVariant;
  translationRu?: TranslationVariant;
  shouldShowEnglish: boolean;
  shouldShowHebrew: boolean;
  shouldShowRussian: boolean;
  contentScrollRef: React.RefObject<ScrollView | null>;
  recognizedSpeechScrollRef: React.RefObject<ScrollView | null>;
  handleRecognizedSpeechContentSizeChange: () => void;
  handleTranslationsSectionLayout: (event: LayoutChangeEvent) => void;
  onPressRecordButton: () => void;
  onPressSoundButton: () => void;
  handleCopy: (key: TranslationCopyKey, value?: string) => void;
  handlePlaySingleSound: (text: string, language: string) => Promise<boolean>;
  handleTranscriptChange: (text: string) => void;
  handleTranslate: () => void;
  handleClearAll: () => void;
  recognizedSpeechTitle: string;
}

export function useHomeScreenLogic(): HomeScreenLogic {
  const dispatch = useAppDispatch();
  const { soundErrorMessage } = useAppSelector((state) => state.ui);
  const { selectedMode, setSelectedMode } = useTranslationMode();
  const { inputSource } = useAppSelector((state) => state.voice);

  const {
    recordButtonStatus,
    transcript,
    liveTranscript,
    translationEn,
    translationHe,
    translationRu,
    errorMessage,
    handleRecordButtonPress,
    handleTranscriptChange,
    handleTranslate,
    handleClearAll,
  } = useVoiceFlow(selectedMode);

  const isListening = recordButtonStatus === 'listening';
  const isProcessing = recordButtonStatus === 'processing';

  const {
    isSpeaking,
    isSoundEnabled,
    speakingText,
    speakingLanguage,
    stopCurrentSpeech,
    speakSingleText,
  } = useSpeechControl({
    selectedMode,
    translationEn,
    translationHe,
    translationRu,
    isProcessing,
  });

  const { copiedKey, handleCopy, clearCopiedState } = useCopyTranslation();
  
  const recognizedSpeechTitle = inputSource === 'clipboard'
    ? texts.home.recognizedSpeech.manualInputTitle
    : texts.home.recognizedSpeech.title;

  const recognizedSpeechLabel = isListening
    ? texts.home.recognizedSpeech.liveLabel
    : texts.home.recognizedSpeech.finalLabel;

  const recognizedSpeechValue = isListening
    ? liveTranscript ?? ''
    : transcript ?? '';

  const recognizedSpeechPlaceholder = isListening
    ? texts.home.recognizedSpeech.emptyLive
    : texts.home.recognizedSpeech.emptyFinal;

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
        return;
      }

      dispatch(setIsSoundEnabled(false));
      await stopCurrentSpeech();
    };

    run().catch(error => {
      console.error('onPressSoundButton failed', error);
    });
  }, [isSoundEnabled, isSpeaking, stopCurrentSpeech, dispatch]);

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
    speakingText,
    speakingLanguage,
    displayedErrorMessage,
    copiedKey,
    // Content
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
    // Refs & Handlers
    contentScrollRef,
    recognizedSpeechScrollRef,
    handleRecognizedSpeechContentSizeChange,
    handleTranslationsSectionLayout,
    onPressRecordButton,
    onPressSoundButton,
    handleCopy,
    handlePlaySingleSound: (text: string, language: string): Promise<boolean> => speakSingleText(text, language),
    handleTranscriptChange,
    handleTranslate,
    handleClearAll,
    recognizedSpeechTitle,
  };
}
