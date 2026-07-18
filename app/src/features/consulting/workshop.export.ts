import { CONSULTING_STAGES } from '../../data/consultingOs'
import type { WorkshopSession } from './workshop.logic'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function cell(value: string): string {
  return `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`
}

function row(values: string[]): string {
  return `<Row>${values.map(cell).join('')}</Row>`
}

export function buildWorkshopMarkdown(session: WorkshopSession): string {
  const stage = CONSULTING_STAGES.find((item) => item.id === session.stageId)
  const lines: string[] = [
    `# ${session.title}`,
    '',
    `Stage: ${stage ? `${stage.number}. ${stage.title}` : session.stageId}`,
    `Updated: ${session.updatedAt}`,
    '',
    '## Participants',
    session.participants || '_None recorded_',
    '',
    '## Agenda',
    ...session.agenda.map((item) => `- ${item}`),
    '',
    '## Notes',
    session.notes || '_None_',
    '',
    '## Use case',
    `- Name: ${session.useCase?.name || '_TBD_'}`,
    `- Problem: ${session.useCase?.businessProblem || '_TBD_'}`,
    `- Users: ${session.useCase?.targetUsers || '_TBD_'}`,
    `- Current process: ${session.useCase?.currentProcess || '_TBD_'}`,
    `- Desired outcome: ${session.useCase?.desiredOutcome || '_TBD_'}`,
    `- Data available: ${session.useCase?.dataAvailable || '_TBD_'}`,
    `- Constraints: ${session.useCase?.constraints || '_TBD_'}`,
    `- Baseline KPI: ${session.useCase?.baselineKpi || '_TBD_'}`,
    `- Owner: ${session.useCase?.owner || '_TBD_'}`,
    '',
    '## Framework outputs',
  ]

  const outputs = Object.values(session.frameworkOutputs)
  if (outputs.length === 0) {
    lines.push('_No framework outputs saved_')
  } else {
    for (const output of outputs) {
      lines.push('', `### ${output.title}`, `Saved: ${output.savedAt}`)
      for (const [key, value] of Object.entries(output.fields)) {
        lines.push(`- **${key}**: ${value}`)
      }
    }
  }

  lines.push('', '## Decisions')
  if (session.decisions.length === 0) {
    lines.push('_None_')
  } else {
    for (const decision of session.decisions) {
      lines.push(`- ${decision.text} (owner: ${decision.owner || 'TBD'}, date: ${decision.date || 'TBD'})`)
    }
  }

  lines.push('', '## Actions')
  if (session.actions.length === 0) {
    lines.push('_None_')
  } else {
    for (const action of session.actions) {
      lines.push(`- ${action.text} (owner: ${action.owner || 'TBD'}, due: ${action.due || 'TBD'})`)
    }
  }

  return `${lines.join('\n')}\n`
}

