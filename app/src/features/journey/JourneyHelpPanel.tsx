import type { JourneyStepId } from '../../constants/journey'
import { getJourneyHelp } from './journey.help'

type JourneyHelpPanelProps = {
  stepId: JourneyStepId
  defaultOpen?: boolean
}

export function JourneyHelpPanel({ stepId, defaultOpen = false }: JourneyHelpPanelProps) {
  const help = getJourneyHelp(stepId)

  return (
    <details
      className="glass-panel group p-4"
      data-testid={`journey-help-${stepId}`}
      open={defaultOpen ? true : undefined}
    >
      <summary className="cursor-pointer list-none text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        <span className="inline-flex items-center gap-2">
          Need an example?
          <span className="text-xs font-medium text-ink-muted group-open:hidden">(show help)</span>
          <span className="hidden text-xs font-medium text-ink-muted group-open:inline">(hide help)</span>
        </span>
      </summary>
      <div className="mt-4 space-y-3 border-t border-ink/10 pt-4 text-sm">
        <p>
          <span className="font-semibold text-ink">{help.title}.</span>{' '}
          <span className="text-ink-secondary">{help.whyItMatters}</span>
        </p>
        <div className="rounded-xl bg-slate-blue/10 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Good example</p>
          <p className="mt-1 text-ink" data-testid={`journey-help-good-${stepId}`}>
            {help.goodExample}
          </p>
        </div>
        <div className="rounded-xl bg-amber-flame/15 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Avoid</p>
          <p className="mt-1 text-ink">{help.antiPattern}</p>
        </div>
        <p className="text-ink-secondary">
          <span className="font-semibold text-ink">Tip:</span> {help.tip}
        </p>
      </div>
    </details>
  )
}
