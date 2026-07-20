import type {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  SVGProps,
} from 'react';
import {useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';

import {isContentPage} from '@site/src/components/ReadingBookmark/bookmarkStorage';

import styles from './ReadingStickies.module.css';
import {
  applyStickyVisuals,
  clearStickyHighlights,
  cleanupLegacyStickyMarks,
  createRangeForSticky,
  getArticleContentRoot,
  pinPositionForRange,
  readSelectionContext,
  resolveOutsideEditorPosition,
  type StickyPinPosition,
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

function createClientStore(isBrowser: boolean): ReadingStickiesStore {
  if (!isBrowser) {
    return createEmptyStore();
  }
  return loadReadingStickiesStore();
}

function selectionToolbarPosition(
  selectionRect: DOMRect,
  contentRoot: Element,
): {top: number; left: number} {
  const contentRect = contentRoot.getBoundingClientRect();
  return {
    top: Math.max(8, selectionRect.top + selectionRect.height / 2),
    left: Math.min(window.innerWidth - 18, contentRect.right + 14),
  };
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
  const [pins, setPins] = useState<StickyPinPosition[]>([]);
  const stickyRangesRef = useRef<Map<string, Range>>(new Map());

  useEffect(() => {
    if (!showOnPage) {
      setSelectionDraft(undefined);
      setEditor(undefined);
      setPins([]);
      stickyRangesRef.current.clear();
      return;
    }
    setStore(loadReadingStickiesStore());
  }, [pathname, showOnPage]);

  useEffect(() => {
    if (!showOnPage) {
      return;
    }

    function refreshVisuals(): void {
      const contentRoot = getArticleContentRoot();
      if (!contentRoot) {
        stickyRangesRef.current.clear();
        setPins([]);
        return;
      }
      const pageStickies = getStickiesForPage(store, pathname);
      const nextPins = applyStickyVisuals(
        contentRoot,
        pageStickies,
        store.visible,
      );
      stickyRangesRef.current.clear();
      for (const sticky of pageStickies) {
        const range = createRangeForSticky(contentRoot, sticky);
        if (range) {
          stickyRangesRef.current.set(sticky.id, range);
        }
      }
      setPins(nextPins);
    }

    function repositionPins(): void {
      if (!store.visible) {
        setPins([]);
        return;
      }
      const contentRoot = getArticleContentRoot();
      const nextPins: StickyPinPosition[] = [];
      stickyRangesRef.current.forEach((range, stickyId) => {
        const pin = pinPositionForRange(range, stickyId, contentRoot);
        if (pin) {
          nextPins.push(pin);
        }
      });
      setPins(nextPins);
    }

    const timeoutId = window.setTimeout(refreshVisuals, 60);
    window.addEventListener('scroll', repositionPins, {passive: true});
    window.addEventListener('resize', refreshVisuals);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', repositionPins);
      window.removeEventListener('resize', refreshVisuals);
      const contentRoot = getArticleContentRoot();
      if (contentRoot) {
        cleanupLegacyStickyMarks(contentRoot);
      }
      clearStickyHighlights();
      stickyRangesRef.current.clear();
      setPins([]);
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
      const toolbar = selectionToolbarPosition(rect, contentRoot);
      setSelectionDraft({
        ...context,
        top: toolbar.top,
        left: toolbar.left,
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
    const position = resolveOutsideEditorPosition(selectionDraft.top);
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
    event.preventDefault();
  }

  function handlePinButtonClick(event: MouseEvent<HTMLButtonElement>): void {
    const stickyId = event.currentTarget.dataset.stickyId;
    if (!stickyId) {
      return;
    }
    const sticky = getStickiesForPage(store, pathname).find(
      (item) => item.id === stickyId,
    );
    if (!sticky) {
      return;
    }
    const pin = pins.find((item) => item.id === stickyId);
    const position = resolveOutsideEditorPosition(
      pin ? pin.top : window.innerHeight / 3,
    );
    setEditor({
      mode: 'edit',
      stickyId: sticky.id,
      note: sticky.note,
      top: position.top,
      left: position.left,
    });
    setSelectionDraft(undefined);
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
            transform: 'translate(-50%, -50%)',
          }}
          aria-label="Add sticky note"
          data-testid="reading-stickies-selection"
          onMouseDown={handleSelectionButtonMouseDown}
          onClick={handleOpenCreateFromSelection}>
          <StickyIcon className={styles.icon} />
        </button>
      ) : null}

      {store.visible
        ? pins.map((pin) => (
            <button
              key={pin.id}
              type="button"
              className={styles.marginPin}
              style={{top: pin.top, left: pin.left}}
              aria-label="Open sticky note"
              data-sticky-id={pin.id}
              data-testid={`reading-sticky-pin-${pin.id}`}
              onClick={handlePinButtonClick}>
              <StickyIcon className={styles.marginPinIcon} />
            </button>
          ))
        : null}

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
