import { useProject } from '../journey/useProject'

export function UndoToast() {
  const { undoAvailable, undoReset, dismissUndo } = useProject()

  if (!undoAvailable) return null

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 flex w-[min(92vw,28rem)] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-ink/15 bg-ink px-4 py-3 text-sm text-surface-soft shadow-xl"
      role="status"
      data-testid="undo-toast"
    >
      <p>Journey reset. You can undo for a short time.</p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className="rounded-lg bg-surface-soft px-3 py-1.5 text-xs font-semibold text-ink"
          data-testid="undo-toast-action"
          onClick={undoReset}
        >
          Undo
        </button>
        <button
          type="button"
          className="rounded-lg px-2 py-1.5 text-xs font-semibold text-surface-soft/80 hover:text-surface-soft"
          data-testid="undo-toast-dismiss"
          onClick={dismissUndo}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
