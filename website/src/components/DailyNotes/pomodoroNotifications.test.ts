import assert from 'node:assert/strict';
import {afterEach, describe, it} from 'node:test';
import {
  POMODORO_MODE_BREAK,
  POMODORO_MODE_FOCUS,
} from './pomodoroLogic.ts';
import {
  ensureNotificationPermission,
  getNotificationPermission,
  NOTIFICATION_BODY_BREAK,
  NOTIFICATION_BODY_FOCUS,
  NOTIFICATION_TITLE_BREAK,
  NOTIFICATION_TITLE_FOCUS,
  notificationBodyForNextMode,
  notificationTitleForNextMode,
  notifySessionComplete,
} from './pomodoroNotifications.ts';

type MockPermission = NotificationPermission;

type MockNotificationCtor = {
  permission: MockPermission;
  requestPermission: () => Promise<NotificationPermission>;
  new (
    title: string,
    options?: NotificationOptions,
  ): {title: string; options?: NotificationOptions};
};

const createdNotifications: Array<{
  title: string;
  options?: NotificationOptions;
}> = [];

function installNotificationMock(
  permission: MockPermission,
  requestPermission?: () => Promise<NotificationPermission>,
): void {
  createdNotifications.length = 0;
  const NotificationMock = function NotificationMock(
    this: {title: string; options?: NotificationOptions},
    title: string,
    options?: NotificationOptions,
  ): void {
    this.title = title;
    this.options = options;
    createdNotifications.push({title, options});
  } as unknown as MockNotificationCtor;
  NotificationMock.permission = permission;
  NotificationMock.requestPermission =
    requestPermission ??
    (async () => {
      return permission;
    });
  Object.defineProperty(globalThis, 'Notification', {
    configurable: true,
    writable: true,
    value: NotificationMock,
  });
}

function removeNotificationApi(): void {
  Object.defineProperty(globalThis, 'Notification', {
    configurable: true,
    writable: true,
    value: undefined,
  });
}

afterEach(() => {
  removeNotificationApi();
  createdNotifications.length = 0;
});

describe('pomodoroNotifications', () => {
  it('builds titles and bodies for the next mode', () => {
    assert.equal(
      notificationTitleForNextMode(POMODORO_MODE_BREAK),
      NOTIFICATION_TITLE_BREAK,
    );
    assert.equal(
      notificationTitleForNextMode(POMODORO_MODE_FOCUS),
      NOTIFICATION_TITLE_FOCUS,
    );
    assert.equal(
      notificationBodyForNextMode(POMODORO_MODE_BREAK),
      NOTIFICATION_BODY_BREAK,
    );
    assert.equal(
      notificationBodyForNextMode(POMODORO_MODE_FOCUS),
      NOTIFICATION_BODY_FOCUS,
    );
  });

  it('reports unsupported when Notification is missing', () => {
    removeNotificationApi();
    assert.equal(getNotificationPermission(), 'unsupported');
  });

  it('reports current permission when available', () => {
    installNotificationMock('denied');
    assert.equal(getNotificationPermission(), 'denied');
  });

  it('ensurePermission returns unsupported without API', async () => {
    removeNotificationApi();
    assert.equal(await ensureNotificationPermission(), 'unsupported');
  });

  it('ensurePermission short-circuits on granted and denied', async () => {
    installNotificationMock('granted');
    assert.equal(await ensureNotificationPermission(), 'granted');
    installNotificationMock('denied');
    assert.equal(await ensureNotificationPermission(), 'denied');
  });

  it('ensurePermission requests when default', async () => {
    installNotificationMock('default', async () => 'granted');
    assert.equal(await ensureNotificationPermission(), 'granted');
  });

  it('ensurePermission returns denied for unexpected permission values', async () => {
    installNotificationMock('default', async () => {
      return 'maybe' as NotificationPermission;
    });
    assert.equal(await ensureNotificationPermission(), 'denied');
  });

  it('ensurePermission returns denied when request throws', async () => {
    installNotificationMock('default', async () => {
      throw new Error('blocked');
    });
    assert.equal(await ensureNotificationPermission(), 'denied');
  });

  it('notifySessionComplete no-ops without permission', () => {
    removeNotificationApi();
    assert.equal(notifySessionComplete(POMODORO_MODE_BREAK), false);
    installNotificationMock('denied');
    assert.equal(notifySessionComplete(POMODORO_MODE_BREAK), false);
    assert.equal(createdNotifications.length, 0);
  });

  it('notifySessionComplete creates a notification when granted', () => {
    installNotificationMock('granted');
    assert.equal(notifySessionComplete(POMODORO_MODE_BREAK), true);
    assert.equal(createdNotifications.length, 1);
    assert.equal(createdNotifications[0]?.title, NOTIFICATION_TITLE_BREAK);
    assert.equal(
      createdNotifications[0]?.options?.body,
      NOTIFICATION_BODY_BREAK,
    );
    assert.equal(createdNotifications[0]?.options?.silent, true);
  });

  it('notifySessionComplete returns false when constructor throws', () => {
    createdNotifications.length = 0;
    const ThrowingNotification = function ThrowingNotification(): void {
      throw new Error('fail');
    } as unknown as MockNotificationCtor;
    ThrowingNotification.permission = 'granted';
    ThrowingNotification.requestPermission = async () => 'granted';
    Object.defineProperty(globalThis, 'Notification', {
      configurable: true,
      writable: true,
      value: ThrowingNotification,
    });
    assert.equal(notifySessionComplete(POMODORO_MODE_FOCUS), false);
  });
});
