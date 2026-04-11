import { previewContentByMode } from './previewContent';
import { RecordButtonStatus } from './recordButton';
import { texts } from './texts';
import { TranslationMode } from './translationModes';

type PreviewContent = {
  source: string;
  targetEn?: string;
  targetHe?: string;
};

type HomeScreenPreviewState = {
  previewContent: PreviewContent;
  shouldShowEnglish: boolean;
  shouldShowHebrew: boolean;
  isIdle: boolean;
  isListening: boolean;
  isProcessing: boolean;
};

export function getNextRecordButtonStatus(currentStatus: RecordButtonStatus): RecordButtonStatus {
  if (currentStatus === 'idle') {
    return 'listening';
  }

  if (currentStatus === 'listening') {
    return 'processing';
  }

  return currentStatus;
}

export function getHomeScreenPreviewState(
  selectedMode: TranslationMode,
  recordButtonStatus: RecordButtonStatus,
): HomeScreenPreviewState {
  const isIdle = recordButtonStatus === 'idle';
  const isListening = recordButtonStatus === 'listening';
  const isProcessing = recordButtonStatus === 'processing';

  const shouldShowEnglish = selectedMode === 'ruToEn' || selectedMode === 'ruToEnHe';
  const shouldShowHebrew = selectedMode === 'ruToHe' || selectedMode === 'ruToEnHe';

  const previewContent = (() => {
    if (isListening) {
      return texts.home.previewState[selectedMode].listening;
    }

    if (isProcessing) {
      return texts.home.previewState[selectedMode].processing;
    }

    return previewContentByMode[selectedMode];
  })();

  return {
    previewContent,
    shouldShowEnglish,
    shouldShowHebrew,
    isIdle,
    isListening,
    isProcessing,
  };
}
