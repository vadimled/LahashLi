import { useCallback, useEffect, useRef } from 'react';
import { useVoice } from 'react-native-voicekit';

import { RecordButtonStatus } from '../../utils/recordButton';
import { texts } from '../../utils/texts';
import { TranslationMode } from '../../utils/translationModes';
import { mapVoiceErrorToMessage, normalizeTranscript, voiceRecognitionOptions } from '../../utils/voiceRecognition';
import { TranslationVariant } from '../../utils/openAiTranslation';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setLiveTranscript,
  setStatus,
  setErrorMessage,
  resetVoiceState,
  translateTranscript,
  setTranslationResult,
} from '../../store/slices/voiceSlice';

type UseVoiceFlowReturn = {
  recordButtonStatus: RecordButtonStatus;
  transcript?: string;
  liveTranscript?: string;
  translationEn?: TranslationVariant;
  translationHe?: TranslationVariant;
  errorMessage?: string;
  handleRecordButtonPress: () => Promise<void>;
};

const FINAL_RESULT_TIMEOUT_MS = 1800;

export function useVoiceFlow(selectedMode: TranslationMode): UseVoiceFlowReturn {
  const dispatch = useAppDispatch();
  const voiceState = useAppSelector((state) => state.voice);

  const waitingForFinalResultRef = useRef(false);
  const finalResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    available,
    listening,
    transcript: rawLiveTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoice({
    ...voiceRecognitionOptions,
    enablePartialResults: true,
  });

  const liveTranscript = normalizeTranscript(rawLiveTranscript);

  useEffect(() => {
    dispatch(setLiveTranscript(liveTranscript));
  }, [liveTranscript, dispatch]);

  const clearFinalResultTimeout = useCallback((): void => {
    if (finalResultTimeoutRef.current) {
      clearTimeout(finalResultTimeoutRef.current);
      finalResultTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (listening) {
      dispatch(setStatus('listening'));
      dispatch(setErrorMessage(undefined));
      return;
    }

    if (!waitingForFinalResultRef.current) {
      return;
    }

    if (!liveTranscript) {
      return;
    }

    waitingForFinalResultRef.current = false;
    clearFinalResultTimeout();
    dispatch(translateTranscript({ transcript: liveTranscript, mode: selectedMode }));
  }, [clearFinalResultTimeout, listening, liveTranscript, selectedMode, dispatch]);

  useEffect(() => {
    return () => {
      clearFinalResultTimeout();
    };
  }, [clearFinalResultTimeout]);

  useEffect(() => {
    dispatch(resetVoiceState());
    waitingForFinalResultRef.current = false;
    clearFinalResultTimeout();
  }, [selectedMode, clearFinalResultTimeout, dispatch]);

  const handleRecordButtonPress = useCallback(async (): Promise<void> => {
    if (voiceState.status === 'processing') {
      return;
    }

    if (voiceState.status === 'idle') {
      if (!available) {
        dispatch(setErrorMessage(texts.home.recordButton.error.speechRecognizerUnavailable));
        return;
      }

      waitingForFinalResultRef.current = false;
      clearFinalResultTimeout();
      resetTranscript();

      try {
        await startListening();
        dispatch(resetVoiceState());
        dispatch(setStatus('listening'));
      } catch (error) {
        const typedError = error as { code?: string };
        dispatch(setErrorMessage(mapVoiceErrorToMessage(typedError.code)));
      }

      return;
    }

    if (voiceState.status === 'listening') {
      waitingForFinalResultRef.current = true;
      dispatch(setStatus('processing'));
      dispatch(setErrorMessage(undefined));

      clearFinalResultTimeout();

      finalResultTimeoutRef.current = setTimeout(() => {
        if (!waitingForFinalResultRef.current) {
          return;
        }

        waitingForFinalResultRef.current = false;
        dispatch(setTranslationResult({
          errorMessage: texts.home.recordButton.error.noSpeech,
        }));
      }, FINAL_RESULT_TIMEOUT_MS);

      try {
        await stopListening();
      } catch (error) {
        waitingForFinalResultRef.current = false;
        clearFinalResultTimeout();

        const typedError = error as { code?: string };
        dispatch(setErrorMessage(mapVoiceErrorToMessage(typedError.code)));
        dispatch(setStatus('idle'));
      }
    }
  }, [available, clearFinalResultTimeout, resetTranscript, startListening, stopListening, voiceState.status, dispatch]);

  return {
    recordButtonStatus: voiceState.status,
    transcript: voiceState.transcript,
    liveTranscript,
    translationEn: voiceState.translationEn,
    translationHe: voiceState.translationHe,
    errorMessage: voiceState.errorMessage,
    handleRecordButtonPress,
  };
}