export function buildWorkshopHtml(session: WorkshopSession): string {
  const stage = CONSULTING_STAGES.find((item) => item.id === session.stageId)
  const outputs = Object.values(session.frameworkOutputs)
  const outputBlocks = outputs
    .map((output) => {
      const fields = Object.entries(output.fields)
        .map(([key, value]) => `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</li>`)
        .join('')
      return `<section class="block"><h3>${escapeHtml(output.title)}</h3><p class="muted">${escapeHtml(output.savedAt)}</p><ul>${fields}</ul></section>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(session.title)}</title>
  <style>
    body { font-family: Inter, "Segoe UI", sans-serif; margin: 0; background: #f7f4ef; color: #1f2a32; }
    header { background: #1f2a32; color: #f7f4ef; padding: 1.5rem; }
    h1 { font-family: Cinzel, "Times New Roman", serif; font-weight: 600; letter-spacing: 0.02em; }
    main { max-width: 960px; margin: 0 auto; padding: 1.5rem; }
    .block { background: white; border-radius: 1rem; padding: 1rem 1.25rem; margin-bottom: 1rem; border: 1px solid rgba(31,42,50,0.1); }
    .muted { color: #7a858f; font-size: 0.85rem; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(session.title)}</h1>
    <p>${escapeHtml(stage ? stage.title : session.stageId)} · ${escapeHtml(session.updatedAt)}</p>
  </header>
  <main>
    <section class="block"><h2>Participants</h2><p>${escapeHtml(session.participants || 'None recorded')}</p></section>
    <section class="block"><h2>Agenda</h2><ul>${session.agenda.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
    <section class="block"><h2>Notes</h2><p>${escapeHtml(session.notes || 'None')}</p></section>
    <section class="block"><h2>Use case</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(session.useCase?.name || 'TBD')}</li>
        <li><strong>Problem:</strong> ${escapeHtml(session.useCase?.businessProblem || 'TBD')}</li>
        <li><strong>Users:</strong> ${escapeHtml(session.useCase?.targetUsers || 'TBD')}</li>
        <li><strong>Current process:</strong> ${escapeHtml(session.useCase?.currentProcess || 'TBD')}</li>
        <li><strong>Desired outcome:</strong> ${escapeHtml(session.useCase?.desiredOutcome || 'TBD')}</li>
        <li><strong>Data:</strong> ${escapeHtml(session.useCase?.dataAvailable || 'TBD')}</li>
        <li><strong>Constraints:</strong> ${escapeHtml(session.useCase?.constraints || 'TBD')}</li>
        <li><strong>Baseline KPI:</strong> ${escapeHtml(session.useCase?.baselineKpi || 'TBD')}</li>
        <li><strong>Owner:</strong> ${escapeHtml(session.useCase?.owner || 'TBD')}</li>
      </ul>
    </section>
    <h2>Framework outputs</h2>
    ${outputs.length === 0 ? '<p class="muted">No framework outputs saved</p>' : outputBlocks}
    <section class="block"><h2>Decisions</h2><ul>${
      session.decisions.length === 0
        ? '<li>None</li>'
        : session.decisions
            .map(
              (decision) =>
                `<li>${escapeHtml(decision.text)} — ${escapeHtml(decision.owner || 'TBD')} (${escapeHtml(decision.date || 'TBD')})</li>`,
            )
            .join('')
    }</ul></section>
    <section class="block"><h2>Actions</h2><ul>${
      session.actions.length === 0
        ? '<li>None</li>'
        : session.actions
            .map(
              (action) =>
                `<li>${escapeHtml(action.text)} — ${escapeHtml(action.owner || 'TBD')} (due ${escapeHtml(action.due || 'TBD')})</li>`,
            )
            .join('')
    }</ul></section>
  </main>
</body>
</html>`
}

export function buildWorkshopExcelXml(session: WorkshopSession): string {
  const stage = CONSULTING_STAGES.find((item) => item.id === session.stageId)
  const summary = [
    row(['Field', 'Value']),
    row(['Title', session.title]),
    row(['Stage', stage ? stage.title : session.stageId]),
    row(['Participants', session.participants]),
    row(['Notes', session.notes]),
    row(['Updated', session.updatedAt]),
  ].join('')

  const useCaseRows = [
    row(['Field', 'Value']),
    row(['Name', session.useCase?.name ?? '']),
    row(['Problem', session.useCase?.businessProblem ?? '']),
    row(['Users', session.useCase?.targetUsers ?? '']),
    row(['Current process', session.useCase?.currentProcess ?? '']),
    row(['Desired outcome', session.useCase?.desiredOutcome ?? '']),
    row(['Data available', session.useCase?.dataAvailable ?? '']),
    row(['Constraints', session.useCase?.constraints ?? '']),
    row(['Baseline KPI', session.useCase?.baselineKpi ?? '']),
    row(['Owner', session.useCase?.owner ?? '']),
  ].join('')

  const agendaRows = [row(['Agenda item']), ...session.agenda.map((item) => row([item]))].join('')

  const outputRows = [
    row(['Framework', 'Field', 'Value', 'Saved At']),
    ...Object.values(session.frameworkOutputs).flatMap((output) =>
      Object.entries(output.fields).map(([key, value]) =>
        row([output.title, key, value, output.savedAt]),
      ),
    ),
  ].join('')

  const decisionRows = [
    row(['Decision', 'Owner', 'Date']),
    ...session.decisions.map((decision) => row([decision.text, decision.owner, decision.date])),
  ].join('')

  const actionRows = [
    row(['Action', 'Owner', 'Due']),
    ...session.actions.map((action) => row([action.text, action.owner, action.due])),
  ].join('')

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Summary"><Table>${summary}</Table></Worksheet>
 <Worksheet ss:Name="UseCase"><Table>${useCaseRows}</Table></Worksheet>
 <Worksheet ss:Name="Agenda"><Table>${agendaRows}</Table></Worksheet>
 <Worksheet ss:Name="FrameworkOutputs"><Table>${outputRows}</Table></Worksheet>
 <Worksheet ss:Name="Decisions"><Table>${decisionRows}</Table></Worksheet>
 <Worksheet ss:Name="Actions"><Table>${actionRows}</Table></Worksheet>
</Workbook>`
}

export function workshopPackStem(session: WorkshopSession): string {
  const date = session.updatedAt.slice(0, 10) || 'draft'
  return `workshop-${session.stageId}-${date}`
}
