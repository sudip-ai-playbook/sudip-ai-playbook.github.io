import assert from 'node:assert/strict';
import {afterEach, describe, it} from 'node:test';
import {
  POMODORO_MODE_BREAK,
  POMODORO_MODE_FOCUS,
} from './pomodoroLogic.ts';
import {
  CHIME_BREAK_HZ,
  CHIME_FOCUS_HZ,
  chimeFrequencyForNextMode,
  playPomodoroChime,
  primePomodoroAudio,
  resetPomodoroAudioForTests,
} from './pomodoroSound.ts';

type MockOscillator = {
  type: string;
  frequency: {value: number};
  connectCalls: unknown[];
  startedAt: number | null;
  stoppedAt: number | null;
  connect: (destination: unknown) => void;
  start: (when?: number) => void;
  stop: (when?: number) => void;
};

type MockGain = {
  gain: {
    setValueAtTime: (value: number, when: number) => void;
    exponentialRampToValueAtTime: (value: number, when: number) => void;
  };
  connectCalls: unknown[];
  connect: (destination: unknown) => void;
};

const destination = {id: 'destination'};
let resumeCalls = 0;
let createShouldThrow = false;
let playShouldThrow = false;
let contextState = 'running';

function createMockOscillator(): MockOscillator {
  const oscillator: MockOscillator = {
    type: '',
    frequency: {value: 0},
    connectCalls: [],
    startedAt: null,
    stoppedAt: null,
    connect(destinationNode: unknown): void {
      oscillator.connectCalls.push(destinationNode);
    },
    start(when = 0): void {
      if (playShouldThrow) {
        throw new Error('start failed');
      }
      oscillator.startedAt = when;
    },
    stop(when = 0): void {
      oscillator.stoppedAt = when;
    },
  };
  return oscillator;
}

function createMockGain(): MockGain {
  const gain: MockGain = {
    gain: {
      setValueAtTime(): void {},
      exponentialRampToValueAtTime(): void {},
    },
    connectCalls: [],
    connect(destinationNode: unknown): void {
      gain.connectCalls.push(destinationNode);
    },
  };
  return gain;
}

function installAudioContextMock(): {
  oscillators: MockOscillator[];
  gains: MockGain[];
} {
  const oscillators: MockOscillator[] = [];
  const gains: MockGain[] = [];
  resumeCalls = 0;
  createShouldThrow = false;
  playShouldThrow = false;
  contextState = 'running';

  function AudioContextMock(this: {
    state: string;
    currentTime: number;
    destination: unknown;
    resume: () => Promise<void>;
    createOscillator: () => MockOscillator;
    createGain: () => MockGain;
  }): void {
    if (createShouldThrow) {
      throw new Error('unsupported');
    }
    this.state = contextState;
    this.currentTime = 10;
    this.destination = destination;
    this.resume = async () => {
      resumeCalls += 1;
      this.state = 'running';
      contextState = 'running';
    };
    this.createOscillator = () => {
      const oscillator = createMockOscillator();
      oscillators.push(oscillator);
      return oscillator;
    };
    this.createGain = () => {
      const gain = createMockGain();
      gains.push(gain);
      return gain;
    };
  }

  Object.defineProperty(globalThis, 'AudioContext', {
    configurable: true,
    writable: true,
    value: AudioContextMock,
  });
  Object.defineProperty(globalThis, 'webkitAudioContext', {
    configurable: true,
    writable: true,
    value: undefined,
  });

  return {oscillators, gains};
}

function removeAudioContextApi(): void {
  Object.defineProperty(globalThis, 'AudioContext', {
    configurable: true,
    writable: true,
    value: undefined,
  });
  Object.defineProperty(globalThis, 'webkitAudioContext', {
    configurable: true,
    writable: true,
    value: undefined,
  });
}

afterEach(() => {
  resetPomodoroAudioForTests();
  removeAudioContextApi();
});

describe('pomodoroSound', () => {
  it('maps next mode to chime frequencies', () => {
    assert.equal(chimeFrequencyForNextMode(POMODORO_MODE_BREAK), CHIME_BREAK_HZ);
    assert.equal(chimeFrequencyForNextMode(POMODORO_MODE_FOCUS), CHIME_FOCUS_HZ);
  });

  it('returns false when AudioContext is unavailable', async () => {
    removeAudioContextApi();
    assert.equal(await primePomodoroAudio(), false);
    assert.equal(playPomodoroChime(POMODORO_MODE_BREAK), false);
  });

  it('primes and plays a chime when AudioContext works', async () => {
    const mocks = installAudioContextMock();
    assert.equal(await primePomodoroAudio(), true);
    assert.equal(playPomodoroChime(POMODORO_MODE_BREAK), true);
    assert.equal(mocks.oscillators.length, 1);
    assert.equal(mocks.oscillators[0]?.frequency.value, CHIME_BREAK_HZ);
    assert.equal(mocks.oscillators[0]?.type, 'sine');
    assert.equal(mocks.gains[0]?.connectCalls[0], destination);
    assert.equal(playPomodoroChime(POMODORO_MODE_FOCUS), true);
    assert.equal(mocks.oscillators[1]?.frequency.value, CHIME_FOCUS_HZ);
  });

  it('resumes a suspended context before playing', async () => {
    installAudioContextMock();
    contextState = 'suspended';
    assert.equal(await primePomodoroAudio(), true);
    assert.equal(resumeCalls, 1);
    contextState = 'suspended';
    assert.equal(playPomodoroChime(POMODORO_MODE_FOCUS), true);
    assert.ok(resumeCalls >= 1);
  });

  it('returns false when AudioContext construction throws', async () => {
    installAudioContextMock();
    createShouldThrow = true;
    resetPomodoroAudioForTests();
    assert.equal(await primePomodoroAudio(), false);
    assert.equal(playPomodoroChime(POMODORO_MODE_FOCUS), false);
  });

  it('returns false when oscillator start throws', () => {
    installAudioContextMock();
    playShouldThrow = true;
    assert.equal(playPomodoroChime(POMODORO_MODE_FOCUS), false);
  });
});
