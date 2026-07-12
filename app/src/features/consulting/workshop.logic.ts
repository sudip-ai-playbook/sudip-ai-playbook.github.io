import { CONSULTING_STAGES } from '../../data/consultingOs'
import type { CanvasType } from '../../data/frameworkLibrary'
import { getCanvasFieldDefs } from './canvasFields'

export const WORKSHOP_STORAGE_KEY = 'sudip-consult-workshop'

export interface UseCaseCard {
  name: string
  businessProblem: string
  targetUsers: string
  currentProcess: string
  desiredOutcome: string
  dataAvailable: string
  constraints: string
  baselineKpi: string
  owner: string
}

export const EMPTY_USE_CASE: UseCaseCard = {
  name: '',
  businessProblem: '',
  targetUsers: '',
  currentProcess: '',
  desiredOutcome: '',
  dataAvailable: '',
  constraints: '',
  baselineKpi: '',
  owner: '',
}

export interface WorkshopDecision {
  id: string
  text: string
  owner: string
  date: string
}

export interface WorkshopAction {
  id: string
  text: string
  owner: string
  due: string
}

export interface FrameworkOutput {
  frameworkId: string
  canvasType: CanvasType
  title: string
  fields: Record<string, string>
  savedAt: string
}

export interface WorkshopSession {
  stageId: string
  title: string
  agenda: string[]
  participants: string
  notes: string
  useCase: UseCaseCard
  frameworkOutputs: Record<string, FrameworkOutput>
  decisions: WorkshopDecision[]
  actions: WorkshopAction[]
  updatedAt: string
}

export function isUseCaseReady(useCase: UseCaseCard): boolean {
  return useCase.name.trim().length >= 3 && useCase.businessProblem.trim().length >= 8
}

export function formatUseCaseBlock(useCase: UseCaseCard): string {
  return [
    `Use case: ${useCase.name || 'TBD'}`,
    `Problem: ${useCase.businessProblem || 'TBD'}`,
    `Users: ${useCase.targetUsers || 'TBD'}`,
    `Current process: ${useCase.currentProcess || 'TBD'}`,
    `Desired outcome: ${useCase.desiredOutcome || 'TBD'}`,
    `Data available: ${useCase.dataAvailable || 'TBD'}`,
    `Constraints: ${useCase.constraints || 'TBD'}`,
    `Baseline KPI: ${useCase.baselineKpi || 'TBD'}`,
    `Owner: ${useCase.owner || 'TBD'}`,
  ].join('\n')
}

export function seedCanvasFieldsFromUseCase(
  canvasType: CanvasType,
  useCase: UseCaseCard,
  existing: Record<string, string> = {},
): Record<string, string> {
  const fields: Record<string, string> = { ...existing }
  const apply = (key: string, value: string): void => {
    if (!fields[key]?.trim() && value.trim()) {
      fields[key] = value.trim()
    }
  }

  const problem = useCase.businessProblem || useCase.name
  const initiative = useCase.name || useCase.businessProblem

  switch (canvasType) {
    case 'mece':
    case 'fiveWhys':
      apply('problem', problem)
      break
    case 'sipoc':
      apply('processName', useCase.currentProcess || initiative)
      apply('customers', useCase.targetUsers)
      apply('outputs', useCase.desiredOutcome)
      break
    case 'vsm':
      apply('trigger', useCase.currentProcess || problem)
      apply('outcome', useCase.desiredOutcome)
      break
    case 'jtbd':
      apply('user', useCase.targetUsers)
      apply('job', useCase.desiredOutcome || problem)
      apply('success', useCase.baselineKpi)
      apply('frictions', useCase.businessProblem)
      break
    case 'aiCanvas':
      apply('prediction', `Support: ${initiative}`)
      apply('action', useCase.desiredOutcome)
      apply('data', useCase.dataAvailable)
      apply('value', useCase.baselineKpi || useCase.desiredOutcome)
      apply('risks', useCase.constraints)
      break
    case 'valueFeasibility':
      apply('useCase', initiative)
      break
    case 'rice':
      apply('initiative', initiative)
      break
    case 'swot':
      apply('weaknesses', useCase.businessProblem)
      apply('opportunities', useCase.desiredOutcome)
      break
    case 'bmc':
      apply('segments', useCase.targetUsers)
      apply('valueProps', useCase.desiredOutcome)
      apply('activities', useCase.currentProcess)
      break
    case 'raci':
      apply('activity', `Deliver ${initiative}`)
      apply('accountable', useCase.owner)
      break
    case 'raid':
      apply('description', `${problem}. Constraints: ${useCase.constraints}`)
      apply('owner', useCase.owner)
      apply('entryType', 'Risk')
      break
    case 'adkar':
      apply('awareness', `Why change: ${problem}`)
      apply(
        'desire',
        `Benefit for ${useCase.targetUsers || 'users'}: ${useCase.desiredOutcome}`,
      )
      break
    case 'businessCase':
      apply('strategicCase', problem)
      apply('options', `Do nothing · Improve process · Deliver ${initiative}`)
      break
    case 'tcoRoi':
      apply(
        'scenarios',
        `Expected benefit linked to: ${useCase.baselineKpi || useCase.desiredOutcome}`,
      )
      break
    case 'guidedNotes':
      apply('useCaseContext', formatUseCaseBlock(useCase))
      apply(
        'frameworkPrompts',
        'Answer the framework questions against this use case. Capture evidence for each claim.',
      )
      break
    default:
      break
  }

  for (const def of getCanvasFieldDefs(canvasType)) {
    if (fields[def.key] === undefined) {
      fields[def.key] = existing[def.key] ?? ''
    }
  }
  return fields
}

