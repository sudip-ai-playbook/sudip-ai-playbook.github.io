import { useState, type ChangeEvent } from 'react'
import { LifeBuoy } from 'lucide-react'
import { createRegisterId, type EngagementState } from '../engagement.logic'
import { canEditEngagement, type ConsultPersona } from '../roles/roles.logic'
import { downloadTextFile } from '../consulting.export'
import { buildServiceReportMarkdown } from './service.logic'

interface ServiceManagementCentreViewProps {
  engagement: EngagementState
  persona: ConsultPersona
  onEngagementChange: (engagement: EngagementState) => void
}

export function ServiceManagementCentreView({
  engagement,
  persona,
  onEngagementChange,
}: ServiceManagementCentreViewProps) {
  const editable = canEditEngagement(persona)
  const [incidentTitle, setIncidentTitle] = useState('')
  const [incidentPriority, setIncidentPriority] = useState('P3')

  function updateServiceField(
    field: 'catalogueEntry' | 'availabilityTarget' | 'incidentPriorities' | 'aiQualityTargets' | 'runbook',
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void {
    if (!editable) return
    onEngagementChange({
      ...engagement,
      service: {
        ...engagement.service,
        [field]: event.target.value,
      },
    })
  }

  function handleAddIncident(): void {
    if (!editable || !incidentTitle.trim()) return
    onEngagementChange({
      ...engagement,
      service: {
        ...engagement.service,
        incidents: [
          ...engagement.service.incidents,
          {
            id: createRegisterId('inc'),
            title: incidentTitle,
            priority: incidentPriority,
            status: 'open',
          },
        ],
      },
    })
    setIncidentTitle('')
  }

  function handleDownloadReport(): void {
    downloadTextFile(
      `service-report-${engagement.engagementName || 'draft'}.md`,
      buildServiceReportMarkdown(engagement),
      'text/markdown;charset=utf-8',
    )
  }

  return (
    <div className="space-y-6" data-testid="service-centre-view">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <LifeBuoy className="h-5 w-5 text-slate-blue" />
          Service management centre
        </h2>
        <p className="text-sm text-ink-secondary">
          Service catalogue, SLA targets, incidents and monthly reporting.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="glass-panel block p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Service catalogue entry
          <textarea className="field-input mt-2 min-h-24" data-testid="service-catalogue" value={engagement.service.catalogueEntry} onChange={(event) => updateServiceField('catalogueEntry', event)} disabled={!editable} />
        </label>
        <label className="glass-panel block p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Availability / SLA target
          <textarea className="field-input mt-2 min-h-24" data-testid="service-availability" value={engagement.service.availabilityTarget} onChange={(event) => updateServiceField('availabilityTarget', event)} disabled={!editable} />
        </label>
        <label className="glass-panel block p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Incident priorities
          <textarea className="field-input mt-2 min-h-24" data-testid="service-priorities" value={engagement.service.incidentPriorities} onChange={(event) => updateServiceField('incidentPriorities', event)} disabled={!editable} />
        </label>
        <label className="glass-panel block p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          AI quality targets
          <textarea className="field-input mt-2 min-h-24" data-testid="service-ai-quality" value={engagement.service.aiQualityTargets} onChange={(event) => updateServiceField('aiQualityTargets', event)} disabled={!editable} />
        </label>
      </section>

      <section className="glass-panel space-y-3 p-5" data-testid="service-incidents">
        <h3 className="font-bold">Incidents</h3>
        <ul className="space-y-1 text-sm">
          {engagement.service.incidents.map((item) => (
            <li key={item.id}>
              [{item.priority}] {item.title} ({item.status})
            </li>
          ))}
        </ul>
        {editable ? (
          <div className="flex flex-wrap gap-2">
            <input className="field-input" data-testid="service-incident-title" placeholder="Incident title" value={incidentTitle} onChange={(event) => setIncidentTitle(event.target.value)} />
            <select className="field-input" data-testid="service-incident-priority" value={incidentPriority} onChange={(event) => setIncidentPriority(event.target.value)}>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
            </select>
            <button type="button" className="btn btn-accent" data-testid="service-add-incident" onClick={handleAddIncident}>
              Add incident
            </button>
          </div>
        ) : null}
      </section>

      <label className="glass-panel block space-y-2 p-5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        Runbook
        <textarea className="field-input mt-2 min-h-32" data-testid="service-runbook" value={engagement.service.runbook} onChange={(event) => updateServiceField('runbook', event)} disabled={!editable} />
      </label>

      <button type="button" className="btn btn-ghost" data-testid="service-download-report" onClick={handleDownloadReport}>
        Download monthly service report
      </button>
    </div>
  )
}
