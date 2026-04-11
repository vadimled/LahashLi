import { VoiceErrorCode, VoiceMode, type VoiceStartListeningOptions } from 'react-native-voicekit';

import { texts } from './texts';

export const voiceRecognitionOptions: VoiceStartListeningOptions = {
  locale: 'ru-RU',
  mode: VoiceMode.Continuous,
  silenceTimeoutMs: 1200,
};

export function normalizeTranscript(transcript: string): string {
  return transcript.replace(/\s+/g, ' ').trim();
}

export function mapVoiceErrorToMessage(errorCode?: VoiceErrorCode | string): string {
  switch (errorCode) {
    case VoiceErrorCode.SPEECH_RECOGNIZER_NOT_AVAILABLE:
      return texts.home.recordButton.error.speechRecognizerUnavailable;

    case VoiceErrorCode.PERMISSION_DENIED:
    case VoiceErrorCode.PERMISSION_NOT_DETERMINED:
      return texts.home.recordButton.error.permissionDenied;

    case VoiceErrorCode.PERMISSION_RESTRICTED:
      return texts.home.recordButton.error.permissionRestricted;

    case VoiceErrorCode.RECORDING_START_FAILED:
      return texts.home.recordButton.error.recordingStartFailed;

    case VoiceErrorCode.RECOGNITION_FAILED:
      return texts.home.recordButton.error.recognitionFailed;

    default:
      return texts.home.recordButton.error.generic;
  }
}
