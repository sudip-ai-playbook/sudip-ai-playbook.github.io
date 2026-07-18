import type { JourneyStepId } from '../../constants/journey'
import { JOURNEY_STEPS } from '../../constants/journey'
import { isFrameComplete, type PlaybookProject } from './project.logic'

export type JourneyAccessStatus = 'open' | 'locked' | 'incomplete'

export type JourneyStepAccess = {
  status: JourneyAccessStatus
  reason: string | null
  unlockPath: string | null
  unlockLabel: string | null
}

const FRAME_PATH = '/frame'

export function getJourneyStepAccess(
  stepId: JourneyStepId,
  project: PlaybookProject,
): JourneyStepAccess {
  if (stepId === 'frame') {
    return {
      status: 'open',
      reason: null,
      unlockPath: null,
      unlockLabel: null,
    }
  }

  if (!isFrameComplete(project)) {
    return {
      status: 'locked',
      reason: 'Frame the business outcome before continuing the architecture journey.',
      unlockPath: FRAME_PATH,
      unlockLabel: 'Go to Frame',
    }
  }

  if (stepId === 'summary' && project.stack.length === 0) {
    return {
      status: 'incomplete',
      reason: 'Add at least one service to the stack before exporting a stakeholder brief.',
      unlockPath: '/compare',
      unlockLabel: 'Compare services',
    }
  }

  if (stepId === 'decide' && !project.selectedCapability && project.stack.length === 0) {
    return {
      status: 'incomplete',
      reason: 'Pick a capability in Compare or use a Quick Pick so scoring has something to decide.',
      unlockPath: '/compare',
      unlockLabel: 'Open Compare',
    }
  }

  return {
    status: 'open',
    reason: null,
    unlockPath: null,
    unlockLabel: null,
  }
}

export function isJourneyStepNavigable(
  stepId: JourneyStepId,
  project: PlaybookProject,
): boolean {
  return getJourneyStepAccess(stepId, project).status !== 'locked'
}

export function getJourneyProgress(project: PlaybookProject): {
  completedCount: number
  totalCount: number
  nextOpenPath: string
} {
  const checks: Array<(current: PlaybookProject) => boolean> = [
    (current) => isFrameComplete(current),
    (current) => Boolean(current.selectedLayer),
    (current) => Boolean(current.selectedScenario),
    (current) => Boolean(current.selectedCapability),
    (current) => current.preferredProvider !== 'undecided',
    () => true,
    (current) => current.stack.length > 0,
    (current) => isFrameComplete(current) && current.stack.length > 0,
  ]

  const completedCount = checks.reduce((count, check) => {
    return check(project) ? count + 1 : count
  }, 0)

  const nextIndex = checks.findIndex((check) => !check(project))
  const nextOpenPath =
    nextIndex === -1 ? '/summary' : (JOURNEY_STEPS[nextIndex]?.path ?? FRAME_PATH)

  return {
    completedCount,
    totalCount: JOURNEY_STEPS.length,
    nextOpenPath,
  }
}
