import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getJourneyIndex, getJourneyStepByPath, JOURNEY_STEPS } from '../../constants/journey'
import { isJourneyStepNavigable } from './journey.gates'
import { useProject } from './useProject'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export function JourneyKeyboardShortcuts() {
  const location = useLocation()
  const navigate = useNavigate()
  const { project } = useProject()
  const activeIndex = getJourneyIndex(location.pathname)

  useEffect(() => {
    if (activeIndex < 0) return undefined

    function handleKeyDown(event: KeyboardEvent): void {
      if (!event.altKey || isTypingTarget(event.target)) return
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return

      event.preventDefault()
      const delta = event.key === 'ArrowRight' ? 1 : -1
      const nextIndex = activeIndex + delta
      if (nextIndex < 0 || nextIndex >= JOURNEY_STEPS.length) return
      const nextStep = JOURNEY_STEPS[nextIndex]
      if (!nextStep || !isJourneyStepNavigable(nextStep.id, project)) return
      navigate(nextStep.path)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, navigate, project])

  const step = getJourneyStepByPath(location.pathname)
  if (!step) return null

  return (
    <p className="sr-only" data-testid="journey-shortcuts-hint">
      Keyboard: Alt+Left previous step, Alt+Right next step.
    </p>
  )
}
