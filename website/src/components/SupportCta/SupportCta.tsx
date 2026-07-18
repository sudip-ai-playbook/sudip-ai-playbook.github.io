import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import {
  BUY_ME_A_COFFEE_URL,
  KO_FI_URL,
  SUPPORT_HEADING,
  SUPPORT_LEAD,
} from '@site/src/constants/support';

import styles from './SupportCta.module.css';

type SupportCtaProps = {
  variant?: 'panel' | 'compact';
  headingId?: string;
};

export default function SupportCta({
  variant = 'panel',
  headingId = 'support-playbook',
}: SupportCtaProps): ReactNode {
  const isPanel = variant === 'panel';

  return (
    <aside
      className={clsx(isPanel ? styles.panel : styles.compact)}
      aria-labelledby={headingId}
      data-testid="support-cta">
      <div>
        <Heading as="h2" id={headingId} className={styles.title}>
          {SUPPORT_HEADING}
        </Heading>
        <p className={styles.lead}>{SUPPORT_LEAD}</p>
      </div>
      <div className={styles.actions}>
        <Link className="button button--primary" href={BUY_ME_A_COFFEE_URL}>
          Buy me a coffee
        </Link>
        <Link className="button button--secondary" href={KO_FI_URL}>
          Support on Ko-fi
        </Link>
      </div>
    </aside>
  );
}
