import { CONSULTING_STAGES, CONSULTING_OS_META } from '../../data/consultingOs'
import type { EngagementState } from './engagement.logic'
import { isGatePassed, STAGE_STATUS_LABELS } from './engagement.logic'
import type { WorkshopSession } from './workshop.logic'
import { formatUseCaseBlock, isUseCaseReady } from './workshop.logic'

export const DELIVERABLE_TEMPLATES: ReadonlyArray<{
  id: DeliverableTemplateId
  label: string
  stageIds: readonly string[]
}> = [
  {
    id: 'opportunity-brief',
    label: 'Client opportunity brief',
    stageIds: ['stage-0'],
  },
  {
    id: 'first-meeting-summary',
    label: 'First meeting summary',
    stageIds: ['stage-1'],
  },
  {
    id: 'discovery-report',
    label: 'Current-state discovery report',
    stageIds: ['stage-3'],
  },
  {
    id: 'maturity-report',
    label: 'AI maturity assessment summary',
    stageIds: ['stage-4'],
  },
  {
    id: 'use-case-portfolio',
    label: 'Use-case portfolio pack',
    stageIds: ['stage-5', 'stage-6'],
  },
  {
    id: 'ai-strategy',
    label: 'AI strategy-on-a-page',
    stageIds: ['stage-7'],
  },
  {
    id: 'roadmap-brief',
    label: 'Roadmap and investment brief',
    stageIds: ['stage-9'],
  },
  {
    id: 'executive-pack',
    label: 'Executive steering pack',
    stageIds: [],
  },
  {
    id: 'closure-report',
    label: 'Engagement closure report',
    stageIds: ['stage-19'],
  },
]

export type DeliverableTemplateId =
  | 'opportunity-brief'
  | 'first-meeting-summary'
  | 'discovery-report'
  | 'maturity-report'
  | 'use-case-portfolio'
  | 'ai-strategy'
  | 'roadmap-brief'
  | 'executive-pack'
  | 'closure-report'

