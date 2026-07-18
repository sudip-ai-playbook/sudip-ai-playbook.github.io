import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import quickPicks from '../../data/quickPicks.json'
import type { ProviderId } from '../../constants/playbook'
import { StepNav } from '../journey/StepNav'
import { useProject } from '../journey/useProject'

interface QuickPick {
  scenario: string
  architectureLayer?: string
  subcategory?: string
  useWhenTrigger?: string
  awsOption?: string
  azureOption?: string
  googleCloudOption?: string
  defaultFirstChoice?: string
  chooseAwsWhen?: string
  chooseAzureWhen?: string
  chooseGoogleCloudWhen?: string
  complexityCaution?: string
}

const picks = quickPicks as QuickPick[]

function inferProvider(defaultChoice?: string): ProviderId {
  const value = (defaultChoice ?? '').toLowerCase()
  if (value.includes('azure')) return 'azure'
  if (value.includes('gcp') || value.includes('google')) return 'gcp'
  if (value.includes('aws')) return 'aws'
  return 'azure'
}

function serviceFor(pick: QuickPick, provider: ProviderId): string {
  if (provider === 'aws') return pick.awsOption ?? 'TBD'
  if (provider === 'azure') return pick.azureOption ?? 'TBD'
  return pick.googleCloudOption ?? 'TBD'
}

export function QuickPicksView() {
  const { project, setFocus, addToStack } = useProject()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(project.selectedScenario || picks[0]?.scenario)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    let list = picks
    if (project.selectedLayer) {
      list = list.filter((pick) => pick.architectureLayer === project.selectedLayer)
    }
    if (!normalized) return list.length > 0 ? list : picks
    return list.filter((pick) =>
      [pick.scenario, pick.architectureLayer, pick.subcategory, pick.useWhenTrigger]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    )
  }, [query, project.selectedLayer])

  const active = filtered.find((pick) => pick.scenario === selected) ?? filtered[0]

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value)
  }

  function handleSelect(scenario: string): void {
    setSelected(scenario)
    const pick = picks.find((item) => item.scenario === scenario)
    setFocus({
      selectedScenario: scenario,
      selectedLayer: pick?.architectureLayer || project.selectedLayer,
    })
  }

  function handleUsePick(): void {
    if (!active) return
    const provider = inferProvider(active.defaultFirstChoice)
    setFocus({
      selectedScenario: active.scenario,
      selectedLayer: active.architectureLayer || project.selectedLayer,
      preferredProvider: provider,
    })
    addToStack({
      layer: active.architectureLayer || project.selectedLayer || 'Unspecified',
      capability: active.scenario,
      provider,
      service: serviceFor(active, provider),
      source: 'picks',
    })
  }

  return (
    <div data-testid="picks-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">Step 3 · Picks</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em]">Start from a default</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          {project.selectedLayer
            ? `Filtered to ${project.selectedLayer}`
            : 'Scenario shortcuts — then challenge in Compare'}
        </p>
      </header>

      <input
        data-testid="picks-search"
        className="field-input"
        placeholder="Filter scenarios…"
        value={query}
        onChange={handleQueryChange}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="glass-panel max-h-[65vh] overflow-y-auto p-2">
          {filtered.map((pick) => (
            <button
              key={pick.scenario}
              type="button"
              onClick={() => handleSelect(pick.scenario)}
              className={[
                'mb-1 w-full rounded-xl px-3 py-3 text-left',
                pick.scenario === active?.scenario ? 'bg-slate-blue/15' : 'hover:bg-white/70',
              ].join(' ')}
            >
              <p className="text-sm font-bold">{pick.scenario}</p>
              <p className="text-xs text-ink-muted">{pick.defaultFirstChoice}</p>
            </button>
          ))}
        </div>

        {active ? (
          <div className="glass-panel space-y-4 p-6" data-testid="picks-detail">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">{active.scenario}</h2>
            <p className="text-sm text-ink-secondary">{active.useWhenTrigger}</p>
            <p className="inline-flex rounded-full bg-amber-flame/20 px-3 py-1 text-xs font-bold">
              Default: {active.defaultFirstChoice}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl provider-aws p-3">
                <p className="text-xs font-bold">AWS</p>
                <p className="mt-1 text-sm">{active.awsOption}</p>
              </div>
              <div className="rounded-xl provider-azure p-3">
                <p className="text-xs font-bold">Azure</p>
                <p className="mt-1 text-sm">{active.azureOption}</p>
              </div>
              <div className="rounded-xl provider-gcp p-3">
                <p className="text-xs font-bold">GCP</p>
                <p className="mt-1 text-sm">{active.googleCloudOption}</p>
              </div>
            </div>
            <button type="button" className="btn btn-primary" data-testid="picks-use" onClick={handleUsePick}>
              <Plus className="h-4 w-4" />
              Use default & add to stack
            </button>
          </div>
        ) : null}
      </div>

      <StepNav path="/picks" nextHint="Next: compare alternatives" />
    </div>
  )
}
