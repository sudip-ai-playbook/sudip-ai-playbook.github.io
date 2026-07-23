import {
  POMODORO_MODE_BREAK,
  type PomodoroMode,
} from './pomodoroLogic.ts';

export const NOTIFICATION_TITLE_BREAK =
  'Break time — 5 minutes' as const;
export const NOTIFICATION_TITLE_FOCUS =
  'Focus time — 25 minutes' as const;
export const NOTIFICATION_BODY_BREAK =
  'Focus session finished. Take a short break.' as const;
export const NOTIFICATION_BODY_FOCUS =
  'Break finished. Time to focus again.' as const;

export type NotificationPermissionResult =
  | 'granted'
  | 'denied'
  | 'default'
  | 'unsupported';

function readNotificationApi():
  | typeof globalThis.Notification
  | undefined {
  if (typeof globalThis.Notification === 'undefined') {
    return undefined;
  }
  return globalThis.Notification;
}

export function notificationTitleForNextMode(mode: PomodoroMode): string {
  if (mode === POMODORO_MODE_BREAK) {
    return NOTIFICATION_TITLE_BREAK;
  }
  return NOTIFICATION_TITLE_FOCUS;
}

export function notificationBodyForNextMode(mode: PomodoroMode): string {
  if (mode === POMODORO_MODE_BREAK) {
    return NOTIFICATION_BODY_BREAK;
  }
  return NOTIFICATION_BODY_FOCUS;
}

export function getNotificationPermission(): NotificationPermissionResult {
  const NotificationApi = readNotificationApi();
  if (NotificationApi === undefined) {
    return 'unsupported';
  }
  return NotificationApi.permission;
}

/**
 * Request permission only from a user gesture (e.g. Start click).
 * Never throws; returns the resulting permission state.
 */
export async function ensureNotificationPermission(): Promise<NotificationPermissionResult> {
  const NotificationApi = readNotificationApi();
  if (NotificationApi === undefined) {
    return 'unsupported';
  }
  if (NotificationApi.permission === 'granted') {
    return 'granted';
  }
  if (NotificationApi.permission === 'denied') {
    return 'denied';
  }
  try {
    const result = await NotificationApi.requestPermission();
    if (result === 'granted' || result === 'denied' || result === 'default') {
      return result;
    }
    return 'denied';
  } catch {
    return 'denied';
  }
}

/**
 * Show a session-complete notification when permission is granted.
 * Safe no-op when unsupported or denied.
 */
export function notifySessionComplete(nextMode: PomodoroMode): boolean {
  const NotificationApi = readNotificationApi();
  if (NotificationApi === undefined) {
    return false;
  }
  if (NotificationApi.permission !== 'granted') {
    return false;
  }
  try {
    new NotificationApi(notificationTitleForNextMode(nextMode), {
      body: notificationBodyForNextMode(nextMode),
      silent: true,
    });
    return true;
  } catch {
    return false;
  }
}
