import { describe, expect, it } from 'vitest'
import { EMPTY_PROJECT } from '../journey/project.logic'
import {
  buildWorkspacePack,
  parseWorkspacePack,
  serializeWorkspacePack,
} from './workspacePack.logic'
import {
  LocalStorageWorkspaceAdapter,
  RemoteApiWorkspaceAdapter,
  createWorkspaceStorageAdapter,
} from './storageAdapter'

describe('workspacePack.logic', () => {
  it('round-trips a valid workspace pack', () => {
    const pack = buildWorkspacePack({
      project: { ...EMPTY_PROJECT, outcome: 'Claims copilot for handlers' },
      consultingWorkspace: { version: 1 },
    })
    const parsed = parseWorkspacePack(serializeWorkspacePack(pack))
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.pack.project.outcome).toBe('Claims copilot for handlers')
    expect(parsed.pack.consultingWorkspace).toEqual({ version: 1 })
  })

  it('rejects invalid packs', () => {
    expect(parseWorkspacePack('not-json').ok).toBe(false)
    expect(parseWorkspacePack(JSON.stringify({ kind: 'other' })).ok).toBe(false)
  })
})

describe('storageAdapter', () => {
  it('defaults to local adapter without API URL', () => {
    const adapter = createWorkspaceStorageAdapter()
    expect(adapter).toBeInstanceOf(LocalStorageWorkspaceAdapter)
    expect(adapter.getStatus().mode).toBe('local')
  })

  it('remote adapter explains that sync is not connected', async () => {
    const adapter = new RemoteApiWorkspaceAdapter('https://api.example.com/workspaces')
    expect(adapter.getStatus().syncEnabled).toBe(true)
    await expect(adapter.loadSnapshot()).rejects.toThrow(/not connected/)
  })
})
