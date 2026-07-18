import { useLocation } from 'react-router-dom'
import { getJourneyStepByPath } from '../../constants/journey'
import { JourneyHelpPanel } from './JourneyHelpPanel'

export function JourneyHelpHost() {
  const location = useLocation()
  const step = getJourneyStepByPath(location.pathname)
  if (!step) return null

  return (
    <div className="mb-6">
      <JourneyHelpPanel stepId={step.id} />
    </div>
  )
}
