import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  buildTodayReportTaskRows,
  createEmptyStore,
  setTasksForDay,
} from './notesStorage.ts';

describe('notesExport data', () => {
  it('builds today report rows with future, today, then past', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-17', [
      {id: 'old', text: 'Past task', done: false},
    ]);
    store = setTasksForDay(store, '2026-07-19', [
      {id: 'open', text: 'Today open', done: false},
      {id: 'done', text: 'Today done', done: true},
    ]);
    store = setTasksForDay(store, '2026-07-21', [
      {id: 'soon', text: 'Future task', done: false},
    ]);

    assert.deepEqual(buildTodayReportTaskRows(store, '2026-07-19'), [
      {done: false, text: 'Future task', fromDateKey: '2026-07-21'},
      {done: false, text: 'Today open', fromDateKey: null},
      {done: true, text: 'Today done', fromDateKey: null},
      {done: false, text: 'Past task', fromDateKey: '2026-07-17'},
    ]);
  });
});