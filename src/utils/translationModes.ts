export enum TranslationMode {
  RuToHe = 'ruToHe',
  HeToRu = 'heToRu',
  RuToEn = 'ruToEn',
  EnToRu = 'enToRu',
  RuToEnHe = 'ruToEnHe',
}

export type TranslationModeOption = {
  id: TranslationMode;
  label: string;
  toggleMode?: TranslationMode;
};

export const translationModeOptions: TranslationModeOption[] = [
  {
    id: TranslationMode.RuToHe,
    label: 'RU → HE',
    toggleMode: TranslationMode.HeToRu,
  },
  {
    id: TranslationMode.RuToEn,
    label: 'RU → EN',
    toggleMode: TranslationMode.EnToRu,
  },
  {
    id: TranslationMode.RuToEnHe,
    label: 'RU → EN + HE',
  },
];
