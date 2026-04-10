import { RecordButtonStatus } from './recordButton';

export function getNextRecordButtonStatus(
  currentStatus: RecordButtonStatus,
): RecordButtonStatus {
  if (currentStatus === 'idle') {
    return 'listening';
  }

  if (currentStatus === 'listening') {
    return 'processing';
  }

  return currentStatus;
}
