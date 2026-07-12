import { Bot } from 'lucide-react'
import { buildCopilotReport, type CopilotReport } from './copilot.logic'
import type { EngagementState } from '../engagement.logic'

interface CopilotPanelProps {
  engagement: EngagementState
  onOpenDeliverables: (templateId: string | null) => void
}

export function CopilotPanel({ engagement, onOpenDeliverables }: CopilotPanelProps) {
  const report: CopilotReport = buildCopilotReport(engagement)

  function handleDraft(): void {
    onOpenDeliverables(report.suggestedDeliverableId)
  }

  return (
    <div className="space-y-6" data-testid="copilot-panel">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <Bot className="h-5 w-5 text-slate-blue" />
          Consulting copilot
        </h2>
        <p className="rounded-xl bg-amber-flame/15 px-3 py-2 text-sm text-tiger-orange" data-testid="copilot-disclaimer">
          {report.disclaimer}
        </p>
      </header>

      <section className="glass-panel space-y-2 p-5" data-testid="copilot-guide">
        <h3 className="font-bold">Engagement guide</h3>
        <p className="text-sm">{report.guide}</p>
      </section>

      <section className="glass-panel space-y-2 p-5" data-testid="copilot-frameworks">
        <h3 className="font-bold">Framework recommender</h3>
        <p className="text-sm">{report.frameworkAdvice}</p>
      </section>

      <section className="glass-panel space-y-2 p-5" data-testid="copilot-findings">
        <h3 className="font-bold">Quality reviewer</h3>
        <ul className="space-y-1 text-sm">
          {report.findings.length === 0 ? (
            <li>No issues detected.</li>
          ) : (
            report.findings.map((finding) => (
              <li key={finding.id} data-testid={`copilot-finding-${finding.id}`}>
                [{finding.severity}] {finding.message}
              </li>
            ))
          )}
        </ul>
      </section>

      <button type="button" className="btn btn-accent" data-testid="copilot-open-deliverable" onClick={handleDraft}>
        Draft suggested deliverable
      </button>
    </div>
  )
}
