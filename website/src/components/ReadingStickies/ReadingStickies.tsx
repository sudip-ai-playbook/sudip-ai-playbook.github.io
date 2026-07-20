import type {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  SVGProps,
} from 'react';
import {useEffect, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';

import {isContentPage} from '@site/src/components/ReadingBookmark/bookmarkStorage';

import styles from './ReadingStickies.module.css';
import {
  applyStickyMarks,
  getArticleContentRoot,
  readSelectionContext,
  STICKY_MARK_ATTRIBUTE,
} from './stickyDom';
import {
  addStickyNote,
  createEmptyStore,
  deleteStickyNote,
  getStickiesForPage,
  loadReadingStickiesStore,
  MAX_STICKY_NOTE_LENGTH,
  normalizePathname,
  saveReadingStickiesStore,
  setStickiesVisible,
  updateStickyNote,
  type ReadingStickiesStore,
} from './stickyStorage';

type IconProps = SVGProps<SVGSVGElement>;

type SelectionDraft = {
  prefix: string;
  quote: string;
  suffix: string;
  top: number;
  left: number;
};

type EditorState = {
  mode: 'create' | 'edit';
  stickyId?: string;
  note: string;
  top: number;
  left: number;
  prefix?: string;
  quote?: string;
  suffix?: string;
};

function StickyIcon({className, ...props}: IconProps): ReactNode {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>
      <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
      <path d="M15 3v5h5" />
    </svg>
  );
}

