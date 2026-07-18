import { Navigate, useLocation } from 'react-router-dom'
import { getJourneyStepByPath } from '../../constants/journey'
import { CoachBanner } from '../guidance'
import { getJourneyStepAccess } from './journey.gates'
import { useProject } from './useProject'

export function JourneyCoach() {
  const location = useLocation()
  const { project } = useProject()
  const step = getJourneyStepByPath(location.pathname)

  if (!step) return null

  const access = getJourneyStepAccess(step.id, project)

  if (access.status === 'locked' && access.unlockPath) {
    return <Navigate to={access.unlockPath} replace />
  }

  if (access.status === 'open' || !access.reason) return null

  return (
    <div className="mb-6">
      <CoachBanner
        testId="journey-coach"
        tone="info"
        title="Almost ready"
        message={access.reason}
        actionLabel={access.unlockLabel ?? undefined}
        actionTo={access.unlockPath ?? undefined}
      />
    </div>
  )
}
