import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  addStickyNote,
  buildStickyContext,
  clampNoteText,
  createEmptyStore,
  deleteStickyNote,
  findQuoteIndex,
  getStickiesForPage,
  loadReadingStickiesStore,
  MAX_STICKY_NOTE_LENGTH,
  parseReadingStickiesStore,
  READING_STICKIES_STORAGE_KEY,
  saveReadingStickiesStore,
  serializeReadingStickiesStore,
  setStickiesVisible,
  updateStickyNote,
} from './stickyStorage.ts';

describe('stickyStorage', () => {
  it('builds quote context with surrounding text', () => {
    const context = buildStickyContext(
      'Hello brave new world today',
      6,
      15,
    );
    assert.deepEqual(context, {
      prefix: 'Hello ',
      quote: 'brave new',
      suffix: ' world today',
    });
  });

  it('returns undefined for empty or invalid quote ranges', () => {
    assert.equal(buildStickyContext('abc', 2, 2), undefined);
    assert.equal(buildStickyContext('abc', -1, 2), undefined);
    assert.equal(buildStickyContext('   ', 0, 3), undefined);
  });

  it('finds quotes with prefix and suffix preference', () => {
    const haystack = 'one foo two foo three';
    assert.equal(findQuoteIndex(haystack, 'foo', 'two ', ' three'), 12);
    assert.equal(findQuoteIndex(haystack, 'foo', '', ''), 4);
    assert.equal(findQuoteIndex(haystack, '', '', ''), -1);
  });

  it('clamps note text length', () => {
    const longNote = 'x'.repeat(MAX_STICKY_NOTE_LENGTH + 20);
    assert.equal(clampNoteText(`  ${longNote}  `).length, MAX_STICKY_NOTE_LENGTH);
  });

  it('returns empty store for null, empty, or corrupt JSON', () => {
    assert.deepEqual(parseReadingStickiesStore(null), createEmptyStore());
    assert.deepEqual(parseReadingStickiesStore(''), createEmptyStore());
    assert.deepEqual(parseReadingStickiesStore('{bad'), createEmptyStore());
    assert.deepEqual(parseReadingStickiesStore('[]'), createEmptyStore());
    assert.deepEqual(
      parseReadingStickiesStore(JSON.stringify({version: 9, pages: {}})),
      createEmptyStore(),
    );
  });

  it('defaults visibility to hidden and round-trips stickies', () => {
    const empty = createEmptyStore();
    assert.equal(empty.visible, false);

    const added = addStickyNote(empty, '/blog/articles/a/', {
      quote: 'important line',
      prefix: 'before ',
      suffix: ' after',
      note: 'Remember this',
      now: '2026-07-20T12:00:00.000Z',
    });
    assert.ok(added);
    assert.equal(added.visible, true);
    assert.equal(getStickiesForPage(added, '/blog/articles/a').length, 1);

    const restored = parseReadingStickiesStore(
      serializeReadingStickiesStore(added),
    );
    assert.equal(restored.visible, true);
    assert.equal(getStickiesForPage(restored, '/blog/articles/a')[0]?.note, 'Remember this');
  });

  it('rejects empty notes and quotes when adding', () => {
    assert.equal(
      addStickyNote(createEmptyStore(), '/p', {
        quote: 'text',
        prefix: '',
        suffix: '',
        note: '   ',
      }),
      undefined,
    );
    assert.equal(
      addStickyNote(createEmptyStore(), '/p', {
        quote: '   ',
        prefix: '',
        suffix: '',
        note: 'ok',
      }),
      undefined,
    );
  });

  it('updates and deletes sticky notes for a page', () => {
    let store = addStickyNote(createEmptyStore(), '/p', {
      quote: 'quote',
      prefix: '',
      suffix: '',
      note: 'first',
      now: '2026-07-20T12:00:00.000Z',
    });
    assert.ok(store);
    const stickyId = getStickiesForPage(store, '/p')[0]?.id;
    assert.ok(stickyId);

    const updated = updateStickyNote(
      store,
      '/p',
      stickyId,
      'second',
      '2026-07-20T13:00:00.000Z',
    );
    assert.ok(updated);
    assert.equal(getStickiesForPage(updated, '/p')[0]?.note, 'second');

    assert.equal(
      updateStickyNote(updated, '/p', 'missing', 'nope'),
      undefined,
    );
    assert.equal(updateStickyNote(updated, '/p', stickyId, '  '), undefined);

    store = deleteStickyNote(updated, '/p', stickyId);
    assert.deepEqual(getStickiesForPage(store, '/p'), []);
    assert.equal(deleteStickyNote(store, '/missing', stickyId), store);
  });

  it('toggles visibility without losing notes', () => {
    const withNote = addStickyNote(createEmptyStore(), '/p', {
      quote: 'quote',
      prefix: '',
      suffix: '',
      note: 'keep',
    });
    assert.ok(withNote);
    const hidden = setStickiesVisible(withNote, false);
    assert.equal(hidden.visible, false);
    assert.equal(getStickiesForPage(hidden, '/p').length, 1);
  });

  it('skips invalid page entries on parse', () => {
    const raw = JSON.stringify({
      version: 1,
      visible: true,
      pages: {
        '/good': [
          {
            id: '1',
            quote: 'q',
            prefix: '',
            suffix: '',
            note: 'n',
            createdAt: 't',
            updatedAt: 't',
          },
        ],
        '/bad-array': {nope: true},
        '/bad-items': [{id: 1}],
      },
    });
    const store = parseReadingStickiesStore(raw);
    assert.equal(store.visible, true);
    assert.equal(getStickiesForPage(store, '/good').length, 1);
    assert.equal(getStickiesForPage(store, '/bad-array').length, 0);
    assert.equal(getStickiesForPage(store, '/bad-items').length, 0);
  });

  it('rejects null root and missing pages object', () => {
    assert.deepEqual(parseReadingStickiesStore('null'), createEmptyStore());
    assert.deepEqual(
      parseReadingStickiesStore(JSON.stringify({version: 1, pages: null})),
      createEmptyStore(),
    );
  });

  it('persists and reloads through localStorage', () => {
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
      const store = addStickyNote(createEmptyStore(), '/blog/articles/x', {
        quote: 'persist me',
        prefix: '',
        suffix: '',
        note: 'saved',
      });
      assert.ok(store);
      saveReadingStickiesStore(store);
      assert.ok(memory.has(READING_STICKIES_STORAGE_KEY));
      assert.equal(
        getStickiesForPage(loadReadingStickiesStore(), '/blog/articles/x')[0]
          ?.note,
        'saved',
      );
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('no-ops load and save when localStorage is unavailable', () => {
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: undefined,
    });
    try {
      assert.deepEqual(loadReadingStickiesStore(), createEmptyStore());
      saveReadingStickiesStore(createEmptyStore());
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('normalizes root pathname and updates missing pages as undefined', () => {
    assert.equal(
      updateStickyNote(createEmptyStore(), '/missing', 'id', 'note'),
      undefined,
    );
  });

  it('falls back to a generated sticky id when randomUUID is unavailable', () => {
    const originalCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {},
    });
    try {
      const store = addStickyNote(createEmptyStore(), '/p', {
        quote: 'quote',
        prefix: '',
        suffix: '',
        note: 'note',
      });
      assert.ok(store);
      assert.match(getStickiesForPage(store, '/p')[0]?.id ?? '', /^sticky-/);
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        configurable: true,
        value: originalCrypto,
      });
    }
  });
});
