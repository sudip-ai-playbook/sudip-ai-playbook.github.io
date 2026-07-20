export const READING_BOOKMARKS_STORAGE_KEY =
  'sudip-ai-playbook-reading-bookmarks';

export const READING_BOOKMARKS_STORE_VERSION = 1 as const;

/** Minimum scroll progress before offering resume / saving resume. */
export const MIN_RESUME_PROGRESS = 0.05;

/** Treat current scroll as already at the saved spot. */
export const NEAR_POSITION_EPSILON = 0.02;

const CONTENT_PATH_MARKERS: readonly string[] = [
  '/articles/',
  '/docs/',
  '/ai-solution-engineering/',
  '/learning-map/',
  '/roadmaps/',
  '/startup-entrepreneurship/',
];

export type PageReadingState = {
  resumeProgress: number;
  bookmarkProgress?: number;
};

export type ReadingBookmarksStore = {
  version: typeof READING_BOOKMARKS_STORE_VERSION;
  pages: Record<string, PageReadingState>;
};

export function createEmptyStore(): ReadingBookmarksStore {
  return {
    version: READING_BOOKMARKS_STORE_VERSION,
    pages: {},
  };
}

export function normalizePathname(pathname: string): string {
  if (pathname.length <= 1) {
    return pathname;
  }
  return pathname.replace(/\/+$/, '');
}

export function isContentPage(pathname: string): boolean {
  const withSlash = `${normalizePathname(pathname)}/`;
  return CONTENT_PATH_MARKERS.some((marker) => withSlash.includes(marker));
}

export function clampProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0;
  }
  return Math.min(1, Math.max(0, progress));
}

export function isMeaningfulProgress(progress: number): boolean {
  return clampProgress(progress) >= MIN_RESUME_PROGRESS;
}

export function isNearProgress(
  currentProgress: number,
  targetProgress: number,
): boolean {
  return (
    Math.abs(clampProgress(currentProgress) - clampProgress(targetProgress)) <=
    NEAR_POSITION_EPSILON
  );
}

export function getPageState(
  store: ReadingBookmarksStore,
  pathname: string,
): PageReadingState | undefined {
  return store.pages[normalizePathname(pathname)];
}

export function getJumpTarget(
  pageState: PageReadingState | undefined,
): number | undefined {
  if (!pageState) {
    return undefined;
  }
  if (
    pageState.bookmarkProgress !== undefined &&
    isMeaningfulProgress(pageState.bookmarkProgress)
  ) {
    return clampProgress(pageState.bookmarkProgress);
  }
  if (isMeaningfulProgress(pageState.resumeProgress)) {
    return clampProgress(pageState.resumeProgress);
  }
  return undefined;
}

export function setResumeProgress(
  store: ReadingBookmarksStore,
  pathname: string,
  progress: number,
): ReadingBookmarksStore {
  const pathKey = normalizePathname(pathname);
  const clamped = clampProgress(progress);
  const existing = store.pages[pathKey];
  return {
    ...store,
    pages: {
      ...store.pages,
      [pathKey]: {
        resumeProgress: clamped,
        bookmarkProgress: existing?.bookmarkProgress,
      },
    },
  };
}

export function setBookmarkProgress(
  store: ReadingBookmarksStore,
  pathname: string,
  progress: number,
): ReadingBookmarksStore {
  const pathKey = normalizePathname(pathname);
  const clamped = clampProgress(progress);
  const existing = store.pages[pathKey];
  return {
    ...store,
    pages: {
      ...store.pages,
      [pathKey]: {
        resumeProgress: existing?.resumeProgress ?? clamped,
        bookmarkProgress: clamped,
      },
    },
  };
}

export function clearBookmarkProgress(
  store: ReadingBookmarksStore,
  pathname: string,
): ReadingBookmarksStore {
  const pathKey = normalizePathname(pathname);
  const existing = store.pages[pathKey];
  if (!existing) {
    return store;
  }
  const nextPages = {...store.pages};
  if (!isMeaningfulProgress(existing.resumeProgress)) {
    delete nextPages[pathKey];
  } else {
    nextPages[pathKey] = {
      resumeProgress: existing.resumeProgress,
    };
  }
  return {
    ...store,
    pages: nextPages,
  };
}

function isPageReadingState(value: unknown): value is PageReadingState {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  if (typeof record.resumeProgress !== 'number') {
    return false;
  }
  if (
    record.bookmarkProgress !== undefined &&
    typeof record.bookmarkProgress !== 'number'
  ) {
    return false;
  }
  return true;
}

export function parseReadingBookmarksStore(
  raw: string | null,
): ReadingBookmarksStore {
  if (!raw) {
    return createEmptyStore();
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object') {
      return createEmptyStore();
    }
    const record = parsed as Record<string, unknown>;
    if (record.version !== READING_BOOKMARKS_STORE_VERSION) {
      return createEmptyStore();
    }
    if (record.pages === null || typeof record.pages !== 'object') {
      return createEmptyStore();
    }
    const pages: Record<string, PageReadingState> = {};
    for (const [pathKey, pageValue] of Object.entries(
      record.pages as Record<string, unknown>,
    )) {
      if (!isPageReadingState(pageValue)) {
        continue;
      }
      pages[normalizePathname(pathKey)] = {
        resumeProgress: clampProgress(pageValue.resumeProgress),
        bookmarkProgress:
          pageValue.bookmarkProgress === undefined
            ? undefined
            : clampProgress(pageValue.bookmarkProgress),
      };
    }
    return {
      version: READING_BOOKMARKS_STORE_VERSION,
      pages,
    };
  } catch {
    return createEmptyStore();
  }
}

export function serializeReadingBookmarksStore(
  store: ReadingBookmarksStore,
): string {
  return JSON.stringify(store);
}

export function loadReadingBookmarksStore(): ReadingBookmarksStore {
  if (typeof localStorage === 'undefined') {
    return createEmptyStore();
  }
  return parseReadingBookmarksStore(
    localStorage.getItem(READING_BOOKMARKS_STORAGE_KEY),
  );
}

export function saveReadingBookmarksStore(store: ReadingBookmarksStore): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(
    READING_BOOKMARKS_STORAGE_KEY,
    serializeReadingBookmarksStore(store),
  );
}
