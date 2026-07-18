import { useEffect, useId, useRef } from 'react'

type ConfirmDialogProps = {
  testId: string
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  testId,
  title,
  message,
  confirmLabel,
  cancelLabel,
  open,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return undefined

    confirmRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onCancel()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [cancelRef.current, confirmRef.current].filter(
        (node): node is HTMLButtonElement => node !== null,
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4"
      role="presentation"
      data-testid={`${testId}-backdrop`}
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-testid={testId}
        className="w-full max-w-md rounded-2xl border border-ink/10 bg-surface p-6 shadow-xl"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <h2 id={titleId} className="font-[family-name:var(--font-display)] text-xl font-600 text-ink">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm text-ink-secondary">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            className="btn btn-ghost"
            data-testid={`${testId}-cancel`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="btn btn-primary"
            data-testid={`${testId}-confirm`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
