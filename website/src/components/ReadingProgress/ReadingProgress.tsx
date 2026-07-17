import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';

import styles from './ReadingProgress.module.css';

function getScrollProgress(): number {
  const documentElement = document.documentElement;
  const scrollTop = window.scrollY || documentElement.scrollTop;
  const scrollHeight = documentElement.scrollHeight - documentElement.clientHeight;
  if (scrollHeight <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
}

export default function ReadingProgress(): ReactNode {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll(): void {
      setProgress(getScrollProgress());
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}>
      <div className={styles.bar} style={{width: `${progress}%`}} />
    </div>
  );
}
