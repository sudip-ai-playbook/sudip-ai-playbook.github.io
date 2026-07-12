import { useEffect, useState } from 'react'
import architectureMap from '../../data/architectureMap.json'
import { StepNav } from '../journey/StepNav'
import { useProject } from '../journey/useProject'

interface LayerRow {
  layer: string
  purpose: string
  subcategories: string
  primaryDecisionQuestion: string
  typicalSolutionEngineeringOutputs: string
  stopRule: string
}

const layers = architectureMap as LayerRow[]

export function MapView() {
  const { project, setFocus } = useProject()
  const [selectedLayer, setSelectedLayer] = useState(
    project.selectedLayer || layers[0]?.layer || '',
  )

  useEffect(() => {
    if (project.selectedLayer && project.selectedLayer !== selectedLayer) {
      setSelectedLayer(project.selectedLayer)
    }
  }, [project.selectedLayer, selectedLayer])

  const selected = layers.find((layer) => layer.layer === selectedLayer) ?? layers[0]

  function handleSelectLayer(layerName: string): void {
    setSelectedLayer(layerName)
    setFocus({ selectedLayer: layerName })
  }

  return (
    <div data-testid="map-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">Step 2 · Map</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-800">Locate the layer</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Foundation decisions constrain platform decisions.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="glass-panel space-y-2 p-3">
          {layers.map((layer) => {
            const isActive = layer.layer === selected.layer
            return (
              <button
                key={layer.layer}
                type="button"
                data-testid={`layer-${layer.layer.slice(0, 2)}`}
                onClick={() => handleSelectLayer(layer.layer)}
                className={[
                  'w-full rounded-xl px-3 py-3 text-left text-sm transition',
                  isActive
                    ? 'bg-slate-blue text-white shadow-md'
                    : 'bg-white/50 text-ink hover:bg-white/80',
                ].join(' ')}
              >
                <span className="font-semibold">{layer.layer}</span>
              </button>
            )
          })}
        </div>

        <div className="glass-panel space-y-5 p-6" data-testid="layer-detail">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">{selected.layer}</h2>
          <p className="text-ink-secondary">{selected.purpose}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card glass-card-accent-blue p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Decide</p>
              <p className="mt-2 text-sm font-medium">{selected.primaryDecisionQuestion}</p>
            </div>
            <div className="glass-card glass-card-accent-red p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Stop rule</p>
              <p className="mt-2 text-sm font-medium">{selected.stopRule}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Subcategories</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selected.subcategories.split('|').map((part) => (
                <span
                  key={part.trim()}
                  className="rounded-full bg-slate-blue/10 px-3 py-1 text-xs font-semibold text-indigo-velvet"
                >
                  {part.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <StepNav path="/map" nextHint="Next: scenario defaults" />
    </div>
  )
}
