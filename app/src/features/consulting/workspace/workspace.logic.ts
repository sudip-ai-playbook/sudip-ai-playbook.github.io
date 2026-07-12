import { CONSULTING_STAGES } from '../../../data/consultingOs'
import {
  ENGAGEMENT_STORAGE_KEY,
  RAG_STATUS,
  STAGE_STATUS,
  createEmptyEngagement,
  loadEngagementFromLegacyKey,
  normalizeEngagementState,
  type EngagementState,
  type RagStatus,
} from '../engagement.logic'
import {
  CONSULT_PERSONA,
  parseConsultPersona,
  type ConsultPersona,
} from '../roles/roles.logic'
import {
  WORKSHOP_STORAGE_KEY,
  createEmptyWorkshop,
  createRegisterId,
  loadWorkshopFromLegacyKey,
  normalizeWorkshopSession,
  type UseCaseCard,
  type WorkshopSession,
  EMPTY_USE_CASE,
} from '../workshop.logic'

export const WORKSPACE_STORAGE_KEY = 'sudip-consult-workspace'
export const WORKSPACE_VERSION = 1

export interface ClientRecord {
  id: string
  name: string
  industry: string
  geography: string
  engagements: EngagementState[]
}

export interface WorkspaceStore {
  version: number
  clients: ClientRecord[]
  activeClientId: string | null
  activeEngagementId: string | null
  persona: ConsultPersona
  updatedAt: string
}

export function createEmptyClient(name = 'New client'): ClientRecord {
  const engagement = createEmptyEngagement()
  engagement.clientName = name
  engagement.engagementName = 'New engagement'
  return {
    id: createRegisterId('client'),
    name,
    industry: '',
    geography: '',
    engagements: [engagement],
  }
}

export function createEmptyWorkspace(): WorkspaceStore {
  const client = createEmptyClient('Default client')
  return {
    version: WORKSPACE_VERSION,
    clients: [client],
    activeClientId: client.id,
    activeEngagementId: client.engagements[0]?.id ?? null,
    persona: CONSULT_PERSONA.CONSULTANT,
    updatedAt: new Date().toISOString(),
  }
}

function migrateLegacyStorage(): WorkspaceStore | null {
  const legacyEngagementRaw = localStorage.getItem(ENGAGEMENT_STORAGE_KEY)
  const legacyWorkshopRaw = localStorage.getItem(WORKSHOP_STORAGE_KEY)
  if (!legacyEngagementRaw && !legacyWorkshopRaw) {
    return null
  }

  const legacyEngagement = legacyEngagementRaw ? loadEngagementFromLegacyKey() : null
  const legacyWorkshop = legacyWorkshopRaw ? loadWorkshopFromLegacyKey() : null

  const engagement = legacyEngagement ?? createEmptyEngagement()
  if (legacyWorkshop) {
    engagement.workshopsByStage[legacyWorkshop.stageId] = legacyWorkshop
    engagement.sharedUseCase = { ...EMPTY_USE_CASE, ...legacyWorkshop.useCase }
  }
  if (!engagement.clientName.trim()) {
    engagement.clientName = 'Migrated client'
  }
  if (!engagement.engagementName.trim()) {
    engagement.engagementName = 'Migrated engagement'
  }

  const client: ClientRecord = {
    id: createRegisterId('client'),
    name: engagement.clientName || 'Migrated client',
    industry: '',
    geography: '',
    engagements: [engagement],
  }

  return {
    version: WORKSPACE_VERSION,
    clients: [client],
    activeClientId: client.id,
    activeEngagementId: engagement.id,
    persona: CONSULT_PERSONA.CONSULTANT,
    updatedAt: new Date().toISOString(),
  }
}

function normalizeClient(raw: ClientRecord): ClientRecord {
  const engagements = Array.isArray(raw.engagements)
    ? raw.engagements.map((item) => normalizeEngagementState(item))
    : [createEmptyEngagement()]
  return {
    id: raw.id || createRegisterId('client'),
    name: raw.name ?? 'Client',
    industry: raw.industry ?? '',
    geography: raw.geography ?? '',
    engagements,
  }
}

