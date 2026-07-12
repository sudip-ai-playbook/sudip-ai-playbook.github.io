import { CONSULTING_STAGES, type ConsultingStage } from '../../data/consultingOs'
import {
  createRegisterId,
  type UseCaseCard,
  type WorkshopAction,
  type WorkshopDecision,
  type WorkshopSession,
  EMPTY_USE_CASE,
} from './workshop.logic'

export const ENGAGEMENT_STORAGE_KEY = 'sudip-consult-engagement'

export const STAGE_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  INTERNAL_REVIEW: 'internal_review',
  CLIENT_REVIEW: 'client_review',
  APPROVED: 'approved',
  BLOCKED: 'blocked',
  CLOSED: 'closed',
} as const

export type StageStatus = (typeof STAGE_STATUS)[keyof typeof STAGE_STATUS]

export const RAG_STATUS = {
  GREEN: 'green',
  AMBER: 'amber',
  RED: 'red',
} as const

export type RagStatus = (typeof RAG_STATUS)[keyof typeof RAG_STATUS]

export const RISK_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export type RiskSeverity = (typeof RISK_SEVERITY)[keyof typeof RISK_SEVERITY]

export const REGISTER_ITEM_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CLOSED: 'closed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DEFERRED: 'deferred',
} as const

export type RegisterItemStatus =
  (typeof REGISTER_ITEM_STATUS)[keyof typeof REGISTER_ITEM_STATUS]

export const DELIVERABLE_STATUS = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
} as const

export type DeliverableStatus =
  (typeof DELIVERABLE_STATUS)[keyof typeof DELIVERABLE_STATUS]

export interface StageProgress {
  status: StageStatus
  checkedCriteria: string[]
  notes: string
}

export interface EngagementRisk {
  id: string
  text: string
  severity: RiskSeverity
  owner: string
  stageId: string
  status: RegisterItemStatus
}

export interface EngagementDeliverableItem {
  id: string
  title: string
  stageId: string
  status: DeliverableStatus
}

export interface EngagementStakeholder {
  id: string
  name: string
  role: string
  interest: string
  influence: string
}

export interface EngagementRaciRow {
  id: string
  activity: string
  responsible: string
  accountable: string
  consulted: string
  informed: string
}

export interface EngagementActionItem {
  id: string
  text: string
  owner: string
  due: string
  status: RegisterItemStatus
  stageId: string
}

export interface EngagementDecisionItem {
  id: string
  text: string
  context: string
  options: string
  criteria: string
  recommendation: string
  risks: string
  owner: string
  date: string
  approvalEvidence: string
  linkedWorkstreams: string
  status: RegisterItemStatus
  stageId: string
}

export interface EngagementAssumptionItem {
  id: string
  text: string
  owner: string
  status: RegisterItemStatus
  stageId: string
}

export interface EngagementIssueItem {
  id: string
  text: string
  owner: string
  status: RegisterItemStatus
  stageId: string
}

export interface EngagementDependencyItem {
  id: string
  text: string
  owner: string
  status: RegisterItemStatus
  stageId: string
}

export interface EngagementBenefitItem {
  id: string
  text: string
  expected: string
  realised: string
  owner: string
  status: RegisterItemStatus
}

export interface EngagementChangeRequestItem {
  id: string
  text: string
  owner: string
  status: RegisterItemStatus
  stageId: string
}

export interface EngagementRegisters {
  actions: EngagementActionItem[]
  decisions: EngagementDecisionItem[]
  risks: EngagementRisk[]
  assumptions: EngagementAssumptionItem[]
  issues: EngagementIssueItem[]
  dependencies: EngagementDependencyItem[]
  deliverables: EngagementDeliverableItem[]
  benefits: EngagementBenefitItem[]
  changeRequests: EngagementChangeRequestItem[]
}

export interface EngagementHealthFields {
  schedule: RagStatus
  budget: RagStatus
  scope: RagStatus
  resource: RagStatus
  risk: RagStatus
  clientSatisfaction: RagStatus
  deliverableCompletion: number
}

export interface GovernanceState {
  aiInventory: Array<{ id: string; name: string; owner: string; riskClass: string }>
  policies: Array<{ id: string; title: string; status: string }>
  controls: Array<{ id: string; title: string; status: string }>
  assessments: Array<{ id: string; title: string; status: string }>
  approvals: Array<{ id: string; title: string; status: string; owner: string }>
  auditEvidence: Array<{ id: string; title: string; reference: string }>
  exceptions: Array<{ id: string; text: string; owner: string; status: string }>
}

