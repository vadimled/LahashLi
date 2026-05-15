import { useCallback, useEffect, useRef } from 'react';
import Speech from '@mhpdev/react-native-speech';
import { useAppDispatch, useAppSelector } from '../../store';
import { setIsSpeaking, setSoundErrorMessage } from '../../store/slices/uiSlice';
import { buildSpeechQueue, createSpeechSignature, speakSpeechQueue, stopSpeaking } from '../../utils/textToSpeech';
import { texts } from '../../utils/texts';
import { TranslationMode } from '../../utils/translationModes';
import { TranslationVariant } from '../../utils/openAiTranslation';

interface UseSpeechControlProps {
  selectedMode: TranslationMode;
  translationEn?: TranslationVariant;
  translationHe?: TranslationVariant;
  translationRu?: TranslationVariant;
  isProcessing: boolean;
}

export function useSpeechControl({
  selectedMode,
  translationEn,
  translationHe,
  translationRu,
  isProcessing,
}: UseSpeechControlProps) {
  const dispatch = useAppDispatch();
  const { isSoundEnabled, isSpeaking } = useAppSelector((state) => state.ui);

  const activeSpeechIdsRef = useRef<Set<string>>(new Set());
  const lastAutoSpokenSignatureRef = useRef('');

  const currentSpeechQueue = buildSpeechQueue({
    selectedMode,
    translationEn,
    translationHe,
    translationRu,
  });

  const currentSpeechSignature = createSpeechSignature(currentSpeechQueue);

  const clearSpeechState = useCallback((): void => {
    activeSpeechIdsRef.current.clear();
    dispatch(setIsSpeaking(false));
  }, [dispatch]);

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

    dispatch(setSoundErrorMessage(undefined));

    try {
      await stopSpeaking();
      clearSpeechState();

      const utteranceIds = await speakSpeechQueue(currentSpeechQueue);
      activeSpeechIdsRef.current = new Set(utteranceIds);

      if (!utteranceIds.length) {
        dispatch(setIsSpeaking(false));
        return false;
      }

      dispatch(setIsSpeaking(true));
      return true;
    } catch (error) {
      clearSpeechState();
      dispatch(setSoundErrorMessage(texts.home.soundButton.error.playbackFailed));
      console.error('speakCurrentTranslations failed', error);
      return false;
    }
  }, [clearSpeechState, currentSpeechQueue, dispatch]);

  const speakSingleText = useCallback(async (text: string, language: string): Promise<boolean> => {
    if (!text) {
      return false;
    }

    dispatch(setSoundErrorMessage(undefined));

    try {
      await stopSpeaking();
      clearSpeechState();

      const utteranceIds = await speakSpeechQueue([{ text, language }]);
      activeSpeechIdsRef.current = new Set(utteranceIds);

      if (!utteranceIds.length) {
        dispatch(setIsSpeaking(false));
        return false;
      }

      dispatch(setIsSpeaking(true));
      return true;
    } catch (error) {
      clearSpeechState();
      dispatch(setSoundErrorMessage(texts.home.soundButton.error.playbackFailed));
      console.error('speakSingleText failed', error);
      return false;
    }
  }, [clearSpeechState, dispatch]);


  useEffect(() => {
    const startSubscription = Speech.onStart(({ id }) => {
      if (activeSpeechIdsRef.current.has(id)) {
        dispatch(setIsSpeaking(true));
      }
    });

    const finishSubscription = Speech.onFinish(({ id }) => {
      if (!activeSpeechIdsRef.current.has(id)) {
        return;
      }
      activeSpeechIdsRef.current.delete(id);
      if (activeSpeechIdsRef.current.size === 0) {
        dispatch(setIsSpeaking(false));
      }
    });

    const stoppedSubscription = Speech.onStopped(({ id }) => {
      if (activeSpeechIdsRef.current.has(id)) {
        activeSpeechIdsRef.current.delete(id);
      }
      if (activeSpeechIdsRef.current.size === 0) {
        dispatch(setIsSpeaking(false));
      }
    });

    const errorSubscription = Speech.onError(({ id }) => {
      if (activeSpeechIdsRef.current.has(id)) {
        activeSpeechIdsRef.current.delete(id);
      }
      if (activeSpeechIdsRef.current.size === 0) {
        dispatch(setIsSpeaking(false));
      }
      dispatch(setSoundErrorMessage(texts.home.soundButton.error.playbackFailed));
    });

    return () => {
      startSubscription.remove();
      finishSubscription.remove();
      stoppedSubscription.remove();
      errorSubscription.remove();
    };
  }, [dispatch]);

  // Auto-speak effect
  useEffect(() => {
    if (!isSoundEnabled || isProcessing || !currentSpeechSignature) {
      if (!currentSpeechSignature) {
        lastAutoSpokenSignatureRef.current = '';
      }
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

  return {
    isSpeaking,
    isSoundEnabled,
    currentSpeechSignature,
    stopCurrentSpeech,
    speakCurrentTranslations,
    speakSingleText,
    clearSpeechState,
  };
}
