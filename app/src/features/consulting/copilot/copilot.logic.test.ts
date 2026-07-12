import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyEngagement, addEngagementRisk, RISK_SEVERITY } from '../engagement.logic'
import { buildCopilotReport, COPILOT_DISCLAIMER } from './copilot.logic'

describe('copilot.logic', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('flags missing names and scope', () => {
    const report = buildCopilotReport(createEmptyEngagement())
    expect(report.disclaimer).toBe(COPILOT_DISCLAIMER)
    expect(report.findings.some((item) => item.id === 'names')).toBe(true)
    expect(report.findings.some((item) => item.id === 'scope')).toBe(true)
  })

  it('flags risks without owners', () => {
    let engagement = createEmptyEngagement()
    engagement.clientName = 'Contoso'
    engagement.engagementName = 'AI'
    engagement.scopeIn = 'Customer service'
    engagement = addEngagementRisk(engagement, {
      text: 'Data quality',
      owner: '',
      severity: RISK_SEVERITY.HIGH,
      stageId: 'stage-0',
    })
    const report = buildCopilotReport(engagement)
    expect(report.findings.some((item) => item.id === 'risk-owners')).toBe(true)
  })

  it('suggests stage-aligned deliverable', () => {
    const engagement = createEmptyEngagement()
    engagement.currentStageId = 'stage-4'
    const report = buildCopilotReport(engagement)
    expect(report.suggestedDeliverableId).toBe('maturity-report')
  })
})
