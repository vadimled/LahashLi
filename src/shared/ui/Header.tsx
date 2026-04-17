import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { RecordButtonStatus } from '../../utils/recordButton';
import { texts } from '../../utils/texts';
import { RecordButton } from './RecordButton';
import { SoundButton } from './SoundButton';

type HeaderProps = {
  recordButtonStatus: RecordButtonStatus;
  onPressRecordButton: () => void;
  isSoundEnabled: boolean;
  isSpeaking: boolean;
  onPressSoundButton: () => void;
};

export function Header({
  recordButtonStatus,
  onPressRecordButton,
  isSoundEnabled,
  isSpeaking,
  onPressSoundButton,
}: HeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{texts.app.name}</Text>
        <Text style={styles.subtitle}>{texts.app.subtitle}</Text>
      </View>

      <View style={styles.actionsColumn}>
        <RecordButton status={recordButtonStatus} onPress={onPressRecordButton} />
        <SoundButton isEnabled={isSoundEnabled} isSpeaking={isSpeaking} onPress={onPressSoundButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  textBlock: {
    flex: 1,
    paddingTop: 4,
    paddingRight: 4,
    gap: 6,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  actionsColumn: {
    width: 156,
    alignItems: 'stretch',
    gap: 10,
  },
});
