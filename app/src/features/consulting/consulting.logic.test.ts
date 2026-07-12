import { describe, expect, it } from 'vitest'
import { CONSULTING_STAGES } from '../../data/consultingOs'
import {
  FILTER_ALL,
  buildConsultingFileStem,
  filterStagesById,
  filterStagesBySituation,
  resolveConsultingStages,
  searchStages,
} from './consulting.logic'

describe('consulting.logic', () => {
  it('returns all stages when filter is all', () => {
    expect(filterStagesById(CONSULTING_STAGES, FILTER_ALL)).toHaveLength(CONSULTING_STAGES.length)
  })

  it('filters to a single stage', () => {
    const result = filterStagesById(CONSULTING_STAGES, 'stage-5')
    expect(result).toHaveLength(1)
    expect(result[0]?.title).toContain('Opportunity Identification')
  })

  it('filters stages by business situation', () => {
    const result = filterStagesBySituation(CONSULTING_STAGES, 'prioritise-use-cases')
    expect(result.map((stage) => stage.id)).toEqual(['stage-6'])
  })

  it('returns all stages for unknown situation', () => {
    expect(filterStagesBySituation(CONSULTING_STAGES, 'missing')).toHaveLength(
      CONSULTING_STAGES.length,
    )
  })

  it('combines situation and stage filters', () => {
    const result = resolveConsultingStages({
      situationId: 'underperforming-process',
      stageFilter: 'stage-5',
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('stage-5')
  })

  it('searches across frameworks and deliverables', () => {
    const result = searchStages(CONSULTING_STAGES, 'ADKAR')
    expect(result.some((stage) => stage.id === 'stage-13')).toBe(true)
  })

  it('builds a descriptive file stem', () => {
    expect(
      buildConsultingFileStem({ stageFilter: 'stage-4', situationId: 'ai-maturity' }),
    ).toBe('consultai-os-playbook-ai-maturity-stage-4')
  })
})
