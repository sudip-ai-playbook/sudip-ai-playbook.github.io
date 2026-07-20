import {
  buildStickyContext,
  findQuoteIndex,
  type StickyNote,
} from './stickyStorage';

/** Legacy attribute from older inline-mark implementation. */
export const STICKY_MARK_ATTRIBUTE = 'data-reading-sticky';

export const READING_STICKY_HIGHLIGHT = 'reading-sticky';

export type StickyPinPosition = {
  id: string;
  top: number;
  left: number;
};

export function getArticleContentRoot(): Element | null {
  return (
    document.querySelector('article .markdown') ??
    document.querySelector('.theme-doc-markdown') ??
    document.querySelector('article') ??
    document.querySelector('main .markdown')
  );
}

export function isSelectionInsideContent(
  selection: Selection,
  contentRoot: Element,
): boolean {
  if (selection.rangeCount === 0 || selection.isCollapsed) {
    return false;
  }
  const range = selection.getRangeAt(0);
  const commonAncestor = range.commonAncestorContainer;
  const ancestorElement =
    commonAncestor.nodeType === Node.ELEMENT_NODE
      ? (commonAncestor as Element)
      : commonAncestor.parentElement;
  if (!ancestorElement) {
    return false;
  }
  return contentRoot.contains(ancestorElement);
}

export function readSelectionContext(
  contentRoot: Element,
  selection: Selection,
): {prefix: string; quote: string; suffix: string} | undefined {
  if (!isSelectionInsideContent(selection, contentRoot)) {
    return undefined;
  }
  const range = selection.getRangeAt(0);
  const quote = selection.toString();
  if (quote.trim().length === 0) {
    return undefined;
  }

  const beforeRange = document.createRange();
  beforeRange.selectNodeContents(contentRoot);
  beforeRange.setEnd(range.startContainer, range.startOffset);
  const beforeText = beforeRange.toString();

  const afterRange = document.createRange();
  afterRange.selectNodeContents(contentRoot);
  afterRange.setStart(range.endContainer, range.endOffset);
  const afterText = afterRange.toString();

  const fullText = `${beforeText}${quote}${afterText}`;
  return buildStickyContext(
    fullText,
    beforeText.length,
    beforeText.length + quote.length,
  );
}

type TextPoint = {
  node: Text;
  offset: number;
};

function mapTextNodes(root: Element): {fullText: string; points: TextPoint[]} {
  const points: TextPoint[] = [];
  const chunks: string[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    const value = textNode.nodeValue ?? '';
    for (let index = 0; index < value.length; index += 1) {
      points.push({node: textNode, offset: index});
      chunks.push(value[index] ?? '');
    }
    current = walker.nextNode();
  }
  return {
    fullText: chunks.join(''),
    points,
  };
}

function toNormalizedIndexMap(fullText: string): number[] {
  const map: number[] = [];
  let previousWasSpace = false;
  for (let index = 0; index < fullText.length; index += 1) {
    const character = fullText[index] ?? '';
    const isSpace = /\s/.test(character);
    if (isSpace) {
      if (!previousWasSpace && map.length > 0) {
        map.push(index);
      }
      previousWasSpace = true;
      continue;
    }
    map.push(index);
    previousWasSpace = false;
  }
  return map;
}

/** Removes older inline sticky marks that were breaking list/text layout. */
export function cleanupLegacyStickyMarks(root: Element): void {
  const marks = Array.from(
    root.querySelectorAll(`[${STICKY_MARK_ATTRIBUTE}]`),
  );
  for (const mark of marks) {
    const parent = mark.parentNode;
    if (!parent) {
      continue;
    }
    const pin = mark.querySelector('.reading-sticky-pin');
    pin?.remove();
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
    parent.normalize();
  }
}

export function createRangeForSticky(
  root: Element,
  sticky: StickyNote,
): Range | undefined {
  const mapped = mapTextNodes(root);
  const normalizedMap = toNormalizedIndexMap(mapped.fullText);
  const normalizedStart = findQuoteIndex(
    mapped.fullText,
    sticky.quote,
    sticky.prefix,
    sticky.suffix,
  );
  if (normalizedStart < 0) {
    return undefined;
  }
  const normalizedEnd = normalizedStart + sticky.quote.length;
  const rawStart = normalizedMap[normalizedStart];
  const rawLast = normalizedMap[normalizedEnd - 1];
  if (rawStart === undefined || rawLast === undefined) {
    return undefined;
  }

  const startPoint = mapped.points[rawStart];
  const endPoint = mapped.points[rawLast];
  if (!startPoint || !endPoint) {
    return undefined;
  }

  const range = document.createRange();
  range.setStart(startPoint.node, startPoint.offset);
  range.setEnd(endPoint.node, endPoint.offset + 1);
  return range;
}

export function pinPositionForRange(
  range: Range,
  stickyId: string,
  contentRoot?: Element | null,
): StickyPinPosition | undefined {
  const clientRects = range.getClientRects();
  const rect = clientRects.item(0) ?? range.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) {
    return undefined;
  }

  const contentRect = contentRoot?.getBoundingClientRect();
  // Prefer the right gutter outside the article text column.
  const left = contentRect
    ? Math.min(window.innerWidth - 18, contentRect.right + 14)
    : Math.min(window.innerWidth - 18, rect.right + 14);

  return {
    id: stickyId,
    top: rect.top + rect.height / 2,
    left,
  };
}

export function resolveOutsideEditorPosition(anchorTop: number): {
  top: number;
  left: number;
} {
  const editorWidth = Math.min(260, window.innerWidth - 24);
  const editorHeight = 180;
  const contentRoot = getArticleContentRoot();
  const contentRect = contentRoot?.getBoundingClientRect();
  const maxTop = Math.max(16, window.innerHeight - editorHeight - 16);
  const top = Math.min(Math.max(16, anchorTop - 24), maxTop);

  if (contentRect) {
    const rightSlot = contentRect.right + 12;
    const leftSlot = contentRect.left - editorWidth - 12;
    if (window.innerWidth - rightSlot >= editorWidth + 8) {
      return {top, left: rightSlot};
    }
    if (leftSlot >= 8) {
      return {top, left: leftSlot};
    }
  }

  // Narrow layout: keep the note card on the far right, clear of mid-page text.
  return {
    top: Math.min(top, window.innerHeight - editorHeight - 72),
    left: Math.max(8, window.innerWidth - editorWidth - 16),
  };
}

function supportsCssHighlight(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    'highlights' in CSS &&
    typeof Highlight !== 'undefined'
  );
}

export function clearStickyHighlights(): void {
  if (!supportsCssHighlight()) {
    return;
  }
  CSS.highlights.delete(READING_STICKY_HIGHLIGHT);
}

export function applyStickyVisuals(
  root: Element,
  stickies: StickyNote[],
  visible: boolean,
): StickyPinPosition[] {
  cleanupLegacyStickyMarks(root);
  clearStickyHighlights();

  if (!visible || stickies.length === 0) {
    return [];
  }

  const ranges: Range[] = [];
  const pins: StickyPinPosition[] = [];

  for (const sticky of stickies) {
    const range = createRangeForSticky(root, sticky);
    if (!range) {
      continue;
    }
    ranges.push(range);
    const pin = pinPositionForRange(range, sticky.id, root);
    if (pin) {
      pins.push(pin);
    }
  }

  if (supportsCssHighlight() && ranges.length > 0) {
    const highlight = new Highlight(...ranges);
    CSS.highlights.set(READING_STICKY_HIGHLIGHT, highlight);
  }

  return pins;
}
