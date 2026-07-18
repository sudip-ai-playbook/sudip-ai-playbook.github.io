import {
  CONSULTING_OS_META,
  type ConsultingStage,
} from '../../data/consultingOs'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderList(items: string[]): string {
  if (items.length === 0) {
    return '<p class="muted">None listed.</p>'
  }
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
}

export function buildConsultingHtml(stages: ConsultingStage[]): string {
  const stageBlocks = stages
    .map((stage) => {
      return `
<section class="stage">
  <h2>Stage ${stage.number}: ${escapeHtml(stage.title)}</h2>
  <p class="meta"><strong>${escapeHtml(stage.shortLabel)}</strong> · Gate: ${escapeHtml(stage.gate)}</p>
  <h3>Purpose</h3>
  <p>${escapeHtml(stage.purpose)}</p>
  <h3>Questions answered</h3>
  ${renderList(stage.questionsAnswered)}
  <h3>Frameworks</h3>
  ${renderList(stage.frameworks)}
  <h3>Website actions</h3>
  ${renderList(stage.actions)}
  <h3>Deliverables</h3>
  ${renderList(stage.deliverables)}
  <h3>Gate criteria</h3>
  ${renderList(stage.gateCriteria)}
</section>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(CONSULTING_OS_META.workingName)} — Playbook</title>
  <style>
    :root { color-scheme: light; }
    body { font-family: Inter, "Segoe UI", sans-serif; margin: 0; background: #f7f4ef; color: #1f2a32; line-height: 1.5; }
    header { background: #1f2a32; color: #f7f4ef; padding: 2rem 1.5rem; }
    main { max-width: 960px; margin: 0 auto; padding: 1.5rem; }
    h1 { margin: 0 0 0.5rem; font-family: Cinzel, "Times New Roman", serif; font-weight: 600; letter-spacing: 0.02em; }
    .stage { background: rgba(255,255,255,0.9); border: 1px solid rgba(31,42,50,0.1); border-radius: 1rem; padding: 1.25rem 1.5rem; margin-bottom: 1rem; }
    h2 { margin-top: 0; color: #1f2a32; font-family: Cinzel, "Times New Roman", serif; font-weight: 600; }
    h3 { margin-bottom: 0.35rem; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.08em; color: #7a858f; }
    .meta { color: #4a5560; }
    .muted { color: #7a858f; }
    ul { margin-top: 0.25rem; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(CONSULTING_OS_META.workingName)}</h1>
    <p>${escapeHtml(CONSULTING_OS_META.productName)}</p>
    <p>${escapeHtml(CONSULTING_OS_META.positioning)}</p>
  </header>
  <main>
    <p><strong>Guiding questions:</strong> ${CONSULTING_OS_META.guidingQuestions.map(escapeHtml).join(' · ')}</p>
    <p>Exported stages: ${stages.length}</p>
    ${stageBlocks}
  </main>
</body>
</html>`
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

export function buildConsultingExcelXml(stages: ConsultingStage[]): string {
  const header = row([
    'Stage Number',
    'Short Label',
    'Title',
    'Purpose',
    'Gate',
    'Gate Criteria',
    'Frameworks',
    'Actions',
    'Deliverables',
    'Questions Answered',
    'Journey Label',
  ])

  const body = stages
    .map((stage) =>
      row([
        String(stage.number),
        stage.shortLabel,
        stage.title,
        stage.purpose,
        stage.gate,
        stage.gateCriteria.join(' | '),
        stage.frameworks.join(' | '),
        stage.actions.join(' | '),
        stage.deliverables.join(' | '),
        stage.questionsAnswered.join(' | '),
        stage.journeyLabel,
      ]),
    )
    .join('')

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Consulting Stages">
  <Table>
   ${header}
   ${body}
  </Table>
 </Worksheet>
</Workbook>`
}

export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
