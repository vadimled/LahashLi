export const texts = {
  app: {
    name: 'LahashLi',
    subtitle: 'Personal voice translator',
  },
  home: {
    previewLabel: 'Preview',
    previewEnglishLabel: 'English',
    previewHebrewLabel: 'Hebrew',
    recordButton: {
      text: {
        idle: 'Speak',
        listening: 'Listening...',
        processing: 'Processing...',
      },
      hint: {
        idle: 'Tap, say the phrase in Russian, get the reply.',
        listening: 'Say your phrase in Russian',
        processing: 'Preparing translation...',
      },
    },
    previewState: {
      listening: {
        source: 'Listening for your Russian phrase...',
        targetEn: 'English translation will appear here.',
        targetHe: 'התרגום לעברית יופיע כאן.',
      },
      processing: {
        source: 'Preparing your translation...',
        targetEn: 'Generating English reply...',
        targetHe: 'מייצר תשובה בעברית...',
      },
    },
  },
} as const;