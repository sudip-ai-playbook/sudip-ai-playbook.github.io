import { describe, expect, it } from 'vitest'
import {
  REGISTER_ITEM_STATUS,
  STAGE_STATUS,
  advanceStageWithOverride,
  createEmptyEngagement,
  getIncompleteGateReasons,
  writeBackDeliverable,
  DELIVERABLE_STATUS,
} from './engagement.logic'

describe('engagement gates and write-back', () => {
  it('reports incomplete prior gates', () => {
    const state = createEmptyEngagement()
    const reasons = getIncompleteGateReasons(state, 'stage-2')
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('logs override decisions when advancing past incomplete gates', () => {
    const state = createEmptyEngagement()
    const next = advanceStageWithOverride(state, 'stage-2', 'Client urgency')
    expect(next.currentStageId).toBe('stage-2')
    expect(next.registers.decisions.some((item) => item.approvalEvidence === 'Client urgency')).toBe(
      true,
    )
    expect(next.stageProgress['stage-2'].status).toBe(STAGE_STATUS.IN_PROGRESS)
  })

  it('writes deliverables back into the register', () => {
    let state = createEmptyEngagement()
    state = writeBackDeliverable(state, 'AI maturity assessment summary', 'stage-4')
    expect(state.registers.deliverables[0]?.status).toBe(DELIVERABLE_STATUS.DRAFT)
    state = writeBackDeliverable(
      state,
      'AI maturity assessment summary',
      'stage-4',
      DELIVERABLE_STATUS.IN_REVIEW,
    )
    expect(state.registers.deliverables).toHaveLength(1)
    expect(state.registers.deliverables[0]?.status).toBe(DELIVERABLE_STATUS.IN_REVIEW)
    expect(REGISTER_ITEM_STATUS.OPEN).toBe('open')
  })
})
