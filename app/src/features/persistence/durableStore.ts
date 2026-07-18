import type { PlaybookProject } from '../journey/project.logic'
import { normalizeLoadedProject } from '../journey/project.logic'
import { PROJECT_STORAGE_KEY } from '../../constants/journey'
import { clearProjectStorage, loadProject, saveProject } from '../journey/project.logic'

const DB_NAME = 'sudip-ai-playbook-db'
const DB_VERSION = 1
const STORE_NAME = 'kv'

function canUseIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined'
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'))
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
  })
}

async function idbGet<T>(key: string): Promise<T | null> {
  if (!canUseIndexedDb()) return null
  const database = await openDb()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(key)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB get failed'))
    request.onsuccess = () => {
      resolve((request.result as T | undefined) ?? null)
    }
  })
}

async function idbSet(key: string, value: unknown): Promise<void> {
  if (!canUseIndexedDb()) return
  const database = await openDb()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(value, key)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB put failed'))
    request.onsuccess = () => resolve()
  })
}

async function idbDelete(key: string): Promise<void> {
  if (!canUseIndexedDb()) return
  const database = await openDb()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(key)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB delete failed'))
    request.onsuccess = () => resolve()
  })
}

export async function loadProjectDurable(): Promise<PlaybookProject> {
  try {
    const fromIdb = await idbGet<PlaybookProject>(PROJECT_STORAGE_KEY)
    if (fromIdb) {
      const normalized = normalizeLoadedProject(fromIdb)
      saveProject(normalized)
      return normalized
    }
  } catch {
    // Fall through to localStorage.
  }
  return loadProject()
}

export async function saveProjectDurable(project: PlaybookProject): Promise<PlaybookProject> {
  saveProject(project)
  const withTimestamp = { ...project, updatedAt: new Date().toISOString() }
  try {
    await idbSet(PROJECT_STORAGE_KEY, withTimestamp)
  } catch {
    // localStorage remains the synchronous source of truth.
  }
  return withTimestamp
}

export async function clearProjectDurable(): Promise<void> {
  clearProjectStorage()
  try {
    await idbDelete(PROJECT_STORAGE_KEY)
  } catch {
    // Ignore IndexedDB failures on clear.
  }
}
