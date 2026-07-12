import { beforeEach, describe, expect, it } from 'vitest'
import { CONSULTING_STAGES } from '../../data/consultingOs'
import {
  ENGAGEMENT_STORAGE_KEY,
  RAG_STATUS,
  RISK_SEVERITY,
  STAGE_STATUS,
  addEngagementDeliverable,
  addEngagementRisk,
  buildNextStepGuidance,
  clearEngagement,
  computeEngagementHealth,
  countApprovedStages,
  createEmptyEngagement,
  findNextOpenStage,
  isGatePassed,
  loadEngagement,
  removeEngagementRisk,
  saveEngagement,
  setStageStatus,
  syncDeliverablesFromStage,
  toggleGateCriterion,
} from './engagement.logic'
import { createEmptyWorkshop, loadWorkshop, saveWorkshop } from './workshop.logic'

describe('engagement.logic', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates empty engagement with all stages not started', () => {
    const engagement = createEmptyEngagement()
    expect(engagement.currentStageId).toBe('stage-0')
    expect(Object.keys(engagement.stageProgress)).toHaveLength(CONSULTING_STAGES.length)
    expect(engagement.stageProgress['stage-0'].status).toBe(STAGE_STATUS.NOT_STARTED)
  })

  it('persists and reloads engagement state', () => {
    const created = createEmptyEngagement()
    created.clientName = 'Contoso'
    created.engagementName = 'GenAI CS'
    saveEngagement(created)
    const loaded = loadEngagement()
    expect(loaded.clientName).toBe('Contoso')
    expect(loaded.engagementName).toBe('GenAI CS')
  })

  it('returns empty engagement when storage is corrupt', () => {
    localStorage.setItem(ENGAGEMENT_STORAGE_KEY, '{not-json')
    const loaded = loadEngagement()
    expect(loaded.clientName === '' || loaded.clientName === 'Migrated client').toBe(true)
  })

  it('toggles gate criteria and auto-approves when complete', () => {
    const stage = CONSULTING_STAGES[0]
    let state = createEmptyEngagement()
    for (const criterion of stage.gateCriteria) {
      state = toggleGateCriterion(state, stage.id, criterion)
    }
    expect(isGatePassed(stage, state.stageProgress[stage.id])).toBe(true)
    expect(state.stageProgress[stage.id].status).toBe(STAGE_STATUS.APPROVED)

    state = toggleGateCriterion(state, stage.id, stage.gateCriteria[0])
    expect(isGatePassed(stage, state.stageProgress[stage.id])).toBe(false)
    expect(state.stageProgress[stage.id].status).toBe(STAGE_STATUS.IN_PROGRESS)
  })

  it('ignores unknown gate criteria and stages', () => {
    const state = createEmptyEngagement()
    expect(toggleGateCriterion(state, 'stage-0', 'not a real criterion')).toBe(state)
    expect(toggleGateCriterion(state, 'missing', 'x')).toBe(state)
    expect(setStageStatus(state, 'missing', STAGE_STATUS.BLOCKED)).toBe(state)
  })

  it('computes RAG health from risks and blocked stages', () => {
    let state = createEmptyEngagement()
    expect(computeEngagementHealth(state)).toBe(RAG_STATUS.GREEN)

    state = addEngagementRisk(state, {
      text: 'High risk item',
      owner: 'Alex',
      severity: RISK_SEVERITY.HIGH,
      stageId: 'stage-0',
    })
    expect(computeEngagementHealth(state)).toBe(RAG_STATUS.AMBER)

    state = addEngagementRisk(state, {
      text: 'Critical',
      owner: 'Alex',
      severity: RISK_SEVERITY.CRITICAL,
      stageId: 'stage-0',
    })
    expect(computeEngagementHealth(state)).toBe(RAG_STATUS.RED)

    state = removeEngagementRisk(state, state.risks[1].id)
    state = removeEngagementRisk(state, state.risks[0].id)
    state = setStageStatus(state, 'stage-1', STAGE_STATUS.BLOCKED)
    expect(computeEngagementHealth(state)).toBe(RAG_STATUS.RED)
  })

  it('finds next open stage and builds guidance', () => {
    let state = createEmptyEngagement()
    expect(findNextOpenStage(state).id).toBe('stage-0')

    state = {
      ...state,
      clientName: '',
      engagementName: '',
    }
    let guidance = buildNextStepGuidance(state, null)
    expect(guidance.whatNext).toContain('Name the client')

    state = {
      ...state,
      clientName: 'Contoso',
      engagementName: 'Programme',
      currentStageId: 'stage-0',
    }
    guidance = buildNextStepGuidance(state, null)
    expect(guidance.whereAreWe).toContain('Qualify')
    expect(guidance.recommendedFrameworks.length).toBeGreaterThan(0)

    const stage = CONSULTING_STAGES[0]
    for (const criterion of stage.gateCriteria) {
      state = toggleGateCriterion(state, stage.id, criterion)
    }
    guidance = buildNextStepGuidance(state, null)
    expect(guidance.whatNext).toContain('Advance to')
    expect(guidance.recommendedStageId).toBe('stage-1')
  })

  it('syncs deliverables from a stage without duplicating', () => {
    let state = createEmptyEngagement()
    state = syncDeliverablesFromStage(state, 'stage-0')
    const firstCount = state.deliverables.length
    expect(firstCount).toBe(CONSULTING_STAGES[0].deliverables.length)

    state = syncDeliverablesFromStage(state, 'stage-0')
    expect(state.deliverables.length).toBe(firstCount)

    state = addEngagementDeliverable(state, {
      title: 'Custom pack',
      stageId: 'stage-0',
      status: 'draft',
    })
    expect(state.deliverables.some((item) => item.title === 'Custom pack')).toBe(true)
  })

  it('counts approved stages and clears storage', () => {
    let state = createEmptyEngagement()
    state = setStageStatus(state, 'stage-0', STAGE_STATUS.APPROVED)
    state = setStageStatus(state, 'stage-1', STAGE_STATUS.CLOSED)
    saveEngagement(state)
    expect(countApprovedStages(loadEngagement())).toBe(2)
    clearEngagement()
    expect(loadEngagement().clientName).toBe('')
  })

  it('guides toward frameworks when workshop has no outputs', () => {
    const workshop = saveWorkshop(createEmptyWorkshop('stage-5'))
    const base = createEmptyEngagement()
    const state = {
      ...base,
      clientName: 'Contoso',
      engagementName: 'Programme',
      currentStageId: 'stage-5',
      stageProgress: {
        ...base.stageProgress,
        'stage-5': {
          status: STAGE_STATUS.IN_PROGRESS,
          checkedCriteria: [] as string[],
          notes: '',
        },
      },
    }
    const guidance = buildNextStepGuidance(state, workshop)
    expect(guidance.whatNext.toLowerCase()).toMatch(/framework|gate evidence|workshop/)
    expect(loadWorkshop('stage-5')).toBeTruthy()
  })
})
