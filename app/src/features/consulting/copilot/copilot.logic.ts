import {
  BUSINESS_SITUATIONS,
  CONSULTING_OS_META,
  CONSULTING_STAGES,
  FRAMEWORK_RECOMMENDATIONS,
} from '../../../data/consultingOs'
import {
  buildNextStepGuidance,
  isGatePassed,
  type EngagementState,
} from '../engagement.logic'
import { isUseCaseReady } from '../workshop.logic'
import { getWorkshopForStage } from '../workspace/workspace.logic'

export interface CopilotFinding {
  id: string
  severity: 'info' | 'warning' | 'critical'
  message: string
}

export interface CopilotReport {
  guide: string
  frameworkAdvice: string
  findings: CopilotFinding[]
  suggestedDeliverableId: string | null
  disclaimer: string
}

export const COPILOT_DISCLAIMER =
  'Recommendations require human approval. The copilot never approves its own suggestions.'

export function buildCopilotReport(engagement: EngagementState): CopilotReport {
  const workshop = getWorkshopForStage(engagement, engagement.currentStageId)
  const guidance = buildNextStepGuidance(engagement, workshop)
  const findings: CopilotFinding[] = []

  if (!engagement.clientName.trim() || !engagement.engagementName.trim()) {
    findings.push({
      id: 'names',
      severity: 'critical',
      message: 'Client or engagement name is empty.',
    })
  }

  if (!engagement.scopeIn.trim()) {
    findings.push({
      id: 'scope',
      severity: 'warning',
      message: 'Scope-in is empty — complete engagement setup.',
    })
  }

  if (engagement.stakeholders.length === 0) {
    findings.push({
      id: 'stakeholders',
      severity: 'warning',
      message: 'No stakeholders recorded.',
    })
  }

  const stageProgress = engagement.stageProgress[engagement.currentStageId]
  const currentStageMeta = CONSULTING_STAGES.find(
    (stage) => stage.id === engagement.currentStageId,
  )
  if (currentStageMeta && stageProgress && !isGatePassed(currentStageMeta, stageProgress)) {
    findings.push({
      id: 'gate',
      severity: 'warning',
      message: `Gate criteria incomplete for ${currentStageMeta.gate}.`,
    })
  }

  if (!isUseCaseReady(engagement.sharedUseCase) && !isUseCaseReady(workshop.useCase)) {
    findings.push({
      id: 'usecase',
      severity: 'warning',
      message: 'Use case card is incomplete (name + business problem required).',
    })
  }

  const openRisksWithoutOwner = engagement.registers.risks.filter(
    (risk) => !risk.owner.trim() && risk.status !== 'closed',
  )
  if (openRisksWithoutOwner.length > 0) {
    findings.push({
      id: 'risk-owners',
      severity: 'critical',
      message: `${openRisksWithoutOwner.length} risk(s) missing an owner.`,
    })
  }

  const decisionsWithoutEvidence = engagement.registers.decisions.filter(
    (decision) => decision.status === 'approved' && !decision.approvalEvidence.trim(),
  )
  if (decisionsWithoutEvidence.length > 0) {
    findings.push({
      id: 'decision-evidence',
      severity: 'warning',
      message: 'Approved decisions lack approval evidence.',
    })
  }

  const situation = BUSINESS_SITUATIONS.find((item) => item.id === engagement.situationId)
  const combo = FRAMEWORK_RECOMMENDATIONS[0]
  const frameworkAdvice = situation
    ? `Situation “${situation.label}” → ${situation.recommendedFrameworks.slice(0, 4).join(' → ')}`
    : combo
      ? `${combo.question} → ${combo.frameworks.join(' → ')}`
      : guidance.whichFramework

  let suggestedDeliverableId: string | null = 'executive-pack'
  if (engagement.currentStageId === 'stage-0') suggestedDeliverableId = 'opportunity-brief'
  if (engagement.currentStageId === 'stage-1') suggestedDeliverableId = 'first-meeting-summary'
  if (engagement.currentStageId === 'stage-3') suggestedDeliverableId = 'discovery-report'
  if (engagement.currentStageId === 'stage-4') suggestedDeliverableId = 'maturity-report'
  if (engagement.currentStageId === 'stage-5' || engagement.currentStageId === 'stage-6') {
    suggestedDeliverableId = 'use-case-portfolio'
  }
  if (engagement.currentStageId === 'stage-7') suggestedDeliverableId = 'ai-strategy'
  if (engagement.currentStageId === 'stage-9') suggestedDeliverableId = 'roadmap-brief'
  if (engagement.currentStageId === 'stage-19') suggestedDeliverableId = 'closure-report'

  return {
    guide: `${guidance.whereAreWe} Next: ${guidance.whatNext}`,
    frameworkAdvice,
    findings,
    suggestedDeliverableId,
    disclaimer: COPILOT_DISCLAIMER,
  }
}

export function buildCopilotMarkdown(report: CopilotReport): string {
  const lines = [
    `# ${CONSULTING_OS_META.workingName} Copilot`,
    '',
    report.disclaimer,
    '',
    '## Engagement guide',
    report.guide,
    '',
    '## Framework advice',
    report.frameworkAdvice,
    '',
    '## Quality findings',
  ]
  if (report.findings.length === 0) {
    lines.push('- No issues detected.')
  } else {
    for (const finding of report.findings) {
      lines.push(`- [${finding.severity}] ${finding.message}`)
    }
  }
  if (report.suggestedDeliverableId) {
    lines.push('', '## Suggested deliverable draft', report.suggestedDeliverableId)
  }
  return lines.join('\n')
}
