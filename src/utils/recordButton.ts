export type RecordButtonStatus = 'idle' | 'listening' | 'processing';

export function getNextRecordButtonStatus(currentStatus: RecordButtonStatus): RecordButtonStatus {
  switch (currentStatus) {
    case 'idle':
      return 'listening';
    case 'listening':
      return 'processing';
    case 'processing':
      return 'idle';
    default:
      return 'idle';
  }
}