export function createEmptyWorkshop(stageId: string): WorkshopSession {
  const stage = CONSULTING_STAGES.find((item) => item.id === stageId)
  const agenda = stage
    ? [
        'Confirm / refine the use case card',
        `Objective: ${stage.purpose}`,
        'Confirm participants and decision rights',
        'Run recommended frameworks against the use case',
        'Capture decisions and actions',
        `Review gate: ${stage.gate}`,
      ]
    : ['Define use case', 'Run frameworks', 'Capture actions']

  return {
    stageId,
    title: stage ? `Workshop · ${stage.shortLabel}: ${stage.title}` : 'Workshop',
    agenda,
    participants: '',
    notes: '',
    useCase: { ...EMPTY_USE_CASE },
    frameworkOutputs: {},
    decisions: [],
    actions: [],
    updatedAt: new Date().toISOString(),
  }
}

export function loadWorkshop(): WorkshopSession | null {
  try {
    const raw = localStorage.getItem(WORKSHOP_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as WorkshopSession
    if (!parsed.stageId || !CONSULTING_STAGES.some((stage) => stage.id === parsed.stageId)) {
      localStorage.removeItem(WORKSHOP_STORAGE_KEY)
      return null
    }
    return {
      ...createEmptyWorkshop(parsed.stageId),
      ...parsed,
      useCase: { ...EMPTY_USE_CASE, ...(parsed.useCase ?? {}) },
      frameworkOutputs: parsed.frameworkOutputs ?? {},
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      agenda: Array.isArray(parsed.agenda)
        ? parsed.agenda
        : createEmptyWorkshop(parsed.stageId).agenda,
    }
  } catch {
    return null
  }
}

export function saveWorkshop(session: WorkshopSession): WorkshopSession {
  const next = { ...session, updatedAt: new Date().toISOString() }
  localStorage.setItem(WORKSHOP_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearWorkshop(): void {
  localStorage.removeItem(WORKSHOP_STORAGE_KEY)
}

export function startWorkshopForStage(stageId: string): WorkshopSession {
  const existing = loadWorkshop()
  if (existing && existing.stageId === stageId) {
    return existing
  }
  const previousUseCase = existing?.useCase
  const created = createEmptyWorkshop(stageId)
  if (previousUseCase && isUseCaseReady(previousUseCase)) {
    created.useCase = previousUseCase
  }
  return saveWorkshop(created)
}

export function validateCanvasFields(
  fields: Record<string, string>,
  requiredKeys: string[],
  labelsByKey: Record<string, string> = {},
): string | null {
  for (const key of requiredKeys) {
    if (!fields[key] || fields[key].trim().length === 0) {
      return `Please complete: ${labelsByKey[key] ?? key}`
    }
  }
  return null
}

export function requiredKeysForCanvas(canvasType: CanvasType): string[] {
  switch (canvasType) {
    case 'mece':
      return ['problem', 'branch1', 'branch2']
    case 'fiveWhys':
      return ['problem', 'why1', 'rootCause']
    case 'sipoc':
      return ['processName', 'suppliers', 'inputs', 'process', 'outputs', 'customers']
    case 'vsm':
      return ['trigger', 'steps', 'wasteThemes']
    case 'jtbd':
      return ['user', 'job', 'success']
    case 'aiCanvas':
      return ['prediction', 'action', 'data', 'value']
    case 'valueFeasibility':
      return ['useCase', 'valueScore', 'feasibilityScore', 'bucket']
    case 'rice':
      return ['initiative', 'reach', 'impact', 'confidence', 'effort']
    case 'swot':
      return ['strengths', 'weaknesses', 'opportunities', 'threats']
    case 'pestle':
      return ['political', 'economic', 'social', 'technological', 'legal', 'environmental']
    case 'bmc':
      return ['segments', 'valueProps', 'activities']
    case 'mckinsey7s':
      return ['strategy', 'structure', 'systems', 'misalignments']
    case 'nistAiRmf':
      return ['govern', 'map', 'measure', 'manage']
    case 'raci':
      return ['activity', 'responsible', 'accountable']
    case 'raid':
      return ['entryType', 'description', 'owner']
    case 'adkar':
      return ['awareness', 'desire', 'knowledge', 'ability', 'reinforcement']
    case 'businessCase':
      return ['strategicCase', 'options', 'recommendation']
    case 'tcoRoi':
      return ['implementationCost', 'annualOperatingCost', 'annualBenefit']
    case 'guidedNotes':
      return ['useCaseContext', 'findings', 'decisionOrOutput']
    default:
      return ['notes']
  }
}

export function createRegisterId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function computeRiceScore(fields: Record<string, string>): number | null {
  const reach = Number(fields.reach)
  const impact = Number(fields.impact)
  const confidence = Number(fields.confidence)
  const effort = Number(fields.effort)
  if ([reach, impact, confidence, effort].some((value) => Number.isNaN(value) || value <= 0)) {
    return null
  }
  return (reach * impact * (confidence / 100)) / effort
}
