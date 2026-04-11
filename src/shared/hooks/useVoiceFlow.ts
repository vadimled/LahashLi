import { useCallback, useEffect, useRef, useState } from 'react';

import { previewContentByMode } from '../../utils/previewContent';
import { RecordButtonStatus } from '../../utils/recordButton';
import { requestMicrophonePermission } from '../../utils/microphonePermission';
import { texts } from '../../utils/texts';
import { TranslationMode } from '../../utils/translationModes';

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
  translationEn?: string;
  translationHe?: string;
  errorMessage?: string;
  handleRecordButtonPress: () => void;
};

const MOCK_PROCESSING_DELAY_MS = 1400;

export function useVoiceFlow(selectedMode: TranslationMode): UseVoiceFlowReturn {
  const [voiceFlowState, setVoiceFlowState] = useState<VoiceFlowState>({
    status: 'idle',
  });

  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const handleRecordButtonPress = useCallback(async () => {
    if (voiceFlowState.status === 'processing') {
      return;
    }

    if (voiceFlowState.status === 'idle') {
      try {
        const permissionResult = await requestMicrophonePermission();

        if (permissionResult === 'granted') {
          setVoiceFlowState(currentState => ({
            ...currentState,
            status: 'listening',
            errorMessage: undefined,
          }));

          return;
        }

        if (permissionResult === 'blocked') {
          setVoiceFlowState(currentState => ({
            ...currentState,
            status: 'idle',
            errorMessage: texts.home.recordButton.error.microphoneBlocked,
          }));

          return;
        }

        if (permissionResult === 'unavailable') {
          setVoiceFlowState(currentState => ({
            ...currentState,
            status: 'idle',
            errorMessage: texts.home.recordButton.error.microphoneUnavailable,
          }));

          return;
        }

        setVoiceFlowState(currentState => ({
          ...currentState,
          status: 'idle',
          errorMessage: texts.home.recordButton.error.microphoneDenied,
        }));
      } catch {
        setVoiceFlowState(currentState => ({
          ...currentState,
          status: 'idle',
          errorMessage: texts.home.recordButton.error.generic,
        }));
      }

      return;
    }

    if (voiceFlowState.status === 'listening') {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }

      setVoiceFlowState(currentState => ({
        ...currentState,
        status: 'processing',
        errorMessage: undefined,
      }));

      processingTimeoutRef.current = setTimeout(() => {
        const mockResult = previewContentByMode[selectedMode];

        setVoiceFlowState({
          status: 'idle',
          transcript: mockResult.source,
          translationEn: mockResult.targetEn,
          translationHe: mockResult.targetHe,
          errorMessage: undefined,
        });
      }, MOCK_PROCESSING_DELAY_MS);
    }
  }, [selectedMode, voiceFlowState.status]);

  return {
    recordButtonStatus: voiceFlowState.status,
    transcript: voiceFlowState.transcript,
    translationEn: voiceFlowState.translationEn,
    translationHe: voiceFlowState.translationHe,
    errorMessage: voiceFlowState.errorMessage,
    handleRecordButtonPress,
  };
}