export interface ArchitectureState {
  capabilityNotes: string
  processNotes: string
  systemNotes: string
  dataFlowNotes: string
  adrs: Array<{ id: string; title: string; decision: string; status: string }>
}

export interface ServiceManagementState {
  catalogueEntry: string
  availabilityTarget: string
  incidentPriorities: string
  aiQualityTargets: string
  runbook: string
  incidents: Array<{ id: string; title: string; priority: string; status: string }>
  problems: Array<{ id: string; title: string; status: string }>
  changes: Array<{ id: string; title: string; status: string }>
}

export interface EngagementState {
  id: string
  clientName: string
  engagementName: string
  currentStageId: string
  situationId: string | null
  scopeIn: string
  scopeOut: string
  stakeholders: EngagementStakeholder[]
  raci: EngagementRaciRow[]
  stageProgress: Record<string, StageProgress>
  health: EngagementHealthFields
  registers: EngagementRegisters
  workshopsByStage: Record<string, WorkshopSession>
  sharedUseCase: UseCaseCard
  governance: GovernanceState
  architecture: ArchitectureState
  service: ServiceManagementState
  /** @deprecated Prefer registers.risks — kept for legacy helpers */
  risks: EngagementRisk[]
  /** @deprecated Prefer registers.deliverables */
  deliverables: EngagementDeliverableItem[]
  updatedAt: string
}

export interface NextStepGuidance {
  whereAreWe: string
  whatNext: string
  whichFramework: string
  whatEvidence: string
  recommendedStageId: string
  recommendedFrameworks: string[]
}

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  [STAGE_STATUS.NOT_STARTED]: 'Not started',
  [STAGE_STATUS.IN_PROGRESS]: 'In progress',
  [STAGE_STATUS.INTERNAL_REVIEW]: 'Internal review',
  [STAGE_STATUS.CLIENT_REVIEW]: 'Client review',
  [STAGE_STATUS.APPROVED]: 'Approved',
  [STAGE_STATUS.BLOCKED]: 'Blocked',
  [STAGE_STATUS.CLOSED]: 'Closed',
}

function createDefaultStageProgress(): StageProgress {
  return {
    status: STAGE_STATUS.NOT_STARTED,
    checkedCriteria: [],
    notes: '',
  }
}

export function createEmptyRegisters(): EngagementRegisters {
  return {
    actions: [],
    decisions: [],
    risks: [],
    assumptions: [],
    issues: [],
    dependencies: [],
    deliverables: [],
    benefits: [],
    changeRequests: [],
  }
}

export function createEmptyHealth(): EngagementHealthFields {
  return {
    schedule: RAG_STATUS.GREEN,
    budget: RAG_STATUS.GREEN,
    scope: RAG_STATUS.GREEN,
    resource: RAG_STATUS.GREEN,
    risk: RAG_STATUS.GREEN,
    clientSatisfaction: RAG_STATUS.GREEN,
    deliverableCompletion: 0,
  }
}

export function createEmptyGovernance(): GovernanceState {
  return {
    aiInventory: [],
    policies: [
      { id: createRegisterId('policy'), title: 'AI acceptable use', status: 'draft' },
      { id: createRegisterId('policy'), title: 'Model risk policy', status: 'draft' },
    ],
    controls: [
      { id: createRegisterId('ctrl'), title: 'Human oversight checkpoint', status: 'planned' },
      { id: createRegisterId('ctrl'), title: 'Prompt injection guardrails', status: 'planned' },
    ],
    assessments: [],
    approvals: [],
    auditEvidence: [],
    exceptions: [],
  }
}

export function createEmptyArchitecture(): ArchitectureState {
  return {
    capabilityNotes: '',
    processNotes: '',
    systemNotes: '',
    dataFlowNotes: '',
    adrs: [],
  }
}

