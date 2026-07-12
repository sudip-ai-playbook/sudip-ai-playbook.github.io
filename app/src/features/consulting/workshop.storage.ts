import {
  createEmptyEngagement,
  normalizeEngagementState,
  syncWorkshopIntoRegisters,
  type EngagementState,
} from './engagement.logic'
import {
  findActiveEngagement,
  getWorkshopForStage,
  loadWorkspace,
  saveWorkspace,
  updateActiveEngagement,
  upsertWorkshop,
} from './workspace/workspace.logic'
import {
  clearWorkshopLegacyKey,
  createEmptyWorkshop,
  normalizeWorkshopSession,
  type WorkshopSession,
} from './workshop.logic'

export function loadWorkshop(stageId?: string | null): WorkshopSession | null {
  const store = loadWorkspace()
  const engagement = findActiveEngagement(store)
  if (!engagement) return null
  const resolvedStageId = stageId ?? engagement.currentStageId
  if (!engagement.workshopsByStage[resolvedStageId] && !stageId) {
    const anyWorkshop = Object.values(engagement.workshopsByStage)[0]
    return anyWorkshop ? normalizeWorkshopSession(anyWorkshop) : null
  }
  if (!engagement.workshopsByStage[resolvedStageId]) return null
  return getWorkshopForStage(engagement, resolvedStageId)
}

export function saveWorkshop(session: WorkshopSession): WorkshopSession {
  const next = normalizeWorkshopSession({
    ...session,
    updatedAt: new Date().toISOString(),
  })
  const store = loadWorkspace()
  const engagement = findActiveEngagement(store)
  if (!engagement) {
    return next
  }
  let updated = upsertWorkshop(engagement, next)
  updated = syncWorkshopIntoRegisters(updated, next)
  saveWorkspace(updateActiveEngagement(store, updated))
  return next
}

export function clearWorkshop(): void {
  clearWorkshopLegacyKey()
  const store = loadWorkspace()
  const engagement = findActiveEngagement(store)
  if (!engagement) return
  saveWorkspace(
    updateActiveEngagement(store, {
      ...engagement,
      workshopsByStage: {},
    }),
  )
}

export function startWorkshopForStage(stageId: string): WorkshopSession {
  const store = loadWorkspace()
  let engagement = findActiveEngagement(store) ?? createEmptyEngagement()
  const existing = engagement.workshopsByStage[stageId]
  if (existing) {
    return normalizeWorkshopSession(existing)
  }
  const created = createEmptyWorkshop(stageId)
  if (engagement.sharedUseCase) {
    created.useCase = { ...created.useCase, ...engagement.sharedUseCase }
  }
  engagement = upsertWorkshop(engagement, created)
  engagement = {
    ...engagement,
    currentStageId: stageId,
  }
  saveWorkspace(updateActiveEngagement(store, normalizeEngagementState(engagement)))
  return created
}

export type { EngagementState }
