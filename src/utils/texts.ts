export const texts = {
  app: {
    name: 'LahashLi',
    subtitle: 'Personal voice translator',
  },
  home: {
    previewLabel: 'Preview',
    previewEnglishLabel: 'English',
    previewHebrewLabel: 'Hebrew',
    recognizedSpeech: {
      title: 'Recognized speech',
      liveLabel: 'Live',
      finalLabel: 'Final',
      emptyLive: 'Start speaking to see live recognition.',
      emptyFinal: 'Final recognized phrase will appear here.',
    },
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
        speechRecognizerUnavailable:
            'Speech recognition is not available on this device.',
        permissionDenied:
            'Microphone and Speech Recognition access are required to start voice input.',
        permissionRestricted:
            'Speech input is restricted on this iPhone.',
        recordingStartFailed:
            'Could not start listening. Please try again.',
        recognitionFailed:
            'Speech recognition failed. Please try again.',
        noSpeech:
            'No speech was detected. Please try again and speak a little longer.',
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