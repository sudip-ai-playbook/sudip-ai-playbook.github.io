import { useMemo, useState } from 'react'
import architectureMap from '../../data/architectureMap.json'
import serviceMatrix from '../../data/serviceMatrix.json'
import { PROVIDER_LABELS, type ProviderId } from '../../constants/playbook'
import { filterServices } from '../decide/decide.logic'

interface LayerRow {
  layer: string
}

interface ServiceRow {
  layer: string
  capability: string
  aws?: string
  azure?: string
  gcp?: string
  purpose?: string
}

interface CanvasNode {
  id: string
  layer: string
  capability: string
  provider: ProviderId
  service: string
}

const layers = (architectureMap as LayerRow[]).map((row) => row.layer)
const services = serviceMatrix as ServiceRow[]

const CANVAS_STORAGE_KEY = 'sudip-ai-playbook-canvas'

function loadCanvas(): CanvasNode[] {
  try {
    const raw = localStorage.getItem(CANVAS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CanvasNode[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCanvas(nodes: CanvasNode[]): void {
  localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify(nodes))
}

function serviceForProvider(row: ServiceRow, provider: ProviderId): string {
  if (provider === 'aws') return row.aws ?? 'TBD'
  if (provider === 'azure') return row.azure ?? 'TBD'
  return row.gcp ?? 'TBD'
}

export function CanvasView() {
  const [nodes, setNodes] = useState<CanvasNode[]>(() => loadCanvas())
  const [query, setQuery] = useState('')
  const [provider, setProvider] = useState<ProviderId>('azure')
  const [layerFilter, setLayerFilter] = useState('')
  const [showEmbed, setShowEmbed] = useState(false)

  const filtered = useMemo(
    () => filterServices(services, query, layerFilter).slice(0, 40),
    [query, layerFilter],
  )

  const grouped = useMemo(() => {
    const map = new Map<string, CanvasNode[]>()
    layers.forEach((layer) => map.set(layer, []))
    nodes.forEach((node) => {
      const bucket = map.get(node.layer) ?? []
      bucket.push(node)
      map.set(node.layer, bucket)
    })
    return layers
      .map((layer) => ({ layer, items: map.get(layer) ?? [] }))
      .filter((group) => group.items.length > 0 || nodes.length === 0)
  }, [nodes])

  function persist(next: CanvasNode[]): void {
    setNodes(next)
    saveCanvas(next)
  }

  function handleAdd(row: ServiceRow): void {
    const node: CanvasNode = {
      id: `${row.capability}-${provider}-${Date.now()}`,
      layer: row.layer,
      capability: row.capability,
      provider,
      service: serviceForProvider(row, provider),
    }
    persist([...nodes, node])
  }

  function handleRemove(nodeId: string): void {
    persist(nodes.filter((node) => node.id !== nodeId))
  }

  function handleClear(): void {
    persist([])
  }

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value)
  }

  function handleLayerFilter(event: React.ChangeEvent<HTMLSelectElement>): void {
    setLayerFilter(event.target.value)
  }

  function handleProviderChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setProvider(event.target.value as ProviderId)
  }

  function handleToggleEmbed(): void {
    setShowEmbed((previous) => !previous)
  }

  function handleExportMarkdown(): void {
    const lines = ['# Architecture stack', '']
    grouped.forEach((group) => {
      if (group.items.length === 0) return
      lines.push(`## ${group.layer}`)
      group.items.forEach((item) => {
        lines.push(`- **${item.capability}** (${PROVIDER_LABELS[item.provider]}): ${item.service}`)
      })
      lines.push('')
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
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
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-800">Architecture Canvas</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Compose a stack from the playbook · refine in diagrams.net
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost" onClick={handleExportMarkdown} data-testid="canvas-export">
            Export MD
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleClear} data-testid="canvas-clear">
            Clear
          </button>
          <button type="button" className="btn btn-primary" onClick={handleToggleEmbed} data-testid="canvas-embed-toggle">
            {showEmbed ? 'Hide diagrams.net' : 'Open diagrams.net'}
          </button>
        </div>
      </header>

      {showEmbed ? (
        <div className="glass-panel overflow-hidden p-2" data-testid="canvas-embed">
          <iframe
            title="diagrams.net"
            className="h-[70vh] w-full rounded-xl border-0 bg-white"
            src="https://embed.diagrams.net/?embed=1&ui=min&spin=1&proto=json&libraries=1&saveAndExit=0&noSaveBtn=1"
          />
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
          {nodes.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink-muted">
              Add capabilities from the left to build your architecture stack.
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
                          onClick={() => handleRemove(item.id)}
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
    </div>
  )
}
