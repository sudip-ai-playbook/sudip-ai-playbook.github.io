export type TextareaHeightTarget = {
  scrollHeight: number;
  style: {height: string};
};

/**
 * Sizes a textarea to its content height, never below `minHeightPx`.
 * Resets height first so the box can shrink when text is deleted.
 */
export function fitTextareaHeight(
  textarea: TextareaHeightTarget,
  minHeightPx: number,
): void {
  const safeMinHeight = Number.isFinite(minHeightPx)
    ? Math.max(0, minHeightPx)
    : 0;
  textarea.style.height = 'auto';
  const nextHeight = Math.max(safeMinHeight, textarea.scrollHeight);
  textarea.style.height = `${nextHeight}px`;
}

export function readTextareaMinHeightPx(
  textarea: HTMLTextAreaElement,
): number {
  const parsed = Number.parseFloat(window.getComputedStyle(textarea).minHeight);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function fitTextareaToContent(textarea: HTMLTextAreaElement): void {
  fitTextareaHeight(textarea, readTextareaMinHeightPx(textarea));
}
