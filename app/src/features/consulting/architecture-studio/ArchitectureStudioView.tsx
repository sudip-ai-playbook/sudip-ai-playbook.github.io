import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Boxes } from 'lucide-react'
import { createRegisterId, type EngagementState } from '../engagement.logic'
import { canEditEngagement, type ConsultPersona } from '../roles/roles.logic'

interface ArchitectureStudioViewProps {
  engagement: EngagementState
  persona: ConsultPersona
  onEngagementChange: (engagement: EngagementState) => void
}

export function ArchitectureStudioView({
  engagement,
  persona,
  onEngagementChange,
}: ArchitectureStudioViewProps) {
  const editable = canEditEngagement(persona)
  const [adrTitle, setAdrTitle] = useState('')
  const [adrDecision, setAdrDecision] = useState('')

  function updateField(
    field: 'capabilityNotes' | 'processNotes' | 'systemNotes' | 'dataFlowNotes',
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void {
    if (!editable) return
    onEngagementChange({
      ...engagement,
      architecture: {
        ...engagement.architecture,
        [field]: event.target.value,
      },
    })
  }

  function handleAddAdr(): void {
    if (!editable || !adrTitle.trim()) return
    onEngagementChange({
      ...engagement,
      architecture: {
        ...engagement.architecture,
        adrs: [
          ...engagement.architecture.adrs,
          {
            id: createRegisterId('adr'),
            title: adrTitle,
            decision: adrDecision,
            status: 'proposed',
          },
        ],
      },
    })
    setAdrTitle('')
    setAdrDecision('')
  }

  return (
    <div className="space-y-6" data-testid="architecture-studio-view">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <Boxes className="h-5 w-5 text-slate-blue" />
          Architecture studio
        </h2>
        <p className="text-sm text-ink-secondary">
          Capture capability, process and system notes. Use the architecture canvas for diagrams.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link className="btn btn-accent" to="/canvas" data-testid="architecture-open-canvas">
            Open architecture canvas
          </Link>
          <Link className="btn btn-ghost" to="/map" data-testid="architecture-open-map">
            Open architecture map
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="glass-panel block p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Business capability notes
          <textarea className="field-input mt-2 min-h-28" data-testid="architecture-capability" value={engagement.architecture.capabilityNotes} onChange={(event) => updateField('capabilityNotes', event)} disabled={!editable} />
        </label>
        <label className="glass-panel block p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Process notes
          <textarea className="field-input mt-2 min-h-28" data-testid="architecture-process" value={engagement.architecture.processNotes} onChange={(event) => updateField('processNotes', event)} disabled={!editable} />
        </label>
        <label className="glass-panel block p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          System context notes
          <textarea className="field-input mt-2 min-h-28" data-testid="architecture-system" value={engagement.architecture.systemNotes} onChange={(event) => updateField('systemNotes', event)} disabled={!editable} />
        </label>
        <label className="glass-panel block p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Data-flow notes
          <textarea className="field-input mt-2 min-h-28" data-testid="architecture-dataflow" value={engagement.architecture.dataFlowNotes} onChange={(event) => updateField('dataFlowNotes', event)} disabled={!editable} />
        </label>
      </section>

      <section className="glass-panel space-y-3 p-5" data-testid="architecture-adrs">
        <h3 className="font-bold">Architecture decision records</h3>
        <ul className="space-y-1 text-sm">
          {engagement.architecture.adrs.map((adr) => (
            <li key={adr.id}>
              {adr.title}: {adr.decision} ({adr.status})
            </li>
          ))}
        </ul>
        {editable ? (
          <div className="space-y-2">
            <input className="field-input" data-testid="architecture-adr-title" placeholder="ADR title" value={adrTitle} onChange={(event) => setAdrTitle(event.target.value)} />
            <textarea className="field-input" data-testid="architecture-adr-decision" placeholder="Decision" value={adrDecision} onChange={(event) => setAdrDecision(event.target.value)} />
            <button type="button" className="btn btn-accent" data-testid="architecture-add-adr" onClick={handleAddAdr}>
              Add ADR
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
