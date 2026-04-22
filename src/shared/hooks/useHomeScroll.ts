import { useCallback, useEffect, useRef } from 'react';
import { ScrollView, LayoutChangeEvent } from 'react-native';
import { TRANSLATIONS_SCROLL_TOP_OFFSET } from '../../utils/constants';

interface UseHomeScrollProps {
  isListening: boolean;
  recognizedSpeechValue: string;
}

export function useHomeScroll({ isListening, recognizedSpeechValue }: UseHomeScrollProps) {
  const contentScrollRef = useRef<ScrollView | null>(null);
  const recognizedSpeechScrollRef = useRef<ScrollView | null>(null);
  const translationsSectionYRef = useRef(0);
  const wasListeningRef = useRef(false);

  const handleRecognizedSpeechContentSizeChange = useCallback((): void => {
    if (!isListening) {
      return;
    }

    recognizedSpeechScrollRef.current?.scrollToEnd({ animated: true });
  }, [isListening]);

  const handleTranslationsSectionLayout = useCallback((event: LayoutChangeEvent): void => {
    translationsSectionYRef.current = event.nativeEvent.layout.y;
  }, []);

  useEffect(() => {
    const hasSwitchedFromLiveToFinal = wasListeningRef.current && !isListening;

    if (hasSwitchedFromLiveToFinal) {
      requestAnimationFrame(() => {
        recognizedSpeechScrollRef.current?.scrollTo({
          y: 0,
          animated: false,
        });

        contentScrollRef.current?.scrollTo({
          y: Math.max(0, translationsSectionYRef.current - TRANSLATIONS_SCROLL_TOP_OFFSET),
          animated: true,
        });
      });
    }

    wasListeningRef.current = isListening;
  }, [isListening, recognizedSpeechValue]);

  return {
    contentScrollRef,
    recognizedSpeechScrollRef,
    handleRecognizedSpeechContentSizeChange,
    handleTranslationsSectionLayout,
  };
}
