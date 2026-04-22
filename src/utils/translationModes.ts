export enum TranslationMode {
  RuToEn = 'ruToEn',
  EnToRu = 'enToRu',
  RuToHe = 'ruToHe',
  HeToRu = 'heToRu',
  RuToEnHe = 'ruToEnHe',
}

export type TranslationModeOption = {
  id: TranslationMode;
  label: string;
  toggleMode?: TranslationMode;
};

export const translationModeOptions: TranslationModeOption[] = [
  {
    id: TranslationMode.RuToEn,
    label: 'RU → EN',
    toggleMode: TranslationMode.EnToRu,
  },
  {
    id: TranslationMode.RuToHe,
    label: 'RU → HE',
    toggleMode: TranslationMode.HeToRu,
  },
  {
    id: TranslationMode.RuToEnHe,
    label: 'RU → EN + HE',
  },
];
