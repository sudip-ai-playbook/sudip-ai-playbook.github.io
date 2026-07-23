import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  applySessionComplete,
  BREAK_MS,
  clampRemainingMs,
  completePomodoroSession,
  createInitialPomodoroState,
  durationForMode,
  FOCUS_MS,
  formatPomodoroClock,
  hydratePomodoroAt,
  isPomodoroMode,
  MAX_REMAINING_MS,
  nextMode,
  parsePomodoroClock,
  pausePomodoro,
  POMODORO_MODE_BREAK,
  POMODORO_MODE_FOCUS,
  resetPomodoro,
  setPomodoroRemaining,
  startPomodoro,
  tickPomodoro,
} from './pomodoroLogic.ts';

describe('pomodoroLogic', () => {
  it('creates an idle focus session at 25:00', () => {
    const state = createInitialPomodoroState();
    assert.equal(state.mode, POMODORO_MODE_FOCUS);
    assert.equal(state.running, false);
    assert.equal(state.endsAtMs, null);
    assert.equal(state.remainingMs, FOCUS_MS);
  });

  it('reports durations and next mode', () => {
    assert.equal(durationForMode(POMODORO_MODE_FOCUS), FOCUS_MS);
    assert.equal(durationForMode(POMODORO_MODE_BREAK), BREAK_MS);
    assert.equal(nextMode(POMODORO_MODE_FOCUS), POMODORO_MODE_BREAK);
    assert.equal(nextMode(POMODORO_MODE_BREAK), POMODORO_MODE_FOCUS);
  });

  it('clamps remaining milliseconds', () => {
    assert.equal(clampRemainingMs(-10), 0);
    assert.equal(clampRemainingMs(Number.NaN), 0);
    assert.equal(clampRemainingMs(1500.9), 1500);
    assert.equal(clampRemainingMs(MAX_REMAINING_MS + 1), MAX_REMAINING_MS);
  });

  it('formats the clock as MM:SS', () => {
    assert.equal(formatPomodoroClock(FOCUS_MS), '25:00');
    assert.equal(formatPomodoroClock(BREAK_MS), '05:00');
    assert.equal(formatPomodoroClock(61_000), '01:01');
    assert.equal(formatPomodoroClock(999), '00:01');
    assert.equal(formatPomodoroClock(0), '00:00');
  });

  it('parses MM:SS clock text', () => {
    assert.equal(parsePomodoroClock('25:00'), FOCUS_MS);
    assert.equal(parsePomodoroClock('5:00'), BREAK_MS);
    assert.equal(parsePomodoroClock(' 01:30 '), 90_000);
    assert.equal(parsePomodoroClock('00:00'), 0);
    assert.equal(parsePomodoroClock('99:59'), MAX_REMAINING_MS);
    assert.equal(parsePomodoroClock(''), null);
    assert.equal(parsePomodoroClock('25'), null);
    assert.equal(parsePomodoroClock('25:60'), null);
    assert.equal(parsePomodoroClock('100:00'), null);
    assert.equal(parsePomodoroClock('ab:cd'), null);
  });

  it('sets remaining while paused and while running', () => {
    const nowMs = 1_000_000;
    const paused = setPomodoroRemaining(
      createInitialPomodoroState(),
      90_000,
      nowMs,
    );
    assert.equal(paused.remainingMs, 90_000);
    assert.equal(paused.running, false);
    assert.equal(paused.endsAtMs, null);

    const started = startPomodoro(paused, nowMs);
    const updated = setPomodoroRemaining(started, 45_000, nowMs + 100);
    assert.equal(updated.remainingMs, 45_000);
    assert.equal(updated.running, true);
    assert.equal(updated.endsAtMs, nowMs + 100 + 45_000);
  });

  it('starts a paused session from remaining time', () => {
    const nowMs = 1_000_000;
    const started = startPomodoro(createInitialPomodoroState(), nowMs);
    assert.equal(started.running, true);
    assert.equal(started.endsAtMs, nowMs + FOCUS_MS);
    assert.equal(started.remainingMs, FOCUS_MS);
  });

  it('does not restart when already running', () => {
    const nowMs = 1_000_000;
    const started = startPomodoro(createInitialPomodoroState(), nowMs);
    const again = startPomodoro(started, nowMs + 5_000);
    assert.equal(again.endsAtMs, started.endsAtMs);
  });

  it('starts the next mode when remaining is zero', () => {
    const nowMs = 2_000_000;
    const exhausted = {
      ...createInitialPomodoroState(),
      remainingMs: 0,
    };
    const started = startPomodoro(exhausted, nowMs);
    assert.equal(started.mode, POMODORO_MODE_BREAK);
    assert.equal(started.running, true);
    assert.equal(started.remainingMs, BREAK_MS);
    assert.equal(started.endsAtMs, nowMs + BREAK_MS);
  });

  it('pauses a running session and preserves remaining', () => {
    const nowMs = 1_000_000;
    const started = startPomodoro(createInitialPomodoroState(), nowMs);
    const paused = pausePomodoro(started, nowMs + 60_000);
    assert.equal(paused.running, false);
    assert.equal(paused.endsAtMs, null);
    assert.equal(paused.remainingMs, FOCUS_MS - 60_000);
  });

  it('pause is a no-op when not running', () => {
    const idle = createInitialPomodoroState();
    assert.deepEqual(pausePomodoro(idle, 100), idle);
  });

  it('reset returns a fresh focus session', () => {
    const nowMs = 1_000_000;
    const started = startPomodoro(createInitialPomodoroState(), nowMs);
    const reset = resetPomodoro();
    assert.deepEqual(reset, createInitialPomodoroState());
    assert.notEqual(started.running, reset.running);
  });

  it('ticks down remaining while running', () => {
    const nowMs = 1_000_000;
    const started = startPomodoro(createInitialPomodoroState(), nowMs);
    const ticked = tickPomodoro(started, nowMs + 2_500);
    assert.equal(ticked.remainingMs, FOCUS_MS - 2_500);
    assert.equal(ticked.running, true);
  });

  it('tick is a no-op when paused', () => {
    const idle = createInitialPomodoroState();
    assert.equal(tickPomodoro(idle, 50), idle);
  });

  it('completes focus into a running break', () => {
    const nowMs = 1_000_000;
    const started = startPomodoro(createInitialPomodoroState(), nowMs);
    const completed = completePomodoroSession(started, nowMs + FOCUS_MS);
    assert.equal(completed.mode, POMODORO_MODE_BREAK);
    assert.equal(completed.running, true);
    assert.equal(completed.remainingMs, BREAK_MS);
    assert.equal(completed.endsAtMs, nowMs + FOCUS_MS + BREAK_MS);
  });

  it('completes break into a running focus', () => {
    const nowMs = 3_000_000;
    const onBreak = {
      mode: POMODORO_MODE_BREAK,
      running: true,
      endsAtMs: nowMs,
      remainingMs: 0,
    } as const;
    const result = applySessionComplete(onBreak, nowMs);
    assert.equal(result.completedMode, POMODORO_MODE_BREAK);
    assert.equal(result.nextMode, POMODORO_MODE_FOCUS);
    assert.equal(result.state.mode, POMODORO_MODE_FOCUS);
    assert.equal(result.state.remainingMs, FOCUS_MS);
  });

  it('tick auto-completes when deadline passes', () => {
    const nowMs = 1_000_000;
    const started = startPomodoro(createInitialPomodoroState(), nowMs);
    const after = tickPomodoro(started, nowMs + FOCUS_MS + 10);
    assert.equal(after.mode, POMODORO_MODE_BREAK);
    assert.equal(after.running, true);
    assert.equal(after.remainingMs, BREAK_MS);
  });

  it('hydrate resumes a future deadline without completing', () => {
    const nowMs = 5_000_000;
    const running = {
      mode: POMODORO_MODE_FOCUS,
      running: true,
      endsAtMs: nowMs + 30_000,
      remainingMs: 30_000,
    } as const;
    const hydrated = hydratePomodoroAt(running, nowMs);
    assert.equal(hydrated.didComplete, false);
    assert.equal(hydrated.state.remainingMs, 30_000);
    assert.equal(hydrated.state.running, true);
  });

  it('hydrate completes once when deadline is past', () => {
    const nowMs = 5_000_000;
    const overdue = {
      mode: POMODORO_MODE_FOCUS,
      running: true,
      endsAtMs: nowMs - 1,
      remainingMs: 0,
    } as const;
    const hydrated = hydratePomodoroAt(overdue, nowMs);
    assert.equal(hydrated.didComplete, true);
    assert.equal(hydrated.completedMode, POMODORO_MODE_FOCUS);
    assert.equal(hydrated.nextMode, POMODORO_MODE_BREAK);
    assert.equal(hydrated.state.mode, POMODORO_MODE_BREAK);
    assert.equal(hydrated.state.running, true);
  });

  it('hydrate stops a non-running session', () => {
    const hydrated = hydratePomodoroAt(
      {
        mode: POMODORO_MODE_BREAK,
        running: false,
        endsAtMs: 123,
        remainingMs: 4_000,
      },
      9_000,
    );
    assert.equal(hydrated.didComplete, false);
    assert.equal(hydrated.state.running, false);
    assert.equal(hydrated.state.endsAtMs, null);
    assert.equal(hydrated.state.remainingMs, 4_000);
  });

  it('recognizes pomodoro modes', () => {
    assert.equal(isPomodoroMode('focus'), true);
    assert.equal(isPomodoroMode('break'), true);
    assert.equal(isPomodoroMode('other'), false);
    assert.equal(isPomodoroMode(null), false);
  });
});
