import { useCallback, useState } from 'react'
import {
  loadEngagement,
  saveEngagement,
  type EngagementState,
} from './engagement.logic'
import {
  findActiveClient,
  findActiveEngagement,
  loadWorkspace,
  saveWorkspace,
  setWorkspacePersona,
  type WorkspaceStore,
} from './workspace/workspace.logic'
import type { ConsultPersona } from './roles/roles.logic'
import { canEditEngagement } from './roles/roles.logic'

export function useConsultingWorkspace() {
  const [store, setStore] = useState<WorkspaceStore>(() => loadWorkspace())
  const engagement = findActiveEngagement(store) ?? loadEngagement()
  const client = findActiveClient(store)
  const editable = canEditEngagement(store.persona)

  const persistStore = useCallback((next: WorkspaceStore): void => {
    setStore(saveWorkspace(next))
  }, [])

  const persistEngagement = useCallback((next: EngagementState): EngagementState => {
    const saved = saveEngagement(next)
    setStore(loadWorkspace())
    return saved
  }, [])

  const setPersona = useCallback(
    (persona: ConsultPersona): void => {
      persistStore(setWorkspacePersona(store, persona))
    },
    [persistStore, store],
  )

  const reload = useCallback((): void => {
    setStore(loadWorkspace())
  }, [])

  return {
    store,
    engagement,
    client,
    persona: store.persona,
    editable,
    persistStore,
    persistEngagement,
    setPersona,
    reload,
  }
}
