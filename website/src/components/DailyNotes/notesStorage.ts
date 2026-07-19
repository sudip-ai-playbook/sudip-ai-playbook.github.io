export const DAILY_NOTES_STORAGE_KEY = 'sudip-ai-playbook-daily-notes';

export const DAILY_NOTES_STORE_VERSION = 1 as const;

export type DailyTask = {
  id: string;
  text: string;
  done: boolean;
};

export type DailyNotesStore = {
  version: typeof DAILY_NOTES_STORE_VERSION;
  days: Record<string, DailyTask[]>;
};

export function createEmptyStore(): DailyNotesStore {
  return {
    version: DAILY_NOTES_STORE_VERSION,
    days: {},
  };
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateKey: string): string {
  const [yearText, monthText, dayText] = dateKey.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return dateKey;
  }

  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function isDailyTask(value: unknown): value is DailyTask {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Partial<DailyTask>;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.text === 'string' &&
    typeof candidate.done === 'boolean'
  );
}

export function parseDailyNotesStore(raw: string | null): DailyNotesStore {
  if (raw === null || raw.trim() === '') {
    return createEmptyStore();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return createEmptyStore();
    }

    const candidate = parsed as Partial<DailyNotesStore>;
    if (candidate.version !== DAILY_NOTES_STORE_VERSION) {
      return createEmptyStore();
    }
    if (typeof candidate.days !== 'object' || candidate.days === null) {
      return createEmptyStore();
    }

    const days: Record<string, DailyTask[]> = {};
    for (const [dateKey, tasks] of Object.entries(candidate.days)) {
      if (!Array.isArray(tasks)) {
        continue;
      }
      days[dateKey] = tasks.filter(isDailyTask);
    }

    return {
      version: DAILY_NOTES_STORE_VERSION,
      days,
    };
  } catch {
    return createEmptyStore();
  }
}

export function serializeDailyNotesStore(store: DailyNotesStore): string {
  return JSON.stringify(store);
}

export function getTasksForDay(
  store: DailyNotesStore,
  dateKey: string,
): DailyTask[] {
  return store.days[dateKey] ?? [];
}

export function listDayKeys(store: DailyNotesStore): string[] {
  return Object.keys(store.days).sort((left, right) => right.localeCompare(left));
}

export function createTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTask(text: string): DailyTask | null {
  const trimmedText = text.trim();
  if (trimmedText === '') {
    return null;
  }
  return {
    id: createTaskId(),
    text: trimmedText,
    done: false,
  };
}

export function setTasksForDay(
  store: DailyNotesStore,
  dateKey: string,
  tasks: DailyTask[],
): DailyNotesStore {
  return {
    ...store,
    days: {
      ...store.days,
      [dateKey]: tasks,
    },
  };
}

export function loadDailyNotesStore(): DailyNotesStore {
  if (typeof localStorage === 'undefined') {
    return createEmptyStore();
  }
  return parseDailyNotesStore(localStorage.getItem(DAILY_NOTES_STORAGE_KEY));
}

export function saveDailyNotesStore(store: DailyNotesStore): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(
    DAILY_NOTES_STORAGE_KEY,
    serializeDailyNotesStore(store),
  );
}
