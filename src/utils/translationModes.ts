export enum TranslationMode {
  RuToEn = 'ruToEn',
  RuToHe = 'ruToHe',
  RuToEnHe = 'ruToEnHe',
}

export type TranslationModeOption = {
  id: TranslationMode;
  label: string;
};

export const translationModeOptions: TranslationModeOption[] = [
  {
    id: TranslationMode.RuToEn,
    label: 'RU → EN',
  },
  {
    id: TranslationMode.RuToHe,
    label: 'RU → HE',
  },
  {
    id: TranslationMode.RuToEnHe,
    label: 'RU → EN + HE',
  },
];
