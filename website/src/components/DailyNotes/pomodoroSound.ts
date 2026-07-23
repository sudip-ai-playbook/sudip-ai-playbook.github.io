import {
  POMODORO_MODE_BREAK,
  type PomodoroMode,
} from './pomodoroLogic.ts';

export const CHIME_FOCUS_HZ = 880;
export const CHIME_BREAK_HZ = 660;
export const CHIME_DURATION_SEC = 0.18;
export const CHIME_GAIN = 0.08;

type OscillatorNodeLike = {
  type: string;
  frequency: {value: number};
  connect: (destination: unknown) => void;
  start: (when?: number) => void;
  stop: (when?: number) => void;
};

type GainNodeLike = {
  gain: {
    setValueAtTime: (value: number, when: number) => void;
    exponentialRampToValueAtTime: (value: number, when: number) => void;
  };
  connect: (destination: unknown) => void;
};

type AudioContextLike = {
  state: string;
  currentTime: number;
  destination: unknown;
  resume: () => Promise<void>;
  createOscillator: () => OscillatorNodeLike;
  createGain: () => GainNodeLike;
};

type AudioContextConstructor = new () => AudioContextLike;

let sharedContext: AudioContextLike | null = null;

function readAudioContextConstructor(): AudioContextConstructor | undefined {
  const globalAudio = globalThis as typeof globalThis & {
    AudioContext?: AudioContextConstructor;
    webkitAudioContext?: AudioContextConstructor;
  };
  if (typeof globalAudio.AudioContext === 'function') {
    return globalAudio.AudioContext;
  }
  if (typeof globalAudio.webkitAudioContext === 'function') {
    return globalAudio.webkitAudioContext;
  }
  return undefined;
}

function getOrCreateAudioContext(): AudioContextLike | null {
  if (sharedContext !== null) {
    return sharedContext;
  }
  const AudioContextCtor = readAudioContextConstructor();
  if (AudioContextCtor === undefined) {
    return null;
  }
  try {
    sharedContext = new AudioContextCtor();
    return sharedContext;
  } catch {
    return null;
  }
}

/** Exposed for tests to reset shared state. */
export function resetPomodoroAudioForTests(): void {
  sharedContext = null;
}

export function chimeFrequencyForNextMode(mode: PomodoroMode): number {
  if (mode === POMODORO_MODE_BREAK) {
    return CHIME_BREAK_HZ;
  }
  return CHIME_FOCUS_HZ;
}

/**
 * Resume/create AudioContext from a user gesture (Start click).
 * Required by browser autoplay policies before chimes can play.
 */
export async function primePomodoroAudio(): Promise<boolean> {
  const context = getOrCreateAudioContext();
  if (context === null) {
    return false;
  }
  if (context.state === 'running') {
    return true;
  }
  try {
    await context.resume();
    return true;
  } catch {
    return false;
  }
}

/**
 * Play a short soft chime for the next session mode.
 * Safe no-op when Web Audio is unavailable.
 */
export function playPomodoroChime(nextMode: PomodoroMode): boolean {
  const context = getOrCreateAudioContext();
  if (context === null) {
    return false;
  }
  try {
    if (context.state === 'suspended') {
      void context.resume();
    }
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime;
    const endAt = startAt + CHIME_DURATION_SEC;
    oscillator.type = 'sine';
    oscillator.frequency.value = chimeFrequencyForNextMode(nextMode);
    gain.gain.setValueAtTime(CHIME_GAIN, startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, endAt);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(endAt);
    return true;
  } catch {
    return false;
  }
}
