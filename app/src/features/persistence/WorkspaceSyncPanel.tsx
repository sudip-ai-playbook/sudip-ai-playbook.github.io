import type { ChangeEvent, FormEvent } from 'react'
import { useId, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { useProject } from '../journey/useProject'
import {
  buildWorkspacePack,
  createWorkspaceStorageAdapter,
  downloadWorkspacePack,
  parseWorkspacePack,
  readConsultingWorkspaceRaw,
} from './index'

export function WorkspaceSyncPanel() {
  const { project, importWorkspacePack } = useProject()
  const adapter = createWorkspaceStorageAdapter()
  const status = adapter.getStatus()
  const fileInputId = useId()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleExport(): void {
    const pack = buildWorkspacePack({
      project,
      consultingWorkspace: readConsultingWorkspaceRaw(),
    })
    downloadWorkspacePack(pack)
    setError(null)
    setMessage('Workspace pack downloaded. Share the JSON file with your team or another device.')
  }

  function handleImportFile(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const raw = typeof reader.result === 'string' ? reader.result : ''
      const parsed = parseWorkspacePack(raw)
      if (!parsed.ok) {
        setMessage(null)
        setError(parsed.error)
        return
      }
      importWorkspacePack(parsed.pack)
      setError(null)
      setMessage(`Imported workspace from ${parsed.pack.exportedAt}. Reload Engagement if it is open.`)
    }
    reader.onerror = () => {
      setMessage(null)
      setError('Could not read that file.')
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  function handleImportSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
  }

  return (
    <section className="glass-panel space-y-4 p-5" data-testid="workspace-sync-panel">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-600 text-ink">
          Workspace sync
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">{status.detail}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Mode: {status.label}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" data-testid="workspace-export" onClick={handleExport}>
          <Download className="h-4 w-4" aria-hidden />
          Export workspace pack
        </button>
        <form onSubmit={handleImportSubmit}>
          <label className="btn btn-accent cursor-pointer" htmlFor={fileInputId}>
            <Upload className="h-4 w-4" aria-hidden />
            Import workspace pack
            <input
              id={fileInputId}
              data-testid="workspace-import-input"
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={handleImportFile}
            />
          </label>
        </form>
      </div>
      {message ? (
        <p className="text-sm text-ink" role="status" data-testid="workspace-sync-message">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-cayenne-red" role="alert" data-testid="workspace-sync-error">
          {error}
        </p>
      ) : null}
    </section>
  )
}
