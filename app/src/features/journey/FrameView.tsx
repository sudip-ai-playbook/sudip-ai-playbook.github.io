import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import {
  DEPLOYMENT_OPTIONS,
  ECOSYSTEM_OPTIONS,
  type DeploymentOption,
  type EcosystemOption,
} from '../../constants/playbook'
import { isFrameComplete } from './project.logic'
import { StepNav } from './StepNav'
import { useProject } from './useProject'

export function FrameView() {
  const navigate = useNavigate()
  const { project, updateBrief } = useProject()
  const [error, setError] = useState<string | undefined>()

  function handleOutcome(event: ChangeEvent<HTMLTextAreaElement>): void {
    updateBrief({ outcome: event.target.value })
    if (error) setError(undefined)
  }

  function handleUsers(event: ChangeEvent<HTMLInputElement>): void {
    updateBrief({ users: event.target.value })
  }

  function handleConstraints(event: ChangeEvent<HTMLTextAreaElement>): void {
    updateBrief({ constraints: event.target.value })
  }

  function handleEcosystem(event: ChangeEvent<HTMLSelectElement>): void {
    updateBrief({ ecosystem: event.target.value as EcosystemOption })
  }

  function handleDeployment(event: ChangeEvent<HTMLSelectElement>): void {
    updateBrief({ deployment: event.target.value as DeploymentOption })
  }

  function handleContinue(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!isFrameComplete(project)) {
      setError('Describe the business outcome in a sentence or two first.')
      return
    }
    navigate('/map')
  }

  return (
    <div data-testid="frame-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">Step 1 of 8</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-800">Frame the outcome</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Start with the problem — not a product name.
        </p>
      </header>

      <form onSubmit={handleContinue} className="glass-panel space-y-5 p-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Business outcome *
          <textarea
            data-testid="frame-outcome"
            className="field-input mt-2 min-h-28"
            placeholder="e.g. Grounded GenAI assistant for claims handlers with citations and audit trail"
            value={project.outcome}
            onChange={handleOutcome}
          />
        </label>

        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Users / personas
          <input
            data-testid="frame-users"
            className="field-input mt-2"
            placeholder="Who uses this? Internal ops, customers, partners…"
            value={project.users}
            onChange={handleUsers}
          />
        </label>

        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Constraints
          <textarea
            data-testid="frame-constraints"
            className="field-input mt-2 min-h-20"
            placeholder="Security, residency, SLA, budget, existing estate…"
            value={project.constraints}
            onChange={handleConstraints}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Ecosystem
            <select
              data-testid="frame-ecosystem"
              className="field-input mt-2"
              value={project.ecosystem}
              onChange={handleEcosystem}
            >
              {ECOSYSTEM_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Deployment
            <select
              data-testid="frame-deployment"
              className="field-input mt-2"
              value={project.deployment}
              onChange={handleDeployment}
            >
              {DEPLOYMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="text-sm text-cayenne-red" role="alert" data-testid="frame-error">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-accent" data-testid="frame-continue">
          <Sparkles className="h-4 w-4" />
          Continue to Architecture Map
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <StepNav path="/frame" disableNext={!isFrameComplete(project)} nextHint="Map next" />
    </div>
  )
}
