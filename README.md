# LahashLi

LahashLi is a React Native application built with TypeScript, designed for voice-to-voice translation and speech processing. It leverages OpenAI for translations and advanced speech technologies for a seamless user experience.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `>=22.11.0`
- **npm**: (comes with Node.js)
- **CocoaPods**: (for iOS development)
- **Android Studio / Xcode**: (for mobile emulation/builds)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd LahashLi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install iOS Pods**:
   ```bash
   npm run pods
   ```
   *Note: If you encounter issues with `Podfile.lock`, use `npm run clean:pods`.*

### Running the App

1. **Start Metro Bundler**:
   ```bash
   npm start
   ```

2. **Run on Android**:
   ```bash
   npm run android
   ```

3. **Run on iOS**:
   ```bash
   npm run ios
   ```

## 🛠 Project Structure

- `src/screens`: UI screens (e.g., `HomeScreen`).
- `src/shared`: Shared UI components, hooks, and constants.
- `src/utils`: Business logic, helpers, and integrations:
  - `voiceRecognition.ts`: Wraps `react-native-voicekit` for STT.
  - `textToSpeech.ts`: Wraps `@mhpdev/react-native-speech` for TTS.
  - `openAiTranslation.ts`: Handles translation logic via OpenAI.
- `src/theme`: Styling and color definitions.
- `__tests__`: Unit and component tests.

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm start` | Starts the Metro bundler. |
| `npm run android` | Builds and runs the app on an Android emulator or device. |
| `npm run ios` | Builds and runs the app on an iOS simulator or device. |
| `npm run lint` | Runs ESLint for code quality checks. |
| `npm test` | Executes unit tests using Jest. |
| `npm run typecheck` | Runs TypeScript compiler to check for type errors. |
| `npm run pods` | Installs CocoaPods dependencies. |
| `npm run clean:pods` | Cleans and reinstalls CocoaPods dependencies. |

## ⚙️ Configuration & Environment

### OpenAI Configuration
The app uses OpenAI for translation. Configuration is located at `src/utils/openAiConfig.ts`.
- **TODO**: Move sensitive configuration (like API keys) to environment variables (`.env` file).

### State Management
- **Redux Toolkit**: Used for global state management.

### Data Validation
- **Zod**: Used for schema validation across the project.

## 🧪 Testing

The project uses **Jest** for unit and component testing.

- **Run all tests**:
  ```bash
  npm test
  ```
- **Run a specific test file**:
  ```bash
  npx jest path/to/test.ts
  ```

## 📝 License

- **TODO**: Add license information.
