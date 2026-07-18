import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, CheckCircle2, Copy, Download, RotateCcw } from 'lucide-react'
import { PROVIDER_LABELS } from '../../constants/playbook'
import { CoachBanner, ConfirmDialog } from '../guidance'
import { buildDecisionBrief, isFrameComplete } from './project.logic'
import { StepNav } from './StepNav'
import { useProject } from './useProject'
import {
  VALIDATION_CHECK_IDS,
  VALIDATION_CHECK_LABELS,
  areAllValidationChecksComplete,
  countCompletedValidationChecks,
  type ValidationCheckId,
} from './validation.logic'

export function SummaryView() {
  const { project, updateBrief, resetProject, setValidationCheck } = useProject()
  const brief = buildDecisionBrief(project)
  const ready = isFrameComplete(project) && project.stack.length > 0
  const [copied, setCopied] = useState(false)
  const [exported, setExported] = useState(false)
  const [confirmResetOpen, setConfirmResetOpen] = useState(false)
  const completedChecks = countCompletedValidationChecks(project.validationChecks)
  const allChecksDone = areAllValidationChecksComplete(project.validationChecks)

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
    setExported(true)
  }

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  function handleResetConfirm(): void {
    resetProject()
    setExported(false)
    setCopied(false)
    setConfirmResetOpen(false)
  }

  function handleValidationToggle(id: ValidationCheckId): void {
    setValidationCheck(id, !project.validationChecks[id])
  }

  return (
    <div data-testid="summary-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-blue">
          Step 8 of 8 · Closure
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em]">
          Validate and record
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Export a stakeholder brief. A recommendation is not an approval — confirm the gates
          below with your client.
        </p>
      </header>

      {ready ? (
        <CoachBanner
          testId="summary-ready-coach"
          tone="info"
          title="Ready to share"
          message="Your decision brief includes outcome, context, stack and validation checklist. Download or copy it for the steering pack."
        />
      ) : (
        <CoachBanner
          testId="summary-blocked-coach"
          tone="warning"
          title="Brief not ready yet"
          message="Frame an outcome and add at least one stack service, then export."
          actionLabel="Compare services"
          actionTo="/compare"
        />
      )}

      {exported ? (
        <p
          className="rounded-xl border border-slate-blue/25 bg-slate-blue/10 px-4 py-3 text-sm font-medium text-ink"
          data-testid="summary-export-success"
          role="status"
        >
          Brief downloaded. Share it with sponsors, then schedule validation on residency,
          security, and FinOps.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel space-y-4 p-5" aria-labelledby="summary-snapshot-heading">
          <h2 id="summary-snapshot-heading" className="font-semibold">
            Decision snapshot
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Outcome
              </dt>
              <dd className="mt-1">{project.outcome || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Context
              </dt>
              <dd className="mt-1">
                {project.ecosystem} · {project.deployment} ·{' '}
                {project.preferredProvider === 'undecided'
                  ? 'provider TBD'
                  : PROVIDER_LABELS[project.preferredProvider]}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Focus
              </dt>
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

        <section className="glass-panel space-y-4 p-5" aria-labelledby="summary-stack-heading">
          <h2 id="summary-stack-heading" className="font-semibold">
            Architecture stack ({project.stack.length})
          </h2>
          {project.stack.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Add services from Compare, Decide, or Canvas first.{' '}
              <Link to="/compare" className="font-semibold text-ink underline-offset-2 hover:underline">
                Open Compare
              </Link>
            </p>
          ) : (
            <ul className="space-y-2" data-testid="summary-stack">
              {project.stack.map((item) => (
                <li key={item.id} className="rounded-xl bg-white/70 px-3 py-2 text-sm">
                  <p className="font-semibold">{item.capability}</p>
                  <p className="text-xs text-ink-secondary">
                    {item.layer} · {PROVIDER_LABELS[item.provider]} · {item.service}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <fieldset
            className="space-y-2 rounded-xl bg-white/60 p-4 text-sm"
            data-testid="summary-validation-checklist"
          >
            <legend className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Validation checklist ({completedChecks}/{VALIDATION_CHECK_IDS.length})
            </legend>
            {VALIDATION_CHECK_IDS.map((id) => {
              const checked = project.validationChecks[id]
              return (
                <label
                  key={id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1.5 text-ink hover:bg-white/80"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-slate-blue"
                    data-testid={`summary-check-${id}`}
                    checked={checked}
                    onChange={() => handleValidationToggle(id)}
                  />
                  <span className="flex items-start gap-2">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${checked ? 'text-slate-blue' : 'text-ink-muted'}`}
                      aria-hidden
                    />
                    {VALIDATION_CHECK_LABELS[id]}
                  </span>
                </label>
              )
            })}
            {allChecksDone ? (
              <p className="pt-1 text-xs font-medium text-ink" data-testid="summary-checks-complete">
                All validation gates marked complete.
              </p>
            ) : null}
          </fieldset>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              data-testid="summary-export"
              onClick={handleExport}
              disabled={!ready}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export stakeholder brief
            </button>
            <button
              type="button"
              className="btn btn-accent"
              data-testid="summary-copy"
              onClick={() => {
                void handleCopy()
              }}
              disabled={!ready}
            >
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied ? 'Copied' : 'Copy brief'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="summary-reset"
              onClick={() => setConfirmResetOpen(true)}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset journey
            </button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        testId="summary-reset-confirm"
        open={confirmResetOpen}
        title="Reset architecture journey?"
        message="This clears the framed outcome, stack, notes and validation checks on this device. Export a workspace pack first if you need a backup."
        confirmLabel="Reset journey"
        cancelLabel="Keep working"
        onConfirm={handleResetConfirm}
        onCancel={() => setConfirmResetOpen(false)}
      />

      <StepNav path="/summary" nextHint="Journey complete — share the brief with stakeholders" />
    </div>
  )
}
