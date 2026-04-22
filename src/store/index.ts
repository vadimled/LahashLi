import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import voiceReducer from './slices/voiceSlice';
import uiReducer from './slices/uiSlice';
import translationReducer from './slices/translationSlice';

export const store = configureStore({
  reducer: {
    voice: voiceReducer,
    ui: uiReducer,
    translation: translationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
