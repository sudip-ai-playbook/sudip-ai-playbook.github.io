import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  createEmptyStore,
  createTask,
  formatDateKey,
  formatDisplayDate,
  getTasksForDay,
  listDayKeys,
  parseDailyNotesStore,
  serializeDailyNotesStore,
  setTasksForDay,
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

  it('returns empty store for null, empty, or corrupt JSON', () => {
    assert.deepEqual(parseDailyNotesStore(null), createEmptyStore());
    assert.deepEqual(parseDailyNotesStore(''), createEmptyStore());
    assert.deepEqual(parseDailyNotesStore('{not-json'), createEmptyStore());
    assert.deepEqual(parseDailyNotesStore('[]'), createEmptyStore());
    assert.deepEqual(
      parseDailyNotesStore(JSON.stringify({version: 2, days: {}})),
      createEmptyStore(),
    );
  });

  it('round-trips a valid store through serialize and parse', () => {
    const store = setTasksForDay(createEmptyStore(), '2026-07-19', [
      {id: 'task-1', text: 'Write notes', done: false},
      {id: 'task-2', text: 'Review PR', done: true},
    ]);

    const restored = parseDailyNotesStore(serializeDailyNotesStore(store));
    assert.deepEqual(restored, store);
    assert.deepEqual(getTasksForDay(restored, '2026-07-19'), store.days['2026-07-19']);
  });

  it('drops invalid tasks while keeping valid ones', () => {
    const raw = JSON.stringify({
      version: 1,
      days: {
        '2026-07-19': [
          {id: 'ok', text: 'Valid', done: false},
          {id: '', text: 'Bad id', done: false},
          {text: 'Missing id', done: true},
          null,
        ],
      },
    });

    const store = parseDailyNotesStore(raw);
    assert.deepEqual(store.days['2026-07-19'], [
      {id: 'ok', text: 'Valid', done: false},
    ]);
  });

  it('lists day keys newest first', () => {
    const store = {
      version: 1 as const,
      days: {
        '2026-07-17': [],
        '2026-07-19': [],
        '2026-07-18': [],
      },
    };
    assert.deepEqual(listDayKeys(store), [
      '2026-07-19',
      '2026-07-18',
      '2026-07-17',
    ]);
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
});
