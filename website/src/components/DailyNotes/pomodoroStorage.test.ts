import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  BREAK_MS,
  createInitialPomodoroState,
  FOCUS_MS,
  POMODORO_MODE_BREAK,
  POMODORO_MODE_FOCUS,
} from './pomodoroLogic.ts';
import {
  loadPomodoroState,
  parsePomodoroState,
  POMODORO_STORAGE_KEY,
  savePomodoroState,
  serializePomodoroState,
} from './pomodoroStorage.ts';

describe('pomodoroStorage', () => {
  it('serializes and parses a valid state', () => {
    const state = {
      mode: POMODORO_MODE_FOCUS,
      running: true,
      endsAtMs: 1_700_000_000_000,
      remainingMs: 12_000,
    } as const;
    const raw = serializePomodoroState(state);
    const parsed = parsePomodoroState(raw);
    assert.deepEqual(parsed, state);
  });

  it('returns initial state for null or empty input', () => {
    assert.deepEqual(parsePomodoroState(null), createInitialPomodoroState());
    assert.deepEqual(parsePomodoroState(''), createInitialPomodoroState());
  });

  it('returns initial state for invalid JSON', () => {
    assert.deepEqual(
      parsePomodoroState('{not-json'),
      createInitialPomodoroState(),
    );
    assert.deepEqual(parsePomodoroState('[]'), createInitialPomodoroState());
    assert.deepEqual(parsePomodoroState('null'), createInitialPomodoroState());
  });

  it('returns initial state for invalid shape', () => {
    assert.deepEqual(
      parsePomodoroState(JSON.stringify({mode: 'focus'})),
      createInitialPomodoroState(),
    );
    assert.deepEqual(
      parsePomodoroState(
        JSON.stringify({
          mode: 'nope',
          running: false,
          endsAtMs: null,
          remainingMs: FOCUS_MS,
        }),
      ),
      createInitialPomodoroState(),
    );
  });

  it('clamps remaining and clears endsAt when not running', () => {
    const parsed = parsePomodoroState(
      JSON.stringify({
        mode: POMODORO_MODE_BREAK,
        running: false,
        endsAtMs: 99,
        remainingMs: 999_999_999,
      }),
    );
    assert.equal(parsed.mode, POMODORO_MODE_BREAK);
    assert.equal(parsed.running, false);
    assert.equal(parsed.endsAtMs, null);
    assert.equal(parsed.remainingMs, BREAK_MS);
  });

  it('rejects non-finite remaining and clears invalid endsAt', () => {
    assert.deepEqual(
      parsePomodoroState(
        JSON.stringify({
          mode: POMODORO_MODE_FOCUS,
          running: true,
          endsAtMs: Number.NaN,
          remainingMs: FOCUS_MS,
        }),
      ),
      {
        mode: POMODORO_MODE_FOCUS,
        running: true,
        endsAtMs: null,
        remainingMs: FOCUS_MS,
      },
    );
    assert.deepEqual(
      parsePomodoroState(
        JSON.stringify({
          mode: POMODORO_MODE_FOCUS,
          running: false,
          endsAtMs: null,
          remainingMs: 'nope',
        }),
      ),
      createInitialPomodoroState(),
    );
  });

  it('loads and saves through localStorage', () => {
    const memory = new Map<string, string>();
    const previous = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(key: string): string | null {
          return memory.has(key) ? memory.get(key)! : null;
        },
        setItem(key: string, value: string): void {
          memory.set(key, value);
        },
      },
    });

    try {
      assert.deepEqual(loadPomodoroState(), createInitialPomodoroState());
      const state = {
        mode: POMODORO_MODE_FOCUS,
        running: true,
        endsAtMs: 42,
        remainingMs: 1_000,
      } as const;
      savePomodoroState(state);
      assert.equal(
        memory.get(POMODORO_STORAGE_KEY),
        serializePomodoroState(state),
      );
      assert.deepEqual(loadPomodoroState(), state);
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: previous,
      });
    }
  });

  it('no-ops load and save when localStorage is unavailable', () => {
    const previous = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: undefined,
    });
    try {
      assert.deepEqual(loadPomodoroState(), createInitialPomodoroState());
      savePomodoroState(createInitialPomodoroState());
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: previous,
      });
    }
  });

  it('tolerates localStorage getItem and setItem failures', () => {
    const previous = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(): string {
          throw new Error('blocked');
        },
        setItem(): void {
          throw new Error('quota');
        },
      },
    });
    try {
      assert.deepEqual(loadPomodoroState(), createInitialPomodoroState());
      savePomodoroState(createInitialPomodoroState());
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: previous,
      });
    }
  });
});
