import { useEffect, useState } from 'react';

import { getNextRecordButtonStatus, RecordButtonStatus } from '../../utils/recordButton';

export function useRecordButtonState() {
  const [recordButtonStatus, setRecordButtonStatus] = useState<RecordButtonStatus>('idle');

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
    setRecordButtonStatus(currentStatus => getNextRecordButtonStatus(currentStatus));
  };

  return {
    recordButtonStatus,
    handleRecordButtonPress,
  };
}
