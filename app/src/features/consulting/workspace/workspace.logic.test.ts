import { beforeEach, describe, expect, it } from 'vitest'
import {
  WORKSPACE_STORAGE_KEY,
  addClient,
  addEngagementToClient,
  createEmptyWorkspace,
  findActiveEngagement,
  loadWorkspace,
  removeClient,
  saveWorkspace,
  setActiveEngagement,
} from './workspace.logic'
import { ENGAGEMENT_STORAGE_KEY, createEmptyEngagement } from '../engagement.logic'
import { WORKSHOP_STORAGE_KEY, createEmptyWorkshop } from '../workshop.logic'

describe('workspace.logic', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a workspace with a default client and engagement', () => {
    const store = createEmptyWorkspace()
    expect(store.clients).toHaveLength(1)
    expect(store.activeClientId).toBeTruthy()
    expect(findActiveEngagement(store)?.engagementName).toBe('New engagement')
  })

  it('persists and reloads workspace state', () => {
    let store = createEmptyWorkspace()
    store = addClient(store, 'Contoso', 'Retail', 'UK')
    saveWorkspace(store)
    const loaded = loadWorkspace()
    expect(loaded.clients.some((client) => client.name === 'Contoso')).toBe(true)
  })

  it('migrates legacy engagement and workshop keys', () => {
    const engagement = createEmptyEngagement()
    engagement.clientName = 'Legacy Co'
    engagement.engagementName = 'Legacy Deal'
    localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(engagement))
    localStorage.setItem(
      WORKSHOP_STORAGE_KEY,
      JSON.stringify(createEmptyWorkshop('stage-1')),
    )

    const loaded = loadWorkspace()
    expect(localStorage.getItem(WORKSPACE_STORAGE_KEY)).toBeTruthy()
    expect(findActiveEngagement(loaded)?.clientName).toBe('Legacy Co')
    expect(findActiveEngagement(loaded)?.workshopsByStage['stage-1']).toBeTruthy()
    expect(localStorage.getItem(ENGAGEMENT_STORAGE_KEY)).toBeNull()
  })

  it('adds engagements and switches active selection', () => {
    let store = createEmptyWorkspace()
    const clientId = store.clients[0].id
    store = addEngagementToClient(store, clientId, 'Second deal')
    const engagementId = store.clients[0].engagements[1].id
    store = setActiveEngagement(store, clientId, engagementId)
    expect(findActiveEngagement(store)?.engagementName).toBe('Second deal')
  })

  it('refuses to remove the last client', () => {
    const store = createEmptyWorkspace()
    const next = removeClient(store, store.clients[0].id)
    expect(next.clients).toHaveLength(1)
  })

  it('recovers from corrupt workspace json', () => {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, '{bad')
    const loaded = loadWorkspace()
    expect(loaded.clients.length).toBeGreaterThan(0)
  })
})
