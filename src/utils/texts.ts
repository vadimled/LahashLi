export const texts = {
  app: {
    name: 'LahashLi',
    subtitle: 'Personal voice translator',
  },
  home: {
    translationsLabel: 'Translations',
    translationVariants: {
      formal: 'Formal',
      casual: 'Casual',
    },
    translationVariantHints: {
      casual: 'Everyday tone',
    },
    languageLabels: {
      english: 'English',
      hebrew: 'Hebrew',
    },
    copyButton: {
      idle: 'Copy',
      success: 'Copied',
    },
    soundButton: {
      text: {
        idle: 'Sound',
        enabled: 'Sound',
        stop: 'Sound',
      },
      state: {
        off: 'Off',
        on: 'On',
        stop: 'Stop',
      },
      error: {
        playbackFailed: 'Could not play audio.\nPlease try again.',
      },
    },
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
        speechRecognizerUnavailable: 'Speech recognition is not available on this device.',
        permissionDenied: 'Microphone and Speech Recognition access are required to start voice input.',
        permissionRestricted: 'Speech input is restricted on this iPhone.',
        recordingStartFailed: 'Could not start listening.\nPlease try again.',
        recognitionFailed: 'Speech recognition failed.\nPlease try again.',
        noSpeech: 'No speech was detected.\nPlease try again and speak a little longer.',
        generic: 'Something went wrong while starting voice input.',
        missingOpenAiApiKey: 'OpenAI API key is missing.\nAdd it to openAiConfig.ts.',
        translationFailed: 'Could not translate the phrase.\nPlease try again.',
      },
    },
    translationPlaceholders: {
      englishFormal: 'Formal English translation will appear here.',
      englishCasual: 'Casual English translation will appear here.',
      hebrewFormal: 'התרגום הרשמי לעברית יופיע כאן.',
      hebrewCasual: 'התרגום היומיומי לעברית יופיע כאן.',
      bilingualHint: 'Formal and casual translations will appear here.',
      singleLanguageHint: 'Translation variants will appear here.',
    },
  },
} as const;
