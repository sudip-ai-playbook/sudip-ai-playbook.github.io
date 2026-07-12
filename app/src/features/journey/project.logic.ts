import type { DeploymentOption, EcosystemOption, ProviderId } from '../../constants/playbook'
import { PROJECT_STORAGE_KEY } from '../../constants/journey'

export interface StackItem {
  id: string
  layer: string
  capability: string
  provider: ProviderId
  service: string
  source: 'compare' | 'picks' | 'decide' | 'canvas' | 'manual'
}

export interface PlaybookProject {
  outcome: string
  users: string
  constraints: string
  ecosystem: EcosystemOption
  deployment: DeploymentOption
  selectedLayer: string
  selectedCapability: string
  selectedScenario: string
  preferredProvider: ProviderId | 'undecided'
  decisionNotes: string
  stack: StackItem[]
  updatedAt: string
}

export const EMPTY_PROJECT: PlaybookProject = {
  outcome: '',
  users: '',
  constraints: '',
  ecosystem: 'Neutral',
  deployment: 'Cloud-native',
  selectedLayer: '',
  selectedCapability: '',
  selectedScenario: '',
  preferredProvider: 'undecided',
  decisionNotes: '',
  stack: [],
  updatedAt: '',
}

export function loadProject(): PlaybookProject {
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY)
    if (!raw) return { ...EMPTY_PROJECT }
    const parsed = JSON.parse(raw) as PlaybookProject
    return {
      ...EMPTY_PROJECT,
      ...parsed,
      stack: Array.isArray(parsed.stack) ? parsed.stack : [],
    }
  } catch {
    return { ...EMPTY_PROJECT }
  }
}

export function saveProject(project: PlaybookProject): void {
  const next = { ...project, updatedAt: new Date().toISOString() }
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(next))
}

export function clearProjectStorage(): void {
  localStorage.removeItem(PROJECT_STORAGE_KEY)
}

export function isFrameComplete(project: PlaybookProject): boolean {
  return project.outcome.trim().length >= 8
}

export function buildDecisionBrief(project: PlaybookProject): string {
  const lines = [
    '# Architecture decision brief',
    '',
    `Generated: ${project.updatedAt || new Date().toISOString()}`,
    '',
    '## Outcome',
    project.outcome || '_Not framed yet_',
    '',
    '## Users',
    project.users || '_Not specified_',
    '',
    '## Constraints',
    project.constraints || '_Not specified_',
    '',
    '## Context',
    `- Ecosystem: ${project.ecosystem}`,
    `- Deployment: ${project.deployment}`,
    `- Preferred provider: ${project.preferredProvider}`,
    '',
    '## Focus',
    `- Layer: ${project.selectedLayer || '_Not selected_'}`,
    `- Scenario: ${project.selectedScenario || '_Not selected_'}`,
    `- Capability: ${project.selectedCapability || '_Not selected_'}`,
    '',
    '## Architecture stack',
  ]

  if (project.stack.length === 0) {
    lines.push('_No services added yet_')
  } else {
    project.stack.forEach((item) => {
      lines.push(
        `- **${item.layer}** · ${item.capability} → ${item.provider.toUpperCase()}: ${item.service}`,
      )
    })
  }

  lines.push('', '## Notes', project.decisionNotes || '_None_', '')
  lines.push('## Validation checklist')
  lines.push('- [ ] Region / data residency confirmed')
  lines.push('- [ ] Security and identity model reviewed')
  lines.push('- [ ] SLA / quotas checked')
  lines.push('- [ ] Cost / FinOps estimate reviewed')
  lines.push('- [ ] Proof of value / PoC criteria defined')
  lines.push('')
  return lines.join('\n')
}

export function createStackItem(input: Omit<StackItem, 'id'>): StackItem {
  return {
    ...input,
    id: `${input.capability}-${input.provider}-${Date.now()}`,
  }
}
