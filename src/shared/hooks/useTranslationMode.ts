import { useState } from 'react';

import { TranslationMode } from '../../utils/translationModes';

export function useTranslationMode() {
  const [selectedMode, setSelectedMode] = useState<TranslationMode>('ruToEn');

  return {
    selectedMode,
    setSelectedMode,
  };
}
