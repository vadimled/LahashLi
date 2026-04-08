import { TranslationMode } from './translationModes';

type PreviewContent = {
  source: string;
  targetEn?: string;
  targetHe?: string;
};

export const previewContentByMode: Record<TranslationMode, PreviewContent> = {
  ruToEn: {
    source: 'Я проверю это после митинга.',
    targetEn: 'I’ll check it after the meeting.',
  },
  ruToHe: {
    source: 'Я проверю это после митинга.',
    targetHe: 'אני אבדוק את זה אחרי הפגישה.',
  },
  ruToEnHe: {
    source: 'Я проверю это после митинга.',
    targetEn: 'I’ll check it after the meeting.',
    targetHe: 'אני אבדוק את זה אחרי הפגישה.',
  },
};
