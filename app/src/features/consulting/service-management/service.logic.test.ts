import { describe, expect, it } from 'vitest'
import { createEmptyEngagement } from '../engagement.logic'
import { buildServiceReportMarkdown } from './service.logic'

describe('service.logic', () => {
  it('builds a markdown service report', () => {
    const engagement = createEmptyEngagement()
    engagement.clientName = 'Contoso'
    engagement.engagementName = 'Support'
    engagement.service.catalogueEntry = 'Customer support copilot'
    engagement.service.incidents.push({
      id: 'inc-1',
      title: 'Latency spike',
      priority: 'P2',
      status: 'open',
    })
    const markdown = buildServiceReportMarkdown(engagement)
    expect(markdown).toContain('Contoso')
    expect(markdown).toContain('Latency spike')
    expect(markdown).toContain('Customer support copilot')
  })
})
