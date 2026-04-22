import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TranslationMode } from '../../utils/translationModes';

export interface TranslationState {
  selectedMode: TranslationMode;
}

const initialState: TranslationState = {
  selectedMode: TranslationMode.RuToEn,
};

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    setSelectedMode(state, action: PayloadAction<TranslationMode>) {
      state.selectedMode = action.payload;
    },
  },
});

export const { setSelectedMode } = translationSlice.actions;
export default translationSlice.reducer;
