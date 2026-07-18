import { Link, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { JOURNEY_STEPS, getJourneyIndex } from '../../constants/journey'
import { getJourneyProgress, getJourneyStepAccess, isJourneyStepNavigable } from './journey.gates'
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
  const progress = getJourneyProgress(project)
  const progressPercent = Math.round((progress.completedCount / progress.totalCount) * 100)

  return (
    <nav
      className="border-b border-ink/8 bg-white/40 backdrop-blur-md"
      data-testid="journey-rail"
      aria-label="Architecture journey steps"
    >
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Journey progress
          </p>
          <p className="text-[11px] font-semibold text-ink" data-testid="journey-progress-label">
            {progress.completedCount}/{progress.totalCount} complete
          </p>
        </div>
        <div
          className="mb-2 h-1.5 overflow-hidden rounded-full bg-ink/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          aria-label="Architecture journey completion"
          data-testid="journey-progress-bar"
        >
          <span
            className="block h-full rounded-full bg-slate-blue transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-2 sm:px-6">
        {JOURNEY_STEPS.map((step, index) => {
          const isActive = index === activeIndex
          const access = getJourneyStepAccess(step.id, project)
          const navigable = isJourneyStepNavigable(step.id, project)
          const isDone =
            (step.id === 'frame' && framed) ||
            (step.id === 'map' && Boolean(project.selectedLayer)) ||
            (step.id === 'picks' && Boolean(project.selectedScenario)) ||
            (step.id === 'compare' && Boolean(project.selectedCapability)) ||
            (step.id === 'decide' && project.preferredProvider !== 'undecided') ||
            (step.id === 'canvas' && project.stack.length > 0) ||
            (step.id === 'summary' && project.stack.length > 0 && framed)

          if (!navigable) {
            return (
              <span
                key={step.id}
                data-testid={`journey-step-${step.id}`}
                aria-disabled="true"
                title={access.reason ?? 'Complete Frame first'}
                className="flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full bg-white/50 px-3 py-1.5 text-xs font-semibold text-ink-muted opacity-60"
              >
                <Lock className="h-3.5 w-3.5" aria-hidden />
                {step.label}
              </span>
            )
          }

          return (
            <Link
              key={step.id}
              to={step.path}
              data-testid={`journey-step-${step.id}`}
              aria-current={isActive ? 'step' : undefined}
              className={[
                'flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                isActive
                  ? 'bg-ink text-surface-soft'
                  : isDone
                    ? 'bg-slate-blue/15 text-ink'
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
          <span className="ml-auto shrink-0 rounded-full bg-slate-blue/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink">
            Stack: {project.stack.length}
          </span>
        ) : null}
      </div>
    </nav>
  )
}
