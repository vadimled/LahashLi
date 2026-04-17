import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS, type Permission, type PermissionStatus } from 'react-native-permissions';

export type MicrophonePermissionResult = 'granted' | 'denied' | 'blocked' | 'unavailable';

function getMicrophonePermission(): Permission {
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.MICROPHONE;
  }

  return PERMISSIONS.ANDROID.RECORD_AUDIO;
}

function mapPermissionStatus(status: PermissionStatus): MicrophonePermissionResult {
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    return 'granted';
  }

  if (status === RESULTS.BLOCKED) {
    return 'blocked';
  }

  if (status === RESULTS.UNAVAILABLE) {
    return 'unavailable';
  }

  return 'denied';
}

export async function requestMicrophonePermission(): Promise<MicrophonePermissionResult> {
  const permission = getMicrophonePermission();

  const currentStatus = await check(permission);

  if (currentStatus === RESULTS.GRANTED || currentStatus === RESULTS.LIMITED) {
    return 'granted';
  }

  if (currentStatus === RESULTS.BLOCKED) {
    return 'blocked';
  }

  if (currentStatus === RESULTS.UNAVAILABLE) {
    return 'unavailable';
  }

  const requestedStatus = await request(permission);

  return mapPermissionStatus(requestedStatus);
}
