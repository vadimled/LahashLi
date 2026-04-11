import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  type EmitterSubscription,
} from 'react-native';
import { useVoice } from 'react-native-voicekit';

import { openAiConfig } from '../../utils/openAiConfig';
import { translateWithOpenAi } from '../../utils/openAiTranslation';
import { RecordButtonStatus } from '../../utils/recordButton';
import { texts } from '../../utils/texts';
import { TranslationMode } from '../../utils/translationModes';
import {
  mapVoiceErrorToMessage,
  normalizeTranscript,
  voiceRecognitionOptions,
} from '../../utils/voiceRecognition';

type VoiceFlowState = {
  status: RecordButtonStatus;
  transcript?: string;
  translationEn?: string;
  translationHe?: string;
  errorMessage?: string;
};

type UseVoiceFlowReturn = {
  recordButtonStatus: RecordButtonStatus;
  transcript?: string;
  liveTranscript?: string;
  translationEn?: string;
  translationHe?: string;
  errorMessage?: string;
  handleRecordButtonPress: () => Promise<void>;
};

const FINAL_RESULT_TIMEOUT_MS = 1800;

export function useVoiceFlow(
  selectedMode: TranslationMode,
): UseVoiceFlowReturn {
  const [voiceFlowState, setVoiceFlowState] = useState<VoiceFlowState>({
    status: 'idle',
  });

  const waitingForFinalResultRef = useRef(false);
  const finalResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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

  const clearFinalResultTimeout = useCallback(() => {
    if (finalResultTimeoutRef.current) {
      clearTimeout(finalResultTimeoutRef.current);
      finalResultTimeoutRef.current = null;
    }
  }, []);

  const translateFinalTranscript = useCallback(
    async (finalTranscript: string) => {
      if (!openAiConfig.apiKey.trim()) {
        setVoiceFlowState({
          status: 'idle',
          transcript: finalTranscript,
          translationEn: undefined,
          translationHe: undefined,
          errorMessage: texts.home.recordButton.error.missingOpenAiApiKey,
        });

        return;
      }

      try {
        const translationResult = await translateWithOpenAi({
          text: finalTranscript,
          mode: selectedMode,
          apiKey: openAiConfig.apiKey,
          model: openAiConfig.model,
        });

        setVoiceFlowState({
          status: 'idle',
          transcript: translationResult.source,
          translationEn: translationResult.translationEn,
          translationHe: translationResult.translationHe,
          errorMessage: undefined,
        });
      } catch {
        setVoiceFlowState({
          status: 'idle',
          transcript: finalTranscript,
          translationEn: undefined,
          translationHe: undefined,
          errorMessage: texts.home.recordButton.error.translationFailed,
        });
      }
    },
    [selectedMode],
  );

  useEffect(() => {
    const nativeVoiceKitModule = NativeModules.RNVoiceKit;

    if (!nativeVoiceKitModule) {
      return;
    }

    const eventEmitter = new NativeEventEmitter(nativeVoiceKitModule);

    const subscriptions: EmitterSubscription[] = [
      eventEmitter.addListener('availability-change', () => {}),
      eventEmitter.addListener('RNVoiceKit.availability-change', () => {}),
    ];

    return () => {
      subscriptions.forEach(subscription => {
        subscription.remove();
      });
    };
  }, []);

  useEffect(() => {
    if (listening) {
      setVoiceFlowState(currentState => ({
        ...currentState,
        status: 'listening',
        errorMessage: undefined,
      }));
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

    // eslint-disable-next-line no-void
    void translateFinalTranscript(liveTranscript);
  }, [
    clearFinalResultTimeout,
    listening,
    liveTranscript,
    translateFinalTranscript,
  ]);

  useEffect(() => {
    return () => {
      clearFinalResultTimeout();
    };
  }, [clearFinalResultTimeout]);

  const handleRecordButtonPress = useCallback(async () => {
    if (voiceFlowState.status === 'processing') {
      return;
    }

    if (voiceFlowState.status === 'idle') {
      if (!available) {
        setVoiceFlowState(currentState => ({
          ...currentState,
          status: 'idle',
          errorMessage:
          texts.home.recordButton.error.speechRecognizerUnavailable,
        }));
        return;
      }

      waitingForFinalResultRef.current = false;
      clearFinalResultTimeout();
      resetTranscript();

      try {
        await startListening();

        setVoiceFlowState({
          status: 'listening',
          transcript: undefined,
          translationEn: undefined,
          translationHe: undefined,
          errorMessage: undefined,
        });
      } catch (error) {
        const typedError = error as { code?: string };

        setVoiceFlowState(currentState => ({
          ...currentState,
          status: 'idle',
          errorMessage: mapVoiceErrorToMessage(typedError.code),
        }));
      }

      return;
    }

    if (voiceFlowState.status === 'listening') {
      waitingForFinalResultRef.current = true;

      setVoiceFlowState(currentState => ({
        ...currentState,
        status: 'processing',
        errorMessage: undefined,
      }));

      clearFinalResultTimeout();

      finalResultTimeoutRef.current = setTimeout(() => {
        if (!waitingForFinalResultRef.current) {
          return;
        }

        waitingForFinalResultRef.current = false;

        setVoiceFlowState(currentState => ({
          ...currentState,
          status: 'idle',
          errorMessage: texts.home.recordButton.error.noSpeech,
        }));
      }, FINAL_RESULT_TIMEOUT_MS);

      try {
        await stopListening();
      } catch (error) {
        waitingForFinalResultRef.current = false;
        clearFinalResultTimeout();

        const typedError = error as { code?: string };

        setVoiceFlowState(currentState => ({
          ...currentState,
          status: 'idle',
          errorMessage: mapVoiceErrorToMessage(typedError.code),
        }));
      }
    }
  }, [
    available,
    clearFinalResultTimeout,
    resetTranscript,
    startListening,
    stopListening,
    voiceFlowState.status,
  ]);

  return {
    recordButtonStatus: voiceFlowState.status,
    transcript: voiceFlowState.transcript,
    liveTranscript,
    translationEn: voiceFlowState.translationEn,
    translationHe: voiceFlowState.translationHe,
    errorMessage: voiceFlowState.errorMessage,
    handleRecordButtonPress,
  };
}