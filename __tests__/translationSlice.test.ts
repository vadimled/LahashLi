import translationReducer from '../src/store/slices/translationSlice';
import { TranslationMode } from '../src/utils/translationModes';

describe('translationSlice', () => {
  it('should return the initial state with RuToHe as default mode', () => {
    const initialState = translationReducer(undefined, { type: 'unknown' });
    expect(initialState.selectedMode).toBe(TranslationMode.RuToHe);
  });
});
