import { describe, expect, it } from 'vitest'
import { EMPTY_PROJECT } from './project.logic'
import {
  getJourneyProgress,
  getJourneyStepAccess,
  isJourneyStepNavigable,
} from './journey.gates'

describe('journey.gates', () => {
  it('locks architecture steps until the outcome is framed', () => {
    const access = getJourneyStepAccess('map', EMPTY_PROJECT)
    expect(access.status).toBe('locked')
    expect(access.unlockPath).toBe('/frame')
    expect(isJourneyStepNavigable('map', EMPTY_PROJECT)).toBe(false)
    expect(isJourneyStepNavigable('frame', EMPTY_PROJECT)).toBe(true)
  })

  it('opens later steps after framing and flags incomplete summary', () => {
    const framed = {
      ...EMPTY_PROJECT,
      outcome: 'Grounded GenAI assistant for claims handlers',
    }
    expect(getJourneyStepAccess('map', framed).status).toBe('open')
    expect(getJourneyStepAccess('summary', framed).status).toBe('incomplete')
    expect(getJourneyStepAccess('decide', framed).status).toBe('incomplete')
  })

  it('reports progress toward a complete journey', () => {
    const progress = getJourneyProgress({
      ...EMPTY_PROJECT,
      outcome: 'Grounded GenAI assistant for claims handlers',
      selectedLayer: '07 AI',
    })
    expect(progress.completedCount).toBeGreaterThanOrEqual(2)
    expect(progress.totalCount).toBe(8)
    expect(progress.nextOpenPath).toBe('/picks')
  })
})
