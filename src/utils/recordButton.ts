export type RecordButtonStatus = 'idle' | 'listening' | 'processing';

export const recordButtonTexts = {
  idle: 'Speak',
  listening: 'Listening...',
  processing: 'Processing...',
} as const;
