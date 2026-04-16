import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { texts } from '../../utils/texts';
import { RecordButton } from './RecordButton';
import { RecordButtonStatus } from '../../utils/recordButton';

type HeaderProps = {
  recordButtonStatus: RecordButtonStatus;
  onPressRecordButton: () => void;
};

export function Header({ recordButtonStatus, onPressRecordButton }: HeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{texts.app.name}</Text>
        <Text style={styles.subtitle}>{texts.app.subtitle}</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <RecordButton status={recordButtonStatus} onPress={onPressRecordButton} />
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
    gap: 4,
    paddingTop: 2,
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
  buttonWrapper: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
