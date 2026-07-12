import { useState, type ChangeEvent } from 'react'
import { Scale } from 'lucide-react'
import {
  REGISTER_ITEM_STATUS,
  addEngagementDecision,
  type EngagementDecisionItem,
  type EngagementState,
  type RegisterItemStatus,
} from '../engagement.logic'
import { canEditEngagement, type ConsultPersona } from '../roles/roles.logic'

interface DecisionCentreViewProps {
  engagement: EngagementState
  persona: ConsultPersona
  onEngagementChange: (engagement: EngagementState) => void
}

export function DecisionCentreView({
  engagement,
  persona,
  onEngagementChange,
}: DecisionCentreViewProps) {
  const editable = canEditEngagement(persona)
  const [text, setText] = useState('')
  const [context, setContext] = useState('')
  const [options, setOptions] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [owner, setOwner] = useState('')

  function handleAdd(): void {
    if (!editable || !text.trim()) return
    onEngagementChange(
      addEngagementDecision(engagement, {
        text,
        context,
        options,
        criteria: '',
        recommendation,
        risks: '',
        owner,
        date: new Date().toISOString().slice(0, 10),
        approvalEvidence: '',
        linkedWorkstreams: engagement.currentStageId,
        status: REGISTER_ITEM_STATUS.OPEN,
        stageId: engagement.currentStageId,
      }),
    )
    setText('')
    setContext('')
    setOptions('')
    setRecommendation('')
    setOwner('')
  }

  function handleStatusChange(decisionId: string, event: ChangeEvent<HTMLSelectElement>): void {
    if (!editable) return
    const status = event.target.value as RegisterItemStatus
    onEngagementChange({
      ...engagement,
      registers: {
        ...engagement.registers,
        decisions: engagement.registers.decisions.map((item) =>
          item.id === decisionId ? { ...item, status } : item,
        ),
      },
    })
  }

  function handleEvidence(decision: EngagementDecisionItem, event: ChangeEvent<HTMLInputElement>): void {
    if (!editable) return
    onEngagementChange({
      ...engagement,
      registers: {
        ...engagement.registers,
        decisions: engagement.registers.decisions.map((item) =>
          item.id === decision.id ? { ...item, approvalEvidence: event.target.value } : item,
        ),
      },
    })
  }

  return (
    <div className="space-y-6" data-testid="decision-centre-view">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <Scale className="h-5 w-5 text-slate-blue" />
          Decision centre
        </h2>
        <p className="text-sm text-ink-secondary">
          Record options, recommendations, owners and approval evidence.
        </p>
      </header>

      {editable ? (
        <section className="glass-panel grid gap-2 p-5 md:grid-cols-2" data-testid="decision-create">
          <input className="field-input" data-testid="decision-text" placeholder="Decision required" value={text} onChange={(event) => setText(event.target.value)} />
          <input className="field-input" data-testid="decision-owner" placeholder="Owner" value={owner} onChange={(event) => setOwner(event.target.value)} />
          <textarea className="field-input md:col-span-2" data-testid="decision-context" placeholder="Context" value={context} onChange={(event) => setContext(event.target.value)} />
          <textarea className="field-input" data-testid="decision-options" placeholder="Options" value={options} onChange={(event) => setOptions(event.target.value)} />
          <textarea className="field-input" data-testid="decision-recommendation" placeholder="Recommendation" value={recommendation} onChange={(event) => setRecommendation(event.target.value)} />
          <button type="button" className="btn btn-accent md:col-span-2" data-testid="decision-add" onClick={handleAdd}>
            Add decision
          </button>
        </section>
      ) : null}

      <ul className="space-y-3" data-testid="decision-list">
        {engagement.registers.decisions.map((decision) => (
          <li key={decision.id} className="glass-panel space-y-2 p-4" data-testid={`decision-item-${decision.id}`}>
            <p className="font-semibold">{decision.text}</p>
            <p className="text-sm text-ink-secondary">{decision.context}</p>
            <p className="text-xs">Options: {decision.options || '—'}</p>
            <p className="text-xs">Recommendation: {decision.recommendation || '—'}</p>
            <p className="text-xs">Owner: {decision.owner || '—'} · {decision.date}</p>
            <div className="flex flex-wrap gap-2">
              <select
                className="field-input"
                data-testid={`decision-status-${decision.id}`}
                value={decision.status}
                onChange={(event) => handleStatusChange(decision.id, event)}
                disabled={!editable}
              >
                <option value={REGISTER_ITEM_STATUS.OPEN}>Open</option>
                <option value={REGISTER_ITEM_STATUS.APPROVED}>Approved</option>
                <option value={REGISTER_ITEM_STATUS.REJECTED}>Rejected</option>
                <option value={REGISTER_ITEM_STATUS.DEFERRED}>Deferred</option>
              </select>
              <input
                className="field-input"
                data-testid={`decision-evidence-${decision.id}`}
                placeholder="Approval evidence"
                value={decision.approvalEvidence}
                onChange={(event) => handleEvidence(decision, event)}
                disabled={!editable}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