export function normalizeWorkspace(raw: WorkspaceStore): WorkspaceStore {
  const clients =
    Array.isArray(raw.clients) && raw.clients.length > 0
      ? raw.clients.map(normalizeClient)
      : createEmptyWorkspace().clients
  const activeClientId =
    clients.some((client) => client.id === raw.activeClientId)
      ? raw.activeClientId
      : clients[0]?.id ?? null
  const activeClient = clients.find((client) => client.id === activeClientId) ?? clients[0]
  const activeEngagementId =
    activeClient?.engagements.some((item) => item.id === raw.activeEngagementId)
      ? raw.activeEngagementId
      : activeClient?.engagements[0]?.id ?? null

  return {
    version: WORKSPACE_VERSION,
    clients,
    activeClientId,
    activeEngagementId,
    persona: parseConsultPersona(raw.persona),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  }
}

export function loadWorkspace(): WorkspaceStore {
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    if (raw) {
      return normalizeWorkspace(JSON.parse(raw) as WorkspaceStore)
    }
  } catch {
    // fall through to migration / empty
  }

  const migrated = migrateLegacyStorage()
  if (migrated) {
    saveWorkspace(migrated)
    localStorage.removeItem(ENGAGEMENT_STORAGE_KEY)
    localStorage.removeItem(WORKSHOP_STORAGE_KEY)
    return migrated
  }

  const empty = createEmptyWorkspace()
  saveWorkspace(empty)
  return empty
}

