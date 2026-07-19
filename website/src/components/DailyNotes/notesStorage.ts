export const DAILY_NOTES_STORAGE_KEY = 'sudip-ai-playbook-daily-notes';

export const DAILY_NOTES_STORE_VERSION = 2 as const;

export type DailyTask = {
  id: string;
  text: string;
  done: boolean;
};

export type DayEntry = {
  tasks: DailyTask[];
  quickNote: string;
};

export type DailyNotesStore = {
  version: typeof DAILY_NOTES_STORE_VERSION;
  days: Record<string, DayEntry>;
};

export function createEmptyDayEntry(): DayEntry {
  return {
    tasks: [],
    quickNote: '',
  };
}

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

export function formatShortDate(dateKey: string): string {
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
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function isValidDateKey(dateKey: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return false;
  }
  const [yearText, monthText, dayText] = dateKey.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
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

function parseTaskList(value: unknown): DailyTask[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isDailyTask);
}

function parseDayEntry(value: unknown): DayEntry | null {
  if (Array.isArray(value)) {
    return {
      tasks: parseTaskList(value),
      quickNote: '',
    };
  }
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const candidate = value as Partial<DayEntry>;
  return {
    tasks: parseTaskList(candidate.tasks),
    quickNote: typeof candidate.quickNote === 'string' ? candidate.quickNote : '',
  };
}

function isDayEntryEmpty(entry: DayEntry): boolean {
  return entry.tasks.length === 0 && entry.quickNote.trim() === '';
}