export function createEmptyService(): ServiceManagementState {
  return {
    catalogueEntry: '',
    availabilityTarget: '99.5% monthly excluding planned maintenance',
    incidentPriorities:
      'P1: 15–30 min response / 4h restore\nP2: 1h / 8 business hours\nP3: 4 business hours / 3 days\nP4: 1 business day / planned',
    aiQualityTargets: 'Task success, groundedness, hallucination, unsafe-output thresholds TBD',
    runbook: '',
    incidents: [],
    problems: [],
    changes: [],
  }
}

export function createEmptyEngagement(): EngagementState {
  const stageProgress: Record<string, StageProgress> = {}
  for (const stage of CONSULTING_STAGES) {
    stageProgress[stage.id] = createDefaultStageProgress()
  }
  return {
    id: createRegisterId('eng'),
    clientName: '',
    engagementName: '',
    currentStageId: 'stage-0',
    situationId: null,
    scopeIn: '',
    scopeOut: '',
    stakeholders: [],
    raci: [],
    stageProgress,
    health: createEmptyHealth(),
    registers: createEmptyRegisters(),
    workshopsByStage: {},
    sharedUseCase: { ...EMPTY_USE_CASE },
    governance: createEmptyGovernance(),
    architecture: createEmptyArchitecture(),
    service: createEmptyService(),
    risks: [],
    deliverables: [],
    updatedAt: new Date().toISOString(),
  }
}

function syncLegacyAliases(state: EngagementState): EngagementState {
  return {
    ...state,
    risks: state.registers.risks,
    deliverables: state.registers.deliverables,
  }
}

export function normalizeEngagementState(raw: EngagementState): EngagementState {
  const base = createEmptyEngagement()
  const stageProgress: Record<string, StageProgress> = { ...base.stageProgress }
  for (const stage of CONSULTING_STAGES) {
    const existing = raw.stageProgress?.[stage.id]
    if (existing) {
      stageProgress[stage.id] = {
        status: existing.status ?? STAGE_STATUS.NOT_STARTED,
        checkedCriteria: Array.isArray(existing.checkedCriteria)
          ? existing.checkedCriteria.filter((item) => stage.gateCriteria.includes(item))
          : [],
        notes: existing.notes ?? '',
      }
    }
  }

  const legacyRisks = Array.isArray(raw.risks) ? raw.risks : []
  const legacyDeliverables = Array.isArray(raw.deliverables) ? raw.deliverables : []
  const registers: EngagementRegisters = {
    ...createEmptyRegisters(),
    ...(raw.registers ?? {}),
    actions: Array.isArray(raw.registers?.actions) ? raw.registers.actions : [],
    decisions: Array.isArray(raw.registers?.decisions) ? raw.registers.decisions : [],
    risks:
      Array.isArray(raw.registers?.risks) && raw.registers.risks.length > 0
        ? raw.registers.risks.map((risk) => ({
            ...risk,
            status: risk.status ?? REGISTER_ITEM_STATUS.OPEN,
          }))
        : legacyRisks.map((risk) => ({
            ...risk,
            status: risk.status ?? REGISTER_ITEM_STATUS.OPEN,
          })),
    assumptions: Array.isArray(raw.registers?.assumptions) ? raw.registers.assumptions : [],
    issues: Array.isArray(raw.registers?.issues) ? raw.registers.issues : [],
    dependencies: Array.isArray(raw.registers?.dependencies) ? raw.registers.dependencies : [],
    deliverables:
      Array.isArray(raw.registers?.deliverables) && raw.registers.deliverables.length > 0
        ? raw.registers.deliverables
        : legacyDeliverables,
    benefits: Array.isArray(raw.registers?.benefits) ? raw.registers.benefits : [],
    changeRequests: Array.isArray(raw.registers?.changeRequests)
      ? raw.registers.changeRequests
      : [],
  }

  return syncLegacyAliases({
    ...base,
    id: raw.id || base.id,
    clientName: raw.clientName ?? '',
    engagementName: raw.engagementName ?? '',
    currentStageId: CONSULTING_STAGES.some((stage) => stage.id === raw.currentStageId)
      ? raw.currentStageId
      : 'stage-0',
    situationId: raw.situationId ?? null,
    scopeIn: raw.scopeIn ?? '',
    scopeOut: raw.scopeOut ?? '',
    stakeholders: Array.isArray(raw.stakeholders) ? raw.stakeholders : [],
    raci: Array.isArray(raw.raci) ? raw.raci : [],
    stageProgress,
    health: { ...createEmptyHealth(), ...(raw.health ?? {}) },
    registers,
    workshopsByStage: raw.workshopsByStage ?? {},
    sharedUseCase: { ...EMPTY_USE_CASE, ...(raw.sharedUseCase ?? {}) },
    governance: { ...createEmptyGovernance(), ...(raw.governance ?? {}) },
    architecture: { ...createEmptyArchitecture(), ...(raw.architecture ?? {}) },
    service: { ...createEmptyService(), ...(raw.service ?? {}) },
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  })
}