function CheckIcon({className, ...props}: IconProps): ReactNode {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CloseIcon({className, ...props}: IconProps): ReactNode {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function TrashIcon({className, ...props}: IconProps): ReactNode {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}

function clampEditorPosition(
  top: number,
  left: number,
): {top: number; left: number} {
  const maxLeft = Math.max(16, window.innerWidth - 304);
  const maxTop = Math.max(16, window.innerHeight - 180);
  return {
    top: Math.min(Math.max(16, top), maxTop),
    left: Math.min(Math.max(16, left), maxLeft),
  };
}

function createClientStore(isBrowser: boolean): ReadingStickiesStore {
  if (!isBrowser) {
    return createEmptyStore();
  }
  return loadReadingStickiesStore();
}

function resolveStickyIdFromTarget(target: EventTarget | null): string | undefined {
  if (!(target instanceof Element)) {
    return undefined;
  }
  const openButton = target.closest('[data-reading-sticky-open]');
  if (openButton instanceof HTMLElement) {
    return openButton.dataset.readingStickyOpen;
  }
  const mark = target.closest(`[${STICKY_MARK_ATTRIBUTE}]`);
  if (mark instanceof HTMLElement) {
    return mark.getAttribute(STICKY_MARK_ATTRIBUTE) ?? undefined;
  }
  return undefined;
}

export default function ReadingStickies(): ReactNode {
  const isBrowser = useIsBrowser();
  const location = useLocation();
  const pathname = normalizePathname(location.pathname);
  const showOnPage = isBrowser && isContentPage(pathname);

  const [store, setStore] = useState<ReadingStickiesStore>(() =>
    createClientStore(isBrowser),
  );
  const [selectionDraft, setSelectionDraft] = useState<
    SelectionDraft | undefined
  >(undefined);
  const [editor, setEditor] = useState<EditorState | undefined>(undefined);

  useEffect(() => {
    if (!showOnPage) {
      setSelectionDraft(undefined);
      setEditor(undefined);
      return;
    }
    setStore(loadReadingStickiesStore());
  }, [pathname, showOnPage]);

  useEffect(() => {
    if (!showOnPage) {
      return;
    }

    function refreshMarks(): void {
      const contentRoot = getArticleContentRoot();
      if (!contentRoot) {
        return;
      }
      applyStickyMarks(
        contentRoot,
        getStickiesForPage(store, pathname),
        store.visible,
      );
    }

    const timeoutId = window.setTimeout(refreshMarks, 60);
    return () => {
      window.clearTimeout(timeoutId);
      const contentRoot = getArticleContentRoot();
      if (contentRoot) {
        applyStickyMarks(contentRoot, [], false);
      }
    };
  }, [pathname, showOnPage, store]);

  useEffect(() => {
    if (!showOnPage) {
      return;
    }

    function handleContentClick(event: Event): void {
      const stickyId = resolveStickyIdFromTarget(event.target);
      if (!stickyId) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const sticky = getStickiesForPage(store, pathname).find(
        (item) => item.id === stickyId,
      );
      if (!sticky) {
        return;
      }
      let top = window.innerHeight / 3;
      let left = window.innerWidth / 2 - 140;
      if (event.target instanceof Element) {
        const rect = event.target.getBoundingClientRect();
        top = rect.bottom + 8;
        left = rect.left;
      }
      const position = clampEditorPosition(top, left);
      setEditor({
        mode: 'edit',
        stickyId: sticky.id,
        note: sticky.note,
        top: position.top,
        left: position.left,
      });
      setSelectionDraft(undefined);
    }

    const contentRoot = getArticleContentRoot();
    contentRoot?.addEventListener('click', handleContentClick);
    return () => {
      contentRoot?.removeEventListener('click', handleContentClick);
    };
  }, [pathname, showOnPage, store]);

  useEffect(() => {
    if (!showOnPage) {
      return;
    }

    function updateSelectionDraft(): void {
      if (editor) {
        return;
      }
      const selection = window.getSelection();
      const contentRoot = getArticleContentRoot();
      if (!selection || !contentRoot) {
        setSelectionDraft(undefined);
        return;
      }
      const context = readSelectionContext(contentRoot, selection);
      if (!context || selection.rangeCount === 0) {
        setSelectionDraft(undefined);
        return;
      }
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setSelectionDraft(undefined);
        return;
      }
      setSelectionDraft({
        ...context,
        top: Math.max(8, rect.top - 44),
        left: rect.left + rect.width / 2,
      });
    }

    function handleMouseUp(): void {
      window.setTimeout(updateSelectionDraft, 0);
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', updateSelectionDraft);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', updateSelectionDraft);
    };
  }, [editor, showOnPage]);

  function persistStore(nextStore: ReadingStickiesStore): void {
    saveReadingStickiesStore(nextStore);
    setStore(nextStore);
  }

  function handleToggleVisibility(): void {
    persistStore(setStickiesVisible(store, !store.visible));
  }

  function handleOpenCreateFromSelection(): void {
    if (!selectionDraft) {
      return;
    }
    const position = clampEditorPosition(
      selectionDraft.top + 48,
      selectionDraft.left - 140,
    );
    setEditor({
      mode: 'create',
      note: '',
      top: position.top,
      left: position.left,
      prefix: selectionDraft.prefix,
      quote: selectionDraft.quote,
      suffix: selectionDraft.suffix,
    });
    setSelectionDraft(undefined);
    window.getSelection()?.removeAllRanges();
  }

  function handleSelectionButtonMouseDown(
    event: MouseEvent<HTMLButtonElement>,
  ): void {
    // Keep the text selection until the create editor opens.
    event.preventDefault();
  }

  function handleEditorNoteChange(
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void {
    if (!editor) {
      return;
    }
    setEditor({
      ...editor,
      note: event.target.value.slice(0, MAX_STICKY_NOTE_LENGTH),
    });
  }

  function handleCloseEditor(): void {
    setEditor(undefined);
  }

  function handleSaveEditor(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!editor) {
      return;
    }
    if (editor.mode === 'create') {
      if (!editor.quote) {
        return;
      }
      const nextStore = addStickyNote(store, pathname, {
        quote: editor.quote,
        prefix: editor.prefix ?? '',
        suffix: editor.suffix ?? '',
        note: editor.note,
      });
      if (!nextStore) {
        return;
      }
      persistStore(nextStore);
      setEditor(undefined);
      return;
    }
    if (!editor.stickyId) {
      return;
    }
    const nextStore = updateStickyNote(
      store,
      pathname,
      editor.stickyId,
      editor.note,
    );
    if (!nextStore) {
      return;
    }
    persistStore(nextStore);
    setEditor(undefined);
  }

  function handleDeleteSticky(): void {
    if (!editor?.stickyId) {
      return;
    }
    persistStore(deleteStickyNote(store, pathname, editor.stickyId));
    setEditor(undefined);
  }

  if (!showOnPage) {
    return null;
  }

  return (
    <>
      <div className={styles.dock} data-testid="reading-stickies-dock">
        <button
          type="button"
          className={clsx(styles.dockButton, store.visible && styles.dockActive)}
          aria-label={store.visible ? 'Hide stickies' : 'Show stickies'}
          aria-pressed={store.visible}
          data-testid="reading-stickies-toggle"
          onClick={handleToggleVisibility}>
          <StickyIcon className={styles.icon} />
        </button>
      </div>

      {selectionDraft && !editor ? (
        <button
          type="button"
          className={styles.selectionButton}
          style={{
            top: selectionDraft.top,
            left: selectionDraft.left,
            transform: 'translateX(-50%)',
          }}
          aria-label="Add sticky note"
          data-testid="reading-stickies-selection"
          onMouseDown={handleSelectionButtonMouseDown}
          onClick={handleOpenCreateFromSelection}>
          <StickyIcon className={styles.icon} />
        </button>
      ) : null}

      {editor ? (
        <form
          className={styles.editor}
          style={{top: editor.top, left: editor.left}}
          data-testid="reading-stickies-editor"
          onSubmit={handleSaveEditor}>
          <textarea
            className={styles.editorTextarea}
            value={editor.note}
            placeholder="Add note"
            aria-label="Sticky note"
            maxLength={MAX_STICKY_NOTE_LENGTH}
            autoFocus
            data-testid="reading-stickies-note"
            onChange={handleEditorNoteChange}
          />
          <div className={styles.editorActions}>
            {editor.mode === 'edit' ? (
              <button
                type="button"
                className={clsx(styles.dockButton, styles.danger)}
                aria-label="Delete sticky"
                data-testid="reading-stickies-delete"
                onClick={handleDeleteSticky}>
                <TrashIcon className={styles.icon} />
              </button>
            ) : null}
            <button
              type="button"
              className={styles.dockButton}
              aria-label="Cancel"
              data-testid="reading-stickies-cancel"
              onClick={handleCloseEditor}>
              <CloseIcon className={styles.icon} />
            </button>
            <button
              type="submit"
              className={clsx(styles.dockButton, styles.dockActive)}
              aria-label="Save sticky"
              data-testid="reading-stickies-save">
              <CheckIcon className={styles.icon} />
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
}
