import type { ChangeEvent } from 'react'
import { Download, RotateCcw, CheckCircle2 } from 'lucide-react'
import { PROVIDER_LABELS } from '../../constants/playbook'
import { buildDecisionBrief, isFrameComplete } from './project.logic'
import { StepNav } from './StepNav'
import { useProject } from './useProject'

export function SummaryView() {
  const { project, updateBrief, resetProject } = useProject()
  const brief = buildDecisionBrief(project)
  const ready = isFrameComplete(project) && project.stack.length > 0

  function handleNotes(event: ChangeEvent<HTMLTextAreaElement>): void {
    updateBrief({ decisionNotes: event.target.value })
  }

  function handleExport(): void {
    const blob = new Blob([brief], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'architecture-decision-brief.md'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function handleReset(): void {
    resetProject()
  }

  return (
    <div data-testid="summary-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">Step 8 of 8</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-800">Validate and record</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          A recommendation is not an approval — export the brief and check the gates.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel space-y-4 p-5">
          <h2 className="font-bold">Decision snapshot</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase text-ink-muted">Outcome</dt>
              <dd className="mt-1">{project.outcome || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink-muted">Context</dt>
              <dd className="mt-1">
                {project.ecosystem} · {project.deployment} ·{' '}
                {project.preferredProvider === 'undecided'
                  ? 'provider TBD'
                  : PROVIDER_LABELS[project.preferredProvider]}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink-muted">Focus</dt>
              <dd className="mt-1">
                {project.selectedLayer || '—'}
                {project.selectedCapability ? ` · ${project.selectedCapability}` : ''}
              </dd>
            </div>
          </dl>

          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Notes / ADR draft
            <textarea
              data-testid="summary-notes"
              className="field-input mt-2 min-h-28"
              value={project.decisionNotes}
              onChange={handleNotes}
              placeholder="Why this choice? What was rejected? What must be validated?"
            />
          </label>
        </section>

        <section className="glass-panel space-y-4 p-5">
          <h2 className="font-bold">Architecture stack ({project.stack.length})</h2>
          {project.stack.length === 0 ? (
            <p className="text-sm text-ink-muted">Add services from Compare, Decide, or Canvas first.</p>
          ) : (
            <ul className="space-y-2" data-testid="summary-stack">
              {project.stack.map((item) => (
                <li key={item.id} className="rounded-xl bg-white/70 px-3 py-2 text-sm">
                  <p className="font-bold">{item.capability}</p>
                  <p className="text-xs text-ink-secondary">
                    {item.layer} · {PROVIDER_LABELS[item.provider]} · {item.service}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2 rounded-xl bg-white/60 p-4 text-sm">
            {[
              'Region / residency',
              'Security & identity',
              'SLA / quotas',
              'FinOps estimate',
              'PoC / proof of value',
            ].map((item) => (
              <p key={item} className="flex items-center gap-2 text-ink-secondary">
                <CheckCircle2 className="h-4 w-4 text-slate-blue" />
                {item}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-accent"
              data-testid="summary-export"
              onClick={handleExport}
              disabled={!ready}
            >
              <Download className="h-4 w-4" />
              Export brief
            </button>
            <button type="button" className="btn btn-ghost" data-testid="summary-reset" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset journey
            </button>
          </div>
          {!ready ? (
            <p className="text-xs text-tiger-orange">
              Frame an outcome and add at least one stack service to export.
            </p>
          ) : null}
        </section>
      </div>

      <StepNav path="/summary" nextHint="Journey complete" />
    </div>
  )
}
