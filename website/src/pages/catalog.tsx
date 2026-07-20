import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {CatalogTree} from '@site/src/components/Library';
import styles from './catalog.module.css';

export default function CatalogPage(): ReactNode {
  return (
    <Layout
      title="Browse all"
      description="Full AI Playbook catalog — Learning Map, Guide, Frameworks, Roadmaps, Startup, Articles, and Tools.">
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <p className={styles.eyebrow}>Full catalog</p>
          <Heading as="h1" className={styles.title}>
            Browse all content
          </Heading>
          <p className={styles.lead}>
            Every section and page in one tree. Prefer a short path? Go back to
            the Library home.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary" to="/">
              Back to Library home
            </Link>
            <Link className="button button--secondary" to="/articles">
              Articles
            </Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className="container">
          <CatalogTree openFirstBranch />
        </div>
      </main>
    </Layout>
  );
}
