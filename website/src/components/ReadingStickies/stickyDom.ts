import {
  buildStickyContext,
  findQuoteIndex,
  type StickyNote,
} from './stickyStorage';

export const STICKY_MARK_ATTRIBUTE = 'data-reading-sticky';

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

export function unwrapStickyMarks(root: Element): void {
  const marks = Array.from(
    root.querySelectorAll(`[${STICKY_MARK_ATTRIBUTE}]`),
  );
  for (const mark of marks) {
    const parent = mark.parentNode;
    if (!parent) {
      continue;
    }
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
    parent.normalize();
  }
}

export function wrapStickyInRoot(
  root: Element,
  sticky: StickyNote,
): HTMLElement | undefined {
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

  const mark = document.createElement('mark');
  mark.setAttribute(STICKY_MARK_ATTRIBUTE, sticky.id);
  mark.className = 'reading-sticky-mark';

  try {
    range.surroundContents(mark);
    return mark;
  } catch {
    const fragment = range.extractContents();
    mark.appendChild(fragment);
    range.insertNode(mark);
    return mark;
  }
}

export function applyStickyMarks(
  root: Element,
  stickies: StickyNote[],
  visible: boolean,
): Map<string, HTMLElement> {
  unwrapStickyMarks(root);
  const marks = new Map<string, HTMLElement>();
  if (!visible) {
    return marks;
  }
  for (const sticky of stickies) {
    const mark = wrapStickyInRoot(root, sticky);
    if (mark) {
      marks.set(sticky.id, mark);
    }
  }
  return marks;
}
