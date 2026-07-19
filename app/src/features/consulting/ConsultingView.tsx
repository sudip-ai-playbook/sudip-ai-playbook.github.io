import { useMemo, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Download,
  Filter,
  Compass,
  BookOpen,
  Play,
  Briefcase,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Building2,
  Route,
  Scale,
  Shield,
  Boxes,
  LifeBuoy,
  Bot,
} from 'lucide-react'
import {
  BUSINESS_SITUATIONS,
  CONSULTING_STAGES,
  FRAMEWORK_RECOMMENDATIONS,
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
import { FrameworkLabView } from './FrameworkLabView'
import { WorkshopStudio } from './WorkshopStudio'
import { EngagementControlView } from './EngagementControlView'
import { DeliverableBuilderView } from './DeliverableBuilderView'
import { ClientWorkspacesView } from './workspaces/ClientWorkspacesView'
import { ConsultingHomeView } from './dashboard/ConsultingHomeView'
import { ConsultingJourneyView } from './journey/ConsultingJourneyView'
import { DecisionCentreView } from './decisions/DecisionCentreView'
import { GovernanceRiskCentreView } from './governance/GovernanceRiskCentreView'
import { ArchitectureStudioView } from './architecture-studio/ArchitectureStudioView'
import { ServiceManagementCentreView } from './service-management/ServiceManagementCentreView'
import { CopilotPanel } from './copilot/CopilotPanel'
import { getFrameworkByName, isSpecializedCanvas } from './framework.logic'
import {
  startWorkshopForStage,
  type FrameworkOutput,
} from './workshop.logic'
import { useConsultingWorkspace } from './useConsultingWorkspace'
import type { DeliverableTemplateId } from './deliverable.logic'
import {
  getWorkshopForStage,
  upsertWorkshop,
} from './workspace/workspace.logic'

const TAB_HOME = 'home'
const TAB_WORKSPACES = 'workspaces'
const TAB_JOURNEY = 'journey'
const TAB_PLAYBOOK = 'playbook'
const TAB_LAB = 'lab'
const TAB_WORKSHOP = 'workshop'
const TAB_CONTROL = 'control'
const TAB_DELIVERABLES = 'deliverables'
const TAB_DECISIONS = 'decisions'
const TAB_GOVERNANCE = 'governance'
const TAB_ARCHITECTURE = 'architecture'
const TAB_SERVICE = 'service'
const TAB_COPILOT = 'copilot'

const ALL_TABS = [
  TAB_HOME,
  TAB_WORKSPACES,
  TAB_JOURNEY,
  TAB_PLAYBOOK,
  TAB_CONTROL,
  TAB_LAB,
  TAB_WORKSHOP,
  TAB_DECISIONS,
  TAB_GOVERNANCE,
  TAB_ARCHITECTURE,
  TAB_SERVICE,
  TAB_DELIVERABLES,
  TAB_COPILOT,
] as const

const PRIMARY_TABS = [
  TAB_HOME,
  TAB_JOURNEY,
  TAB_WORKSHOP,
  TAB_LAB,
  TAB_DELIVERABLES,
  TAB_PLAYBOOK,
] as const

const MORE_TABS = [
  TAB_WORKSPACES,
  TAB_CONTROL,
  TAB_DECISIONS,
  TAB_GOVERNANCE,
  TAB_ARCHITECTURE,
  TAB_SERVICE,
  TAB_COPILOT,
] as const

type ConsultTab = (typeof ALL_TABS)[number]

function isMoreTab(tab: ConsultTab): boolean {
  return (MORE_TABS as readonly string[]).includes(tab)
}

function parseTab(value: string | null): ConsultTab {
  if (value && (ALL_TABS as readonly string[]).includes(value)) {
    return value as ConsultTab
  }
  return TAB_HOME
}

export function ConsultingView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = parseTab(searchParams.get('tab'))
  const workshopStage = searchParams.get('stage')
  const {
    store,
    engagement,
    persona,
    persistStore,
    persistEngagement,
  } = useConsultingWorkspace()

  const [stageFilter, setStageFilter] = useState<StageFilterId>(
    workshopStage && CONSULTING_STAGES.some((stage) => stage.id === workshopStage)
      ? workshopStage
      : FILTER_ALL,
  )
  const [situationId, setSituationId] = useState<string | null>(engagement.situationId)
  const [query, setQuery] = useState('')
  const [preferredDeliverable, setPreferredDeliverable] =
    useState<DeliverableTemplateId | null>(null)
  const [showMoreTools, setShowMoreTools] = useState(() => isMoreTab(tab))

  const filtered = searchStages(
    resolveConsultingStages({ stageFilter, situationId }),
    query,
  )
  const selectedSituation = BUSINESS_SITUATIONS.find((item) => item.id === situationId)
  const fileStem = buildConsultingFileStem({ stageFilter, situationId })

  const tabItems: Array<{ id: ConsultTab; label: string; icon: typeof Filter }> = useMemo(
    () => [
      { id: TAB_HOME, label: 'Home', icon: LayoutDashboard },
      { id: TAB_JOURNEY, label: 'Journey', icon: Route },
      { id: TAB_WORKSHOP, label: 'Workshop', icon: Briefcase },
      { id: TAB_LAB, label: 'Lab', icon: BookOpen },
      { id: TAB_DELIVERABLES, label: 'Deliverables', icon: FileText },
      { id: TAB_PLAYBOOK, label: 'Playbook', icon: Filter },
      { id: TAB_WORKSPACES, label: 'Workspaces', icon: Building2 },
      { id: TAB_CONTROL, label: 'Control', icon: ClipboardList },
      { id: TAB_DECISIONS, label: 'Decisions', icon: Scale },
      { id: TAB_GOVERNANCE, label: 'Governance', icon: Shield },
      { id: TAB_ARCHITECTURE, label: 'Architecture', icon: Boxes },
      { id: TAB_SERVICE, label: 'Service', icon: LifeBuoy },
      { id: TAB_COPILOT, label: 'Copilot', icon: Bot },
    ],
    [],
  )

  const primaryTabItems = tabItems.filter((item) =>
    (PRIMARY_TABS as readonly string[]).includes(item.id),
  )
  const moreTabItems = tabItems.filter((item) =>
    (MORE_TABS as readonly string[]).includes(item.id),
  )

  function setTab(next: ConsultTab, stageId?: string | null): void {
    if (isMoreTab(next)) {
      setShowMoreTools(true)
    }
    const params = new URLSearchParams(searchParams)
    params.set('tab', next)
    if (stageId) {
      params.set('stage', stageId)
    } else if (next !== TAB_WORKSHOP) {
      params.delete('stage')
    }
    setSearchParams(params)
  }

  function handleStageFilter(event: ChangeEvent<HTMLSelectElement>): void {
    setStageFilter(event.target.value as StageFilterId)
  }

  function handleSituation(event: ChangeEvent<HTMLSelectElement>): void {
    const value = event.target.value
    const nextSituationId = value === '' ? null : value
    setSituationId(nextSituationId)
    persistEngagement({ ...engagement, situationId: nextSituationId })
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

  function handleRunWorkshop(stageId: string): void {
    startWorkshopForStage(stageId)
    setStageFilter(stageId)
    setTab(TAB_WORKSHOP, stageId)
  }

  function handleOpenFramework(name: string): void {
    const entry = getFrameworkByName(name)
    if (!entry) return
    const params = new URLSearchParams(searchParams)
    params.set('tab', TAB_LAB)
    params.set('framework', entry.id)
    params.delete('stage')
    setSearchParams(params)
  }

  function handleLabSave(output: Omit<FrameworkOutput, 'savedAt'>): void {
    const stageId = stageFilter !== FILTER_ALL ? stageFilter : engagement.currentStageId
    const workshop = getWorkshopForStage(engagement, stageId)
    const nextWorkshop = {
      ...workshop,
      frameworkOutputs: {
        ...workshop.frameworkOutputs,
        [output.frameworkId]: { ...output, savedAt: new Date().toISOString() },
      },
    }
    persistEngagement(upsertWorkshop(engagement, nextWorkshop))
  }

  function handleWorkshopStageRequest(stageId: string): void {
    setStageFilter(stageId)
    setTab(TAB_WORKSHOP, stageId)
  }

  function handleOpenDeliverablesFromCopilot(templateId: string | null): void {
    setPreferredDeliverable((templateId as DeliverableTemplateId | null) ?? null)
    setTab(TAB_DELIVERABLES)
  }

  function handleSetTab(tabId: ConsultTab): void {
    setTab(tabId, tabId === TAB_WORKSHOP ? workshopStage : null)
  }

  function handleToggleMoreTools(): void {
    setShowMoreTools((current) => !current)
  }

  return (
    <div data-testid="consulting-view" className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-blue">
          Engagement workspace · legacy ConsultAI OS
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em]">
          Engagement workspace
        </h1>
        <p className="text-xs text-ink-muted" data-testid="consult-active-context">
          Active: {engagement.clientName || 'Unnamed client'} /{' '}
          {engagement.engagementName || 'Unnamed engagement'}
        </p>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2" data-testid="consult-tab-nav" role="tablist" aria-label="Engagement primary tools">
            {primaryTabItems.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                data-testid={`consult-tab-${item.id}`}
                onClick={() => handleSetTab(item.id)}
                className={['btn', tab === item.id ? 'btn-primary' : 'btn-ghost'].join(' ')}
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </button>
            ))}
            <button
              type="button"
              data-testid="consult-more-tools"
              onClick={handleToggleMoreTools}
              className="btn btn-ghost"
              aria-expanded={showMoreTools}
            >
              {showMoreTools ? 'Hide more tools' : 'More tools'}
            </button>
          </div>
          {showMoreTools ? (
            <div
              className="flex flex-wrap gap-2 rounded-xl border border-ink/10 bg-white/50 p-3"
              data-testid="consult-more-tab-nav"
              role="tablist"
              aria-label="Engagement advanced tools"
            >
              {moreTabItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  data-testid={`consult-tab-${item.id}`}
                  onClick={() => handleSetTab(item.id)}
                  className={['btn', tab === item.id ? 'btn-accent' : 'btn-ghost'].join(' ')}
                >
                  <item.icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {tab === TAB_HOME ? (
        <ConsultingHomeView
          store={store}
          engagement={engagement}
          onOpenTab={(nextTab) => setTab(parseTab(nextTab))}
        />
      ) : null}

      {tab === TAB_WORKSPACES ? (
        <ClientWorkspacesView
          store={store}
          engagement={engagement}
          persona={persona}
          onStoreChange={persistStore}
          onEngagementChange={persistEngagement}
        />
      ) : null}

      {tab === TAB_JOURNEY ? (
        <ConsultingJourneyView
          engagement={engagement}
          persona={persona}
          onEngagementChange={persistEngagement}
          onOpenWorkshop={handleRunWorkshop}
        />
      ) : null}

      {tab === TAB_LAB ? (
        <FrameworkLabView
          onSaveOutput={handleLabSave}
          initialFrameworkId={searchParams.get('framework')}
        />
      ) : null}

      {tab === TAB_WORKSHOP ? (
        <WorkshopStudio
          stageId={workshopStage}
          onRequestStage={handleWorkshopStageRequest}
        />
      ) : null}

      {tab === TAB_CONTROL ? (
        <EngagementControlView
          engagement={engagement}
          persona={persona}
          onEngagementChange={persistEngagement}
          onOpenWorkshop={handleRunWorkshop}
          onOpenLab={() => setTab(TAB_LAB)}
          onOpenDeliverables={() => setTab(TAB_DELIVERABLES)}
        />
      ) : null}

      {tab === TAB_DECISIONS ? (
        <DecisionCentreView
          engagement={engagement}
          persona={persona}
          onEngagementChange={persistEngagement}
        />
      ) : null}

      {tab === TAB_GOVERNANCE ? (
        <GovernanceRiskCentreView
          engagement={engagement}
          persona={persona}
          onEngagementChange={persistEngagement}
        />
      ) : null}

      {tab === TAB_ARCHITECTURE ? (
        <ArchitectureStudioView
          engagement={engagement}
          persona={persona}
          onEngagementChange={persistEngagement}
        />
      ) : null}

      {tab === TAB_SERVICE ? (
        <ServiceManagementCentreView
          engagement={engagement}
          persona={persona}
          onEngagementChange={persistEngagement}
        />
      ) : null}

      {tab === TAB_DELIVERABLES ? (
        <DeliverableBuilderView
          preferredStageId={stageFilter !== FILTER_ALL ? stageFilter : null}
          preferredTemplateId={preferredDeliverable}
        />
      ) : null}

      {tab === TAB_COPILOT ? (
        <CopilotPanel
          engagement={engagement}
          onOpenDeliverables={handleOpenDeliverablesFromCopilot}
        />
      ) : null}

      {tab === TAB_PLAYBOOK ? (
        <>
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
                        ? 'bg-ink text-surface-soft shadow-md'
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
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-amber-flame/15 px-3 py-1 text-xs font-bold text-tiger-orange">
                          {stage.gate}
                        </span>
                        <button
                          type="button"
                          className="btn btn-accent"
                          data-testid={`consulting-run-workshop-${stage.id}`}
                          onClick={() => handleRunWorkshop(stage.id)}
                        >
                          <Play className="h-4 w-4" />
                          Run workshop
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-ink-secondary">{stage.purpose}</p>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="glass-card glass-card-accent-blue p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                          Frameworks
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {stage.frameworks.slice(0, 10).map((frameworkName) => {
                            const entry = getFrameworkByName(frameworkName)
                            const specialized = entry ? isSpecializedCanvas(entry) : false
                            return (
                              <button
                                key={frameworkName}
                                type="button"
                                data-testid={`consulting-framework-chip-${stage.id}-${frameworkName}`}
                                onClick={() => handleOpenFramework(frameworkName)}
                                className="rounded-lg bg-slate-blue/15 px-2 py-1 text-left text-xs font-semibold text-indigo-velvet hover:bg-slate-blue/25"
                              >
                                {frameworkName}
                                {specialized ? ' · canvas' : ' · workbook'}
                              </button>
                            )
                          })}
                        </div>
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
                Open Framework Lab
              </h2>
              <p className="text-sm text-ink-secondary">
                18 executable canvases plus short explanations for other stage frameworks.
              </p>
              <button
                type="button"
                className="btn btn-accent"
                data-testid="consulting-open-lab"
                onClick={() => setTab(TAB_LAB)}
              >
                <BookOpen className="h-4 w-4" />
                Framework Lab
              </button>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
