type HighlightedRecognizedSpeech = {
  leadingText: string;
  highlightedText: string;
};

const LIVE_RECOGNIZED_SPEECH_HIGHLIGHTED_WORDS_COUNT = 3;

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
