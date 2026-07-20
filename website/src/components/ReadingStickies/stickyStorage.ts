export const READING_STICKIES_STORAGE_KEY =
  'sudip-ai-playbook-reading-stickies';

export const READING_STICKIES_STORE_VERSION = 1 as const;

export const MAX_STICKY_NOTE_LENGTH = 500;
export const MAX_STICKY_QUOTE_LENGTH = 280;
export const STICKY_CONTEXT_RADIUS = 40;

export type StickyNote = {
  id: string;
  quote: string;
  prefix: string;
  suffix: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type ReadingStickiesStore = {
  version: typeof READING_STICKIES_STORE_VERSION;
  /** When false, highlights and margin markers stay hidden. */
  visible: boolean;
  pages: Record<string, StickyNote[]>;
};

export function createEmptyStore(): ReadingStickiesStore {
  return {
    version: READING_STICKIES_STORE_VERSION,
    visible: false,
    pages: {},
  };
}

export function normalizePathname(pathname: string): string {
  if (pathname.length <= 1) {
    return pathname;
  }
  return pathname.replace(/\/+$/, '');
}

export function createStickyId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sticky-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

export function clampNoteText(note: string): string {
  return note.trim().slice(0, MAX_STICKY_NOTE_LENGTH);
}

export function clampQuoteText(quote: string): string {
  return quote.replace(/\s+/g, ' ').trim().slice(0, MAX_STICKY_QUOTE_LENGTH);
}

export function buildStickyContext(
  fullText: string,
  quoteStart: number,
  quoteEnd: number,
): {prefix: string; quote: string; suffix: string} | undefined {
  if (
    quoteStart < 0 ||
    quoteEnd <= quoteStart ||
    quoteEnd > fullText.length
  ) {
    return undefined;
  }
  const quote = clampQuoteText(fullText.slice(quoteStart, quoteEnd));
  if (quote.length === 0) {
    return undefined;
  }
  const prefix = fullText
    .slice(Math.max(0, quoteStart - STICKY_CONTEXT_RADIUS), quoteStart)
    .replace(/\s+/g, ' ');
  const suffix = fullText
    .slice(quoteEnd, Math.min(fullText.length, quoteEnd + STICKY_CONTEXT_RADIUS))
    .replace(/\s+/g, ' ');
  return {prefix, quote, suffix};
}

export function findQuoteIndex(
  haystack: string,
  quote: string,
  prefix: string,
  suffix: string,
): number {
  const normalizedHaystack = haystack.replace(/\s+/g, ' ');
  const normalizedQuote = clampQuoteText(quote);
  if (normalizedQuote.length === 0) {
    return -1;
  }

  const preferred = `${prefix}${normalizedQuote}${suffix}`;
  if (prefix.length > 0 || suffix.length > 0) {
    const preferredIndex = normalizedHaystack.indexOf(preferred);
    if (preferredIndex >= 0) {
      return preferredIndex + prefix.length;
    }
  }

  return normalizedHaystack.indexOf(normalizedQuote);
}

export function getStickiesForPage(
  store: ReadingStickiesStore,
  pathname: string,
): StickyNote[] {
  return store.pages[normalizePathname(pathname)] ?? [];
}

export function setStickiesVisible(
  store: ReadingStickiesStore,
  visible: boolean,
): ReadingStickiesStore {
  return {
    ...store,
    visible,
  };
}

export function addStickyNote(
  store: ReadingStickiesStore,
  pathname: string,
  input: {
    quote: string;
    prefix: string;
    suffix: string;
    note: string;
    now?: string;
  },
): ReadingStickiesStore | undefined {
  const note = clampNoteText(input.note);
  const quote = clampQuoteText(input.quote);
  if (note.length === 0 || quote.length === 0) {
    return undefined;
  }
  const timestamp = input.now ?? new Date().toISOString();
  const pathKey = normalizePathname(pathname);
  const sticky: StickyNote = {
    id: createStickyId(),
    quote,
    prefix: input.prefix.replace(/\s+/g, ' '),
    suffix: input.suffix.replace(/\s+/g, ' '),
    note,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const existing = store.pages[pathKey] ?? [];
  return {
    ...store,
    visible: true,
    pages: {
      ...store.pages,
      [pathKey]: [...existing, sticky],
    },
  };
}

export function updateStickyNote(
  store: ReadingStickiesStore,
  pathname: string,
  stickyId: string,
  noteText: string,
  now?: string,
): ReadingStickiesStore | undefined {
  const note = clampNoteText(noteText);
  if (note.length === 0) {
    return undefined;
  }
  const pathKey = normalizePathname(pathname);
  const existing = store.pages[pathKey];
  if (!existing) {
    return undefined;
  }
  let changed = false;
  const timestamp = now ?? new Date().toISOString();
  const nextStickies = existing.map((sticky) => {
    if (sticky.id !== stickyId) {
      return sticky;
    }
    changed = true;
    return {
      ...sticky,
      note,
      updatedAt: timestamp,
    };
  });
  if (!changed) {
    return undefined;
  }
  return {
    ...store,
    pages: {
      ...store.pages,
      [pathKey]: nextStickies,
    },
  };
}

export function deleteStickyNote(
  store: ReadingStickiesStore,
  pathname: string,
  stickyId: string,
): ReadingStickiesStore {
  const pathKey = normalizePathname(pathname);
  const existing = store.pages[pathKey];
  if (!existing) {
    return store;
  }
  const nextStickies = existing.filter((sticky) => sticky.id !== stickyId);
  const nextPages = {...store.pages};
  if (nextStickies.length === 0) {
    delete nextPages[pathKey];
  } else {
    nextPages[pathKey] = nextStickies;
  }
  return {
    ...store,
    pages: nextPages,
  };
}

function isStickyNote(value: unknown): value is StickyNote {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.quote === 'string' &&
    typeof record.prefix === 'string' &&
    typeof record.suffix === 'string' &&
    typeof record.note === 'string' &&
    typeof record.createdAt === 'string' &&
    typeof record.updatedAt === 'string'
  );
}

export function parseReadingStickiesStore(
  raw: string | null,
): ReadingStickiesStore {
  if (!raw) {
    return createEmptyStore();
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object') {
      return createEmptyStore();
    }
    const record = parsed as Record<string, unknown>;
    if (record.version !== READING_STICKIES_STORE_VERSION) {
      return createEmptyStore();
    }
    if (record.pages === null || typeof record.pages !== 'object') {
      return createEmptyStore();
    }
    const pages: Record<string, StickyNote[]> = {};
    for (const [pathKey, pageValue] of Object.entries(
      record.pages as Record<string, unknown>,
    )) {
      if (!Array.isArray(pageValue)) {
        continue;
      }
      const stickies = pageValue
        .filter(isStickyNote)
        .map((sticky) => ({
          ...sticky,
          quote: clampQuoteText(sticky.quote),
          note: clampNoteText(sticky.note),
          prefix: sticky.prefix.replace(/\s+/g, ' '),
          suffix: sticky.suffix.replace(/\s+/g, ' '),
        }))
        .filter((sticky) => sticky.quote.length > 0 && sticky.note.length > 0);
      if (stickies.length > 0) {
        pages[normalizePathname(pathKey)] = stickies;
      }
    }
    return {
      version: READING_STICKIES_STORE_VERSION,
      visible: record.visible === true,
      pages,
    };
  } catch {
    return createEmptyStore();
  }
}

export function serializeReadingStickiesStore(
  store: ReadingStickiesStore,
): string {
  return JSON.stringify(store);
}

export function loadReadingStickiesStore(): ReadingStickiesStore {
  if (typeof localStorage === 'undefined') {
    return createEmptyStore();
  }
  return parseReadingStickiesStore(
    localStorage.getItem(READING_STICKIES_STORAGE_KEY),
  );
}

export function saveReadingStickiesStore(store: ReadingStickiesStore): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(
    READING_STICKIES_STORAGE_KEY,
    serializeReadingStickiesStore(store),
  );
}
