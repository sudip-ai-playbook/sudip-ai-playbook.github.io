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

export interface WorkshopVoteOption {
  id: string
  label: string
  votes: string[]
}

export interface WorkshopVoting {
  question: string
  options: WorkshopVoteOption[]
}

export interface WorkshopSession {
  stageId: string
  title: string
  agenda: string[]
  questions: string[]
  participants: string
  notes: string
  useCase: UseCaseCard
  frameworkOutputs: Record<string, FrameworkOutput>
  decisions: WorkshopDecision[]
  actions: WorkshopAction[]
  voting: WorkshopVoting
  updatedAt: string
}

export function createEmptyVoting(): WorkshopVoting {
  return {
    question: '',
    options: [],
  }
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
  const questions = stage
    ? [
        `What would make ${stage.shortLabel} successful?`,
        'What evidence is missing?',
        'What decision is required before the gate?',
      ]
    : ['What is the problem?', 'What decision is required?']

  return {
    stageId,
    title: stage ? `Workshop · ${stage.shortLabel}: ${stage.title}` : 'Workshop',
    agenda,
    questions,
    participants: '',
    notes: '',
    useCase: { ...EMPTY_USE_CASE },
    frameworkOutputs: {},
    decisions: [],
    actions: [],
    voting: createEmptyVoting(),
    updatedAt: new Date().toISOString(),
  }
}

export function normalizeWorkshopSession(raw: WorkshopSession): WorkshopSession {
  const base = createEmptyWorkshop(
    raw.stageId && CONSULTING_STAGES.some((stage) => stage.id === raw.stageId)
      ? raw.stageId
      : 'stage-0',
  )
  return {
    ...base,
    ...raw,
    stageId: base.stageId,
    useCase: { ...EMPTY_USE_CASE, ...(raw.useCase ?? {}) },
    frameworkOutputs: raw.frameworkOutputs ?? {},
    decisions: Array.isArray(raw.decisions) ? raw.decisions : [],
    actions: Array.isArray(raw.actions) ? raw.actions : [],
    agenda: Array.isArray(raw.agenda) && raw.agenda.length > 0 ? raw.agenda : base.agenda,
    questions:
      Array.isArray(raw.questions) && raw.questions.length > 0 ? raw.questions : base.questions,
    voting: {
      question: raw.voting?.question ?? '',
      options: Array.isArray(raw.voting?.options) ? raw.voting.options : [],
    },
  }
}

export function loadWorkshopFromLegacyKey(): WorkshopSession | null {
  try {
    const raw = localStorage.getItem(WORKSHOP_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as WorkshopSession
    if (!parsed.stageId || !CONSULTING_STAGES.some((stage) => stage.id === parsed.stageId)) {
      localStorage.removeItem(WORKSHOP_STORAGE_KEY)
      return null
    }
    return normalizeWorkshopSession(parsed)
  } catch {
    return null
  }
}

export function clearWorkshopLegacyKey(): void {
  localStorage.removeItem(WORKSHOP_STORAGE_KEY)
}

export function addAgendaItem(session: WorkshopSession, item: string): WorkshopSession {
  const text = item.trim()
  if (!text) return session
  return { ...session, agenda: [...session.agenda, text] }
}

export function updateAgendaItem(
  session: WorkshopSession,
  index: number,
  item: string,
): WorkshopSession {
  if (index < 0 || index >= session.agenda.length) return session
  const agenda = [...session.agenda]
  agenda[index] = item
  return { ...session, agenda }
}

export function removeAgendaItem(session: WorkshopSession, index: number): WorkshopSession {
  if (index < 0 || index >= session.agenda.length) return session
  return { ...session, agenda: session.agenda.filter((_, itemIndex) => itemIndex !== index) }
}

export function addQuestionItem(session: WorkshopSession, item: string): WorkshopSession {
  const text = item.trim()
  if (!text) return session
  return { ...session, questions: [...session.questions, text] }
}

export function removeQuestionItem(session: WorkshopSession, index: number): WorkshopSession {
  if (index < 0 || index >= session.questions.length) return session
  return {
    ...session,
    questions: session.questions.filter((_, itemIndex) => itemIndex !== index),
  }
}

export function setVotingQuestion(session: WorkshopSession, question: string): WorkshopSession {
  return {
    ...session,
    voting: { ...session.voting, question },
  }
}

export function addVoteOption(session: WorkshopSession, label: string): WorkshopSession {
  const text = label.trim()
  if (!text) return session
  return {
    ...session,
    voting: {
      ...session.voting,
      options: [
        ...session.voting.options,
        { id: createRegisterId('vote'), label: text, votes: [] },
      ],
    },
  }
}

export function castVote(
  session: WorkshopSession,
  optionId: string,
  voter: string,
): WorkshopSession {
  const name = voter.trim()
  if (!name) return session
  return {
    ...session,
    voting: {
      ...session.voting,
      options: session.voting.options.map((option) => {
        if (option.id !== optionId) {
          return {
            ...option,
            votes: option.votes.filter((existing) => existing !== name),
          }
        }
        if (option.votes.includes(name)) return option
        return { ...option, votes: [...option.votes, name] }
      }),
    },
  }
}

export function tallyVotes(
  session: WorkshopSession,
): Array<{ optionId: string; label: string; count: number }> {
  return session.voting.options.map((option) => ({
    optionId: option.id,
    label: option.label,
    count: option.votes.length,
  }))
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

export {
  clearWorkshop,
  loadWorkshop,
  saveWorkshop,
  startWorkshopForStage,
} from './workshop.storage'
