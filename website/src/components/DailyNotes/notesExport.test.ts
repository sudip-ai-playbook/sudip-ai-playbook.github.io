import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  buildTodayReportTaskRows,
  createEmptyStore,
  setTasksForDay,
} from './notesStorage.ts';

describe('notesExport data', () => {
  it('builds today report rows with carryovers first then today tasks', () => {
    let store = setTasksForDay(createEmptyStore(), '2026-07-17', [
      {id: 'old', text: 'Carry over', done: false},
    ]);
    store = setTasksForDay(store, '2026-07-19', [
      {id: 'open', text: 'Today open', done: false},
      {id: 'done', text: 'Today done', done: true},
    ]);

    assert.deepEqual(buildTodayReportTaskRows(store, '2026-07-19'), [
      {done: false, text: 'Carry over', fromDateKey: '2026-07-17'},
      {done: false, text: 'Today open', fromDateKey: null},
      {done: true, text: 'Today done', fromDateKey: null},
    ]);
  });
});
