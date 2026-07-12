import { afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

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
})

afterEach(() => {
  cleanup()
  memoryStore.clear()
})
