import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  clearBookmarkProgress,
  createEmptyStore,
  getJumpTarget,
  getPageState,
  isContentPage,
  isMeaningfulProgress,
  isNearProgress,
  loadReadingBookmarksStore,
  MIN_RESUME_PROGRESS,
  normalizePathname,
  parseReadingBookmarksStore,
  READING_BOOKMARKS_STORAGE_KEY,
  saveReadingBookmarksStore,
  serializeReadingBookmarksStore,
  setBookmarkProgress,
  setResumeProgress,
} from './bookmarkStorage.ts';

describe('bookmarkStorage', () => {
  it('normalizes trailing slashes on pathnames', () => {
    assert.equal(normalizePathname('/blog/articles/foo/'), '/blog/articles/foo');
    assert.equal(normalizePathname('/'), '/');
  });

  it('detects content pages across all playbook sections', () => {
    assert.equal(isContentPage('/blog/articles/my-post'), true);
    assert.equal(isContentPage('/blog/docs/intro/'), true);
    assert.equal(
      isContentPage('/blog/ai-solution-engineering/01-discovery'),
      true,
    );
    assert.equal(isContentPage('/blog/learning-map/rag'), true);
    assert.equal(isContentPage('/blog/roadmaps/ai-engineer'), true);
    assert.equal(
      isContentPage('/blog/startup-entrepreneurship/mvp'),
      true,
    );
    assert.equal(isContentPage('/blog/'), false);
    assert.equal(isContentPage('/blog/catalog'), false);
    assert.equal(isContentPage('/blog/notes'), false);
  });

  it('treats progress below the resume threshold as not meaningful', () => {
    assert.equal(isMeaningfulProgress(0), false);
    assert.equal(isMeaningfulProgress(MIN_RESUME_PROGRESS - 0.001), false);
    assert.equal(isMeaningfulProgress(MIN_RESUME_PROGRESS), true);
  });

  it('detects when scroll is already near a saved position', () => {
    assert.equal(isNearProgress(0.5, 0.51), true);
    assert.equal(isNearProgress(0.5, 0.6), false);
  });

  it('returns empty store for null, empty, or corrupt JSON', () => {
    assert.deepEqual(parseReadingBookmarksStore(null), createEmptyStore());
    assert.deepEqual(parseReadingBookmarksStore(''), createEmptyStore());
    assert.deepEqual(parseReadingBookmarksStore('{not-json'), createEmptyStore());
    assert.deepEqual(parseReadingBookmarksStore('[]'), createEmptyStore());
    assert.deepEqual(
      parseReadingBookmarksStore(JSON.stringify({version: 99, pages: {}})),
      createEmptyStore(),
    );
  });

  it('round-trips resume and bookmark progress through serialize and parse', () => {
    let store = setResumeProgress(createEmptyStore(), '/blog/articles/a/', 0.4);
    store = setBookmarkProgress(store, '/blog/articles/a/', 0.7);
    const restored = parseReadingBookmarksStore(
      serializeReadingBookmarksStore(store),
    );
    assert.deepEqual(getPageState(restored, '/blog/articles/a'), {
      resumeProgress: 0.4,
      bookmarkProgress: 0.7,
    });
  });

  it('clamps out-of-range progress values on parse', () => {
    const raw = JSON.stringify({
      version: 1,
      pages: {
        '/blog/articles/a': {
          resumeProgress: 2,
          bookmarkProgress: -1,
        },
      },
    });
    const store = parseReadingBookmarksStore(raw);
    assert.deepEqual(getPageState(store, '/blog/articles/a'), {
      resumeProgress: 1,
      bookmarkProgress: 0,
    });
  });

  it('skips invalid page entries on parse', () => {
    const raw = JSON.stringify({
      version: 1,
      pages: {
        '/blog/articles/good': {resumeProgress: 0.3},
        '/blog/articles/bad': {resumeProgress: 'nope'},
      },
    });
    const store = parseReadingBookmarksStore(raw);
    assert.deepEqual(getPageState(store, '/blog/articles/good'), {
      resumeProgress: 0.3,
      bookmarkProgress: undefined,
    });
    assert.equal(getPageState(store, '/blog/articles/bad'), undefined);
  });

  it('prefers explicit bookmark over resume for jump target', () => {
    const withBoth = setBookmarkProgress(
      setResumeProgress(createEmptyStore(), '/p', 0.3),
      '/p',
      0.8,
    );
    assert.equal(getJumpTarget(getPageState(withBoth, '/p')), 0.8);

    const resumeOnly = setResumeProgress(createEmptyStore(), '/p', 0.3);
    assert.equal(getJumpTarget(getPageState(resumeOnly, '/p')), 0.3);

    assert.equal(getJumpTarget(undefined), undefined);
    assert.equal(
      getJumpTarget({resumeProgress: 0.01}),
      undefined,
    );
  });

  it('clears bookmark while keeping meaningful resume progress', () => {
    let store = setBookmarkProgress(
      setResumeProgress(createEmptyStore(), '/p', 0.4),
      '/p',
      0.9,
    );
    store = clearBookmarkProgress(store, '/p');
    assert.deepEqual(getPageState(store, '/p'), {
      resumeProgress: 0.4,
    });
  });

  it('removes the page entry when clearing bookmark with no resume', () => {
    let store = setBookmarkProgress(createEmptyStore(), '/p', 0.9);
    store = clearBookmarkProgress(
      setResumeProgress(store, '/p', 0.01),
      '/p',
    );
    assert.equal(getPageState(store, '/p'), undefined);
  });

  it('returns the same store when clearing a missing bookmark', () => {
    const store = createEmptyStore();
    assert.equal(clearBookmarkProgress(store, '/missing'), store);
  });

  it('clamps non-finite progress to zero', () => {
    assert.equal(isMeaningfulProgress(Number.NaN), false);
    assert.equal(isNearProgress(Number.POSITIVE_INFINITY, 0), true);
  });

  it('rejects page entries with non-object or bad bookmark types', () => {
    const raw = JSON.stringify({
      version: 1,
      pages: {
        '/a': null,
        '/b': {resumeProgress: 0.4, bookmarkProgress: 'bad'},
        '/c': {resumeProgress: 0.4},
      },
    });
    const store = parseReadingBookmarksStore(raw);
    assert.equal(getPageState(store, '/a'), undefined);
    assert.equal(getPageState(store, '/b'), undefined);
    assert.deepEqual(getPageState(store, '/c'), {
      resumeProgress: 0.4,
      bookmarkProgress: undefined,
    });
  });

  it('rejects stores with null root or missing pages object', () => {
    assert.deepEqual(parseReadingBookmarksStore('null'), createEmptyStore());
    assert.deepEqual(
      parseReadingBookmarksStore(JSON.stringify({version: 1, pages: null})),
      createEmptyStore(),
    );
  });

  it('no-ops load and save when localStorage is unavailable', () => {
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: undefined,
    });
    try {
      assert.deepEqual(loadReadingBookmarksStore(), createEmptyStore());
      saveReadingBookmarksStore(
        setResumeProgress(createEmptyStore(), '/p', 0.5),
      );
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('persists and reloads bookmarks through localStorage', () => {
    const memory = new Map<string, string>();
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(key: string): string | null {
          return memory.get(key) ?? null;
        },
        setItem(key: string, value: string): void {
          memory.set(key, value);
        },
      },
    });

    try {
      const store = setBookmarkProgress(
        setResumeProgress(createEmptyStore(), '/blog/articles/persist', 0.25),
        '/blog/articles/persist',
        0.55,
      );
      saveReadingBookmarksStore(store);
      assert.ok(memory.has(READING_BOOKMARKS_STORAGE_KEY));
      assert.deepEqual(
        getPageState(loadReadingBookmarksStore(), '/blog/articles/persist'),
        {
          resumeProgress: 0.25,
          bookmarkProgress: 0.55,
        },
      );
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });
});