function dayHasActiveContent(entry: DayEntry): boolean {
  return (
    entry.quickNote.trim() !== '' ||
    entry.tasks.some((task) => !task.done)
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

    const candidate = parsed as {
      version?: unknown;
      days?: unknown;
    };
    const version = candidate.version;
    if (version !== 1 && version !== DAILY_NOTES_STORE_VERSION) {
      return createEmptyStore();
    }
    if (typeof candidate.days !== 'object' || candidate.days === null) {
      return createEmptyStore();
    }

    const days: Record<string, DayEntry> = {};
    for (const [dateKey, dayValue] of Object.entries(candidate.days)) {
      const entry = parseDayEntry(dayValue);
      if (entry === null) {
        continue;
      }
      days[dateKey] = entry;
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

export function getDayEntry(
  store: DailyNotesStore,
  dateKey: string,
): DayEntry {
  return store.days[dateKey] ?? createEmptyDayEntry();
}

export function getTasksForDay(
  store: DailyNotesStore,
  dateKey: string,
): DailyTask[] {
  return getDayEntry(store, dateKey).tasks;
}

export function getQuickNoteForDay(
  store: DailyNotesStore,
  dateKey: string,
): string {
  return getDayEntry(store, dateKey).quickNote;
}

export function listDayKeys(store: DailyNotesStore): string[] {
  return Object.keys(store.days)
    .filter((dateKey) => !isDayEntryEmpty(store.days[dateKey]))
    .sort((left, right) => right.localeCompare(left));
}

/** Days that still have open tasks or quick notes (completed-only days stay hidden). */
export function listActiveDayKeys(store: DailyNotesStore): string[] {
  return Object.keys(store.days)
    .filter((dateKey) => dayHasActiveContent(store.days[dateKey]))
    .sort((left, right) => right.localeCompare(left));
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

function withDayEntry(
  store: DailyNotesStore,
  dateKey: string,
  entry: DayEntry,
): DailyNotesStore {
  const nextDays = {...store.days};
  if (isDayEntryEmpty(entry)) {
    delete nextDays[dateKey];
  } else {
    nextDays[dateKey] = entry;
  }
  return {
    ...store,
    version: DAILY_NOTES_STORE_VERSION,
    days: nextDays,
  };
}

export function setTasksForDay(
  store: DailyNotesStore,
  dateKey: string,
  tasks: DailyTask[],
): DailyNotesStore {
  const current = getDayEntry(store, dateKey);
  return withDayEntry(store, dateKey, {
    ...current,
    tasks,
  });
}

export function updateTaskText(
  store: DailyNotesStore,
  dateKey: string,
  taskId: string,
  text: string,
): DailyNotesStore {
  const trimmedText = text.trim();
  if (trimmedText === '') {
    return store;
  }
  const currentTasks = getTasksForDay(store, dateKey);
  const nextTasks = currentTasks.map((task) =>
    task.id === taskId ? {...task, text: trimmedText} : task,
  );
  return setTasksForDay(store, dateKey, nextTasks);
}

export function setQuickNoteForDay(
  store: DailyNotesStore,
  dateKey: string,
  quickNote: string,
): DailyNotesStore {
  const current = getDayEntry(store, dateKey);
  return withDayEntry(store, dateKey, {
    ...current,
    quickNote,
  });
}

export function moveTaskToDate(
  store: DailyNotesStore,
  fromDateKey: string,
  toDateKey: string,
  taskId: string,
): DailyNotesStore {
  if (fromDateKey === toDateKey || !isValidDateKey(toDateKey)) {
    return store;
  }

  const sourceEntry = getDayEntry(store, fromDateKey);
  const task = sourceEntry.tasks.find((item) => item.id === taskId);
  if (!task) {
    return store;
  }

  const sourceTasks = sourceEntry.tasks.filter((item) => item.id !== taskId);
  const targetEntry = getDayEntry(store, toDateKey);
  const targetTasks = [...targetEntry.tasks, task];

  let nextStore = withDayEntry(store, fromDateKey, {
    ...sourceEntry,
    tasks: sourceTasks,
  });
  nextStore = withDayEntry(nextStore, toDateKey, {
    ...targetEntry,
    tasks: targetTasks,
  });
  return nextStore;
}

export type IncompleteTaskRef = {
  dateKey: string;
  task: DailyTask;
};

export type TodayReportTaskRow = {
  done: boolean;
  text: string;
  fromDateKey: string | null;
};

export function listIncompleteTasksExcludingDay(
  store: DailyNotesStore,
  excludeDateKey: string,
): IncompleteTaskRef[] {
  const results: IncompleteTaskRef[] = [];
  for (const dateKey of listDayKeys(store)) {
    if (dateKey === excludeDateKey) {
      continue;
    }
    for (const task of getTasksForDay(store, dateKey)) {
      if (!task.done) {
        results.push({dateKey, task});
      }
    }
  }
  return results;
}

/** Collapse Future/Past sections once they grow past this many tasks. */
export const DAY_SECTION_COLLAPSE_THRESHOLD = 2;

export const FUTURE_SECTION_LABEL = 'Future';
export const PAST_SECTION_LABEL = 'Past';

export function shouldExpandDaySection(entryCount: number): boolean {
  return entryCount <= DAY_SECTION_COLLAPSE_THRESHOLD;
}

/** Incomplete tasks on dates before today, oldest past first (today sits below). */
export function listPastIncompleteTasks(
  store: DailyNotesStore,
  todayKey: string,
): IncompleteTaskRef[] {
  return listIncompleteTasksExcludingDay(store, todayKey)
    .filter((item) => item.dateKey < todayKey)
    .sort((left, right) => left.dateKey.localeCompare(right.dateKey));
}

/** Incomplete tasks on dates after today, nearest future first (today sits above). */
export function listFutureIncompleteTasks(
  store: DailyNotesStore,
  todayKey: string,
): IncompleteTaskRef[] {
  return listIncompleteTasksExcludingDay(store, todayKey)
    .filter((item) => item.dateKey > todayKey)
    .sort((left, right) => left.dateKey.localeCompare(right.dateKey));
}

export function buildTodayReportTaskRows(
  store: DailyNotesStore,
  todayKey: string,
): TodayReportTaskRow[] {
  const rows: TodayReportTaskRow[] = [];

  for (const item of listPastIncompleteTasks(store, todayKey)) {
    rows.push({
      done: false,
      text: item.task.text,
      fromDateKey: item.dateKey,
    });
  }

  for (const task of getTasksForDay(store, todayKey)) {
    rows.push({
      done: task.done,
      text: task.text,
      fromDateKey: null,
    });
  }

  for (const item of listFutureIncompleteTasks(store, todayKey)) {
    rows.push({
      done: false,
      text: item.task.text,
      fromDateKey: item.dateKey,
    });
  }

  return rows;
}

export type CompletedTasksGroup = {
  dateKey: string;
  tasks: DailyTask[];
};

export function listCompletedTasksByDate(
  store: DailyNotesStore,
): CompletedTasksGroup[] {
  const groups: CompletedTasksGroup[] = [];
  for (const dateKey of listDayKeys(store)) {
    const completed = getTasksForDay(store, dateKey).filter(
      (task) => task.done,
    );
    if (completed.length > 0) {
      groups.push({dateKey, tasks: completed});
    }
  }
  return groups;
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
