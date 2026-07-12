import type { EngagementState } from '../engagement.logic'

export function buildServiceReportMarkdown(engagement: EngagementState): string {
  const service = engagement.service
  return [
    `# Monthly service report — ${engagement.engagementName || 'Engagement'}`,
    '',
    `Client: ${engagement.clientName || 'TBD'}`,
    '',
    '## Catalogue',
    service.catalogueEntry || 'Not defined',
    '',
    '## Availability target',
    service.availabilityTarget || 'TBD',
    '',
    '## AI quality targets',
    service.aiQualityTargets || 'TBD',
    '',
    '## Incidents',
    ...(service.incidents.length === 0
      ? ['- None']
      : service.incidents.map((item) => `- [${item.priority}] ${item.title} (${item.status})`)),
    '',
    '## Problems',
    ...(service.problems.length === 0
      ? ['- None']
      : service.problems.map((item) => `- ${item.title} (${item.status})`)),
    '',
    '## Changes',
    ...(service.changes.length === 0
      ? ['- None']
      : service.changes.map((item) => `- ${item.title} (${item.status})`)),
  ].join('\n')
}
