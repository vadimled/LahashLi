import { useCallback, useRef } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCopiedKey } from '../../store/slices/uiSlice';
import { COPY_SUCCESS_TIMEOUT_MS, TranslationCopyKey } from '../../utils/constants';

export function useCopyTranslation() {
  const dispatch = useAppDispatch();
  const { copiedKey } = useAppSelector((state) => state.ui);
  const copiedResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback((key: TranslationCopyKey, value?: string): void => {
    if (!value) {
      return;
    }

    Clipboard.setString(value);
    dispatch(setCopiedKey(key));

    if (copiedResetTimeoutRef.current) {
      clearTimeout(copiedResetTimeoutRef.current);
    }

    copiedResetTimeoutRef.current = setTimeout(() => {
      dispatch(setCopiedKey(null));
    }, COPY_SUCCESS_TIMEOUT_MS);
  }, [dispatch]);

  const clearCopiedState = useCallback(() => {
    dispatch(setCopiedKey(null));
    if (copiedResetTimeoutRef.current) {
      clearTimeout(copiedResetTimeoutRef.current);
    }
  }, [dispatch]);

  return {
    copiedKey,
    handleCopy,
    clearCopiedState,
  };
}
