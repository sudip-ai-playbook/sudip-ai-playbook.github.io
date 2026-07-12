import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { EXCALIDRAW_LABELS } from './excalidraw.constants'

export function ExcalidrawBoard() {
  return (
    <div
      className="h-[70vh] w-full overflow-hidden rounded-xl bg-white"
      data-testid="excalidraw-board"
      role="region"
      aria-label={EXCALIDRAW_LABELS.boardTitle}
    >
      <Excalidraw theme="light" />
    </div>
  )
}
