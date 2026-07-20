import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import {
  LIBRARY_SECTIONS,
  type LibraryBranch,
  type LibrarySection,
} from '@site/src/data/playbookLibrary';
import LibraryAnchor from './LibraryAnchor';
import styles from './library.module.css';

function BranchTree({
  section,
  branch,
  defaultOpen,
}: {
  section: LibrarySection;
  branch: LibraryBranch;
  defaultOpen: boolean;
}): ReactNode {
  return (
    <details className={styles.branch} open={defaultOpen}>
      <summary className={styles.branchSummary}>
        <span className={styles.branchTitle}>{branch.title}</span>
        <span className={styles.branchCount}>{branch.links.length}</span>
      </summary>
      <ul className={styles.treeList}>
        {branch.links.map((link) => (
          <li key={`${section.id}-${branch.id}-${link.to}-${link.label}`}>
            <LibraryAnchor link={link} className={styles.treeLink} />
          </li>
        ))}
      </ul>
    </details>
  );
}

type CatalogTreeProps = {
  /** When true, only the first branch in each section starts open. */
  openFirstBranch?: boolean;
};

export default function CatalogTree({
  openFirstBranch = false,
}: CatalogTreeProps): ReactNode {
  return (
    <div className={styles.catalogList}>
      <nav className={styles.catalogJump} aria-label="Catalog sections">
        {LIBRARY_SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.number} {section.title}
          </a>
        ))}
      </nav>
      {LIBRARY_SECTIONS.map((section) => (
        <article
          key={section.id}
          id={section.id}
          className={styles.catalogCard}
          data-testid={`section-${section.id}`}>
          <div className={styles.catalogHeader}>
            <span className={styles.catalogNumber}>{section.number}</span>
            <div>
              <Heading as="h2" className={styles.catalogTitle}>
                {section.title}
              </Heading>
              <p className={styles.catalogSummary}>{section.summary}</p>
            </div>
            <LibraryAnchor
              link={section.overview}
              className={styles.catalogOverview}
            />
          </div>
          <div className={styles.branchList}>
            {section.branches.map((branch, branchIndex) => (
              <BranchTree
                key={branch.id}
                section={section}
                branch={branch}
                defaultOpen={openFirstBranch && branchIndex === 0}
              />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