export interface GeneratedDeliverable {
  templateId: DeliverableTemplateId
  title: string
  markdown: string
  html: string
  warnings: string[]
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function markdownToSimpleHtml(markdown: string): string {
  const lines = markdown.split('\n')
  const parts: string[] = []
  let inList = false

  function closeList(): void {
    if (inList) {
      parts.push('</ul>')
      inList = false
    }
  }

  for (const line of lines) {
    if (line.startsWith('# ')) {
      closeList()
      parts.push(`<h1>${escapeHtml(line.slice(2))}</h1>`)
      continue
    }
    if (line.startsWith('## ')) {
      closeList()
      parts.push(`<h2>${escapeHtml(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith('### ')) {
      closeList()
      parts.push(`<h3>${escapeHtml(line.slice(4))}</h3>`)
      continue
    }
    if (line.startsWith('- ')) {
      if (!inList) {
        parts.push('<ul>')
        inList = true
      }
      parts.push(`<li>${escapeHtml(line.slice(2))}</li>`)
      continue
    }
    closeList()
    if (line.trim().length === 0) {
      parts.push('')
      continue
    }
    parts.push(`<p>${escapeHtml(line)}</p>`)
  }
  closeList()

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(CONSULTING_OS_META.workingName)} Deliverable</title>
  <style>
    body { font-family: Georgia, serif; max-width: 820px; margin: 2rem auto; padding: 0 1rem; color: #1e293b; line-height: 1.5; }
    h1, h2, h3 { font-family: system-ui, sans-serif; }
    ul { padding-left: 1.25rem; }
  </style>
</head>
<body>
${parts.join('\n')}
</body>
</html>`
}

function collectWarnings(
  engagement: EngagementState,
  workshop: WorkshopSession | null,
): string[] {
  const warnings: string[] = []
  if (!engagement.clientName.trim()) {
    warnings.push('Client name is empty — fill it in Engagement Control.')
  }
  if (!engagement.engagementName.trim()) {
    warnings.push('Engagement name is empty — fill it in Engagement Control.')
  }
  if (!workshop) {
    warnings.push('No workshop session yet — run Workshop Studio to enrich this draft.')
  } else if (!isUseCaseReady(workshop.useCase)) {
    warnings.push('Use case card is incomplete — name and business problem are required.')
  }
  if (workshop && Object.keys(workshop.frameworkOutputs).length === 0) {
    warnings.push('No framework outputs saved — run frameworks in Lab or Workshop.')
  }
  return warnings
}

function frameworkOutputSection(workshop: WorkshopSession | null): string[] {
  if (!workshop || Object.keys(workshop.frameworkOutputs).length === 0) {
    return ['- No framework outputs captured yet.']
  }
  return Object.values(workshop.frameworkOutputs).map((output) => {
    const highlights = Object.entries(output.fields)
      .filter(([, value]) => value.trim().length > 0)
      .slice(0, 4)
      .map(([key, value]) => `${key}: ${value.replaceAll('\n', ' ').slice(0, 120)}`)
      .join('; ')
    return `- ${output.title} (${output.savedAt.slice(0, 10)}): ${highlights || 'saved'}`
  })
}

function decisionsSection(workshop: WorkshopSession | null): string[] {
  if (!workshop || workshop.decisions.length === 0) {
    return ['- No decisions recorded.']
  }
  return workshop.decisions.map(
    (decision) =>
      `- ${decision.text} (owner: ${decision.owner || 'TBD'}; date: ${decision.date || 'TBD'})`,
  )
}

function actionsSection(workshop: WorkshopSession | null): string[] {
  if (!workshop || workshop.actions.length === 0) {
    return ['- No actions recorded.']
  }
  return workshop.actions.map(
    (action) =>
      `- ${action.text} (owner: ${action.owner || 'TBD'}; due: ${action.due || 'TBD'})`,
  )
}

function gateSection(engagement: EngagementState, stageId: string): string[] {
  const stage = CONSULTING_STAGES.find((item) => item.id === stageId)
  if (!stage) return ['- Stage not found.']
  const progress = engagement.stageProgress[stageId]
  const lines = [
    `- Gate: ${stage.gate}`,
    `- Status: ${STAGE_STATUS_LABELS[progress?.status ?? 'not_started']}`,
  ]
  for (const criterion of stage.gateCriteria) {
    const checked = progress?.checkedCriteria.includes(criterion) ? 'done' : 'open'
    lines.push(`- [${checked}] ${criterion}`)
  }
  if (progress && isGatePassed(stage, progress)) {
    lines.push('- Gate recommendation: Ready to progress.')
  } else {
    lines.push('- Gate recommendation: Hold until criteria and evidence are complete.')
  }
  return lines
}

function buildBody(
  templateId: DeliverableTemplateId,
  engagement: EngagementState,
  workshop: WorkshopSession | null,
): string[] {
  const stage =
    CONSULTING_STAGES.find((item) => item.id === engagement.currentStageId) ??
    CONSULTING_STAGES[0]
  const useCaseBlock = workshop
    ? formatUseCaseBlock(workshop.useCase)
    : 'Use case not defined yet.'

  const commonHeader = [
    `# ${DELIVERABLE_TEMPLATES.find((item) => item.id === templateId)?.label ?? 'Deliverable'}`,
    '',
    `Client: ${engagement.clientName || 'TBD'}`,
    `Engagement: ${engagement.engagementName || 'TBD'}`,
    `Current stage: ${stage.number}. ${stage.title}`,
    `Generated by ${CONSULTING_OS_META.workingName}`,
    '',
  ]

  switch (templateId) {
    case 'opportunity-brief':
      return [
        ...commonHeader,
        '## Opportunity summary',
        useCaseBlock,
        '',
        '## Qualification lens',
        ...gateSection(engagement, 'stage-0'),
        '',
        '## Recommended next step',
        '- Confirm pursuit decision and schedule the Discovery Authorisation conversation.',
      ]
    case 'first-meeting-summary':
      return [
        ...commonHeader,
        '## Meeting purpose',
        stage.purpose,
        '',
        '## Use case / problem hypothesis',
        useCaseBlock,
        '',
        '## Decisions',
        ...decisionsSection(workshop),
        '',
        '## Follow-up actions',
        ...actionsSection(workshop),
        '',
        '## Evidence still required',
        ...stage.deliverables.map((item) => `- ${item}`),
      ]
    case 'discovery-report':
      return [
        ...commonHeader,
        '## Discovery objective',
        CONSULTING_STAGES.find((item) => item.id === 'stage-3')?.purpose ?? '',
        '',
        '## Focus use case',
        useCaseBlock,
        '',
        '## Framework findings',
        ...frameworkOutputSection(workshop),
        '',
        '## Open risks',
        ...(engagement.risks.length === 0
          ? ['- No engagement risks logged.']
          : engagement.risks.map(
              (risk) => `- [${risk.severity}] ${risk.text} (owner: ${risk.owner || 'TBD'})`,
            )),
        '',
        '## Validation gate',
        ...gateSection(engagement, 'stage-3'),
      ]
    case 'maturity-report':
      return [
        ...commonHeader,
        '## Maturity assessment summary',
        CONSULTING_STAGES.find((item) => item.id === 'stage-4')?.purpose ?? '',
        '',
        '## Evidence captured',
        ...frameworkOutputSection(workshop),
        '',
        '## Capability gaps to discuss',
        '- Strategy and leadership',
        '- Data readiness',
        '- Governance and responsible AI',
        '- Talent and operating model',
        '',
        '## Readiness gate',
        ...gateSection(engagement, 'stage-4'),
      ]
    case 'use-case-portfolio':
      return [
        ...commonHeader,
        '## Portfolio candidate',
        useCaseBlock,
        '',
        '## Scoring and framing outputs',
        ...frameworkOutputSection(workshop),
        '',
        '## Portfolio decisions',
        ...decisionsSection(workshop),
        '',
        '## Actions to complete before Portfolio Approval Gate',
        ...actionsSection(workshop),
        '',
        '## Gate status',
        ...gateSection(engagement, engagement.currentStageId.startsWith('stage-6') ? 'stage-6' : 'stage-5'),
      ]
    case 'ai-strategy':
      return [
        ...commonHeader,
        '## AI vision (draft)',
        workshop?.useCase.desiredOutcome || 'Define the AI vision with executives.',
        '',
        '## Strategic problem being solved',
        workshop?.useCase.businessProblem || 'TBD',
        '',
        '## Strategy workshop outputs',
        ...frameworkOutputSection(workshop),
        '',
        '## Operating model and ownership notes',
        ...decisionsSection(workshop),
        '',
        '## Strategy Approval Gate',
        ...gateSection(engagement, 'stage-7'),
      ]
    case 'roadmap-brief':
      return [
        ...commonHeader,
        '## Investment narrative',
        useCaseBlock,
        '',
        '## Financial and roadmap inputs',
        ...frameworkOutputSection(workshop),
        '',
        '## Risks affecting funding',
        ...(engagement.risks.length === 0
          ? ['- None logged.']
          : engagement.risks.map((risk) => `- [${risk.severity}] ${risk.text}`)),
        '',
        '## Investment Gate',
        ...gateSection(engagement, 'stage-9'),
      ]
    case 'executive-pack':
      return [
        ...commonHeader,
        '## Where we are',
        `Stage ${stage.number} · ${stage.shortLabel}: ${stage.title}`,
        '',
        '## Recommendation in one paragraph',
        workshop?.useCase.desiredOutcome ||
          'Complete the use case card and framework outputs to generate a sharper recommendation.',
        '',
        '## Evidence snapshot',
        ...frameworkOutputSection(workshop),
        '',
        '## Decisions required',
        ...decisionsSection(workshop),
        '',
        '## Actions and owners',
        ...actionsSection(workshop),
        '',
        '## Gate criteria still open',
        ...gateSection(engagement, stage.id),
      ]
    case 'closure-report':
      return [
        ...commonHeader,
        '## Engagement outcomes',
        useCaseBlock,
        '',
        '## Deliverables register',
        ...(engagement.deliverables.length === 0
          ? ['- No deliverables tracked yet — sync from stages in Control.']
          : engagement.deliverables.map(
              (item) => `- [${item.status}] ${item.title} (${item.stageId})`,
            )),
        '',
        '## Open actions',
        ...actionsSection(workshop),
        '',
        '## Open risks requiring named owners',
        ...(engagement.risks.length === 0
          ? ['- None.']
          : engagement.risks.map(
              (risk) => `- ${risk.text} → owner ${risk.owner || 'UNASSIGNED'}`,
            )),
        '',
        '## Closure Gate',
        ...gateSection(engagement, 'stage-19'),
      ]
    default:
      return [...commonHeader, '## Draft', 'Template not recognised.']
  }
}

export function generateDeliverable(
  templateId: DeliverableTemplateId,
  engagement: EngagementState,
  workshop: WorkshopSession | null,
): GeneratedDeliverable {
  const template = DELIVERABLE_TEMPLATES.find((item) => item.id === templateId)
  const title = template?.label ?? 'Deliverable'
  const markdown = buildBody(templateId, engagement, workshop).join('\n')
  return {
    templateId,
    title,
    markdown,
    html: markdownToSimpleHtml(markdown),
    warnings: collectWarnings(engagement, workshop),
  }
}

export function templatesForStage(stageId: string): Array<(typeof DELIVERABLE_TEMPLATES)[number]> {
  return DELIVERABLE_TEMPLATES.filter(
    (template) => template.stageIds.length === 0 || template.stageIds.includes(stageId),
  )
}
