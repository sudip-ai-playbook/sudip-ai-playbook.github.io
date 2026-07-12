import type { FrameworkEntry } from '../../data/frameworkLibrary'
import { isSpecializedCanvas } from './framework.logic'

interface FrameworkDetailPanelProps {
  framework: FrameworkEntry
  onRunCanvas?: () => void
  onClose: () => void
}

export function FrameworkDetailPanel({
  framework,
  onRunCanvas,
  onClose,
}: FrameworkDetailPanelProps) {
  function handleClose(): void {
    onClose()
  }

  function handleRun(): void {
    onRunCanvas?.()
  }

  return (
    <div className="glass-panel space-y-4 p-5" data-testid="framework-detail">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">
            {isSpecializedCanvas(framework) ? 'Specialized canvas' : 'Use-case workbook'}
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">
            {framework.name}
          </h2>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          data-testid="framework-detail-close"
          onClick={handleClose}
        >
          Close
        </button>
      </div>

      <p className="text-sm text-ink-secondary">{framework.purpose}</p>
      {framework.whenUseful ? (
        <p className="text-sm">
          <span className="font-semibold">When useful:</span> {framework.whenUseful}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-white/70 p-4 text-sm">
          <p className="text-xs font-semibold uppercase text-ink-muted">Business questions</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {framework.businessQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white/70 p-4 text-sm">
          <p className="text-xs font-semibold uppercase text-ink-muted">Not for</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {framework.notFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase text-ink-muted">Inputs</p>
          <ul className="mt-2 list-disc pl-4 text-ink-secondary">
            {framework.inputs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-ink-muted">Stakeholders</p>
          <ul className="mt-2 list-disc pl-4 text-ink-secondary">
            {framework.stakeholders.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-ink-muted">Duration</p>
          <p className="mt-2 text-ink-secondary">~{framework.durationMinutes} minutes</p>
          <p className="mt-3 text-xs font-semibold uppercase text-ink-muted">Output</p>
          <p className="mt-1 text-ink-secondary">{framework.outputFormat}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase text-ink-muted">Facilitation steps</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-secondary">
          {framework.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase text-ink-muted">Common mistakes</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink-secondary">
          {framework.commonMistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="text-sm">
        <span className="font-semibold">Recommended next action:</span> {framework.nextAction}
      </p>

      {onRunCanvas ? (
        <button
          type="button"
          className="btn btn-accent"
          data-testid="framework-run-canvas"
          onClick={handleRun}
        >
          Work this framework on my use case
        </button>
      ) : null}
    </div>
  )
}
