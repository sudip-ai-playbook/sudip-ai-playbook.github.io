import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getJourneyStepByPath } from '../../constants/journey'

interface StepNavProps {
  path: string
  disableNext?: boolean
  nextHint?: string
}

export function StepNav({ path, disableNext, nextHint }: StepNavProps) {
  const step = getJourneyStepByPath(path)
  if (!step) return null

  const hasNext = 'next' in step && Boolean(step.next)
  const nextPath = hasNext ? step.next : null

  return (
    <div
      className="glass-panel mt-8 flex flex-wrap items-center justify-between gap-3 p-4"
      data-testid="step-nav"
    >
      {'prev' in step && step.prev ? (
        <Link to={step.prev} className="btn btn-ghost" data-testid="step-prev">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>
      ) : (
        <span />
      )}
      <p className="text-xs text-ink-muted">
        {nextHint ?? step.hint}
        <span className="ml-2 hidden sm:inline">(Alt+← / Alt+→)</span>
      </p>
      {nextPath ? (
        disableNext ? (
          <span
            className="btn btn-accent pointer-events-none opacity-45"
            aria-disabled="true"
            data-testid="step-next"
          >
            Next
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        ) : (
          <Link to={nextPath} className="btn btn-accent" data-testid="step-next">
            Next
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )
      ) : null}
    </div>
  )
}
