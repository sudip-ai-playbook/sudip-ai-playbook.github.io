import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Download } from 'lucide-react'
import {
  FEEDBACK_ROLES,
  addFeedbackEntry,
  exportFeedbackJson,
  isValidEaseScore,
  loadFeedbackEntries,
  type FeedbackRole,
  type UsabilityFeedback,
} from './feedback.logic'

const TASK_OPTIONS = [
  'Start architecture journey and frame an outcome',
  'Compare providers and build a stack',
  'Export a stakeholder brief',
  'Open engagement workspace and find Journey',
  'Import/export a workspace pack',
] as const

export function ResearchFeedbackView() {
  const [role, setRole] = useState<FeedbackRole>('consultant')
  const [task, setTask] = useState<string>(TASK_OPTIONS[0])
  const [easeScore, setEaseScore] = useState(4)
  const [blockers, setBlockers] = useState('')
  const [delight, setDelight] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [entries, setEntries] = useState<UsabilityFeedback[]>(() => loadFeedbackEntries())

  function handleRole(event: ChangeEvent<HTMLSelectElement>): void {
    setRole(event.target.value as FeedbackRole)
  }

  function handleTask(event: ChangeEvent<HTMLSelectElement>): void {
    setTask(event.target.value)
  }

  function handleEase(event: ChangeEvent<HTMLSelectElement>): void {
    setEaseScore(Number(event.target.value))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!isValidEaseScore(easeScore)) {
      setError('Ease score must be an integer from 1 to 5.')
      return
    }
    if (blockers.trim().length < 4) {
      setError('Describe at least one blocker or friction point.')
      return
    }
    const next = addFeedbackEntry({
      role,
      task,
      easeScore,
      blockers: blockers.trim(),
      delight: delight.trim(),
    })
    setEntries(next)
    setBlockers('')
    setDelight('')
    setError(null)
  }

  function handleExport(): void {
    const blob = new Blob([exportFeedbackJson(entries)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'usability-feedback.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div data-testid="research-feedback-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-blue">
          Research
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em]">
          Usability session capture
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-secondary">
          Capture notes from 5–8 consultant/executive sessions. Export JSON after each round for
          synthesis. Protocol lives in docs/research/usability-test-protocol.md.
        </p>
      </header>

      <form className="glass-panel space-y-4 p-6" onSubmit={handleSubmit} data-testid="feedback-form">
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Role
          <select className="field-input mt-2" data-testid="feedback-role" value={role} onChange={handleRole}>
            {FEEDBACK_ROLES.map((option) => (
              <option key={option} value={option}>
                {option.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Task
          <select className="field-input mt-2" data-testid="feedback-task" value={task} onChange={handleTask}>
            {TASK_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Ease (1 = hard, 5 = effortless)
          <select
            className="field-input mt-2"
            data-testid="feedback-ease"
            value={easeScore}
            onChange={handleEase}
          >
            {[1, 2, 3, 4, 5].map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Blockers / friction
          <textarea
            className="field-input mt-2 min-h-24"
            data-testid="feedback-blockers"
            value={blockers}
            onChange={(event) => setBlockers(event.target.value)}
            placeholder="Where did they hesitate, misclick, or ask for help?"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          What worked
          <textarea
            className="field-input mt-2 min-h-20"
            data-testid="feedback-delight"
            value={delight}
            onChange={(event) => setDelight(event.target.value)}
            placeholder="Moments of clarity or delight"
          />
        </label>
        {error ? (
          <p className="text-sm text-cayenne-red" role="alert" data-testid="feedback-error">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary" data-testid="feedback-submit">
          Save session note
        </button>
      </form>

      <section className="glass-panel space-y-3 p-5" aria-labelledby="feedback-list-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="feedback-list-heading" className="font-semibold">
            Captured sessions ({entries.length})
          </h2>
          <button
            type="button"
            className="btn btn-ghost"
            data-testid="feedback-export"
            onClick={handleExport}
            disabled={entries.length === 0}
          >
            <Download className="h-4 w-4" aria-hidden />
            Export JSON
          </button>
        </div>
        {entries.length === 0 ? (
          <p className="text-sm text-ink-muted">No sessions captured yet.</p>
        ) : (
          <ul className="space-y-3" data-testid="feedback-list">
            {entries.map((entry) => (
              <li key={entry.id} className="rounded-xl bg-white/70 px-3 py-3 text-sm">
                <p className="font-semibold text-ink">
                  {entry.role.replaceAll('_', ' ')} · ease {entry.easeScore}/5
                </p>
                <p className="mt-1 text-ink-secondary">{entry.task}</p>
                <p className="mt-2 text-ink">{entry.blockers}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