export function saveWorkspace(store: WorkspaceStore): WorkspaceStore {
  const next = { ...store, version: WORKSPACE_VERSION, updatedAt: new Date().toISOString() }
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearWorkspace(): void {
  localStorage.removeItem(WORKSPACE_STORAGE_KEY)
}

export function findActiveClient(store: WorkspaceStore): ClientRecord | null {
  return store.clients.find((client) => client.id === store.activeClientId) ?? null
}

export function findActiveEngagement(store: WorkspaceStore): EngagementState | null {
  const client = findActiveClient(store)
  if (!client) return null
  return client.engagements.find((item) => item.id === store.activeEngagementId) ?? null
}

export function updateActiveEngagement(
  store: WorkspaceStore,
  engagement: EngagementState,
): WorkspaceStore {
  const clients = store.clients.map((client) => {
    if (client.id !== store.activeClientId) return client
    return {
      ...client,
      name: engagement.clientName.trim() || client.name,
      engagements: client.engagements.map((item) =>
        item.id === engagement.id ? engagement : item,
      ),
    }
  })
  return { ...store, clients }
}

export function setActiveEngagement(
  store: WorkspaceStore,
  clientId: string,
  engagementId: string,
): WorkspaceStore {
  const client = store.clients.find((item) => item.id === clientId)
  if (!client) return store
  if (!client.engagements.some((item) => item.id === engagementId)) return store
  return {
    ...store,
    activeClientId: clientId,
    activeEngagementId: engagementId,
  }
}

export function addClient(
  store: WorkspaceStore,
  name: string,
  industry = '',
  geography = '',
): WorkspaceStore {
  const client = createEmptyClient(name.trim() || 'New client')
  client.industry = industry
  client.geography = geography
  return {
    ...store,
    clients: [...store.clients, client],
    activeClientId: client.id,
    activeEngagementId: client.engagements[0]?.id ?? null,
  }
}

export function addEngagementToClient(
  store: WorkspaceStore,
  clientId: string,
  engagementName: string,
): WorkspaceStore {
  const clients = store.clients.map((client) => {
    if (client.id !== clientId) return client
    const engagement = createEmptyEngagement()
    engagement.clientName = client.name
    engagement.engagementName = engagementName.trim() || 'New engagement'
    return {
      ...client,
      engagements: [...client.engagements, engagement],
    }
  })
  const client = clients.find((item) => item.id === clientId)
  const newEngagement = client?.engagements[client.engagements.length - 1]
  return {
    ...store,
    clients,
    activeClientId: clientId,
    activeEngagementId: newEngagement?.id ?? store.activeEngagementId,
  }
}

export function removeClient(store: WorkspaceStore, clientId: string): WorkspaceStore {
  if (store.clients.length <= 1) return store
  const clients = store.clients.filter((client) => client.id !== clientId)
  const nextActive =
    store.activeClientId === clientId
      ? clients[0]
      : clients.find((client) => client.id === store.activeClientId) ?? clients[0]
  return {
    ...store,
    clients,
    activeClientId: nextActive?.id ?? null,
    activeEngagementId: nextActive?.engagements[0]?.id ?? null,
  }
}

export function removeEngagement(
  store: WorkspaceStore,
  clientId: string,
  engagementId: string,
): WorkspaceStore {
  const client = store.clients.find((item) => item.id === clientId)
  if (!client || client.engagements.length <= 1) return store

  const clients = store.clients.map((item) => {
    if (item.id !== clientId) return item
    return {
      ...item,
      engagements: item.engagements.filter((engagement) => engagement.id !== engagementId),
    }
  })
  const updatedClient = clients.find((item) => item.id === clientId)
  const stillActive =
    store.activeEngagementId === engagementId
      ? updatedClient?.engagements[0]?.id ?? null
      : store.activeEngagementId

  return {
    ...store,
    clients,
    activeEngagementId: stillActive,
  }
}

export function renameClient(
  store: WorkspaceStore,
  clientId: string,
  name: string,
  industry: string,
  geography: string,
): WorkspaceStore {
  return {
    ...store,
    clients: store.clients.map((client) => {
      if (client.id !== clientId) return client
      const nextName = name.trim() || client.name
      return {
        ...client,
        name: nextName,
        industry,
        geography,
        engagements: client.engagements.map((engagement) => ({
          ...engagement,
          clientName: nextName,
        })),
      }
    }),
  }
}

export function setWorkspacePersona(
  store: WorkspaceStore,
  persona: ConsultPersona,
): WorkspaceStore {
  return { ...store, persona }
}

export function getWorkshopForStage(
  engagement: EngagementState,
  stageId: string,
): WorkshopSession {
  const existing = engagement.workshopsByStage[stageId]
  if (existing) {
    return normalizeWorkshopSession(existing)
  }
  const created = createEmptyWorkshop(stageId)
  if (engagement.sharedUseCase) {
    created.useCase = { ...EMPTY_USE_CASE, ...engagement.sharedUseCase }
  }
  return created
}

export function upsertWorkshop(
  engagement: EngagementState,
  workshop: WorkshopSession,
): EngagementState {
  return {
    ...engagement,
    sharedUseCase: { ...EMPTY_USE_CASE, ...workshop.useCase },
    workshopsByStage: {
      ...engagement.workshopsByStage,
      [workshop.stageId]: normalizeWorkshopSession(workshop),
    },
  }
}

export function deriveOverallRag(engagement: EngagementState): RagStatus {
  const statuses: RagStatus[] = [
    engagement.health.schedule,
    engagement.health.budget,
    engagement.health.scope,
    engagement.health.resource,
    engagement.health.risk,
    engagement.health.clientSatisfaction,
  ]
  if (statuses.includes(RAG_STATUS.RED)) return RAG_STATUS.RED
  if (statuses.includes(RAG_STATUS.AMBER)) return RAG_STATUS.AMBER
  return RAG_STATUS.GREEN
}

export function listUpcomingGates(engagement: EngagementState): Array<{
  stageId: string
  gate: string
  shortLabel: string
}> {
  return CONSULTING_STAGES.filter((stage) => {
    const status = engagement.stageProgress[stage.id]?.status
    return (
      status !== STAGE_STATUS.APPROVED &&
      status !== STAGE_STATUS.CLOSED &&
      stage.gateCriteria.length > 0
    )
  })
    .slice(0, 5)
    .map((stage) => ({
      stageId: stage.id,
      gate: stage.gate,
      shortLabel: stage.shortLabel,
    }))
}

export function countOpenRegisterItems(engagement: EngagementState): {
  overdueActions: number
  openRisks: number
  pendingDecisions: number
  deliverablesAwaitingReview: number
} {
  const today = new Date().toISOString().slice(0, 10)
  return {
    overdueActions: engagement.registers.actions.filter(
      (item) => item.due && item.due < today && item.status !== 'done',
    ).length,
    openRisks: engagement.registers.risks.filter((item) => item.status !== 'closed').length,
    pendingDecisions: engagement.registers.decisions.filter(
      (item) => item.status !== 'approved',
    ).length,
    deliverablesAwaitingReview: engagement.registers.deliverables.filter(
      (item) => item.status === 'in_review',
    ).length,
  }
}

export type { UseCaseCard }
