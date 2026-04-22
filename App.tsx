import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { HomeScreen } from './src/screens/HomeScreen/HomeScreen';
import { colors } from './src/theme/colors';
import { store } from './src/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <HomeScreen />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
