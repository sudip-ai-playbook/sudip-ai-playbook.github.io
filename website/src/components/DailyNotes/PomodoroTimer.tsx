import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  ReactNode,
} from 'react';
import {useEffect, useRef, useState} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

import styles from './DailyNotes.module.css';
import {
  createInitialPomodoroState,
  formatPomodoroClock,
  hydratePomodoroAt,
  parsePomodoroClock,
  pausePomodoro,
  POMODORO_MODE_FOCUS,
  resetPomodoro,
  setPomodoroRemaining,
  startPomodoro,
  tickPomodoro,
  type PomodoroState,
} from './pomodoroLogic';
import {
  ensureNotificationPermission,
  notifySessionComplete,
} from './pomodoroNotifications';
import {loadPomodoroState, savePomodoroState} from './pomodoroStorage';

const TICK_INTERVAL_MS = 250;

const MODE_LABEL_FOCUS = 'Focus';
const MODE_LABEL_BREAK = 'Break';
const LABEL_START = 'Start pomodoro';
const LABEL_PAUSE = 'Pause pomodoro';
const LABEL_RESET = 'Reset pomodoro';
const LABEL_EDIT_TIME = 'Edit remaining time';

function modeLabel(state: PomodoroState): string {
  return state.mode === POMODORO_MODE_FOCUS
    ? MODE_LABEL_FOCUS
    : MODE_LABEL_BREAK;
}

function PlayIcon(): ReactNode {
  return (
    <svg
      className={styles.pomodoroIcon}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false">
      <path fill="currentColor" d="M8 5.14v13.72L19 12 8 5.14Z" />
    </svg>
  );
}

function PauseIcon(): ReactNode {
  return (
    <svg
      className={styles.pomodoroIcon}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false">
      <path
        fill="currentColor"
        d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z"
      />
    </svg>
  );
}

function ResetIcon(): ReactNode {
  return (
    <svg
      className={styles.pomodoroIcon}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false">
      <path
        fill="currentColor"
        d="M12 5V2.21c0-.45-.54-.67-.85-.35l-3.8 3.79c-.2.2-.2.51 0 .71l3.79 3.79c.32.31.86.09.86-.36V7c3.73 0 6.68 3.42 5.86 7.29-.47 2.27-2.31 4.1-4.57 4.57-3.57.75-6.75-1.7-7.23-5.01-.07-.48-.49-.85-.98-.85-.6 0-1.08.53-1 1.13.62 4.39 4.8 7.64 9.53 6.72 3.12-.6 5.63-3.12 6.23-6.23C20.61 8.33 16.76 4 12 4Z"
      />
    </svg>
  );
}

export default function PomodoroTimer(): ReactNode {
  const isBrowser = useIsBrowser();
  const [state, setState] = useState<PomodoroState>(createInitialPomodoroState);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [timeDraft, setTimeDraft] = useState('');
  const stateRef = useRef(state);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const loaded = loadPomodoroState();
    const hydrated = hydratePomodoroAt(loaded, Date.now());
    setState(hydrated.state);
    savePomodoroState(hydrated.state);
    if (hydrated.didComplete && hydrated.nextMode !== null) {
      notifySessionComplete(hydrated.nextMode);
    }
    setHasHydrated(true);
  }, [isBrowser]);

  useEffect(() => {
    if (!hasHydrated || !isBrowser) {
      return;
    }
    savePomodoroState(state);
  }, [hasHydrated, isBrowser, state]);

  useEffect(() => {
    if (!hasHydrated || !isBrowser || !state.running || isEditingTime) {
      return;
    }

    function handleTick(): void {
      const previous = stateRef.current;
      const next = tickPomodoro(previous, Date.now());
      if (
        next.remainingMs === previous.remainingMs &&
        next.mode === previous.mode &&
        next.running === previous.running &&
        next.endsAtMs === previous.endsAtMs
      ) {
        return;
      }
      if (next.mode !== previous.mode) {
        notifySessionComplete(next.mode);
      }
      setState(next);
    }

    const intervalId = window.setInterval(handleTick, TICK_INTERVAL_MS);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasHydrated, isBrowser, state.running, isEditingTime]);

  useEffect(() => {
    if (!isEditingTime) {
      return;
    }
    const input = timeInputRef.current;
    if (!input) {
      return;
    }
    input.focus();
    input.select();
  }, [isEditingTime]);

  function handleToggleClick(): void {
    void togglePomodoro();
  }

  async function togglePomodoro(): Promise<void> {
    const nowMs = Date.now();
    const current = stateRef.current;
    if (current.running) {
      setState(pausePomodoro(current, nowMs));
      return;
    }
    await ensureNotificationPermission();
    setState(startPomodoro(stateRef.current, Date.now()));
  }

  function handleReset(): void {
    setIsEditingTime(false);
    setState(resetPomodoro());
  }

  function beginEditingTime(): void {
    setTimeDraft(formatPomodoroClock(stateRef.current.remainingMs));
    setIsEditingTime(true);
  }

  function commitTimeDraft(): void {
    const parsedMs = parsePomodoroClock(timeDraft);
    setIsEditingTime(false);
    if (parsedMs === null) {
      return;
    }
    setState(setPomodoroRemaining(stateRef.current, parsedMs, Date.now()));
  }

  function cancelTimeEdit(): void {
    setIsEditingTime(false);
  }

  function handleTimeDraftChange(event: ChangeEvent<HTMLInputElement>): void {
    setTimeDraft(event.target.value);
  }

  function handleTimeKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitTimeDraft();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelTimeEdit();
    }
  }

  function handleTimeBlur(_event: FocusEvent<HTMLInputElement>): void {
    commitTimeDraft();
  }

  const clock = formatPomodoroClock(state.remainingMs);
  const label = modeLabel(state);
  const timeClassName =
    state.mode === POMODORO_MODE_FOCUS
      ? `${styles.pomodoroTime} ${styles.pomodoroTimeFocus}`
      : `${styles.pomodoroTime} ${styles.pomodoroTimeBreak}`;

  return (
    <div className={styles.pomodoro} data-testid="daily-notes-pomodoro">
      {isEditingTime ? (
        <input
          ref={timeInputRef}
          className={`${timeClassName} ${styles.pomodoroTimeInput}`}
          value={timeDraft}
          onChange={handleTimeDraftChange}
          onKeyDown={handleTimeKeyDown}
          onBlur={handleTimeBlur}
          aria-label={LABEL_EDIT_TIME}
          title={LABEL_EDIT_TIME}
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          maxLength={5}
          data-testid="daily-notes-pomodoro-time-input"
        />
      ) : (
        <button
          type="button"
          className={`${timeClassName} ${styles.pomodoroTimeButton}`}
          onClick={beginEditingTime}
          aria-label={`${label} ${clock}. ${LABEL_EDIT_TIME}`}
          title={`${label} — click to edit`}
          data-testid="daily-notes-pomodoro-time">
          <span aria-live="polite">{clock}</span>
        </button>
      )}
      <button
        type="button"
        className={styles.pomodoroButton}
        onClick={handleToggleClick}
        aria-label={state.running ? LABEL_PAUSE : LABEL_START}
        title={state.running ? LABEL_PAUSE : LABEL_START}
        data-testid="daily-notes-pomodoro-toggle">
        {state.running ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        type="button"
        className={styles.pomodoroButton}
        onClick={handleReset}
        aria-label={LABEL_RESET}
        title={LABEL_RESET}
        data-testid="daily-notes-pomodoro-reset">
        <ResetIcon />
      </button>
    </div>
  );
}
