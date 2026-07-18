import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

vi.mock('@excalidraw/excalidraw', () => ({
  Excalidraw: function ExcalidrawMock() {
    return null
  },
}))

vi.mock('@excalidraw/excalidraw/index.css', () => ({}))

const memoryStore = new Map<string, string>()

const storageMock: Storage = {
  get length() {
    return memoryStore.size
  },
  clear() {
    memoryStore.clear()
  },
  getItem(key: string) {
    return memoryStore.has(key) ? (memoryStore.get(key) ?? null) : null
  },
  key(index: number) {
    return [...memoryStore.keys()][index] ?? null
  },
  removeItem(key: string) {
    memoryStore.delete(key)
  },
  setItem(key: string, value: string) {
    memoryStore.set(key, String(value))
  },
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storageMock,
  })
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: storageMock,
  })
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: () => 'blob:mock-url',
  })
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: () => undefined,
  })
  HTMLCanvasElement.prototype.getContext = (() => {
    return {
      fillRect: () => undefined,
      clearRect: () => undefined,
      getImageData: () => ({ data: new Uint8ClampedArray() }),
      putImageData: () => undefined,
      createImageData: () => [],
      setTransform: () => undefined,
      drawImage: () => undefined,
      save: () => undefined,
      fillText: () => undefined,
      restore: () => undefined,
      beginPath: () => undefined,
      moveTo: () => undefined,
      lineTo: () => undefined,
      closePath: () => undefined,
      stroke: () => undefined,
      translate: () => undefined,
      scale: () => undefined,
      rotate: () => undefined,
      arc: () => undefined,
      fill: () => undefined,
      measureText: () => ({ width: 0 }),
      transform: () => undefined,
      rect: () => undefined,
      clip: () => undefined,
    }
  }) as typeof HTMLCanvasElement.prototype.getContext
})

afterEach(() => {
  cleanup()
  memoryStore.clear()
})
