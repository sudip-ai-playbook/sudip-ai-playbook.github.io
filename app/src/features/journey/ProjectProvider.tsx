import type { ReactNode } from 'react'
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DeploymentOption, EcosystemOption, ProviderId } from '../../constants/playbook'
import { ProjectContext } from './projectContext.shared'
import {
  createStackItem,
  EMPTY_PROJECT,
  loadProject,
  type PlaybookProject,
  type StackItem,
} from './project.logic'
import type { ValidationCheckId } from './validation.logic'
import { applyWorkspacePack, type WorkspacePack } from '../persistence/workspacePack.logic'
import {
  clearProjectDurable,
  loadProjectDurable,
  saveProjectDurable,
} from '../persistence/durableStore'

const UNDO_WINDOW_MS = 15000

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProjectState] = useState<PlaybookProject>(() => loadProject())
  const [isReady] = useState(true)
  const [undoSnapshot, setUndoSnapshot] = useState<PlaybookProject | null>(null)
  const undoTimerRef = useRef<number | null>(null)

  useEffect(() => {
    let active = true
    void loadProjectDurable().then((loaded) => {
      if (!active) return
      setProjectState(loaded)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (undoTimerRef.current !== null) {
        window.clearTimeout(undoTimerRef.current)
      }
    }
  }, [])

  const setProject = useCallback((updater: (previous: PlaybookProject) => PlaybookProject) => {
    setProjectState((previous) => {
      const next = updater(previous)
      const withTimestamp = { ...next, updatedAt: new Date().toISOString() }
      void saveProjectDurable(withTimestamp)
      return withTimestamp
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

  const clearUndoTimer = useCallback(() => {
    if (undoTimerRef.current !== null) {
      window.clearTimeout(undoTimerRef.current)
      undoTimerRef.current = null
    }
  }, [])

  const resetProject = useCallback(() => {
    setProjectState((previous) => {
      setUndoSnapshot(previous)
      clearUndoTimer()
      undoTimerRef.current = window.setTimeout(() => {
        setUndoSnapshot(null)
        undoTimerRef.current = null
      }, UNDO_WINDOW_MS)
      void clearProjectDurable()
      return { ...EMPTY_PROJECT }
    })
  }, [clearUndoTimer])

  const undoReset = useCallback(() => {
    if (!undoSnapshot) return
    clearUndoTimer()
    const restored = { ...undoSnapshot, updatedAt: new Date().toISOString() }
    void saveProjectDurable(restored)
    setProjectState(restored)
    setUndoSnapshot(null)
  }, [undoSnapshot, clearUndoTimer])

  const dismissUndo = useCallback(() => {
    clearUndoTimer()
    setUndoSnapshot(null)
  }, [clearUndoTimer])

  const replaceProject = useCallback((next: PlaybookProject) => {
    const withTimestamp = { ...next, updatedAt: new Date().toISOString() }
    void saveProjectDurable(withTimestamp)
    setProjectState(withTimestamp)
  }, [])

  const importWorkspacePack = useCallback((pack: WorkspacePack) => {
    const next = applyWorkspacePack(pack)
    const withTimestamp = { ...next, updatedAt: new Date().toISOString() }
    void saveProjectDurable(withTimestamp)
    setProjectState(withTimestamp)
  }, [])

  const setValidationCheck = useCallback(
    (id: ValidationCheckId, checked: boolean) => {
      setProject((previous) => ({
        ...previous,
        validationChecks: {
          ...previous.validationChecks,
          [id]: checked,
        },
      }))
    },
    [setProject],
  )

  const value = useMemo(
    () => ({
      project,
      isReady,
      undoAvailable: undoSnapshot !== null,
      updateBrief,
      setFocus,
      addToStack,
      removeFromStack,
      clearStack,
      resetProject,
      undoReset,
      dismissUndo,
      replaceProject,
      importWorkspacePack,
      setValidationCheck,
      setEcosystem: (ecosystem: EcosystemOption) => updateBrief({ ecosystem }),
      setDeployment: (deployment: DeploymentOption) => updateBrief({ deployment }),
      setPreferredProvider: (preferredProvider: ProviderId | 'undecided') =>
        setFocus({ preferredProvider }),
    }),
    [
      project,
      isReady,
      undoSnapshot,
      updateBrief,
      setFocus,
      addToStack,
      removeFromStack,
      clearStack,
      resetProject,
      undoReset,
      dismissUndo,
      replaceProject,
      importWorkspacePack,
      setValidationCheck,
    ],
  )

  if (!isReady) {
    return createElement(
      'div',
      {
        role: 'status',
        'data-testid': 'workspace-loading',
        className: 'flex min-h-screen items-center justify-center bg-surface-soft text-sm text-ink-secondary',
      },
      'Loading workspace…',
    )
  }

  return createElement(ProjectContext.Provider, { value }, children)
}
