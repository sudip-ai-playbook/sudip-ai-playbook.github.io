import { useState, type ChangeEvent } from 'react'
import { motion } from 'motion/react'
import { Download, Filter, Compass, BookOpen } from 'lucide-react'
import {
  BUSINESS_SITUATIONS,
  CONSULTING_OS_META,
  CONSULTING_STAGES,
  FRAMEWORK_RECOMMENDATIONS,
  MVP_FRAMEWORKS,
} from '../../data/consultingOs'
import {
  FILTER_ALL,
  buildConsultingFileStem,
  resolveConsultingStages,
  searchStages,
  type StageFilterId,
} from './consulting.logic'
import {
  buildConsultingExcelXml,
  buildConsultingHtml,
  downloadTextFile,
} from './consulting.export'

export function ConsultingView() {
  const [stageFilter, setStageFilter] = useState<StageFilterId>(FILTER_ALL)
  const [situationId, setSituationId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filtered = searchStages(
    resolveConsultingStages({ stageFilter, situationId }),
    query,
  )
  const selectedSituation = BUSINESS_SITUATIONS.find((item) => item.id === situationId)
  const fileStem = buildConsultingFileStem({ stageFilter, situationId })

  function handleStageFilter(event: ChangeEvent<HTMLSelectElement>): void {
    setStageFilter(event.target.value as StageFilterId)
  }

  function handleSituation(event: ChangeEvent<HTMLSelectElement>): void {
    const value = event.target.value
    setSituationId(value === '' ? null : value)
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value)
  }

  function handleClearFilters(): void {
    setStageFilter(FILTER_ALL)
    setSituationId(null)
    setQuery('')
  }

  function handleDownloadHtml(): void {
    downloadTextFile(
      `${fileStem}.html`,
      buildConsultingHtml(filtered),
      'text/html;charset=utf-8',
    )
  }

  function handleDownloadExcel(): void {
    downloadTextFile(
      `${fileStem}.xls`,
      buildConsultingExcelXml(filtered),
      'application/vnd.ms-excel;charset=utf-8',
    )
  }

  return (
    <div data-testid="consulting-view" className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">
          ConsultAI OS
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-800">
          {CONSULTING_OS_META.workingName}
        </h1>
        <p className="max-w-3xl text-sm text-ink-secondary">
          {CONSULTING_OS_META.positioning}
        </p>
        <div className="flex flex-wrap gap-2">
          {CONSULTING_OS_META.guidingQuestions.map((question) => (
            <span
              key={question}
              className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-ink-secondary"
            >
              {question}
            </span>
          ))}
        </div>
      </header>

      <section className="glass-panel space-y-4 p-5" data-testid="consulting-filters">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-bold">
            <Filter className="h-4 w-4 text-slate-blue" />
            Start from the business situation, then filter the step
          </h2>
          <p className="text-xs text-ink-muted" data-testid="consulting-result-count">
            Showing {filtered.length} of {CONSULTING_STAGES.length} stages
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            What are you trying to achieve?
            <select
              data-testid="consulting-situation"
              className="field-input mt-2"
              value={situationId ?? ''}
              onChange={handleSituation}
            >
              <option value="">All situations</option>
              {BUSINESS_SITUATIONS.map((situation) => (
                <option key={situation.id} value={situation.id}>
                  {situation.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Filter by lifecycle step
            <select
              data-testid="consulting-stage-filter"
              className="field-input mt-2"
              value={stageFilter}
              onChange={handleStageFilter}
            >
              <option value={FILTER_ALL}>All stages (0–19)</option>
              {CONSULTING_STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.number}. {stage.shortLabel} — {stage.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Search frameworks / deliverables
            <input
              data-testid="consulting-search"
              className="field-input mt-2"
              value={query}
              onChange={handleSearch}
              placeholder="e.g. SIPOC, ADKAR, SLA"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-accent"
            data-testid="consulting-download-html"
            onClick={handleDownloadHtml}
            disabled={filtered.length === 0}
          >
            <Download className="h-4 w-4" />
            Download HTML
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            data-testid="consulting-download-excel"
            onClick={handleDownloadExcel}
            disabled={filtered.length === 0}
          >
            <Download className="h-4 w-4" />
            Download Excel
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            data-testid="consulting-clear-filters"
            onClick={handleClearFilters}
          >
            Clear filters
          </button>
        </div>

        {selectedSituation ? (
          <div
            className="rounded-xl bg-white/70 p-4 text-sm"
            data-testid="consulting-situation-hint"
          >
            <p className="font-semibold text-ink">{selectedSituation.label}</p>
            <p className="mt-1 text-ink-secondary">
              Recommended frameworks:{' '}
              {selectedSituation.recommendedFrameworks.join(' · ')}
            </p>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <aside className="glass-panel space-y-2 p-3" data-testid="consulting-journey-rail">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Consulting journey
          </p>
          {CONSULTING_STAGES.map((stage) => {
            const isActive = stageFilter === stage.id
            const isVisible = filtered.some((item) => item.id === stage.id)
            return (
              <button
                key={stage.id}
                type="button"
                data-testid={`consulting-rail-${stage.id}`}
                disabled={!isVisible && stageFilter === FILTER_ALL && Boolean(situationId)}
                onClick={() => setStageFilter(stage.id)}
                className={[
                  'w-full rounded-xl px-3 py-2 text-left text-xs transition',
                  isActive
                    ? 'bg-slate-blue text-white shadow-md'
                    : isVisible
                      ? 'bg-white/50 text-ink hover:bg-white/80'
                      : 'bg-white/20 text-ink-muted',
                ].join(' ')}
              >
                <span className="font-semibold">
                  {stage.number}. {stage.journeyLabel}
                </span>
              </button>
            )
          })}
          <button
            type="button"
            data-testid="consulting-rail-all"
            onClick={() => setStageFilter(FILTER_ALL)}
            className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-blue hover:bg-white/70"
          >
            Show all stages
          </button>
        </aside>

        <div className="space-y-4" data-testid="consulting-stage-list">
          {filtered.length === 0 ? (
            <div className="glass-panel p-6 text-sm text-ink-muted">
              No stages match the current filters.
            </div>
          ) : (
            filtered.map((stage, index) => (
              <motion.article
                key={stage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                data-testid={`consulting-stage-${stage.id}`}
                className="glass-panel space-y-4 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">
                      Stage {stage.number} · {stage.shortLabel}
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-700">
                      {stage.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-amber-flame/15 px-3 py-1 text-xs font-bold text-tiger-orange">
                    {stage.gate}
                  </span>
                </div>

                <p className="text-sm text-ink-secondary">{stage.purpose}</p>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="glass-card glass-card-accent-blue p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Frameworks
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {stage.frameworks.slice(0, 8).map((framework) => (
                        <li key={framework}>{framework}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card glass-card-accent-amber p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Deliverables
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {stage.deliverables.slice(0, 8).map((deliverable) => (
                        <li key={deliverable}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Actions
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink-secondary">
                      {stage.actions.slice(0, 6).map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Gate criteria
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink-secondary">
                      {stage.gateCriteria.map((criterion) => (
                        <li key={criterion}>{criterion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-3 p-5" data-testid="consulting-framework-combos">
          <h2 className="flex items-center gap-2 font-bold">
            <Compass className="h-4 w-4 text-slate-blue" />
            Framework recommendation engine
          </h2>
          {FRAMEWORK_RECOMMENDATIONS.map((combo) => (
            <div key={combo.id} className="rounded-xl bg-white/70 p-4 text-sm">
              <p className="font-semibold">{combo.question}</p>
              <p className="mt-2 text-ink-secondary">{combo.frameworks.join(' → ')}</p>
            </div>
          ))}
        </div>

        <div className="glass-panel space-y-3 p-5" data-testid="consulting-mvp-frameworks">
          <h2 className="flex items-center gap-2 font-bold">
            <BookOpen className="h-4 w-4 text-slate-blue" />
            MVP framework library
          </h2>
          <div className="flex flex-wrap gap-2">
            {MVP_FRAMEWORKS.map((framework) => (
              <span
                key={framework}
                className="rounded-lg bg-slate-blue/10 px-2.5 py-1 text-xs font-semibold text-indigo-velvet"
              >
                {framework}
              </span>
            ))}
          </div>
          <p className="text-xs text-ink-muted">
            Principle: begin with the business situation, then recommend frameworks — never the
            reverse.
          </p>
        </div>
      </section>
    </div>
  )
}
