module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs/toolkit|@mhpdev/react-native-speech|immer)/)',
  ],
  testPathIgnorePatterns: ['/__tests__/setup.js'],
};
