import { useState } from 'react'
import { Route } from 'lucide-react'
import { CONSULTING_STAGES } from '../../../data/consultingOs'
import {
  STAGE_STATUS,
  STAGE_STATUS_LABELS,
  advanceStageWithOverride,
  getIncompleteGateReasons,
  isGatePassed,
  type EngagementState,
} from '../engagement.logic'
import { canEditEngagement, type ConsultPersona } from '../roles/roles.logic'

interface ConsultingJourneyViewProps {
  engagement: EngagementState
  persona: ConsultPersona
  onEngagementChange: (engagement: EngagementState) => void
  onOpenWorkshop: (stageId: string) => void
}

export function ConsultingJourneyView({
  engagement,
  persona,
  onEngagementChange,
  onOpenWorkshop,
}: ConsultingJourneyViewProps) {
  const editable = canEditEngagement(persona)
  const [overrideReason, setOverrideReason] = useState('')
  const [pendingStageId, setPendingStageId] = useState<string | null>(null)

  function handleSelectStage(stageId: string): void {
    if (!editable) return
    const reasons = getIncompleteGateReasons(engagement, stageId)
    if (reasons.length > 0) {
      setPendingStageId(stageId)
      return
    }
    onEngagementChange(
      advanceStageWithOverride(engagement, stageId, ''),
    )
    setPendingStageId(null)
  }

  function handleConfirmOverride(): void {
    if (!pendingStageId || !overrideReason.trim()) return
    onEngagementChange(
      advanceStageWithOverride(engagement, pendingStageId, overrideReason),
    )
    setPendingStageId(null)
    setOverrideReason('')
  }

  function handleCancelOverride(): void {
    setPendingStageId(null)
    setOverrideReason('')
  }

  return (
    <div className="space-y-6" data-testid="consulting-journey-view">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <Route className="h-5 w-5 text-slate-blue" />
          Consulting journey
        </h2>
        <p className="text-sm text-ink-secondary">
          Visual lifecycle with stage readiness and soft gate overrides.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4" data-testid="journey-stage-grid">
        {CONSULTING_STAGES.map((stage) => {
          const progress = engagement.stageProgress[stage.id]
          const status = progress?.status ?? STAGE_STATUS.NOT_STARTED
          const gateOk = progress ? isGatePassed(stage, progress) : false
          const isCurrent = engagement.currentStageId === stage.id
          return (
            <article
              key={stage.id}
              className={[
                'glass-panel space-y-2 p-4',
                isCurrent ? 'ring-2 ring-slate-blue' : '',
              ].join(' ')}
              data-testid={`journey-stage-${stage.id}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">
                {stage.number}. {stage.journeyLabel}
              </p>
              <h3 className="text-sm font-bold">{stage.shortLabel}</h3>
              <p className="text-xs text-ink-muted">{STAGE_STATUS_LABELS[status]}</p>
              <p className="text-xs" data-testid={`journey-gate-${stage.id}`}>
                Gate: {gateOk ? 'Passed' : 'Open'} · {stage.gate}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  data-testid={`journey-select-${stage.id}`}
                  onClick={() => handleSelectStage(stage.id)}
                  disabled={!editable}
                >
                  Set current
                </button>
                <button
                  type="button"
                  className="btn btn-accent"
                  data-testid={`journey-workshop-${stage.id}`}
                  onClick={() => onOpenWorkshop(stage.id)}
                >
                  Workshop
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {pendingStageId ? (
        <div className="glass-panel space-y-3 p-5" data-testid="journey-override-panel">
          <p className="font-semibold text-tiger-orange">Incomplete prior gates</p>
          <ul className="list-disc pl-5 text-sm">
            {getIncompleteGateReasons(engagement, pendingStageId).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Override rationale (required)
            <textarea
              className="field-input mt-2 min-h-20"
              data-testid="journey-override-reason"
              value={overrideReason}
              onChange={(event) => setOverrideReason(event.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-accent"
              data-testid="journey-confirm-override"
              onClick={handleConfirmOverride}
            >
              Override and advance
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="journey-cancel-override"
              onClick={handleCancelOverride}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
