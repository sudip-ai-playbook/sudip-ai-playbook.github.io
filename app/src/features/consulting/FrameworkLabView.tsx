import { useEffect, useState, type ChangeEvent } from 'react'
import { BookOpen, Search } from 'lucide-react'
import { CONSULTING_STAGES } from '../../data/consultingOs'
import type { FrameworkEntry } from '../../data/frameworkLibrary'
import {
  filterMvpByStage,
  getFrameworkById,
  isSpecializedCanvas,
  listMvpFrameworks,
  searchFrameworks,
} from './framework.logic'
import { FrameworkDetailPanel } from './FrameworkDetailPanel'
import { FrameworkCanvas } from './FrameworkCanvas'
import { loadWorkshop, type FrameworkOutput } from './workshop.logic'

interface FrameworkLabViewProps {
  onSaveOutput?: (output: Omit<FrameworkOutput, 'savedAt'>) => void
  initialFrameworkId?: string | null
}

function buildLibraryList(
  query: string,
  stageFilter: string,
): FrameworkEntry[] {
  const searched = searchFrameworks(query)
  if (stageFilter) {
    return filterMvpByStage(stageFilter).filter((framework) =>
      searched.some((entry) => entry.id === framework.id),
    )
  }
  if (!query.trim()) {
    return [...listMvpFrameworks(), ...searched.filter((entry) => entry.canvasType === 'guidedNotes')]
  }
  return searched
}

export function FrameworkLabView({
  onSaveOutput,
  initialFrameworkId = null,
}: FrameworkLabViewProps) {
  const [query, setQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(initialFrameworkId)
  const [runningId, setRunningId] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    if (initialFrameworkId) {
      setSelectedId(initialFrameworkId)
    }
  }, [initialFrameworkId])

  const listItems = buildLibraryList(query, stageFilter)
  const selected = selectedId ? getFrameworkById(selectedId) : undefined
  const running = runningId ? getFrameworkById(runningId) : undefined
  const runningMvp = running ?? undefined
  const workshopUseCase = loadWorkshop()?.useCase

  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value)
  }

  function handleStageFilter(event: ChangeEvent<HTMLSelectElement>): void {
    setStageFilter(event.target.value)
  }

  function handleSelect(framework: FrameworkEntry): void {
    setSelectedId(framework.id)
    setRunningId(null)
    setSaveMessage(null)
  }

  function handleRunCanvas(): void {
    if (selected) {
      setRunningId(selected.id)
      setSaveMessage(null)
    }
  }

  function handleCancelCanvas(): void {
    setRunningId(null)
  }

  function handleSaveCanvas(output: Omit<FrameworkOutput, 'savedAt'>): void {
    onSaveOutput?.(output)
    setRunningId(null)
    setSaveMessage(`Saved ${output.title} to the workshop session.`)
  }

  function handleCloseDetail(): void {
    setSelectedId(null)
  }

  return (
    <div className="space-y-4" data-testid="framework-lab">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <BookOpen className="h-5 w-5 text-slate-blue" />
          Framework Lab
        </h2>
        <p className="text-sm text-ink-secondary">
          Explain every framework. Run guided canvases for the 18 MVP frameworks and save outputs
          into your workshop.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Search
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              data-testid="framework-lab-search"
              className="field-input pl-9"
              value={query}
              onChange={handleSearch}
              placeholder="MECE, ADKAR, SIPOC…"
            />
          </div>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Filter MVP by stage
          <select
            data-testid="framework-lab-stage"
            className="field-input mt-2"
            value={stageFilter}
            onChange={handleStageFilter}
          >
            <option value="">All stages</option>
            {CONSULTING_STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.number}. {stage.shortLabel}
              </option>
            ))}
          </select>
        </label>
      </div>

      {saveMessage ? (
        <p className="text-sm font-medium text-indigo-velvet" data-testid="framework-lab-saved">
          {saveMessage}
        </p>
      ) : null}

      {runningMvp ? (
        <FrameworkCanvas
          framework={runningMvp}
          useCase={workshopUseCase}
          onSave={handleSaveCanvas}
          onCancel={handleCancelCanvas}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="glass-panel max-h-[70vh] space-y-2 overflow-y-auto p-3">
            <p className="px-2 text-xs font-semibold uppercase text-ink-muted">
              Library ({listItems.length})
            </p>
            {listItems.map((entry) => {
              const isActive = entry.id === selectedId
              return (
                <button
                  key={entry.id}
                  type="button"
                  data-testid={`framework-lab-item-${entry.id}`}
                  onClick={() => handleSelect(entry)}
                  className={[
                    'w-full rounded-xl px-3 py-2 text-left text-sm transition',
                    isActive ? 'bg-slate-blue text-white' : 'bg-white/50 hover:bg-white/80',
                  ].join(' ')}
                >
                  <span className="font-semibold">{entry.name}</span>
                  <span className="mt-0.5 block text-[11px] opacity-80">
                    {isSpecializedCanvas(entry) ? 'Specialized canvas' : 'Use-case workbook'}
                  </span>
                </button>
              )
            })}
          </div>
          {selected ? (
            <FrameworkDetailPanel
              framework={selected}
              onClose={handleCloseDetail}
              onRunCanvas={handleRunCanvas}
            />
          ) : (
            <div className="glass-panel p-6 text-sm text-ink-muted">
              Select a framework to read the explanation and launch a canvas.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
