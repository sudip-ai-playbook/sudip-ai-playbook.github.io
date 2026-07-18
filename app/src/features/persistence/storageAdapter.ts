import type { PlaybookProject } from '../journey/project.logic'

export type StorageAdapterStatus = {
  mode: 'local' | 'remote'
  label: string
  syncEnabled: boolean
  detail: string
}

export type WorkspaceSnapshot = {
  project: PlaybookProject
  consultingWorkspace: unknown | null
  updatedAt: string
}

export interface WorkspaceStorageAdapter {
  getStatus(): StorageAdapterStatus
  loadSnapshot(): Promise<WorkspaceSnapshot | null>
  saveSnapshot(snapshot: WorkspaceSnapshot): Promise<void>
}

export class LocalStorageWorkspaceAdapter implements WorkspaceStorageAdapter {
  getStatus(): StorageAdapterStatus {
    return {
      mode: 'local',
      label: 'This browser (localStorage + IndexedDB)',
      syncEnabled: false,
      detail:
        'Work is saved in this browser (durable IndexedDB + localStorage). Export a workspace pack to move or share across devices/teams.',
    }
  }

  async loadSnapshot(): Promise<WorkspaceSnapshot | null> {
    return null
  }

  async saveSnapshot(): Promise<void> {
    return undefined
  }
}

export class RemoteApiWorkspaceAdapter implements WorkspaceStorageAdapter {
  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  getStatus(): StorageAdapterStatus {
    return {
      mode: 'remote',
      label: 'Remote API (stub)',
      syncEnabled: true,
      detail: `Configured endpoint: ${this.endpoint}. Wire auth + Postgres to enable team sync.`,
    }
  }

  async loadSnapshot(): Promise<WorkspaceSnapshot | null> {
    throw new Error(
      'Remote workspace sync is not connected yet. Export/import a pack, or configure the API.',
    )
  }

  async saveSnapshot(): Promise<void> {
    throw new Error(
      'Remote workspace sync is not connected yet. Export/import a pack, or configure the API.',
    )
  }
}

export function createWorkspaceStorageAdapter(): WorkspaceStorageAdapter {
  const endpoint = import.meta.env.VITE_WORKSPACE_API_URL
  if (typeof endpoint === 'string' && endpoint.trim().length > 0) {
    return new RemoteApiWorkspaceAdapter(endpoint.trim())
  }
  return new LocalStorageWorkspaceAdapter()
}
