import { useMemo, useState } from 'react'
import serviceMatrix from '../../data/serviceMatrix.json'
import { filterServices } from '../decide/decide.logic'
import { PROVIDER_LABELS } from '../../constants/playbook'

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

export function CompareView() {
  const [query, setQuery] = useState('')
  const [layer, setLayer] = useState('')
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const layers = useMemo(
    () => [...new Set(services.map((service) => service.layer))].sort(),
    [],
  )

  const filtered = useMemo(() => filterServices(services, query, layer), [query, layer])

  const selected = filtered.find((service) => service.capability === selectedId) ?? filtered[0]

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value)
  }

  function handleLayerChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setLayer(event.target.value)
  }

  function handleSelect(capability: string): void {
    setSelectedId(capability)
  }

  return (
    <div data-testid="compare-view" className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-800">Service Compare</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Filter {services.length} scored capabilities · pick the cloud fit
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
                {service.bestFit ? (
                  <span className="mt-2 inline-block rounded-full bg-amber-flame/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                    {service.bestFit}
                  </span>
                ) : null}
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
              <div className="rounded-xl provider-aws p-3">
                <p className="text-xs font-bold uppercase">{PROVIDER_LABELS.aws}</p>
                <p className="mt-1 text-sm font-medium whitespace-pre-line">{selected.aws}</p>
              </div>
              <div className="rounded-xl provider-azure p-3">
                <p className="text-xs font-bold uppercase">{PROVIDER_LABELS.azure}</p>
                <p className="mt-1 text-sm font-medium whitespace-pre-line">{selected.azure}</p>
              </div>
              <div className="rounded-xl provider-gcp p-3">
                <p className="text-xs font-bold uppercase">{PROVIDER_LABELS.gcp}</p>
                <p className="mt-1 text-sm font-medium whitespace-pre-line">{selected.gcp}</p>
              </div>
            </div>

            <div className="space-y-3">
              <ScoreCell score={selected.awsScore} label="AWS" />
              <ScoreCell score={selected.azureScore} label="Azure" />
              <ScoreCell score={selected.gcpScore} label="GCP" />
            </div>

            {selected.question ? (
              <div className="glass-card glass-card-accent-blue p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Question</p>
                <p className="mt-1 text-sm">{selected.question}</p>
              </div>
            ) : null}

            {selected.recommendation ? (
              <p className="text-sm text-ink-secondary">{selected.recommendation}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
