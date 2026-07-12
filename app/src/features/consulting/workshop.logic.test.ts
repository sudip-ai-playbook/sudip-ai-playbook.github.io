import { beforeEach, describe, expect, it } from 'vitest'
import {
  WORKSHOP_STORAGE_KEY,
  clearWorkshop,
  computeRiceScore,
  createEmptyWorkshop,
  isUseCaseReady,
  loadWorkshop,
  saveWorkshop,
  seedCanvasFieldsFromUseCase,
  startWorkshopForStage,
  validateCanvasFields,
} from './workshop.logic'

describe('workshop.logic', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a workshop with agenda and empty use case', () => {
    const session = createEmptyWorkshop('stage-5')
    expect(session.stageId).toBe('stage-5')
    expect(session.agenda.length).toBeGreaterThan(0)
    expect(session.useCase.name).toBe('')
    expect(isUseCaseReady(session.useCase)).toBe(false)
  })

  it('seeds canvas fields from the use case card', () => {
    const seeded = seedCanvasFieldsFromUseCase('fiveWhys', {
      name: 'Claims copilot',
      businessProblem: 'Handlers spend too long finding policy clauses',
      targetUsers: 'Claims handlers',
      currentProcess: 'Manual policy lookup',
      desiredOutcome: 'Faster grounded answers',
      dataAvailable: 'Policy PDFs',
      constraints: 'EU residency',
      baselineKpi: '12 min AHT',
      owner: 'Ops lead',
    })
    expect(seeded.problem).toContain('Handlers spend too long')
  })

  it('persists use case with workshop sessions', () => {
    const created = startWorkshopForStage('stage-3')
    created.useCase = {
      ...created.useCase,
      name: 'Service triage',
      businessProblem: 'High escalation volume in tier-1 support',
    }
    saveWorkshop(created)
    const loaded = loadWorkshop()
    expect(loaded?.useCase.name).toBe('Service triage')
    expect(isUseCaseReady(loaded!.useCase)).toBe(true)
    expect(localStorage.getItem(WORKSHOP_STORAGE_KEY)).toBeTruthy()
  })

  it('clears invalid stage sessions', () => {
    localStorage.setItem(
      WORKSHOP_STORAGE_KEY,
      JSON.stringify({ stageId: 'stage-missing', frameworkOutputs: {} }),
    )
    expect(loadWorkshop()).toBeNull()
  })

  it('validates required canvas fields with labels', () => {
    expect(
      validateCanvasFields({ problem: '' }, ['problem'], { problem: 'Problem statement' }),
    ).toContain('Problem statement')
    expect(validateCanvasFields({ problem: 'Cost rising' }, ['problem'])).toBeNull()
  })

  it('computes RICE scores and rejects invalid inputs', () => {
    expect(
      computeRiceScore({
        reach: '1000',
        impact: '2',
        confidence: '80',
        effort: '4',
      }),
    ).toBe(400)
    expect(computeRiceScore({ reach: '0', impact: '1', confidence: '50', effort: '1' })).toBeNull()
  })

  it('clears workshop storage', () => {
    startWorkshopForStage('stage-1')
    clearWorkshop()
    expect(loadWorkshop()).toBeNull()
  })
})
