import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import providerRatings from '../../data/providerRatings.json'
import {
  CRITERIA_LABELS,
  DEFAULT_CRITERIA_WEIGHTS,
  DEPLOYMENT_OPTIONS,
  ECOSYSTEM_OPTIONS,
  PROVIDER_LABELS,
  type CriteriaKey,
  type DeploymentOption,
  type EcosystemOption,
  type ProviderId,
} from '../../constants/playbook'
import {
  applyContextAdjustments,
  computeWeightedScores,
  recommendProvider,
  type CapabilityScores,
  type CriteriaWeights,
} from './decide.logic'
import { StepNav } from '../journey/StepNav'
import { useProject } from '../journey/useProject'

const ratings = providerRatings as CapabilityScores[]

export function DecideView() {
  const { project, updateBrief, setFocus, addToStack } = useProject()
  const [capabilityName, setCapabilityName] = useState(
    project.selectedCapability || ratings[0]?.capability || '',
  )
  const [weights, setWeights] = useState<CriteriaWeights>({ ...DEFAULT_CRITERIA_WEIGHTS })

  useEffect(() => {
    if (project.selectedCapability) {
      setCapabilityName(project.selectedCapability)
    }
  }, [project.selectedCapability])

  const capability = useMemo(
    () => ratings.find((item) => item.capability === capabilityName) ?? ratings[0],
    [capabilityName],
  )

  const baseScores = useMemo(
    () => (capability ? computeWeightedScores(capability, weights) : { aws: 0, azure: 0, gcp: 0 }),
    [capability, weights],
  )

  const finalScores = useMemo(
    () => applyContextAdjustments(baseScores, project.ecosystem, project.deployment),
    [baseScores, project.ecosystem, project.deployment],
  )

  const recommendation = useMemo(() => recommendProvider(finalScores), [finalScores])

  function handleCapabilityChange(event: ChangeEvent<HTMLSelectElement>): void {
    const next = event.target.value
    setCapabilityName(next)
    setFocus({ selectedCapability: next })
  }

  function handleEcosystemChange(event: ChangeEvent<HTMLSelectElement>): void {
    updateBrief({ ecosystem: event.target.value as EcosystemOption })
  }

  function handleDeploymentChange(event: ChangeEvent<HTMLSelectElement>): void {
    updateBrief({ deployment: event.target.value as DeploymentOption })
  }

  function handleWeightChange(key: CriteriaKey, value: number): void {
    setWeights((previous) => ({ ...previous, [key]: value }))
  }

  function handleApplyWinner(): void {
    if (!capability) return
    const provider: ProviderId =
      recommendation.winner === 'tie' ? 'azure' : recommendation.winner
    setFocus({
      preferredProvider: provider,
      selectedCapability: capability.capability,
      selectedLayer: capability.layer,
    })
    addToStack({
      layer: capability.layer,
      capability: capability.capability,
      provider,
      service: capability[provider],
      source: 'decide',
    })
  }

  if (!capability) {
    return null
  }

  return (
    <div data-testid="decide-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">Step 5 · Decide</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em]">Score the trade-offs</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Using your framed ecosystem ({project.ecosystem}) and deployment ({project.deployment}).
        </p>
      </header>

      <div className="glass-panel grid gap-4 p-4 sm:grid-cols-3">
        <label className="block text-xs font-semibold text-ink-muted">
          Capability
          <select
            data-testid="decide-capability"
            className="field-input mt-1"
            value={capability.capability}
            onChange={handleCapabilityChange}
          >
            {ratings.map((item) => (
              <option key={item.capability} value={item.capability}>
                {item.capability}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-ink-muted">
          Ecosystem
          <select
            data-testid="decide-ecosystem"
            className="field-input mt-1"
            value={project.ecosystem}
            onChange={handleEcosystemChange}
          >
            {ECOSYSTEM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-ink-muted">
          Deployment
          <select
            data-testid="decide-deployment"
            className="field-input mt-1"
            value={project.deployment}
            onChange={handleDeploymentChange}
          >
            {DEPLOYMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-4 p-5">
          <h2 className="font-bold">Criteria weights</h2>
          {(Object.keys(CRITERIA_LABELS) as CriteriaKey[]).map((key) => (
            <label key={key} className="block text-xs font-semibold text-ink-muted">
              {CRITERIA_LABELS[key]} ({weights[key].toFixed(2)})
              <input
                data-testid={`weight-${key}`}
                type="range"
                min={0}
                max={0.5}
                step={0.01}
                value={weights[key]}
                onChange={(event) => handleWeightChange(key, Number(event.target.value))}
                className="mt-1 w-full accent-slate-blue"
              />
            </label>
          ))}
        </div>

        <div className="glass-panel space-y-5 p-5" data-testid="decide-result">
          <h2 className="font-bold">Result</h2>
          <div className="space-y-3">
            {(['aws', 'azure', 'gcp'] as const).map((provider) => (
              <div key={provider}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{PROVIDER_LABELS[provider]}</span>
                  <span data-testid={`score-${provider}`}>{finalScores[provider].toFixed(2)}</span>
                </div>
                <div className="score-bar">
                  <span style={{ width: `${(finalScores[provider] / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card glass-card-accent-amber p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Starting point</p>
            <p className="mt-2 text-lg font-bold" data-testid="decide-winner">
              {recommendation.winner === 'tie'
                ? 'Context-dependent tie'
                : PROVIDER_LABELS[recommendation.winner]}
            </p>
            <p className="mt-1 text-xs text-ink-secondary">Margin: {recommendation.margin}</p>
          </div>
          <button type="button" className="btn btn-primary" data-testid="decide-apply" onClick={handleApplyWinner}>
            <Plus className="h-4 w-4" />
            Apply winner to stack
          </button>
        </div>
      </div>

      <StepNav path="/decide" nextHint="Next: check LLM FinOps" />
    </div>
  )
}
