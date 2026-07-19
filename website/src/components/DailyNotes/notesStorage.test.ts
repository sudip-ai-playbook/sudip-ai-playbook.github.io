import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  createEmptyStore,
  createTask,
  formatDateKey,
  formatDisplayDate,
  formatShortDate,
  getQuickNoteForDay,
  getTasksForDay,
  isValidDateKey,
  listActiveDayKeys,
  listCompletedTasksByDate,
  listDayKeys,
  listIncompleteTasksExcludingDay,
  listFutureIncompleteTasks,
  listPastIncompleteTasks,
  moveTaskToDate,
  parseDailyNotesStore,
  serializeDailyNotesStore,
  setQuickNoteForDay,
  setTasksForDay,
  shouldExpandDaySection,
  updateTaskText,
} from './notesStorage.ts';

describe('notesStorage', () => {
  it('formats a local date key as YYYY-MM-DD', () => {
    const date = new Date(2026, 6, 19);
    assert.equal(formatDateKey(date), '2026-07-19');
  });

  it('formats a display date from a date key', () => {
    const displayDate = formatDisplayDate('2026-07-19');
    assert.match(displayDate, /2026/);
    assert.match(displayDate, /19/);
  });

  it('formats a short date tag from a date key', () => {
    const shortDate = formatShortDate('2026-07-17');
    assert.match(shortDate, /17/);
  });

  it('validates date keys', () => {
    assert.equal(isValidDateKey('2026-07-19'), true);
    assert.equal(isValidDateKey('2026-02-30'), false);
    assert.equal(isValidDateKey('not-a-date'), false);
  });

  it('returns empty store for null, empty, or corrupt JSON', () => {
    assert.deepEqual(parseDailyNotesStore(null), createEmptyStore());
    assert.deepEqual(parseDailyNotesStore(''), createEmptyStore());
    assert.deepEqual(parseDailyNotesStore('{not-json'), createEmptyStore());
    assert.deepEqual(parseDailyNotesStore('[]'), createEmptyStore());
    assert.deepEqual(
      parseDailyNotesStore(JSON.stringify({version: 99, days: {}})),
      createEmptyStore(),
    );
  });

  it('migrates version 1 task arrays into day entries', () => {
    const raw = JSON.stringify({
      version: 1,
      days: {
        '2026-07-18': [{id: 'old', text: 'Yesterday task', done: false}],
      },
    });
    const store = parseDailyNotesStore(raw);
    assert.equal(store.version, 2);
    assert.deepEqual(getTasksForDay(store, '2026-07-18'), [
      {id: 'old', text: 'Yesterday task', done: false},
    ]);
    assert.equal(getQuickNoteForDay(store, '2026-07-18'), '');
  });

  it('round-trips a valid v2 store through serialize and parse', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-19', [
      {id: 'task-1', text: 'Write notes', done: false},
      {id: 'task-2', text: 'Review PR', done: true},
    ]);
    store = setQuickNoteForDay(store, '2026-07-19', 'Meeting at 3pm');

    const restored = parseDailyNotesStore(serializeDailyNotesStore(store));
    assert.deepEqual(restored, store);
    assert.equal(getQuickNoteForDay(restored, '2026-07-19'), 'Meeting at 3pm');
  });

  it('drops invalid tasks while keeping valid ones', () => {
    const raw = JSON.stringify({
      version: 2,
      days: {
        '2026-07-19': {
          tasks: [
            {id: 'ok', text: 'Valid', done: false},
            {id: '', text: 'Bad id', done: false},
            {text: 'Missing id', done: true},
            null,
          ],
          quickNote: 'Keep me',
        },
      },
    });

    const store = parseDailyNotesStore(raw);
    assert.deepEqual(getTasksForDay(store, '2026-07-19'), [
      {id: 'ok', text: 'Valid', done: false},
    ]);
    assert.equal(getQuickNoteForDay(store, '2026-07-19'), 'Keep me');
  });

  it('lists non-empty day keys newest first', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-17', [
      {id: 'a', text: 'A', done: false},
    ]);
    store = setTasksForDay(store, '2026-07-19', [
      {id: 'b', text: 'B', done: false},
    ]);
    store = setQuickNoteForDay(store, '2026-07-18', 'note only');
    assert.deepEqual(listDayKeys(store), [
      '2026-07-19',
      '2026-07-18',
      '2026-07-17',
    ]);
  });

  it('hides completed-only days from active day keys', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-17', [
      {id: 'done', text: 'Finished', done: true},
    ]);
    store = setTasksForDay(store, '2026-07-19', [
      {id: 'open', text: 'Still open', done: false},
    ]);
    store = setQuickNoteForDay(store, '2026-07-18', 'note only');
    assert.deepEqual(listActiveDayKeys(store), [
      '2026-07-19',
      '2026-07-18',
    ]);
  });

  it('updates task text and ignores empty edits', () => {
    const store = setTasksForDay(createEmptyStore(), '2026-07-19', [
      {id: 't1', text: 'Old', done: false},
    ]);
    const updated = updateTaskText(store, '2026-07-19', 't1', '  New text  ');
    assert.deepEqual(getTasksForDay(updated, '2026-07-19'), [
      {id: 't1', text: 'New text', done: false},
    ]);
    assert.deepEqual(
      updateTaskText(store, '2026-07-19', 't1', '   '),
      store,
    );
  });

  it('creates a task from trimmed text and rejects empty input', () => {
    const task = createTask('  Ship notes  ');
    assert.ok(task);
    assert.equal(task.text, 'Ship notes');
    assert.equal(task.done, false);
    assert.ok(task.id.length > 0);
    assert.equal(createTask('   '), null);
    assert.equal(createTask(''), null);
  });

  it('moves a task to another date and keeps other days intact', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-18', [
      {id: 'move-me', text: 'Carry over', done: false},
      {id: 'stay', text: 'Stay yesterday', done: true},
    ]);
    store = setTasksForDay(store, '2026-07-19', [
      {id: 'today', text: 'Today task', done: false},
    ]);

    store = moveTaskToDate(store, '2026-07-18', '2026-07-19', 'move-me');

    assert.deepEqual(getTasksForDay(store, '2026-07-18'), [
      {id: 'stay', text: 'Stay yesterday', done: true},
    ]);
    assert.deepEqual(getTasksForDay(store, '2026-07-19'), [
      {id: 'today', text: 'Today task', done: false},
      {id: 'move-me', text: 'Carry over', done: false},
    ]);
  });

  it('ignores move to the same or invalid date', () => {
    const store = setTasksForDay(createEmptyStore(), '2026-07-19', [
      {id: 'only', text: 'Only', done: false},
    ]);
    assert.deepEqual(
      moveTaskToDate(store, '2026-07-19', '2026-07-19', 'only'),
      store,
    );
    assert.deepEqual(
      moveTaskToDate(store, '2026-07-19', 'bad-date', 'only'),
      store,
    );
  });

  it('lists incomplete tasks from other days only', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-17', [
      {id: 'open-old', text: 'Still open', done: false},
      {id: 'done-old', text: 'Finished', done: true},
    ]);
    store = setTasksForDay(store, '2026-07-19', [
      {id: 'today-open', text: 'Today open', done: false},
    ]);

    assert.deepEqual(listIncompleteTasksExcludingDay(store, '2026-07-19'), [
      {
        dateKey: '2026-07-17',
        task: {id: 'open-old', text: 'Still open', done: false},
      },
    ]);
  });

  it('partitions future and past incomplete tasks around today', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-17', [
      {id: 'past-1', text: 'Older past', done: false},
    ]);
    store = setTasksForDay(store, '2026-07-18', [
      {id: 'past-2', text: 'Recent past', done: false},
    ]);
    store = setTasksForDay(store, '2026-07-19', [
      {id: 'today', text: 'Today task', done: false},
    ]);
    store = setTasksForDay(store, '2026-07-20', [
      {id: 'future-1', text: 'Near future', done: false},
    ]);
    store = setTasksForDay(store, '2026-07-22', [
      {id: 'future-2', text: 'Far future', done: false},
      {id: 'future-done', text: 'Done future', done: true},
    ]);

    assert.deepEqual(listFutureIncompleteTasks(store, '2026-07-19'), [
      {
        dateKey: '2026-07-22',
        task: {id: 'future-2', text: 'Far future', done: false},
      },
      {
        dateKey: '2026-07-20',
        task: {id: 'future-1', text: 'Near future', done: false},
      },
    ]);
    assert.deepEqual(listPastIncompleteTasks(store, '2026-07-19'), [
      {
        dateKey: '2026-07-18',
        task: {id: 'past-2', text: 'Recent past', done: false},
      },
      {
        dateKey: '2026-07-17',
        task: {id: 'past-1', text: 'Older past', done: false},
      },
    ]);
  });

  it('expands day sections by default until more than 6 entries', () => {
    assert.equal(shouldExpandDaySection(0), true);
    assert.equal(shouldExpandDaySection(6), true);
    assert.equal(shouldExpandDaySection(7), false);
  });

  it('lists completed tasks grouped by date newest first', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-17', [
      {id: 'old-done', text: 'Earlier done', done: true},
      {id: 'old-open', text: 'Earlier open', done: false},
    ]);
    store = setTasksForDay(store, '2026-07-19', [
      {id: 'today-done', text: 'Today done', done: true},
    ]);

    assert.deepEqual(listCompletedTasksByDate(store), [
      {
        dateKey: '2026-07-19',
        tasks: [{id: 'today-done', text: 'Today done', done: true}],
      },
      {
        dateKey: '2026-07-17',
        tasks: [{id: 'old-done', text: 'Earlier done', done: true}],
      },
    ]);
  });
});
