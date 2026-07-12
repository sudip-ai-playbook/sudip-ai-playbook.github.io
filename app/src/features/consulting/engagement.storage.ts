import {
  clearEngagementLegacyKey,
  createEmptyEngagement,
  normalizeEngagementState,
  type EngagementState,
} from './engagement.logic'
import {
  clearWorkspace,
  findActiveEngagement,
  loadWorkspace,
  saveWorkspace,
  updateActiveEngagement,
} from './workspace/workspace.logic'

export function loadEngagement(): EngagementState {
  const store = loadWorkspace()
  const active = findActiveEngagement(store)
  if (active) return normalizeEngagementState(active)
  return createEmptyEngagement()
}

export function saveEngagement(state: EngagementState): EngagementState {
  const store = loadWorkspace()
  const active = findActiveEngagement(store)
  const next = normalizeEngagementState({
    ...state,
    id: active?.id ?? state.id,
    updatedAt: new Date().toISOString(),
  })
  saveWorkspace(updateActiveEngagement(store, next))
  return next
}

export function clearEngagement(): void {
  clearWorkspace()
  clearEngagementLegacyKey()
  const empty = createEmptyEngagement()
  const store = loadWorkspace()
  const activeId = store.activeEngagementId ?? empty.id
  saveWorkspace(
    updateActiveEngagement(store, {
      ...empty,
      id: activeId,
      clientName: '',
      engagementName: '',
    }),
  )
}
