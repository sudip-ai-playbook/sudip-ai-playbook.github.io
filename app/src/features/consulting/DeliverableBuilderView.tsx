import { useEffect, useState, type ChangeEvent } from 'react'
import { Download, FileText, Sparkles } from 'lucide-react'
import { downloadTextFile } from './consulting.export'
import {
  DELIVERABLE_TEMPLATES,
  generateDeliverable,
  templatesForStage,
  type DeliverableTemplateId,
  type GeneratedDeliverable,
} from './deliverable.logic'
import {
  DELIVERABLE_STATUS,
  loadEngagement,
  saveEngagement,
  writeBackDeliverable,
} from './engagement.logic'
import { loadWorkshop } from './workshop.logic'

interface DeliverableBuilderViewProps {
  preferredStageId?: string | null
  preferredTemplateId?: DeliverableTemplateId | null
}

export function DeliverableBuilderView({
  preferredStageId,
  preferredTemplateId,
}: DeliverableBuilderViewProps) {
  const engagement = loadEngagement()
  const workshop = loadWorkshop(engagement.currentStageId)
  const stageId = preferredStageId || engagement.currentStageId
  const suggested = templatesForStage(stageId)
  const initialTemplate =
    preferredTemplateId ??
    suggested[0]?.id ??
    DELIVERABLE_TEMPLATES[0].id

  const [templateId, setTemplateId] = useState<DeliverableTemplateId>(initialTemplate)
  const [generated, setGenerated] = useState<GeneratedDeliverable | null>(null)
  const [writeBackMessage, setWriteBackMessage] = useState<string | null>(null)

  useEffect(() => {
    if (preferredTemplateId) {
      setTemplateId(preferredTemplateId)
      setGenerated(null)
    }
  }, [preferredTemplateId])

  function handleTemplateChange(event: ChangeEvent<HTMLSelectElement>): void {
    setTemplateId(event.target.value as DeliverableTemplateId)
    setGenerated(null)
    setWriteBackMessage(null)
  }

  function handleGenerate(): void {
    const draft = generateDeliverable(templateId, loadEngagement(), loadWorkshop())
    setGenerated(draft)
    setWriteBackMessage(null)
  }

  function handleWriteBack(): void {
    if (!generated) return
    const template = DELIVERABLE_TEMPLATES.find((item) => item.id === generated.templateId)
    const next = writeBackDeliverable(
      loadEngagement(),
      template?.label ?? generated.title,
      stageId,
      DELIVERABLE_STATUS.DRAFT,
    )
    saveEngagement(next)
    setWriteBackMessage('Saved to engagement deliverable register as draft.')
  }

  function handleDownloadMarkdown(): void {
    if (!generated) return
    downloadTextFile(
      `${generated.templateId}.md`,
      generated.markdown,
      'text/markdown;charset=utf-8',
    )
  }

  function handleDownloadHtml(): void {
    if (!generated) return
    downloadTextFile(
      `${generated.templateId}.html`,
      generated.html,
      'text/html;charset=utf-8',
    )
  }

  return (
    <div className="space-y-6" data-testid="deliverable-builder-view">
      <section className="glass-panel space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-bold">
          <FileText className="h-4 w-4 text-slate-blue" />
          Deliverable Builder
        </h2>
        <p className="text-sm text-ink-secondary">
          Draft client-ready artefacts from engagement control, workshop use case, framework
          outputs, decisions and gate status — so you do not retype the same story.
        </p>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Deliverable template
            <select
              data-testid="deliverable-template"
              className="field-input mt-2"
              value={templateId}
              onChange={handleTemplateChange}
            >
              {DELIVERABLE_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                  {suggested.some((item) => item.id === template.id) ? ' · suggested' : ''}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="button"
              className="btn btn-accent"
              data-testid="deliverable-generate"
              onClick={handleGenerate}
            >
              <Sparkles className="h-4 w-4" />
              Generate draft
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white/70 p-3 text-sm text-ink-secondary">
          <p>
            Client: <span className="font-semibold text-ink">{engagement.clientName || 'TBD'}</span>
            {' · '}
            Engagement:{' '}
            <span className="font-semibold text-ink">
              {engagement.engagementName || 'TBD'}
            </span>
          </p>
          <p className="mt-1">
            Workshop:{' '}
            {workshop
              ? `${workshop.title} · ${Object.keys(workshop.frameworkOutputs).length} framework outputs`
              : 'none yet'}
          </p>
        </div>
      </section>

      {generated ? (
        <section className="glass-panel space-y-4 p-5" data-testid="deliverable-preview">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold">{generated.title}</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-accent"
                data-testid="deliverable-writeback"
                onClick={handleWriteBack}
              >
                Save to register
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                data-testid="deliverable-download-md"
                onClick={handleDownloadMarkdown}
              >
                <Download className="h-4 w-4" />
                Markdown
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                data-testid="deliverable-download-html"
                onClick={handleDownloadHtml}
              >
                <Download className="h-4 w-4" />
                HTML
              </button>
            </div>
          </div>

          {writeBackMessage ? (
            <p className="text-sm text-emerald-700" data-testid="deliverable-writeback-message">
              {writeBackMessage}
            </p>
          ) : null}

          {generated.warnings.length > 0 ? (
            <ul
              className="rounded-xl bg-amber-flame/10 p-3 text-sm text-tiger-orange"
              data-testid="deliverable-warnings"
            >
              {generated.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-700" data-testid="deliverable-ready">
              Draft has engagement and workshop context.
            </p>
          )}

          <pre
            className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-xl bg-white/80 p-4 text-sm"
            data-testid="deliverable-markdown"
          >
            {generated.markdown}
          </pre>
        </section>
      ) : null}
    </div>
  )
}
