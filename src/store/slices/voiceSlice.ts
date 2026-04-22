import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RecordButtonStatus } from '../../utils/recordButton';
import { translateWithOpenAi, TranslationVariant } from '../../utils/openAiTranslation';
import { TranslationMode } from '../../utils/translationModes';
import { openAiConfig } from '../../utils/openAiConfig';
import { texts } from '../../utils/texts';

export interface VoiceState {
  status: RecordButtonStatus;
  transcript?: string;
  liveTranscript?: string;
  translationEn?: TranslationVariant;
  translationHe?: TranslationVariant;
  translationRu?: TranslationVariant;
  errorMessage?: string;
}

const initialState: VoiceState = {
  status: 'idle',
};

export const translateTranscript = createAsyncThunk(
  'voice/translate',
  async (
    { transcript, mode }: { transcript: string; mode: TranslationMode },
    { rejectWithValue }
  ) => {
    if (!openAiConfig.apiKey.trim()) {
      return rejectWithValue(texts.home.recordButton.error.missingOpenAiApiKey);
    }

    try {
      return await translateWithOpenAi({
        text: transcript,
        mode: mode,
        apiKey: openAiConfig.apiKey,
        model: openAiConfig.model,
      });
    } catch {
      return rejectWithValue(texts.home.recordButton.error.translationFailed);
    }
  }
);

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<RecordButtonStatus>) {
      state.status = action.payload;
    },
    setLiveTranscript(state, action: PayloadAction<string>) {
      state.liveTranscript = action.payload;
    },
    setTranslationResult(
      state,
      action: PayloadAction<{
        transcript?: string;
        translationEn?: TranslationVariant;
        translationHe?: TranslationVariant;
        translationRu?: TranslationVariant;
        errorMessage?: string;
      }>
    ) {
      const { transcript, translationEn, translationHe, translationRu, errorMessage } = action.payload;
      state.status = 'idle';
      state.transcript = transcript;
      state.translationEn = translationEn;
      state.translationHe = translationHe;
      state.translationRu = translationRu;
      state.errorMessage = errorMessage;
      state.liveTranscript = undefined;
    },
    setErrorMessage(state, action: PayloadAction<string | undefined>) {
      state.errorMessage = action.payload;
    },
    resetVoiceState(state) {
      state.status = 'idle';
      state.transcript = undefined;
      state.liveTranscript = undefined;
      state.translationEn = undefined;
      state.translationHe = undefined;
      state.translationRu = undefined;
      state.errorMessage = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(translateTranscript.pending, (state) => {
        state.status = 'processing';
      })
      .addCase(translateTranscript.fulfilled, (state, action) => {
        state.status = 'idle';
        state.transcript = action.payload.source;
        state.translationEn = action.payload.translationEn;
        state.translationHe = action.payload.translationHe;
        state.translationRu = action.payload.translationRu;
        state.errorMessage = undefined;
        state.liveTranscript = undefined;
      })
      .addCase(translateTranscript.rejected, (state, action) => {
        state.status = 'idle';
        state.errorMessage = (action.payload as string) || texts.home.recordButton.error.translationFailed;
      });
  },
});

export const {
  setStatus,
  setLiveTranscript,
  setTranslationResult,
  setErrorMessage,
  resetVoiceState,
} = voiceSlice.actions;

export default voiceSlice.reducer;
