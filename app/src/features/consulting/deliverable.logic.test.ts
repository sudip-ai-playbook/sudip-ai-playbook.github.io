import { beforeEach, describe, expect, it } from 'vitest'
import {
  DELIVERABLE_TEMPLATES,
  generateDeliverable,
  templatesForStage,
} from './deliverable.logic'
import {
  createEmptyEngagement,
  saveEngagement,
  syncDeliverablesFromStage,
  toggleGateCriterion,
} from './engagement.logic'
import { CONSULTING_STAGES } from '../../data/consultingOs'
import {
  createEmptyWorkshop,
  saveWorkshop,
  type WorkshopSession,
} from './workshop.logic'

describe('deliverable.logic', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('lists templates for a stage including executive pack', () => {
    const forQualify = templatesForStage('stage-0')
    expect(forQualify.some((item) => item.id === 'opportunity-brief')).toBe(true)
    expect(forQualify.some((item) => item.id === 'executive-pack')).toBe(true)
  })

  it('generates opportunity brief with warnings when empty', () => {
    const engagement = createEmptyEngagement()
    const draft = generateDeliverable('opportunity-brief', engagement, null)
    expect(draft.title).toContain('opportunity')
    expect(draft.markdown).toContain('Opportunity summary')
    expect(draft.html).toContain('<h1>')
    expect(draft.warnings.length).toBeGreaterThan(0)
  })

  it('generates enriched executive pack from workshop and engagement', () => {
    let engagement = createEmptyEngagement()
    engagement = {
      ...engagement,
      clientName: 'Contoso Retail',
      engagementName: 'Support Copilot',
      currentStageId: 'stage-5',
    }
    engagement = syncDeliverablesFromStage(engagement, 'stage-5')
    for (const criterion of CONSULTING_STAGES[5].gateCriteria) {
      engagement = toggleGateCriterion(engagement, 'stage-5', criterion)
    }
    saveEngagement(engagement)

    const workshop: WorkshopSession = {
      ...createEmptyWorkshop('stage-5'),
      useCase: {
        name: 'Support Copilot',
        businessProblem: 'Customer service costs are rising',
        targetUsers: 'Agents',
        currentProcess: 'Manual triage',
        desiredOutcome: 'Faster resolution',
        dataAvailable: 'Tickets',
        constraints: 'PII',
        baselineKpi: 'AHT 12m',
        owner: 'Ops lead',
      },
      decisions: [
        {
          id: 'd1',
          text: 'Proceed to prototype',
          owner: 'Sponsor',
          date: '2026-07-12',
        },
      ],
      actions: [
        {
          id: 'a1',
          text: 'Collect evaluation set',
          owner: 'Data',
          due: '2026-07-20',
        },
      ],
      frameworkOutputs: {
        'five-whys': {
          frameworkId: 'five-whys',
          canvasType: 'fiveWhys',
          title: 'Five Whys',
          fields: {
            problem: 'Costs rising',
            why1: 'High AHT',
            rootCause: 'Poor knowledge findability',
          },
          savedAt: '2026-07-12T10:00:00.000Z',
        },
      },
    }
    saveWorkshop(workshop)

    const draft = generateDeliverable('executive-pack', engagement, workshop)
    expect(draft.warnings).toHaveLength(0)
    expect(draft.markdown).toContain('Contoso Retail')
    expect(draft.markdown).toContain('Support Copilot')
    expect(draft.markdown).toContain('Proceed to prototype')
    expect(draft.markdown).toContain('Five Whys')
    expect(draft.html).toContain('Contoso Retail')
  })

  it('covers each template id without throwing', () => {
    const engagement = {
      ...createEmptyEngagement(),
      clientName: 'Acme',
      engagementName: 'AI Programme',
    }
    const workshop = createEmptyWorkshop('stage-1')
    for (const template of DELIVERABLE_TEMPLATES) {
      const draft = generateDeliverable(template.id, engagement, workshop)
      expect(draft.markdown.length).toBeGreaterThan(40)
      expect(draft.html).toContain('<html')
    }
  })
})
