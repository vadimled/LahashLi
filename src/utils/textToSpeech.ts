import Speech from '@mhpdev/react-native-speech';

import { type TranslationVariant } from './openAiTranslation';
import { TranslationMode } from './translationModes';

export const ENGLISH_LANGUAGE = 'en-US';
export const HEBREW_LANGUAGE = 'he-IL';
export const RUSSIAN_LANGUAGE = 'ru-RU';

export type SpeechChunk = {
  text: string;
  language: string;
};

type BuildSpeechQueueParams = {
  selectedMode: TranslationMode;
  translationEn?: TranslationVariant;
  translationHe?: TranslationVariant;
  translationRu?: TranslationVariant;
};

function normalizeSpeechText(value?: string): string {
  return value?.trim() ?? '';
}

function pushChunk(chunks: SpeechChunk[], value: string | undefined, language: string): void {
  const text = normalizeSpeechText(value);

  if (!text) {
    return;
  }

  const lastChunk = chunks[chunks.length - 1];

  if (lastChunk && lastChunk.text === text && lastChunk.language === language) {
    return;
  }

  chunks.push({
    text,
    language,
  });
}

export function buildSpeechQueue({
  selectedMode,
  translationEn,
  translationHe,
  translationRu,
}: BuildSpeechQueueParams): SpeechChunk[] {
  const chunks: SpeechChunk[] = [];

  switch (selectedMode) {
    case TranslationMode.RuToEn:
      pushChunk(chunks, translationEn?.formal, ENGLISH_LANGUAGE);
      pushChunk(chunks, translationEn?.casual, ENGLISH_LANGUAGE);
      break;

    case TranslationMode.RuToHe:
      pushChunk(chunks, translationHe?.formal, HEBREW_LANGUAGE);
      pushChunk(chunks, translationHe?.casual, HEBREW_LANGUAGE);
      break;

    case TranslationMode.RuToEnHe:
      pushChunk(chunks, translationEn?.formal, ENGLISH_LANGUAGE);
      pushChunk(chunks, translationEn?.casual, ENGLISH_LANGUAGE);
      pushChunk(chunks, translationHe?.formal, HEBREW_LANGUAGE);
      pushChunk(chunks, translationHe?.casual, HEBREW_LANGUAGE);
      break;

    case TranslationMode.EnToRu:
    case TranslationMode.HeToRu:
      pushChunk(chunks, translationRu?.formal, RUSSIAN_LANGUAGE);
      pushChunk(chunks, translationRu?.casual, RUSSIAN_LANGUAGE);
      break;
  }

  return chunks;
}

export function createSpeechSignature(chunks: SpeechChunk[]): string {
  return chunks.map(chunk => `${chunk.language}:${chunk.text}`).join('||');
}

export async function speakSpeechQueue(
  chunks: SpeechChunk[],
  onIdCreated?: (id: string) => void,
): Promise<string[]> {
  const utteranceIds: string[] = [];

  for (const chunk of chunks) {
    const utteranceId = await Speech.speak(chunk.text, {
      language: chunk.language,
      ducking: true,
      silentMode: 'obey',
    });

    utteranceIds.push(utteranceId);
    onIdCreated?.(utteranceId);
  }

  return utteranceIds;
}

export async function stopSpeaking(): Promise<void> {
  await Speech.stop();
}
