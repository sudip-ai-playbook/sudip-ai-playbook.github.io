import { LayoutDashboard } from 'lucide-react'
import { CONSULTING_STAGES } from '../../../data/consultingOs'
import {
  computeEngagementHealth,
  countApprovedStages,
  STAGE_STATUS_LABELS,
  type EngagementState,
} from '../engagement.logic'
import {
  countOpenRegisterItems,
  deriveOverallRag,
  listUpcomingGates,
  type WorkspaceStore,
} from '../workspace/workspace.logic'

const RAG_LABEL = {
  green: 'Green',
  amber: 'Amber',
  red: 'Red',
} as const

interface ConsultingHomeViewProps {
  store: WorkspaceStore
  engagement: EngagementState
  onOpenTab: (tab: string) => void
}

export function ConsultingHomeView({ store, engagement, onOpenTab }: ConsultingHomeViewProps) {
  const health = computeEngagementHealth(engagement)
  const overall = deriveOverallRag(engagement)
  const counts = countOpenRegisterItems(engagement)
  const gates = listUpcomingGates(engagement)
  const approved = countApprovedStages(engagement)
  const stage =
    CONSULTING_STAGES.find((item) => item.id === engagement.currentStageId) ?? CONSULTING_STAGES[0]
  const stageStatus = engagement.stageProgress[stage.id]?.status

  function handleOpenControl(): void {
    onOpenTab('control')
  }

  function handleOpenJourney(): void {
    onOpenTab('journey')
  }

  function handleOpenWorkspaces(): void {
    onOpenTab('workspaces')
  }

  return (
    <div className="space-y-6" data-testid="consulting-home-view">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <LayoutDashboard className="h-5 w-5 text-slate-blue" />
          Home dashboard
        </h2>
        <p className="text-sm text-ink-secondary">
          Active engagement health, open work, and upcoming phase gates.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4" data-testid="home-status-strip">
        <div className="glass-panel p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Overall RAG</p>
          <p className="mt-1 text-xl font-bold" data-testid="home-overall-rag">
            {RAG_LABEL[overall]}
          </p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Derived health</p>
          <p className="mt-1 text-xl font-bold" data-testid="home-derived-health">
            {RAG_LABEL[health]}
          </p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Current phase</p>
          <p className="mt-1 text-sm font-bold" data-testid="home-current-phase">
            {stage.number}. {stage.shortLabel}
          </p>
          <p className="text-xs text-ink-muted">
            {stageStatus ? STAGE_STATUS_LABELS[stageStatus] : 'Not started'}
          </p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Stages approved</p>
          <p className="mt-1 text-xl font-bold" data-testid="home-approved-count">
            {approved}/{CONSULTING_STAGES.length}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-3 p-5" data-testid="home-active-clients">
          <h3 className="font-bold">Active clients</h3>
          <ul className="space-y-2 text-sm">
            {store.clients.map((client) => (
              <li key={client.id}>
                <span className="font-semibold">{client.name}</span>
                <span className="text-ink-muted"> · {client.engagements.length} engagement(s)</span>
              </li>
            ))}
          </ul>
          <p className="text-sm" data-testid="home-active-engagement">
            Active: {engagement.clientName || 'Unnamed client'} /{' '}
            {engagement.engagementName || 'Unnamed engagement'}
          </p>
          <button type="button" className="btn btn-ghost" data-testid="home-open-workspaces" onClick={handleOpenWorkspaces}>
            Open workspaces
          </button>
        </div>

        <div className="glass-panel space-y-3 p-5" data-testid="home-open-work">
          <h3 className="font-bold">Open work</h3>
          <ul className="space-y-1 text-sm">
            <li data-testid="home-overdue-actions">Overdue actions: {counts.overdueActions}</li>
            <li data-testid="home-open-risks">Open risks: {counts.openRisks}</li>
            <li data-testid="home-pending-decisions">Pending decisions: {counts.pendingDecisions}</li>
            <li data-testid="home-deliverables-review">
              Deliverables awaiting review: {counts.deliverablesAwaitingReview}
            </li>
          </ul>
          <button type="button" className="btn btn-accent" data-testid="home-open-control" onClick={handleOpenControl}>
            Open control centre
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-3 p-5" data-testid="home-upcoming-gates">
          <h3 className="font-bold">Upcoming phase gates</h3>
          <ul className="space-y-1 text-sm">
            {gates.length === 0 ? (
              <li>All remaining gates cleared or closed.</li>
            ) : (
              gates.map((gate) => (
                <li key={gate.stageId}>
                  {gate.shortLabel}: {gate.gate}
                </li>
              ))
            )}
          </ul>
          <button type="button" className="btn btn-ghost" data-testid="home-open-journey" onClick={handleOpenJourney}>
            Open journey
          </button>
        </div>

        <div className="glass-panel space-y-3 p-5" data-testid="home-benefits">
          <h3 className="font-bold">Expected vs realised benefits</h3>
          <ul className="space-y-1 text-sm">
            {engagement.registers.benefits.length === 0 ? (
              <li className="text-ink-muted">No benefits captured yet — add them in Control.</li>
            ) : (
              engagement.registers.benefits.map((benefit) => (
                <li key={benefit.id}>
                  {benefit.text}: expected {benefit.expected || 'TBD'} / realised{' '}
                  {benefit.realised || 'TBD'}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  )
}
