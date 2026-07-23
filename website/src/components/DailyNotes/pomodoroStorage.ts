import {
  BREAK_MS,
  createInitialPomodoroState,
  FOCUS_MS,
  isPomodoroMode,
  POMODORO_MODE_BREAK,
  type PomodoroState,
} from './pomodoroLogic.ts';

export const POMODORO_STORAGE_KEY = 'sudip-ai-playbook-pomodoro';

export function serializePomodoroState(state: PomodoroState): string {
  return JSON.stringify({
    mode: state.mode,
    running: state.running,
    endsAtMs: state.endsAtMs,
    remainingMs: state.remainingMs,
  });
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function parsePomodoroState(raw: string | null): PomodoroState {
  if (raw === null || raw === '') {
    return createInitialPomodoroState();
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return createInitialPomodoroState();
    }
    const candidate = parsed as Partial<PomodoroState>;
    if (!isPomodoroMode(candidate.mode)) {
      return createInitialPomodoroState();
    }
    if (typeof candidate.running !== 'boolean') {
      return createInitialPomodoroState();
    }
    const endsAtMs =
      candidate.endsAtMs === null
        ? null
        : isFiniteNumber(candidate.endsAtMs)
          ? candidate.endsAtMs
          : null;
    if (!isFiniteNumber(candidate.remainingMs)) {
      return createInitialPomodoroState();
    }
    const maxMs =
      candidate.mode === POMODORO_MODE_BREAK ? BREAK_MS : FOCUS_MS;
    const remainingMs = Math.min(
      Math.max(0, Math.floor(candidate.remainingMs)),
      maxMs,
    );
    return {
      mode: candidate.mode,
      running: candidate.running,
      endsAtMs: candidate.running ? endsAtMs : null,
      remainingMs,
    };
  } catch {
    return createInitialPomodoroState();
  }
}

export function loadPomodoroState(): PomodoroState {
  if (typeof localStorage === 'undefined') {
    return createInitialPomodoroState();
  }
  try {
    return parsePomodoroState(localStorage.getItem(POMODORO_STORAGE_KEY));
  } catch {
    return createInitialPomodoroState();
  }
}

export function savePomodoroState(state: PomodoroState): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(POMODORO_STORAGE_KEY, serializePomodoroState(state));
  } catch {
    // Quota or private mode — ignore.
  }
}
