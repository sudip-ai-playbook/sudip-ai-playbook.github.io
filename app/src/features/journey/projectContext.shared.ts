import { createContext } from 'react'
import type { DeploymentOption, EcosystemOption, ProviderId } from '../../constants/playbook'
import type { PlaybookProject, StackItem } from './project.logic'
import type { ValidationCheckId } from './validation.logic'
import type { WorkspacePack } from '../persistence/workspacePack.logic'

export interface ProjectContextValue {
  project: PlaybookProject
  isReady: boolean
  undoAvailable: boolean
  updateBrief: (
    patch: Partial<
      Pick<PlaybookProject, 'outcome' | 'users' | 'constraints' | 'ecosystem' | 'deployment' | 'decisionNotes'>
    >,
  ) => void
  setFocus: (
    patch: Partial<
      Pick<PlaybookProject, 'selectedLayer' | 'selectedCapability' | 'selectedScenario' | 'preferredProvider'>
    >,
  ) => void
  addToStack: (item: Omit<StackItem, 'id'>) => void
  removeFromStack: (itemId: string) => void
  clearStack: () => void
  resetProject: () => void
  undoReset: () => void
  dismissUndo: () => void
  replaceProject: (project: PlaybookProject) => void
  importWorkspacePack: (pack: WorkspacePack) => void
  setValidationCheck: (id: ValidationCheckId, checked: boolean) => void
  setEcosystem: (ecosystem: EcosystemOption) => void
  setDeployment: (deployment: DeploymentOption) => void
  setPreferredProvider: (provider: ProviderId | 'undecided') => void
}

export const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)
