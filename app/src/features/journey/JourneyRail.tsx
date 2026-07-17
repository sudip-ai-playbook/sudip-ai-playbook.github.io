import { Link, useLocation } from 'react-router-dom'
import { JOURNEY_STEPS, getJourneyIndex } from '../../constants/journey'
import { isFrameComplete } from './project.logic'
import { useProject } from './useProject'

export function JourneyRail() {
  const location = useLocation()
  const { project } = useProject()
  const hashPath = location.pathname
  const activeIndex = getJourneyIndex(hashPath)

  if (activeIndex < 0) {
    return null
  }

  const framed = isFrameComplete(project)

  return (
    <div className="border-b border-slate-blue/10 bg-white/40 backdrop-blur-md" data-testid="journey-rail">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6">
        {JOURNEY_STEPS.map((step, index) => {
          const isActive = index === activeIndex
          const isDone =
            (step.id === 'frame' && framed) ||
            (step.id === 'map' && Boolean(project.selectedLayer)) ||
            (step.id === 'picks' && Boolean(project.selectedScenario)) ||
            (step.id === 'compare' && Boolean(project.selectedCapability)) ||
            (step.id === 'decide' && project.preferredProvider !== 'undecided') ||
            (step.id === 'canvas' && project.stack.length > 0) ||
            (step.id === 'summary' && project.stack.length > 0 && framed)
          return (
            <Link
              key={step.id}
              to={step.path}
              data-testid={`journey-step-${step.id}`}
              className={[
                'flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                isActive
                  ? 'bg-slate-blue text-white'
                  : isDone
                    ? 'bg-amber-flame/20 text-ink'
                    : 'bg-white/70 text-ink-muted hover:bg-white',
              ].join(' ')}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px]">
                {index + 1}
              </span>
              {step.label}
            </Link>
          )
        })}
        {project.stack.length > 0 ? (
          <span className="ml-auto shrink-0 rounded-full bg-slate-blue/10 px-3 py-1 text-[10px] font-bold text-indigo-velvet">
            Stack: {project.stack.length}
          </span>
        ) : null}
      </div>
    </div>
  )
}
