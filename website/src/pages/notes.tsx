import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import DailyNotes from '@site/src/components/DailyNotes';

import styles from './notes.module.css';

export default function NotesPage(): ReactNode {
  return (
    <Layout
      title="Daily Notes"
      description="Personal daily tasks stored only in this browser."
      noFooter>
      <main className={styles.main}>
        <div className="container">
          <DailyNotes />
        </div>
      </main>
    </Layout>
  );
}
