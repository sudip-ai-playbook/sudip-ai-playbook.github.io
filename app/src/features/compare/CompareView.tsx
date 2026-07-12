import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import serviceMatrix from '../../data/serviceMatrix.json'
import { PROVIDER_LABELS, type ProviderId } from '../../constants/playbook'
import { filterServices } from '../decide/decide.logic'
import { StepNav } from '../journey/StepNav'
import { useProject } from '../journey/useProject'

interface ServiceRow {
  layer: string
  domain?: string
  subcategory?: string
  capability: string
  purpose?: string
  useWhen?: string
  question?: string
  tradeoff?: string
  ease?: string
  aws?: string
  azure?: string
  gcp?: string
  awsScore?: number
  azureScore?: number
  gcpScore?: number
  bestFit?: string
  recommendation?: string
}

const services = serviceMatrix as ServiceRow[]

function ScoreCell({ score, label }: { score?: number; label: string }) {
  if (score === undefined) {
    return <span className="text-ink-muted">—</span>
  }
  const width = `${Math.min(100, (score / 5) * 100)}%`
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-semibold">{label}</span>
        <span>{score.toFixed(2)}</span>
      </div>
      <div className="score-bar">
        <span style={{ width }} />
      </div>
    </div>
  )
}

function serviceFor(row: ServiceRow, provider: ProviderId): string {
  if (provider === 'aws') return row.aws ?? 'TBD'
  if (provider === 'azure') return row.azure ?? 'TBD'
  return row.gcp ?? 'TBD'
}

function bestProvider(row: ServiceRow): ProviderId {
  const scores: Array<{ provider: ProviderId; score: number }> = [
    { provider: 'aws', score: row.awsScore ?? 0 },
    { provider: 'azure', score: row.azureScore ?? 0 },
    { provider: 'gcp', score: row.gcpScore ?? 0 },
  ]
  return scores.sort((left, right) => right.score - left.score)[0].provider
}

export function CompareView() {
  const { project, setFocus, addToStack } = useProject()
  const [query, setQuery] = useState('')
  const [layer, setLayer] = useState(project.selectedLayer || '')
  const [selectedId, setSelectedId] = useState<string | undefined>(
    project.selectedCapability || undefined,
  )

  const layers = useMemo(
    () => [...new Set(services.map((service) => service.layer))].sort(),
    [],
  )

  const filtered = useMemo(() => filterServices(services, query, layer), [query, layer])
  const selected = filtered.find((service) => service.capability === selectedId) ?? filtered[0]

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value)
  }

  function handleLayerChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextLayer = event.target.value
    setLayer(nextLayer)
    if (nextLayer) setFocus({ selectedLayer: nextLayer })
  }

  function handleSelect(capability: string): void {
    setSelectedId(capability)
    const row = services.find((service) => service.capability === capability)
    setFocus({
      selectedCapability: capability,
      selectedLayer: row?.layer || project.selectedLayer,
    })
  }

  function handleAddToStack(provider: ProviderId): void {
    if (!selected) return
    setFocus({
      selectedCapability: selected.capability,
      selectedLayer: selected.layer,
      preferredProvider: provider,
    })
    addToStack({
      layer: selected.layer,
      capability: selected.capability,
      provider,
      service: serviceFor(selected, provider),
      source: 'compare',
    })
  }

  return (
    <div data-testid="compare-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">Step 4 · Compare</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-800">Compare services</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          {services.length} scored capabilities · add the winner to your stack
        </p>
      </header>

      <div className="glass-panel flex flex-col gap-3 p-4 sm:flex-row">
        <input
          data-testid="compare-search"
          className="field-input"
          placeholder="Search capability, service, purpose…"
          value={query}
          onChange={handleQueryChange}
        />
        <select
          data-testid="compare-layer"
          className="field-input sm:max-w-xs"
          value={layer}
          onChange={handleLayerChange}
        >
          <option value="">All layers</option>
          {layers.map((layerName) => (
            <option key={layerName} value={layerName}>
              {layerName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="glass-panel max-h-[70vh] overflow-y-auto p-2" data-testid="compare-list">
          <p className="px-3 py-2 text-xs text-ink-muted">{filtered.length} results</p>
          {filtered.map((service) => {
            const isActive = service.capability === selected?.capability
            return (
              <button
                key={service.capability}
                type="button"
                onClick={() => handleSelect(service.capability)}
                className={[
                  'mb-1 w-full rounded-xl px-3 py-3 text-left transition',
                  isActive ? 'bg-slate-blue/15' : 'hover:bg-white/70',
                ].join(' ')}
              >
                <p className="text-sm font-bold text-ink">{service.capability}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{service.layer}</p>
              </button>
            )
          })}
        </div>

        {selected ? (
          <div className="glass-panel space-y-5 p-6" data-testid="compare-detail">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">
                {selected.capability}
              </h2>
              <p className="mt-2 text-sm text-ink-secondary">{selected.purpose}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {(['aws', 'azure', 'gcp'] as const).map((provider) => (
                <div key={provider} className={`rounded-xl p-3 provider-${provider}`}>
                  <p className="text-xs font-bold uppercase">{PROVIDER_LABELS[provider]}</p>
                  <p className="mt-1 text-sm font-medium whitespace-pre-line">
                    {serviceFor(selected, provider)}
                  </p>
                  <button
                    type="button"
                    className="btn btn-ghost mt-3 w-full px-2 py-1 text-xs"
                    data-testid={`compare-add-${provider}`}
                    onClick={() => handleAddToStack(provider)}
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <ScoreCell score={selected.awsScore} label="AWS" />
              <ScoreCell score={selected.azureScore} label="Azure" />
              <ScoreCell score={selected.gcpScore} label="GCP" />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              data-testid="compare-add-best"
              onClick={() => handleAddToStack(bestProvider(selected))}
            >
              <Plus className="h-4 w-4" />
              Add best-fit to stack
            </button>
          </div>
        ) : null}
      </div>

      <StepNav path="/compare" nextHint="Next: weight the decision" />
    </div>
  )
}
