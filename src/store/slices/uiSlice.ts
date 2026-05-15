import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TranslationCopyKey } from '../../utils/constants';

export interface UiState {
  isSoundEnabled: boolean;
  isSpeaking: boolean;
  soundErrorMessage?: string;
  copiedKey: TranslationCopyKey | null;
  speakingText?: string;
  speakingLanguage?: string;
}

const initialState: UiState = {
  isSoundEnabled: false,
  isSpeaking: false,
  copiedKey: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsSoundEnabled(state, action: PayloadAction<boolean>) {
      state.isSoundEnabled = action.payload;
    },
    setIsSpeaking(state, action: PayloadAction<boolean>) {
      state.isSpeaking = action.payload;
    },
    setSoundErrorMessage(state, action: PayloadAction<string | undefined>) {
      state.soundErrorMessage = action.payload;
    },
    setCopiedKey(state, action: PayloadAction<TranslationCopyKey | null>) {
      state.copiedKey = action.payload;
    },
    setSpeakingMetadata(state, action: PayloadAction<{ text?: string; language?: string }>) {
      state.speakingText = action.payload.text;
      state.speakingLanguage = action.payload.language;
    },
  },
});

export const {
  setIsSoundEnabled,
  setIsSpeaking,
  setSoundErrorMessage,
  setCopiedKey,
  setSpeakingMetadata,
} = uiSlice.actions;

export default uiSlice.reducer;
