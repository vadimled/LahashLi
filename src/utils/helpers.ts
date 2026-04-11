import { RecordButtonStatus } from './recordButton';
import { texts } from './texts';
import { TranslationMode } from './translationModes';

type PreviewContent = {
  source: string;
  targetEn?: string;
  targetHe?: string;
};

type GetHomeScreenPreviewStateParams = {
  selectedMode: TranslationMode;
  recordButtonStatus: RecordButtonStatus;
  transcript?: string;
  translationEn?: string;
  translationHe?: string;
};

type HomeScreenPreviewState = {
  previewContent: PreviewContent;
  shouldShowEnglish: boolean;
  shouldShowHebrew: boolean;
  isIdle: boolean;
  isListening: boolean;
  isProcessing: boolean;
  hasResolvedContent: boolean;
};

type HighlightedRecognizedSpeech = {
  leadingText: string;
  highlightedText: string;
};

const LIVE_RECOGNIZED_SPEECH_HIGHLIGHTED_WORDS_COUNT = 3;

export function getNextRecordButtonStatus(currentStatus: RecordButtonStatus): RecordButtonStatus {
  if (currentStatus === 'idle') {
    return 'listening';
  }

  if (currentStatus === 'listening') {
    return 'processing';
  }

  return currentStatus;
}

export function getHomeScreenPreviewState({
  selectedMode,
  recordButtonStatus,
  transcript,
  translationEn,
  translationHe,
}: GetHomeScreenPreviewStateParams): HomeScreenPreviewState {
  const isIdle = recordButtonStatus === 'idle';
  const isListening = recordButtonStatus === 'listening';
  const isProcessing = recordButtonStatus === 'processing';

  const shouldShowEnglish = selectedMode === 'ruToEn' || selectedMode === 'ruToEnHe';
  const shouldShowHebrew = selectedMode === 'ruToHe' || selectedMode === 'ruToEnHe';

  const hasResolvedContent = Boolean(transcript) || Boolean(translationEn) || Boolean(translationHe);

  const previewContent = (() => {
    if (isListening) {
      return texts.home.previewState[selectedMode].listening;
    }

    if (isProcessing) {
      return texts.home.previewState[selectedMode].processing;
    }

    if (hasResolvedContent) {
      return {
        source: transcript ?? texts.home.previewState[selectedMode].idle.source,
        targetEn: shouldShowEnglish ? translationEn ?? texts.home.previewState[selectedMode].idle.targetEn : undefined,
        targetHe: shouldShowHebrew ? translationHe ?? texts.home.previewState[selectedMode].idle.targetHe : undefined,
      };
    }

    return texts.home.previewState[selectedMode].idle;
  })();

  return {
    previewContent,
    shouldShowEnglish,
    shouldShowHebrew,
    isIdle,
    isListening,
    isProcessing,
    hasResolvedContent,
  };
}

export function getHighlightedRecognizedSpeech(text: string): HighlightedRecognizedSpeech {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return {
      leadingText: '',
      highlightedText: '',
    };
  }

  const words = normalizedText.split(/\s+/);

  if (words.length <= LIVE_RECOGNIZED_SPEECH_HIGHLIGHTED_WORDS_COUNT) {
    return {
      leadingText: '',
      highlightedText: normalizedText,
    };
  }

  const leadingWords = words.slice(0, -LIVE_RECOGNIZED_SPEECH_HIGHLIGHTED_WORDS_COUNT);
  const highlightedWords = words.slice(-LIVE_RECOGNIZED_SPEECH_HIGHLIGHTED_WORDS_COUNT);

  return {
    leadingText: `${leadingWords.join(' ')} `,
    highlightedText: highlightedWords.join(' '),
  };
}
