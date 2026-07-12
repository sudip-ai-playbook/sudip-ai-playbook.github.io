import { useState, type ChangeEvent } from 'react'
import {
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  Compass,
  Plus,
  Trash2,
} from 'lucide-react'
import { CONSULTING_STAGES } from '../../data/consultingOs'
import {
  RAG_STATUS,
  REGISTER_ITEM_STATUS,
  RISK_SEVERITY,
  STAGE_STATUS,
  STAGE_STATUS_LABELS,
  addEngagementAction,
  addEngagementBenefit,
  addEngagementDeliverable,
  addEngagementRisk,
  addRegisterTextItem,
  buildNextStepGuidance,
  computeEngagementHealth,
  countApprovedStages,
  isGatePassed,
  removeEngagementRisk,
  setStageStatus,
  syncDeliverablesFromStage,
  toggleGateCriterion,
  updateHealthField,
  type EngagementState,
  type RagStatus,
  type RiskSeverity,
  type StageStatus,
} from './engagement.logic'
import { getWorkshopForStage } from './workspace/workspace.logic'
import { canEditEngagement, type ConsultPersona } from './roles/roles.logic'

const RAG_LABEL = {
  [RAG_STATUS.GREEN]: 'Green',
  [RAG_STATUS.AMBER]: 'Amber',
  [RAG_STATUS.RED]: 'Red',
} as const

interface EngagementControlViewProps {
  engagement: EngagementState
  persona: ConsultPersona
  onEngagementChange: (engagement: EngagementState) => void
  onOpenWorkshop: (stageId: string) => void
  onOpenLab: () => void
  onOpenDeliverables: () => void
}

