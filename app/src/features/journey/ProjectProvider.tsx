import type { ReactNode } from 'react'
import { createElement, useCallback, useMemo, useState } from 'react'
import type { DeploymentOption, EcosystemOption, ProviderId } from '../../constants/playbook'
import { ProjectContext } from './projectContext.shared'
import {
  clearProjectStorage,
  createStackItem,
  loadProject,
  saveProject,
  type PlaybookProject,
  type StackItem,
} from './project.logic'

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProjectState] = useState<PlaybookProject>(() => loadProject())

  const setProject = useCallback((updater: (previous: PlaybookProject) => PlaybookProject) => {
    setProjectState((previous) => {
      const next = updater(previous)
      saveProject(next)
      return { ...next, updatedAt: new Date().toISOString() }
    })
  }, [])

  const updateBrief = useCallback(
    (patch: Partial<Pick<PlaybookProject, 'outcome' | 'users' | 'constraints' | 'ecosystem' | 'deployment' | 'decisionNotes'>>) => {
      setProject((previous) => ({ ...previous, ...patch }))
    },
    [setProject],
  )

  const setFocus = useCallback(
    (patch: Partial<Pick<PlaybookProject, 'selectedLayer' | 'selectedCapability' | 'selectedScenario' | 'preferredProvider'>>) => {
      setProject((previous) => ({ ...previous, ...patch }))
    },
    [setProject],
  )

  const addToStack = useCallback(
    (item: Omit<StackItem, 'id'>) => {
      setProject((previous) => {
        const exists = previous.stack.some(
          (entry) =>
            entry.capability === item.capability &&
            entry.provider === item.provider &&
            entry.service === item.service,
        )
        if (exists) return previous
        return { ...previous, stack: [...previous.stack, createStackItem(item)] }
      })
    },
    [setProject],
  )

  const removeFromStack = useCallback(
    (itemId: string) => {
      setProject((previous) => ({
        ...previous,
        stack: previous.stack.filter((item) => item.id !== itemId),
      }))
    },
    [setProject],
  )

  const clearStack = useCallback(() => {
    setProject((previous) => ({ ...previous, stack: [] }))
  }, [setProject])

  const resetProject = useCallback(() => {
    clearProjectStorage()
    setProjectState(loadProject())
  }, [])

  const value = useMemo(
    () => ({
      project,
      updateBrief,
      setFocus,
      addToStack,
      removeFromStack,
      clearStack,
      resetProject,
      setEcosystem: (ecosystem: EcosystemOption) => updateBrief({ ecosystem }),
      setDeployment: (deployment: DeploymentOption) => updateBrief({ deployment }),
      setPreferredProvider: (preferredProvider: ProviderId | 'undecided') =>
        setFocus({ preferredProvider }),
    }),
    [project, updateBrief, setFocus, addToStack, removeFromStack, clearStack, resetProject],
  )

  return createElement(ProjectContext.Provider, { value }, children)
}
