import type { ChangeEvent } from 'react'
import { lazy, Suspense, useMemo, useState } from 'react'
import architectureMap from '../../data/architectureMap.json'
import serviceMatrix from '../../data/serviceMatrix.json'
import { PROVIDER_LABELS, type ProviderId } from '../../constants/playbook'
import { filterServices } from '../decide/decide.logic'
import { StepNav } from '../journey/StepNav'
import { useProject } from '../journey/useProject'
import { buildDecisionBrief } from '../journey/project.logic'
import { EXCALIDRAW_LABELS } from './excalidraw.constants'

const ExcalidrawBoard = lazy(async function loadExcalidrawBoard() {
  const module = await import('./ExcalidrawBoard')
  return { default: module.ExcalidrawBoard }
})

interface LayerRow {
  layer: string
}

interface ServiceRow {
  layer: string
  capability: string
  aws?: string
  azure?: string
  gcp?: string
}

const layers = (architectureMap as LayerRow[]).map((row) => row.layer)
const services = serviceMatrix as ServiceRow[]

function serviceForProvider(row: ServiceRow, provider: ProviderId): string {
  if (provider === 'aws') return row.aws ?? 'TBD'
  if (provider === 'azure') return row.azure ?? 'TBD'
  return row.gcp ?? 'TBD'
}

export function CanvasView() {
  const { project, addToStack, removeFromStack, clearStack } = useProject()
  const [query, setQuery] = useState('')
  const [provider, setProvider] = useState<ProviderId>(
    project.preferredProvider === 'undecided' ? 'azure' : project.preferredProvider,
  )
  const [layerFilter, setLayerFilter] = useState(project.selectedLayer || '')
  const [showEmbed, setShowEmbed] = useState(false)

  const stack = project.stack

  const filtered = useMemo(
    () => filterServices(services, query, layerFilter).slice(0, 40),
    [query, layerFilter],
  )

  const grouped = useMemo(() => {
    const map = new Map<string, typeof stack>()
    layers.forEach((layer) => map.set(layer, []))
    stack.forEach((node) => {
      const bucket = map.get(node.layer) ?? []
      bucket.push(node)
      map.set(node.layer, bucket)
    })
    return layers
      .map((layer) => ({ layer, items: map.get(layer) ?? [] }))
      .filter((group) => group.items.length > 0 || stack.length === 0)
  }, [stack])

  function handleAdd(row: ServiceRow): void {
    addToStack({
      layer: row.layer,
      capability: row.capability,
      provider,
      service: serviceForProvider(row, provider),
      source: 'canvas',
    })
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value)
  }

  function handleLayerFilter(event: ChangeEvent<HTMLSelectElement>): void {
    setLayerFilter(event.target.value)
  }

  function handleProviderChange(event: ChangeEvent<HTMLSelectElement>): void {
    setProvider(event.target.value as ProviderId)
  }

  function handleToggleEmbed(): void {
    setShowEmbed((previous) => !previous)
  }

  function handleExportMarkdown(): void {
    const content = buildDecisionBrief(project)
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'architecture-stack.md'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div data-testid="canvas-view" className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">Step 7 · Build</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em]">Assemble the stack</h1>
          <p className="mt-1 text-sm text-ink-secondary">{EXCALIDRAW_LABELS.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost" onClick={handleExportMarkdown} data-testid="canvas-export">
            Export MD
          </button>
          <button type="button" className="btn btn-ghost" onClick={clearStack} data-testid="canvas-clear">
            Clear
          </button>
          <button type="button" className="btn btn-primary" onClick={handleToggleEmbed} data-testid="canvas-embed-toggle">
            {showEmbed ? EXCALIDRAW_LABELS.hide : EXCALIDRAW_LABELS.open}
          </button>
        </div>
      </header>

      {showEmbed ? (
        <div className="glass-panel overflow-hidden p-2" data-testid="canvas-embed">
          <Suspense
            fallback={
              <div
                className="flex h-[70vh] items-center justify-center text-sm text-ink-muted"
                data-testid="excalidraw-loading"
              >
                {EXCALIDRAW_LABELS.loading}
              </div>
            }
          >
            <ExcalidrawBoard />
          </Suspense>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="glass-panel space-y-3 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Add service</p>
          <select
            data-testid="canvas-provider"
            className="field-input"
            value={provider}
            onChange={handleProviderChange}
          >
            <option value="aws">AWS</option>
            <option value="azure">Azure</option>
            <option value="gcp">Google Cloud</option>
          </select>
          <select
            data-testid="canvas-layer-filter"
            className="field-input"
            value={layerFilter}
            onChange={handleLayerFilter}
          >
            <option value="">All layers</option>
            {layers.map((layer) => (
              <option key={layer} value={layer}>
                {layer}
              </option>
            ))}
          </select>
          <input
            data-testid="canvas-search"
            className="field-input"
            placeholder="Search capabilities…"
            value={query}
            onChange={handleQueryChange}
          />
          <div className="max-h-[50vh] space-y-1 overflow-y-auto">
            {filtered.map((row) => (
              <button
                key={row.capability}
                type="button"
                onClick={() => handleAdd(row)}
                className="w-full rounded-lg bg-white/60 px-3 py-2 text-left text-xs hover:bg-white"
              >
                <span className="font-bold text-ink">{row.capability}</span>
                <span className="mt-0.5 block text-ink-muted">{serviceForProvider(row, provider)}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="glass-panel space-y-4 p-5" data-testid="canvas-stack">
          {stack.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink-muted">
              Add from Compare / Decide / here to build your end-to-end architecture.
            </p>
          ) : (
            grouped.map((group) =>
              group.items.length === 0 ? null : (
                <section key={group.layer} className="rounded-xl border border-slate-blue/15 bg-white/55 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-blue">{group.layer}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-3 rounded-lg bg-white/80 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-bold">{item.capability}</p>
                          <p className="text-xs text-ink-secondary">
                            {PROVIDER_LABELS[item.provider]} · {item.service}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-xs font-semibold text-cayenne-red"
                          onClick={() => removeFromStack(item.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ),
            )
          )}
        </div>
      </div>

      <StepNav path="/canvas" nextHint="Next: validate and export" />
    </div>
  )
}
