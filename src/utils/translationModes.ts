export type TranslationMode = 'ruToEn' | 'ruToHe' | 'ruToEnHe';

export type TranslationModeOption = {
  id: TranslationMode;
  label: string;
};

export const translationModeOptions: TranslationModeOption[] = [
  {
    id: 'ruToEn',
    label: 'RU → EN',
  },
  {
    id: 'ruToHe',
    label: 'RU → HE',
  },
  {
    id: 'ruToEnHe',
    label: 'RU → EN + HE',
  },
];
