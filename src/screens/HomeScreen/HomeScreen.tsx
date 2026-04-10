import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ModeSelector } from '../../shared/ui/ModeSelector';
import { RecordButton } from '../../shared/ui/RecordButton';
import { Screen } from '../../shared/ui/Screen';
import { TranslationPreviewBlock } from '../../shared/ui/TranslationPreviewBlock';
import { colors } from '../../theme/colors';
import { previewContentByMode } from '../../utils/previewContent';
import { RecordButtonStatus } from '../../utils/recordButton';
import { texts } from '../../utils/texts';
import { TranslationMode } from '../../utils/translationModes';

export function HomeScreen() {
  const [selectedMode, setSelectedMode] = useState<TranslationMode>('ruToEn');
  const [recordButtonStatus, setRecordButtonStatus] =
    useState<RecordButtonStatus>('idle');

  const previewContent = previewContentByMode[selectedMode];

  useEffect(() => {
    if (recordButtonStatus !== 'processing') {
      return;
    }

    const timeoutId = setTimeout(() => {
      setRecordButtonStatus('idle');
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [recordButtonStatus]);

  const handleRecordButtonPress = () => {
    if (recordButtonStatus === 'idle') {
      setRecordButtonStatus('listening');
      return;
    }

    if (recordButtonStatus === 'listening') {
      setRecordButtonStatus('processing');
      return;
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{texts.app.name}</Text>
        <Text style={styles.subtitle}>{texts.app.subtitle}</Text>
      </View>

      <ModeSelector
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
      />

      <View style={styles.center}>
        <RecordButton
          status={recordButtonStatus}
          onPress={handleRecordButtonPress}
        />

        <Text style={styles.hint}>{texts.home.hint}</Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>{texts.home.previewLabel}</Text>
        <Text style={styles.resultSource}>{previewContent.source}</Text>

        <TranslationPreviewBlock
          label={texts.home.previewEnglishLabel}
          value={previewContent.targetEn}
        />

        <TranslationPreviewBlock
          label={texts.home.previewHebrewLabel}
          value={previewContent.targetHe}
          isRtl
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: 24,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  resultLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  resultSource: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
