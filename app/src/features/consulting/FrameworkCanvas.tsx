import { useState, type ChangeEvent } from 'react'
import type { MvpFramework } from '../../data/frameworkLibrary'
import { getCanvasFieldDefs } from './canvasFields'
import {
  computeRiceScore,
  isUseCaseReady,
  requiredKeysForCanvas,
  seedCanvasFieldsFromUseCase,
  validateCanvasFields,
  type FrameworkOutput,
  type UseCaseCard,
} from './workshop.logic'

interface FrameworkCanvasProps {
  framework: MvpFramework
  useCase?: UseCaseCard
  initialFields?: Record<string, string>
  onSave: (output: Omit<FrameworkOutput, 'savedAt'>) => void
  onCancel: () => void
}

export function FrameworkCanvas({
  framework,
  useCase,
  initialFields,
  onSave,
  onCancel,
}: FrameworkCanvasProps) {
  const fieldDefs = getCanvasFieldDefs(framework.canvasType)
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {}
    for (const def of fieldDefs) {
      base[def.key] = initialFields?.[def.key] ?? ''
    }
    if (useCase && isUseCaseReady(useCase)) {
      return seedCanvasFieldsFromUseCase(framework.canvasType, useCase, base)
    }
    return base
  })
  const [error, setError] = useState<string | null>(null)

  const riceScore = framework.canvasType === 'rice' ? computeRiceScore(fields) : null
  const labelsByKey = Object.fromEntries(fieldDefs.map((def) => [def.key, def.label]))

  function handleFieldChange(key: string) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((previous) => ({ ...previous, [key]: event.target.value }))
      setError(null)
    }
  }

  function handleApplyUseCase(): void {
    if (!useCase || !isUseCaseReady(useCase)) {
      setError('Complete the use case card in Workshop first (name + business problem).')
      return
    }
    setFields(seedCanvasFieldsFromUseCase(framework.canvasType, useCase, fields))
    setError(null)
  }

  function handleSave(): void {
    const validationError = validateCanvasFields(
      fields,
      requiredKeysForCanvas(framework.canvasType),
      labelsByKey,
    )
    if (validationError) {
      setError(validationError)
      return
    }
    const outputFields = { ...fields }
    if (riceScore !== null) {
      outputFields.riceScore = String(Math.round(riceScore * 100) / 100)
    }
    if (useCase?.name) {
      outputFields.linkedUseCase = useCase.name
    }
    onSave({
      frameworkId: framework.id,
      canvasType: framework.canvasType,
      title: framework.name,
      fields: outputFields,
    })
  }

  function handleCancel(): void {
    onCancel()
  }

  return (
    <div className="glass-panel space-y-4 p-5" data-testid="framework-canvas">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">
          Guided canvas · ~{framework.durationMinutes} min
          {framework.canvasType === 'guidedNotes' ? ' · use-case workbook' : ''}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">
          {framework.name}
        </h2>
        <p className="text-sm text-ink-secondary">{framework.purpose}</p>
      </header>

      {useCase && isUseCaseReady(useCase) ? (
        <div
          className="rounded-xl border border-slate-blue/20 bg-slate-blue/5 p-4 text-sm"
          data-testid="canvas-use-case-banner"
        >
          <p className="font-semibold text-indigo-velvet">Working use case: {useCase.name}</p>
          <p className="mt-1 text-ink-secondary">{useCase.businessProblem}</p>
          <button
            type="button"
            className="btn btn-ghost mt-3"
            data-testid="canvas-apply-usecase"
            onClick={handleApplyUseCase}
          >
            Re-apply use case to empty fields
          </button>
        </div>
      ) : (
        <p className="rounded-xl bg-amber-flame/10 px-4 py-3 text-sm text-tiger-orange">
          Tip: open Workshop, fill the use case card, then run this canvas — fields will pre-fill
          from your use case.
        </p>
      )}

      <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-secondary">
        {framework.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="grid gap-3 md:grid-cols-2">
        {fieldDefs.map((def) => (
          <label
            key={def.key}
            className={`block text-xs font-semibold uppercase tracking-wider text-ink-muted ${def.multiline ? 'md:col-span-2' : ''}`}
          >
            {def.label}
            {def.multiline ? (
              <textarea
                data-testid={`canvas-field-${def.key}`}
                className="field-input mt-2 min-h-20"
                value={fields[def.key] ?? ''}
                onChange={handleFieldChange(def.key)}
                placeholder={def.placeholder}
              />
            ) : (
              <input
                data-testid={`canvas-field-${def.key}`}
                className="field-input mt-2"
                value={fields[def.key] ?? ''}
                onChange={handleFieldChange(def.key)}
                placeholder={def.placeholder}
              />
            )}
          </label>
        ))}
      </div>

      {riceScore !== null ? (
        <p className="text-sm font-semibold text-indigo-velvet" data-testid="canvas-rice-score">
          RICE score: {Math.round(riceScore * 100) / 100}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-tiger-orange" data-testid="canvas-error">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-accent"
          data-testid="canvas-save"
          onClick={handleSave}
        >
          Save to workshop
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          data-testid="canvas-cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