export function EngagementControlView({
  engagement,
  persona,
  onEngagementChange,
  onOpenWorkshop,
  onOpenLab,
  onOpenDeliverables,
}: EngagementControlViewProps) {
  const editable = canEditEngagement(persona)
  const [riskText, setRiskText] = useState('')
  const [riskOwner, setRiskOwner] = useState('')
  const [riskSeverity, setRiskSeverity] = useState<RiskSeverity>(RISK_SEVERITY.MEDIUM)
  const [deliverableTitle, setDeliverableTitle] = useState('')
  const [actionText, setActionText] = useState('')
  const [actionOwner, setActionOwner] = useState('')
  const [actionDue, setActionDue] = useState('')
  const [assumptionText, setAssumptionText] = useState('')
  const [benefitText, setBenefitText] = useState('')
  const [benefitExpected, setBenefitExpected] = useState('')

  const workshop = getWorkshopForStage(engagement, engagement.currentStageId)
  const health = computeEngagementHealth(engagement)
  const guidance = buildNextStepGuidance(engagement, workshop)
  const approvedCount = countApprovedStages(engagement)
  const currentStage =
    CONSULTING_STAGES.find((stage) => stage.id === engagement.currentStageId) ??
    CONSULTING_STAGES[0]
  const currentProgress = engagement.stageProgress[currentStage.id]

  function persist(next: EngagementState): void {
    onEngagementChange(next)
  }

  function handleClientName(event: ChangeEvent<HTMLInputElement>): void {
    if (!editable) return
    persist({ ...engagement, clientName: event.target.value })
  }

  function handleEngagementName(event: ChangeEvent<HTMLInputElement>): void {
    if (!editable) return
    persist({ ...engagement, engagementName: event.target.value })
  }

  function handleCurrentStage(event: ChangeEvent<HTMLSelectElement>): void {
    if (!editable) return
    const stageId = event.target.value
    persist(
      setStageStatus(
        { ...engagement, currentStageId: stageId },
        stageId,
        STAGE_STATUS.IN_PROGRESS,
      ),
    )
  }

  function handleStageStatus(event: ChangeEvent<HTMLSelectElement>): void {
    if (!editable) return
    persist(setStageStatus(engagement, currentStage.id, event.target.value as StageStatus))
  }

  function handleToggleCriterion(criterion: string): void {
    if (!editable) return
    persist(toggleGateCriterion(engagement, currentStage.id, criterion))
  }

  function handleStageNotes(event: ChangeEvent<HTMLTextAreaElement>): void {
    if (!editable) return
    const existing = engagement.stageProgress[currentStage.id] ?? {
      status: STAGE_STATUS.NOT_STARTED,
      checkedCriteria: [],
      notes: '',
    }
    persist({
      ...engagement,
      stageProgress: {
        ...engagement.stageProgress,
        [currentStage.id]: { ...existing, notes: event.target.value },
      },
    })
  }

  function handleHealth(
    field: 'schedule' | 'budget' | 'scope' | 'resource' | 'risk' | 'clientSatisfaction',
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    if (!editable) return
    persist(updateHealthField(engagement, field, event.target.value as RagStatus))
  }

  function handleAddRisk(): void {
    if (!editable || !riskText.trim()) return
    persist(
      addEngagementRisk(engagement, {
        text: riskText,
        owner: riskOwner,
        severity: riskSeverity,
        stageId: currentStage.id,
      }),
    )
    setRiskText('')
    setRiskOwner('')
  }

  function handleAddDeliverable(): void {
    if (!editable || !deliverableTitle.trim()) return
    persist(
      addEngagementDeliverable(engagement, {
        title: deliverableTitle,
        stageId: currentStage.id,
        status: 'draft',
      }),
    )
    setDeliverableTitle('')
  }

  function handleSyncDeliverables(): void {
    if (!editable) return
    persist(syncDeliverablesFromStage(engagement, currentStage.id))
  }

  function handleAddAction(): void {
    if (!editable || !actionText.trim()) return
    persist(
      addEngagementAction(engagement, {
        text: actionText,
        owner: actionOwner,
        due: actionDue,
        status: REGISTER_ITEM_STATUS.OPEN,
        stageId: currentStage.id,
      }),
    )
    setActionText('')
    setActionOwner('')
    setActionDue('')
  }

  function handleAddAssumption(): void {
    if (!editable || !assumptionText.trim()) return
    persist(
      addRegisterTextItem(engagement, 'assumptions', {
        text: assumptionText,
        owner: actionOwner || 'TBD',
        status: REGISTER_ITEM_STATUS.OPEN,
        stageId: currentStage.id,
      }),
    )
    setAssumptionText('')
  }

  function handleAddBenefit(): void {
    if (!editable || !benefitText.trim()) return
    persist(
      addEngagementBenefit(engagement, {
        text: benefitText,
        expected: benefitExpected,
        realised: '',
        owner: actionOwner || 'TBD',
        status: REGISTER_ITEM_STATUS.OPEN,
      }),
    )
    setBenefitText('')
    setBenefitExpected('')
  }

  return (
    <div className="space-y-6" data-testid="engagement-control-view">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
            <ClipboardList className="h-5 w-5 text-slate-blue" />
            Engagement Control Centre
          </h2>
          <p className="text-sm text-ink-secondary">
            Status, phase gates and full engagement registers.
          </p>
        </div>
        <div
          className="rounded-full bg-slate-blue/15 px-3 py-1 text-xs font-bold text-indigo-velvet"
          data-testid="engagement-rag"
        >
          RAG {RAG_LABEL[health]} · {approvedCount}/{CONSULTING_STAGES.length} stages approved
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6" data-testid="engagement-health-strip">
        {(
          [
            ['schedule', 'Schedule'],
            ['budget', 'Budget'],
            ['scope', 'Scope'],
            ['resource', 'Resource'],
            ['risk', 'Risk'],
            ['clientSatisfaction', 'Client sat.'],
          ] as const
        ).map(([field, label]) => (
          <label key={field} className="glass-panel block p-3 text-xs font-semibold uppercase text-ink-muted">
            {label}
            <select
              className="field-input mt-2"
              data-testid={`engagement-health-${field}`}
              value={engagement.health[field]}
              onChange={(event) => handleHealth(field, event)}
              disabled={!editable}
            >
              <option value={RAG_STATUS.GREEN}>Green</option>
              <option value={RAG_STATUS.AMBER}>Amber</option>
              <option value={RAG_STATUS.RED}>Red</option>
            </select>
          </label>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="glass-panel block space-y-2 p-4 text-xs font-semibold uppercase text-ink-muted">
          Client
          <input
            className="field-input"
            data-testid="engagement-client-name"
            value={engagement.clientName}
            onChange={handleClientName}
            disabled={!editable}
          />
        </label>
        <label className="glass-panel block space-y-2 p-4 text-xs font-semibold uppercase text-ink-muted">
          Engagement
          <input
            className="field-input"
            data-testid="engagement-name"
            value={engagement.engagementName}
            onChange={handleEngagementName}
            disabled={!editable}
          />
        </label>
      </section>

      <section className="glass-panel space-y-3 p-5" data-testid="engagement-next-step">
        <h3 className="flex items-center gap-2 font-bold">
          <Compass className="h-4 w-4 text-slate-blue" />
          Four OS questions
        </h3>
        <dl className="grid gap-3 md:grid-cols-2 text-sm">
          <div>
            <dt className="text-xs uppercase text-ink-muted">Where are we?</dt>
            <dd className="mt-1" data-testid="guidance-where">
              {guidance.whereAreWe}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-ink-muted">What next?</dt>
            <dd className="mt-1" data-testid="guidance-next">
              {guidance.whatNext}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-ink-muted">Which framework?</dt>
            <dd className="mt-1" data-testid="guidance-framework">
              {guidance.whichFramework}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-ink-muted">Evidence / approval?</dt>
            <dd className="mt-1" data-testid="guidance-evidence">
              {guidance.whatEvidence}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-accent"
            data-testid="engagement-open-workshop"
            onClick={() => onOpenWorkshop(guidance.recommendedStageId)}
          >
            Open workshop
          </button>
          <button type="button" className="btn btn-ghost" data-testid="engagement-open-lab" onClick={onOpenLab}>
            Framework Lab
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            data-testid="engagement-open-deliverables"
            onClick={onOpenDeliverables}
          >
            Deliverables
          </button>
        </div>
      </section>

      <section className="glass-panel space-y-4 p-5" data-testid="engagement-gate-panel">
        <h3 className="flex items-center gap-2 font-bold">
          <CheckSquare className="h-4 w-4 text-slate-blue" />
          Phase gate
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase text-ink-muted">
            Current stage
            <select
              className="field-input mt-2"
              data-testid="engagement-current-stage"
              value={currentStage.id}
              onChange={handleCurrentStage}
              disabled={!editable}
            >
              {CONSULTING_STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.number}. {stage.shortLabel}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase text-ink-muted">
            Stage status
            <select
              className="field-input mt-2"
              data-testid="engagement-stage-status"
              value={currentProgress?.status ?? STAGE_STATUS.NOT_STARTED}
              onChange={handleStageStatus}
              disabled={!editable}
            >
              {Object.entries(STAGE_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-sm font-semibold">
          {currentStage.gate}{' '}
          {currentProgress && isGatePassed(currentStage, currentProgress) ? '· passed' : '· open'}
        </p>
        <ul className="space-y-2">
          {currentStage.gateCriteria.map((criterion, index) => (
            <li key={criterion}>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  data-testid={`engagement-gate-criterion-${index}`}
                  checked={Boolean(currentProgress?.checkedCriteria.includes(criterion))}
                  onChange={() => handleToggleCriterion(criterion)}
                  disabled={!editable}
                />
                <span>{criterion}</span>
              </label>
            </li>
          ))}
        </ul>
        <textarea
          className="field-input min-h-20"
          data-testid="engagement-stage-notes"
          value={currentProgress?.notes ?? ''}
          onChange={handleStageNotes}
          placeholder="Stage notes"
          disabled={!editable}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-3 p-5" data-testid="engagement-risk-panel">
          <h3 className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-4 w-4 text-tiger-orange" />
            Risks
          </h3>
          {editable ? (
            <div className="space-y-2">
              <input className="field-input" data-testid="engagement-risk-text" value={riskText} onChange={(event) => setRiskText(event.target.value)} placeholder="Risk" />
              <div className="flex gap-2">
                <input className="field-input" data-testid="engagement-risk-owner" value={riskOwner} onChange={(event) => setRiskOwner(event.target.value)} placeholder="Owner" />
                <select className="field-input" data-testid="engagement-risk-severity" value={riskSeverity} onChange={(event) => setRiskSeverity(event.target.value as RiskSeverity)}>
                  {Object.values(RISK_SEVERITY).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" className="btn btn-ghost" data-testid="engagement-add-risk" onClick={handleAddRisk}>
                <Plus className="h-4 w-4" />
                Add risk
              </button>
            </div>
          ) : null}
          <ul className="space-y-2 text-sm">
            {engagement.registers.risks.map((risk) => (
              <li key={risk.id} className="rounded-xl bg-white/70 px-3 py-2" data-testid={`engagement-risk-${risk.id}`}>
                <div className="flex justify-between gap-2">
                  <span>
                    [{risk.severity}] {risk.text} · {risk.owner || 'No owner'}
                  </span>
                  {editable ? (
                    <button type="button" data-testid={`engagement-remove-risk-${risk.id}`} onClick={() => persist(removeEngagementRisk(engagement, risk.id))}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel space-y-3 p-5" data-testid="engagement-deliverable-panel">
          <h3 className="font-bold">Deliverables</h3>
          {editable ? (
            <div className="flex flex-wrap gap-2">
              <input className="field-input" data-testid="engagement-deliverable-title" value={deliverableTitle} onChange={(event) => setDeliverableTitle(event.target.value)} placeholder="Deliverable title" />
              <button type="button" className="btn btn-ghost" data-testid="engagement-add-deliverable" onClick={handleAddDeliverable}>
                Add
              </button>
              <button type="button" className="btn btn-ghost" data-testid="engagement-sync-deliverables" onClick={handleSyncDeliverables}>
                Sync from stage
              </button>
            </div>
          ) : null}
          <ul className="space-y-1 text-sm">
            {engagement.registers.deliverables.map((item) => (
              <li key={item.id} data-testid={`engagement-deliverable-${item.id}`}>
                {item.title} · {item.status}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass-panel space-y-3 p-5" data-testid="engagement-actions-register">
          <h3 className="font-bold">Actions</h3>
          <ul className="space-y-1 text-sm">
            {engagement.registers.actions.map((item) => (
              <li key={item.id}>
                {item.text} · {item.owner} · due {item.due || 'TBD'}
              </li>
            ))}
          </ul>
          {editable ? (
            <div className="space-y-2">
              <input className="field-input" data-testid="engagement-action-text" value={actionText} onChange={(event) => setActionText(event.target.value)} placeholder="Action" />
              <input className="field-input" data-testid="engagement-action-owner" value={actionOwner} onChange={(event) => setActionOwner(event.target.value)} placeholder="Owner" />
              <input className="field-input" data-testid="engagement-action-due" value={actionDue} onChange={(event) => setActionDue(event.target.value)} placeholder="Due YYYY-MM-DD" />
              <button type="button" className="btn btn-ghost" data-testid="engagement-add-action" onClick={handleAddAction}>
                Add action
              </button>
            </div>
          ) : null}
        </div>

        <div className="glass-panel space-y-3 p-5" data-testid="engagement-assumptions-register">
          <h3 className="font-bold">Assumptions / issues / deps</h3>
          <ul className="space-y-1 text-sm">
            {engagement.registers.assumptions.map((item) => (
              <li key={item.id}>Assumption: {item.text}</li>
            ))}
            {engagement.registers.issues.map((item) => (
              <li key={item.id}>Issue: {item.text}</li>
            ))}
            {engagement.registers.dependencies.map((item) => (
              <li key={item.id}>Dependency: {item.text}</li>
            ))}
          </ul>
          {editable ? (
            <div className="flex gap-2">
              <input className="field-input" data-testid="engagement-assumption-text" value={assumptionText} onChange={(event) => setAssumptionText(event.target.value)} placeholder="Assumption" />
              <button type="button" className="btn btn-ghost" data-testid="engagement-add-assumption" onClick={handleAddAssumption}>
                Add
              </button>
            </div>
          ) : null}
        </div>

        <div className="glass-panel space-y-3 p-5" data-testid="engagement-benefits-register">
          <h3 className="font-bold">Benefits</h3>
          <ul className="space-y-1 text-sm">
            {engagement.registers.benefits.map((item) => (
              <li key={item.id}>
                {item.text}: expected {item.expected || 'TBD'} / realised {item.realised || 'TBD'}
              </li>
            ))}
          </ul>
          {editable ? (
            <div className="space-y-2">
              <input className="field-input" data-testid="engagement-benefit-text" value={benefitText} onChange={(event) => setBenefitText(event.target.value)} placeholder="Benefit" />
              <input className="field-input" data-testid="engagement-benefit-expected" value={benefitExpected} onChange={(event) => setBenefitExpected(event.target.value)} placeholder="Expected value" />
              <button type="button" className="btn btn-ghost" data-testid="engagement-add-benefit" onClick={handleAddBenefit}>
                Add benefit
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-2 p-5" data-testid="engagement-workshop-actions">
          <h3 className="font-bold">Workshop actions (current stage)</h3>
          <ul className="space-y-1 text-sm">
            {workshop.actions.length === 0 ? (
              <li className="text-ink-muted">None yet</li>
            ) : (
              workshop.actions.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))
            )}
          </ul>
        </div>
        <div className="glass-panel space-y-2 p-5" data-testid="engagement-workshop-decisions">
          <h3 className="font-bold">Workshop decisions (current stage)</h3>
          <ul className="space-y-1 text-sm">
            {workshop.decisions.length === 0 ? (
              <li className="text-ink-muted">None yet</li>
            ) : (
              workshop.decisions.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  )
}
