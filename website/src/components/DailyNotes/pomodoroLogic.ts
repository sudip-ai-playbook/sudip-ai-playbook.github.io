export const FOCUS_MS = 25 * 60 * 1000;
export const BREAK_MS = 5 * 60 * 1000;

export const POMODORO_MODE_FOCUS = 'focus' as const;
export const POMODORO_MODE_BREAK = 'break' as const;

export type PomodoroMode =
  | typeof POMODORO_MODE_FOCUS
  | typeof POMODORO_MODE_BREAK;

export type PomodoroState = {
  mode: PomodoroMode;
  running: boolean;
  endsAtMs: number | null;
  remainingMs: number;
};

export function durationForMode(mode: PomodoroMode): number {
  if (mode === POMODORO_MODE_BREAK) {
    return BREAK_MS;
  }
  return FOCUS_MS;
}

export function createInitialPomodoroState(): PomodoroState {
  return {
    mode: POMODORO_MODE_FOCUS,
    running: false,
    endsAtMs: null,
    remainingMs: FOCUS_MS,
  };
}

export function clampRemainingMs(remainingMs: number): number {
  if (!Number.isFinite(remainingMs) || remainingMs < 0) {
    return 0;
  }
  return Math.floor(remainingMs);
}

export function formatPomodoroClock(remainingMs: number): string {
  const totalSeconds = Math.ceil(clampRemainingMs(remainingMs) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function nextMode(mode: PomodoroMode): PomodoroMode {
  if (mode === POMODORO_MODE_FOCUS) {
    return POMODORO_MODE_BREAK;
  }
  return POMODORO_MODE_FOCUS;
}

export function startPomodoro(
  state: PomodoroState,
  nowMs: number,
): PomodoroState {
  if (state.running) {
    return state;
  }
  const remainingMs = clampRemainingMs(state.remainingMs);
  if (remainingMs <= 0) {
    const mode = nextMode(state.mode);
    const durationMs = durationForMode(mode);
    return {
      mode,
      running: true,
      endsAtMs: nowMs + durationMs,
      remainingMs: durationMs,
    };
  }
  return {
    ...state,
    running: true,
    endsAtMs: nowMs + remainingMs,
    remainingMs,
  };
}

export function pausePomodoro(
  state: PomodoroState,
  nowMs: number,
): PomodoroState {
  if (!state.running || state.endsAtMs === null) {
    return state;
  }
  return {
    ...state,
    running: false,
    endsAtMs: null,
    remainingMs: clampRemainingMs(state.endsAtMs - nowMs),
  };
}

export function resetPomodoro(): PomodoroState {
  return createInitialPomodoroState();
}

export function tickPomodoro(
  state: PomodoroState,
  nowMs: number,
): PomodoroState {
  if (!state.running || state.endsAtMs === null) {
    return state;
  }
  const remainingMs = clampRemainingMs(state.endsAtMs - nowMs);
  if (remainingMs <= 0) {
    return completePomodoroSession(state, nowMs);
  }
  return {
    ...state,
    remainingMs,
  };
}

export type PomodoroCompleteResult = {
  state: PomodoroState;
  completedMode: PomodoroMode;
  nextMode: PomodoroMode;
};

/**
 * Ends the current session and starts the next mode running.
 * Callers should notify once using completedMode → nextMode.
 */
export function completePomodoroSession(
  state: PomodoroState,
  nowMs: number,
): PomodoroState {
  const completed = applySessionComplete(state, nowMs);
  return completed.state;
}

export function applySessionComplete(
  state: PomodoroState,
  nowMs: number,
): PomodoroCompleteResult {
  const completedMode = state.mode;
  const followingMode = nextMode(completedMode);
  const durationMs = durationForMode(followingMode);
  return {
    completedMode,
    nextMode: followingMode,
    state: {
      mode: followingMode,
      running: true,
      endsAtMs: nowMs + durationMs,
      remainingMs: durationMs,
    },
  };
}

export type PomodoroHydrateResult = {
  state: PomodoroState;
  didComplete: boolean;
  completedMode: PomodoroMode | null;
  nextMode: PomodoroMode | null;
};

/**
 * If a running deadline is in the past, advance one session boundary.
 * At most one completion (for a single notification on hydrate).
 */
export function hydratePomodoroAt(
  state: PomodoroState,
  nowMs: number,
): PomodoroHydrateResult {
  if (!state.running || state.endsAtMs === null) {
    return {
      state: {
        ...state,
        remainingMs: clampRemainingMs(state.remainingMs),
        endsAtMs: null,
        running: false,
      },
      didComplete: false,
      completedMode: null,
      nextMode: null,
    };
  }
  if (state.endsAtMs > nowMs) {
    return {
      state: {
        ...state,
        remainingMs: clampRemainingMs(state.endsAtMs - nowMs),
      },
      didComplete: false,
      completedMode: null,
      nextMode: null,
    };
  }
  const completed = applySessionComplete(state, nowMs);
  return {
    state: completed.state,
    didComplete: true,
    completedMode: completed.completedMode,
    nextMode: completed.nextMode,
  };
}

export function isPomodoroMode(value: unknown): value is PomodoroMode {
  return value === POMODORO_MODE_FOCUS || value === POMODORO_MODE_BREAK;
}
