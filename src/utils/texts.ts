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
        idle: 'Tap to start a new phrase.',
        listening: 'Say your phrase in Russian, then tap again.',
        processing: 'Preparing translation...',
      },
      error: {
        microphoneDenied: 'Microphone access is required to start voice input.',
        microphoneBlocked: 'Microphone access is blocked. Enable it in iPhone Settings.',
        microphoneUnavailable: 'Microphone access is unavailable on this device.',
        generic: 'Something went wrong while starting voice input.',
      },
    },
    previewState: {
      ruToEn: {
        idle: {
          source: 'Your Russian phrase will appear here.',
          targetEn: 'English translation will appear here.',
        },
        listening: {
          source: 'Listening for your Russian phrase...',
          targetEn: 'English translation will appear here.',
        },
        processing: {
          source: 'Preparing your translation...',
          targetEn: 'Generating English reply...',
        },
      },
      ruToHe: {
        idle: {
          source: 'Your Russian phrase will appear here.',
          targetHe: 'התרגום לעברית יופיע כאן.',
        },
        listening: {
          source: 'Listening for your Russian phrase...',
          targetHe: 'התרגום לעברית יופיע כאן.',
        },
        processing: {
          source: 'Preparing your translation...',
          targetHe: 'מכין תשובה בעברית...',
        },
      },
      ruToEnHe: {
        idle: {
          source: 'Your Russian phrase will appear here.',
          targetEn: 'English translation will appear here.',
          targetHe: 'התרגום לעברית יופיע כאן.',
        },
        listening: {
          source: 'Listening for your Russian phrase...',
          targetEn: 'English translation will appear here.',
          targetHe: 'התרגום לעברית יופיע כאן.',
        },
        processing: {
          source: 'Preparing your translation...',
          targetEn: 'Generating English reply...',
          targetHe: 'מכין תשובה בעברית...',
        },
      },
    },
  },
} as const;
