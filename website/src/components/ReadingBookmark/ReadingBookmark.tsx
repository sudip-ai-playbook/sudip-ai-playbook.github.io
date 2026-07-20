import type {ReactNode, SVGProps} from 'react';
import {useEffect, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';

import styles from './ReadingBookmark.module.css';
import {
  clearBookmarkProgress,
  createEmptyStore,
  getJumpTarget,
  getPageState,
  isContentPage,
  isNearProgress,
  loadReadingBookmarksStore,
  normalizePathname,
  saveReadingBookmarksStore,
  setBookmarkProgress,
  setResumeProgress,
  type ReadingBookmarksStore,
} from './bookmarkStorage';

const RESUME_SAVE_DELAY_MS = 250;
const SCROLL_RESTORE_RETRY_MS = 120;
const SCROLL_RESTORE_ATTEMPTS = 8;

type IconProps = SVGProps<SVGSVGElement>;

function BookmarkIcon({className, ...props}: IconProps): ReactNode {
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
      <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function BookmarkFilledIcon({className, ...props}: IconProps): ReactNode {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>
      <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function JumpIcon({className, ...props}: IconProps): ReactNode {
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
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function DismissIcon({className, ...props}: IconProps): ReactNode {
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

function getScrollProgress(): number {
  const documentElement = document.documentElement;
  const scrollTop = window.scrollY || documentElement.scrollTop;
  const scrollHeight =
    documentElement.scrollHeight - documentElement.clientHeight;
  if (scrollHeight <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, scrollTop / scrollHeight));
}

function scrollToProgress(progress: number): void {
  const documentElement = document.documentElement;
  const scrollHeight =
    documentElement.scrollHeight - documentElement.clientHeight;
  if (scrollHeight <= 0) {
    return;
  }
  const top = scrollHeight * progress;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  window.scrollTo({
    top,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}

function scrollToProgressWhenReady(progress: number): () => void {
  let attempt = 0;
  let timeoutId = 0;

  function tryScroll(): void {
    scrollToProgress(progress);
    attempt += 1;
    if (attempt >= SCROLL_RESTORE_ATTEMPTS) {
      return;
    }
    timeoutId = window.setTimeout(tryScroll, SCROLL_RESTORE_RETRY_MS);
  }

  tryScroll();

  return () => {
    window.clearTimeout(timeoutId);
  };
}

export default function ReadingBookmark(): ReactNode {
  const isBrowser = useIsBrowser();
  const location = useLocation();
  const pathname = normalizePathname(location.pathname);
  const showOnPage = isBrowser && isContentPage(pathname);

  const [store, setStore] = useState<ReadingBookmarksStore>(() =>
    createClientStore(isBrowser),
  );
  const [offerVisible, setOfferVisible] = useState(false);
  const [offerTarget, setOfferTarget] = useState<number | undefined>(undefined);

  const pageState = getPageState(store, pathname);
  const hasBookmark = pageState?.bookmarkProgress !== undefined;

  useEffect(() => {
    if (!showOnPage) {
      setOfferVisible(false);
      setOfferTarget(undefined);
      return;
    }

    const latestStore = loadReadingBookmarksStore();
    setStore(latestStore);
    const jumpTarget = getJumpTarget(getPageState(latestStore, pathname));
    if (jumpTarget === undefined) {
      setOfferVisible(false);
      setOfferTarget(undefined);
      return;
    }

    const currentProgress = getScrollProgress();
    if (isNearProgress(currentProgress, jumpTarget)) {
      setOfferVisible(false);
      setOfferTarget(undefined);
      return;
    }

    setOfferTarget(jumpTarget);
    setOfferVisible(true);
  }, [pathname, showOnPage]);

  useEffect(() => {
    if (!showOnPage) {
      return;
    }

    let saveTimeoutId = 0;

    function handleScroll(): void {
      window.clearTimeout(saveTimeoutId);
      saveTimeoutId = window.setTimeout(() => {
        const progress = getScrollProgress();
        setStore((previousStore) => {
          const nextStore = setResumeProgress(previousStore, pathname, progress);
          saveReadingBookmarksStore(nextStore);
          return nextStore;
        });
      }, RESUME_SAVE_DELAY_MS);
    }

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.clearTimeout(saveTimeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, showOnPage]);

  function handleToggleBookmark(): void {
    setStore((previousStore) => {
      const currentPage = getPageState(previousStore, pathname);
      if (currentPage?.bookmarkProgress !== undefined) {
        const nextStore = clearBookmarkProgress(previousStore, pathname);
        saveReadingBookmarksStore(nextStore);
        return nextStore;
      }
      const progress = getScrollProgress();
      const nextStore = setBookmarkProgress(previousStore, pathname, progress);
      saveReadingBookmarksStore(nextStore);
      return nextStore;
    });
  }

  function handleJump(): void {
    if (offerTarget === undefined) {
      return;
    }
    const cancelRetries = scrollToProgressWhenReady(offerTarget);
    window.setTimeout(
      cancelRetries,
      SCROLL_RESTORE_RETRY_MS * SCROLL_RESTORE_ATTEMPTS,
    );
    setOfferVisible(false);
  }

  function handleDismissOffer(): void {
    setOfferVisible(false);
  }

  if (!showOnPage) {
    return null;
  }

  return (
    <div className={styles.dock} data-testid="reading-bookmark">
      {offerVisible && offerTarget !== undefined ? (
        <div className={styles.offer} data-testid="reading-bookmark-offer">
          <button
            type="button"
            className={styles.iconButton}
            aria-label={
              hasBookmark ? 'Continue from bookmark' : 'Resume reading'
            }
            data-testid="reading-bookmark-jump"
            onClick={handleJump}>
            <JumpIcon className={styles.icon} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Dismiss"
            data-testid="reading-bookmark-dismiss"
            onClick={handleDismissOffer}>
            <DismissIcon className={styles.icon} />
          </button>
        </div>
      ) : null}
      <button
        type="button"
        className={clsx(styles.iconButton, hasBookmark && styles.active)}
        aria-label={hasBookmark ? 'Remove bookmark' : 'Bookmark this position'}
        aria-pressed={hasBookmark}
        data-testid="reading-bookmark-toggle"
        onClick={handleToggleBookmark}>
        {hasBookmark ? (
          <BookmarkFilledIcon className={styles.icon} />
        ) : (
          <BookmarkIcon className={styles.icon} />
        )}
      </button>
    </div>
  );
}

function createClientStore(isBrowser: boolean): ReadingBookmarksStore {
  if (!isBrowser) {
    return createEmptyStore();
  }
  return loadReadingBookmarksStore();
}
