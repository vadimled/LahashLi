import { useAppDispatch, useAppSelector } from '../../store';
import { setSelectedMode as setSelectedModeAction } from '../../store/slices/translationSlice';
import { TranslationMode } from '../../utils/translationModes';

export function useTranslationMode() {
  const dispatch = useAppDispatch();
  const selectedMode = useAppSelector((state) => state.translation.selectedMode);

  const setSelectedMode = (mode: TranslationMode) => {
    dispatch(setSelectedModeAction(mode));
  };

  return {
    selectedMode,
    setSelectedMode,
  };
}