export function loadEngagementFromLegacyKey(): EngagementState {
  try {
    const raw = localStorage.getItem(ENGAGEMENT_STORAGE_KEY)
    if (!raw) return createEmptyEngagement()
    return normalizeEngagementState(JSON.parse(raw) as EngagementState)
  } catch {
    return createEmptyEngagement()
  }
}

export function saveEngagementToLegacyKey(state: EngagementState): EngagementState {
  const next = syncLegacyAliases({
    ...normalizeEngagementState(state),
    updatedAt: new Date().toISOString(),
  })
  localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearEngagementLegacyKey(): void {
  localStorage.removeItem(ENGAGEMENT_STORAGE_KEY)
}

export function isGatePassed(stage: ConsultingStage, progress: StageProgress): boolean {
  if (stage.gateCriteria.length === 0) {
    return (
      progress.status === STAGE_STATUS.APPROVED || progress.status === STAGE_STATUS.CLOSED
    )
  }
  return stage.gateCriteria.every((criterion) => progress.checkedCriteria.includes(criterion))
}

export function getIncompleteGateReasons(
  state: EngagementState,
  targetStageId: string,
): string[] {
  const targetIndex = CONSULTING_STAGES.findIndex((stage) => stage.id === targetStageId)
  if (targetIndex <= 0) return []
  const reasons: string[] = []
  for (let index = 0; index < targetIndex; index += 1) {
    const stage = CONSULTING_STAGES[index]
    const progress = state.stageProgress[stage.id] ?? createDefaultStageProgress()
    if (!isGatePassed(stage, progress)) {
      reasons.push(`${stage.shortLabel}: ${stage.gate} incomplete`)
    }
  }
  return reasons
}

export function advanceStageWithOverride(
  state: EngagementState,
  targetStageId: string,
  overrideReason: string,
): EngagementState {
  const reasons = getIncompleteGateReasons(state, targetStageId)
  let next = {
    ...state,
    currentStageId: targetStageId,
  }
  next = setStageStatus(next, targetStageId, STAGE_STATUS.IN_PROGRESS)
  if (reasons.length > 0 && overrideReason.trim()) {
    next = addEngagementDecision(next, {
      text: `Gate override to ${targetStageId}`,
      context: reasons.join('; '),
      options: 'Stay / Override',
      criteria: 'Engagement manager judgment',
      recommendation: 'Override with documented rationale',
      risks: 'Skipping incomplete gates may create downstream rework',
      owner: 'Engagement manager',
      date: new Date().toISOString().slice(0, 10),
      approvalEvidence: overrideReason.trim(),
      linkedWorkstreams: targetStageId,
      status: REGISTER_ITEM_STATUS.APPROVED,
      stageId: state.currentStageId,
    })
  }
  return next
}

export function toggleGateCriterion(
  state: EngagementState,
  stageId: string,
  criterion: string,
): EngagementState {
  const stage = CONSULTING_STAGES.find((item) => item.id === stageId)
  if (!stage || !stage.gateCriteria.includes(criterion)) {
    return state
  }
  const progress = state.stageProgress[stageId] ?? createDefaultStageProgress()
  const checked = new Set(progress.checkedCriteria)
  if (checked.has(criterion)) {
    checked.delete(criterion)
  } else {
    checked.add(criterion)
  }
  const checkedCriteria = stage.gateCriteria.filter((item) => checked.has(item))
  const nextStatus =
    checkedCriteria.length === stage.gateCriteria.length
      ? STAGE_STATUS.APPROVED
      : progress.status === STAGE_STATUS.NOT_STARTED
        ? STAGE_STATUS.IN_PROGRESS
        : progress.status === STAGE_STATUS.APPROVED
          ? STAGE_STATUS.IN_PROGRESS
          : progress.status

  return {
    ...state,
    stageProgress: {
      ...state.stageProgress,
      [stageId]: {
        ...progress,
        checkedCriteria,
        status: nextStatus,
      },
    },
  }
}

export function setStageStatus(
  state: EngagementState,
  stageId: string,
  status: StageStatus,
): EngagementState {
  const stage = CONSULTING_STAGES.find((item) => item.id === stageId)
  if (!stage) return state
  const progress = state.stageProgress[stageId] ?? createDefaultStageProgress()
  return {
    ...state,
    currentStageId:
      status === STAGE_STATUS.IN_PROGRESS || status === STAGE_STATUS.INTERNAL_REVIEW
        ? stageId
        : state.currentStageId,
    stageProgress: {
      ...state.stageProgress,
      [stageId]: { ...progress, status },
    },
  }
}

export function computeEngagementHealth(state: EngagementState): RagStatus {
  const risks = state.registers.risks.length > 0 ? state.registers.risks : state.risks
  const hasCritical = risks.some((risk) => risk.severity === RISK_SEVERITY.CRITICAL)
  if (hasCritical) return RAG_STATUS.RED

  const blockedCount = CONSULTING_STAGES.filter(
    (stage) => state.stageProgress[stage.id]?.status === STAGE_STATUS.BLOCKED,
  ).length
  if (blockedCount > 0) return RAG_STATUS.RED

  if (
    state.health.schedule === RAG_STATUS.RED ||
    state.health.budget === RAG_STATUS.RED ||
    state.health.scope === RAG_STATUS.RED
  ) {
    return RAG_STATUS.RED
  }

  const hasHigh = risks.some((risk) => risk.severity === RISK_SEVERITY.HIGH)
  const inReview = CONSULTING_STAGES.some((stage) => {
    const status = state.stageProgress[stage.id]?.status
    return status === STAGE_STATUS.CLIENT_REVIEW || status === STAGE_STATUS.INTERNAL_REVIEW
  })
  if (
    hasHigh ||
    inReview ||
    state.health.schedule === RAG_STATUS.AMBER ||
    state.health.budget === RAG_STATUS.AMBER
  ) {
    return RAG_STATUS.AMBER
  }

  return RAG_STATUS.GREEN
}

export function countApprovedStages(state: EngagementState): number {
  return CONSULTING_STAGES.filter((stage) => {
    const status = state.stageProgress[stage.id]?.status
    return status === STAGE_STATUS.APPROVED || status === STAGE_STATUS.CLOSED
  }).length
}

export function findNextOpenStage(state: EngagementState): ConsultingStage {
  for (const stage of CONSULTING_STAGES) {
    const progress = state.stageProgress[stage.id]
    const status = progress?.status ?? STAGE_STATUS.NOT_STARTED
    if (status !== STAGE_STATUS.APPROVED && status !== STAGE_STATUS.CLOSED) {
      return stage
    }
  }
  return CONSULTING_STAGES[CONSULTING_STAGES.length - 1]
}

export function findNextStageAfter(stageId: string): ConsultingStage {
  const index = CONSULTING_STAGES.findIndex((item) => item.id === stageId)
  if (index < 0 || index >= CONSULTING_STAGES.length - 1) {
    return CONSULTING_STAGES[CONSULTING_STAGES.length - 1]
  }
  return CONSULTING_STAGES[index + 1]
}

export function buildNextStepGuidance(
  state: EngagementState,
  workshop: WorkshopSession | null = null,
): NextStepGuidance {
  const stage =
    CONSULTING_STAGES.find((item) => item.id === state.currentStageId) ??
    findNextOpenStage(state)
  const progress = state.stageProgress[stage.id] ?? createDefaultStageProgress()
  const gateDone = isGatePassed(stage, progress)
  const sequentialNext = findNextStageAfter(stage.id)
  const frameworks = stage.frameworks.slice(0, 4)
  const unfinishedCriteria = stage.gateCriteria.filter(
    (criterion) => !progress.checkedCriteria.includes(criterion),
  )
  const activeWorkshop =
    workshop ?? state.workshopsByStage[stage.id] ?? Object.values(state.workshopsByStage)[0] ?? null

  let whatNext = `Run the workshop for ${stage.shortLabel} and capture decisions.`
  let recommendedStageId = stage.id

  if (!state.clientName.trim() || !state.engagementName.trim()) {
    whatNext = 'Name the client and engagement in Control, then start Stage 0 Qualify.'
  } else if (progress.status === STAGE_STATUS.BLOCKED) {
    whatNext = `Unblock ${stage.shortLabel}: resolve risks and reopen the stage.`
  } else if (!gateDone && unfinishedCriteria.length > 0) {
    whatNext = `Complete gate evidence for ${stage.gate}: ${unfinishedCriteria[0]}.`
  } else if (gateDone && sequentialNext.id !== stage.id) {
    whatNext = `Gate passed. Advance to ${sequentialNext.number}. ${sequentialNext.shortLabel} — ${sequentialNext.title}.`
    recommendedStageId = sequentialNext.id
  } else if (activeWorkshop && Object.keys(activeWorkshop.frameworkOutputs).length === 0) {
    whatNext = `Open Workshop Studio and run ${frameworks[0] ?? 'a recommended framework'} against the use case.`
  } else if (gateDone) {
    whatNext = `Stage ${stage.shortLabel} gate is complete. Review deliverables or close the engagement.`
  }

  const evidence =
    unfinishedCriteria.length > 0
      ? unfinishedCriteria.slice(0, 3).join('; ')
      : stage.deliverables.slice(0, 3).join('; ')

  return {
    whereAreWe: `Stage ${stage.number} · ${stage.shortLabel}: ${stage.title} (${STAGE_STATUS_LABELS[progress.status]})`,
    whatNext,
    whichFramework: frameworks.join(' → ') || 'Open Framework Lab for stage recommendations',
    whatEvidence: evidence || stage.gate,
    recommendedStageId,
    recommendedFrameworks: frameworks,
  }
}

export function addEngagementRisk(
  state: EngagementState,
  input: Omit<EngagementRisk, 'id' | 'status'> & { status?: RegisterItemStatus },
): EngagementState {
  const risk: EngagementRisk = {
    ...input,
    id: createRegisterId('risk'),
    status: input.status ?? REGISTER_ITEM_STATUS.OPEN,
  }
  const next = {
    ...state,
    registers: {
      ...state.registers,
      risks: [...state.registers.risks, risk],
    },
  }
  return syncLegacyAliases(next)
}

export function removeEngagementRisk(state: EngagementState, riskId: string): EngagementState {
  const next = {
    ...state,
    registers: {
      ...state.registers,
      risks: state.registers.risks.filter((risk) => risk.id !== riskId),
    },
  }
  return syncLegacyAliases(next)
}

export function addEngagementDeliverable(
  state: EngagementState,
  input: Omit<EngagementDeliverableItem, 'id'>,
): EngagementState {
  const item: EngagementDeliverableItem = {
    ...input,
    id: createRegisterId('deliv'),
  }
  const next = {
    ...state,
    registers: {
      ...state.registers,
      deliverables: [...state.registers.deliverables, item],
    },
  }
  return syncLegacyAliases(next)
}

export function writeBackDeliverable(
  state: EngagementState,
  title: string,
  stageId: string,
  status: DeliverableStatus = DELIVERABLE_STATUS.DRAFT,
): EngagementState {
  const existing = state.registers.deliverables.find(
    (item) => item.title.toLowerCase() === title.toLowerCase(),
  )
  if (existing) {
    const next = {
      ...state,
      registers: {
        ...state.registers,
        deliverables: state.registers.deliverables.map((item) =>
          item.id === existing.id ? { ...item, status, stageId } : item,
        ),
      },
    }
    return syncLegacyAliases(next)
  }
  return addEngagementDeliverable(state, { title, stageId, status })
}

export function syncDeliverablesFromStage(
  state: EngagementState,
  stageId: string,
): EngagementState {
  const stage = CONSULTING_STAGES.find((item) => item.id === stageId)
  if (!stage) return state
  const existingTitles = new Set(
    state.registers.deliverables.map((item) => item.title.toLowerCase()),
  )
  const additions: EngagementDeliverableItem[] = []
  for (const title of stage.deliverables) {
    if (existingTitles.has(title.toLowerCase())) continue
    additions.push({
      id: createRegisterId('deliv'),
      title,
      stageId,
      status: DELIVERABLE_STATUS.DRAFT,
    })
  }
  if (additions.length === 0) return state
  return syncLegacyAliases({
    ...state,
    registers: {
      ...state.registers,
      deliverables: [...state.registers.deliverables, ...additions],
    },
  })
}

export function addEngagementAction(
  state: EngagementState,
  input: Omit<EngagementActionItem, 'id'>,
): EngagementState {
  return {
    ...state,
    registers: {
      ...state.registers,
      actions: [...state.registers.actions, { ...input, id: createRegisterId('action') }],
    },
  }
}

export function addEngagementDecision(
  state: EngagementState,
  input: Omit<EngagementDecisionItem, 'id'>,
): EngagementState {
  return {
    ...state,
    registers: {
      ...state.registers,
      decisions: [
        ...state.registers.decisions,
        { ...input, id: createRegisterId('decision') },
      ],
    },
  }
}

export function addRegisterTextItem(
  state: EngagementState,
  key: 'assumptions' | 'issues' | 'dependencies' | 'changeRequests',
  input: {
    text: string
    owner: string
    status: RegisterItemStatus
    stageId: string
  },
): EngagementState {
  return {
    ...state,
    registers: {
      ...state.registers,
      [key]: [
        ...state.registers[key],
        { ...input, id: createRegisterId(key.slice(0, 5)) },
      ],
    },
  }
}

export function addEngagementBenefit(
  state: EngagementState,
  input: Omit<EngagementBenefitItem, 'id'>,
): EngagementState {
  return {
    ...state,
    registers: {
      ...state.registers,
      benefits: [...state.registers.benefits, { ...input, id: createRegisterId('benefit') }],
    },
  }
}

export function addStakeholder(
  state: EngagementState,
  input: Omit<EngagementStakeholder, 'id'>,
): EngagementState {
  return {
    ...state,
    stakeholders: [...state.stakeholders, { ...input, id: createRegisterId('stake') }],
  }
}

export function removeStakeholder(state: EngagementState, stakeholderId: string): EngagementState {
  return {
    ...state,
    stakeholders: state.stakeholders.filter((item) => item.id !== stakeholderId),
  }
}

export function addRaciRow(
  state: EngagementState,
  input: Omit<EngagementRaciRow, 'id'>,
): EngagementState {
  return {
    ...state,
    raci: [...state.raci, { ...input, id: createRegisterId('raci') }],
  }
}

export function removeRaciRow(state: EngagementState, rowId: string): EngagementState {
  return {
    ...state,
    raci: state.raci.filter((item) => item.id !== rowId),
  }
}

export function syncWorkshopIntoRegisters(
  state: EngagementState,
  workshop: WorkshopSession,
): EngagementState {
  let next = { ...state }
  for (const action of workshop.actions) {
    const exists = next.registers.actions.some(
      (item) => item.text === action.text && item.owner === action.owner,
    )
    if (!exists) {
      next = addEngagementAction(next, {
        text: action.text,
        owner: action.owner,
        due: action.due,
        status: REGISTER_ITEM_STATUS.OPEN,
        stageId: workshop.stageId,
      })
    }
  }
  for (const decision of workshop.decisions) {
    const exists = next.registers.decisions.some((item) => item.text === decision.text)
    if (!exists) {
      next = addEngagementDecision(next, {
        text: decision.text,
        context: '',
        options: '',
        criteria: '',
        recommendation: decision.text,
        risks: '',
        owner: decision.owner,
        date: decision.date,
        approvalEvidence: '',
        linkedWorkstreams: workshop.stageId,
        status: REGISTER_ITEM_STATUS.OPEN,
        stageId: workshop.stageId,
      })
    }
  }
  return next
}

export function collectWorkshopRegisters(workshop: WorkshopSession | null): {
  actions: WorkshopAction[]
  decisions: WorkshopDecision[]
} {
  if (!workshop) {
    return { actions: [], decisions: [] }
  }
  return {
    actions: workshop.actions,
    decisions: workshop.decisions,
  }
}

export function updateHealthField(
  state: EngagementState,
  field: keyof Omit<EngagementHealthFields, 'deliverableCompletion'>,
  value: RagStatus,
): EngagementState {
  return {
    ...state,
    health: {
      ...state.health,
      [field]: value,
    },
  }
}

export { createRegisterId } from './workshop.logic'

export {
  clearEngagement,
  loadEngagement,
  saveEngagement,
} from './engagement.storage'
