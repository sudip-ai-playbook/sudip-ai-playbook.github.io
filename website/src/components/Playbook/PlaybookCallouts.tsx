import type {ReactNode} from 'react';
import clsx from 'clsx';

import styles from './PlaybookCallouts.module.css';

type CalloutProps = {
  children: ReactNode;
  className?: string;
};

type LabeledCalloutProps = CalloutProps & {
  title?: string;
};

export function SeriesMeta({
  page,
  total = 18,
  trail,
}: {
  page: number;
  total?: number;
  trail?: ReactNode;
}): ReactNode {
  return (
    <div className="ase-series-meta" role="note">
      <span>
        <strong>Guide</strong> · Enterprise AI Solution Engineering
      </span>
      <span>
        Page {page} of {total}
      </span>
      {trail ? <span>{trail}</span> : null}
    </div>
  );
}

export function ExecSummary({
  title = 'Executive summary',
  children,
  className,
}: LabeledCalloutProps): ReactNode {
  return (
    <aside className={clsx(styles.callout, styles.exec, className)} aria-label={title}>
      <p className={styles.label}>{title}</p>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}

export function WhenToUse({
  title = 'When to use this page',
  children,
  className,
}: LabeledCalloutProps): ReactNode {
  return (
    <aside className={clsx(styles.callout, styles.when, className)} aria-label={title}>
      <p className={styles.label}>{title}</p>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}

export function DecisionBox({
  title = 'Decision required',
  children,
  className,
}: LabeledCalloutProps): ReactNode {
  return (
    <aside className={clsx(styles.callout, styles.decision, className)} aria-label={title}>
      <p className={styles.label}>{title}</p>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}

export function RiskBox({
  title = 'Risk',
  control,
  children,
  className,
}: LabeledCalloutProps & {control?: ReactNode}): ReactNode {
  return (
    <aside className={clsx(styles.callout, styles.risk, className)} aria-label={title}>
      <p className={styles.label}>{title}</p>
      <div className={styles.body}>{children}</div>
      {control ? (
        <div className={styles.control}>
          <p className={styles.controlLabel}>Control</p>
          <div>{control}</div>
        </div>
      ) : null}
    </aside>
  );
}

export function DeliverableBox({
  title = 'Output',
  children,
  className,
}: LabeledCalloutProps): ReactNode {
  return (
    <aside className={clsx(styles.callout, styles.deliverable, className)} aria-label={title}>
      <p className={styles.label}>{title}</p>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}

export function RoleBox({
  title = 'Owners',
  owner,
  contributors,
  className,
}: {
  title?: string;
  owner: ReactNode;
  contributors?: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <aside className={clsx(styles.callout, styles.role, className)} aria-label={title}>
      <p className={styles.label}>{title}</p>
      <div className={styles.body}>
        <p>
          <strong>Owner</strong> · {owner}
        </p>
        {contributors ? (
          <p>
            <strong>Contributors</strong> · {contributors}
          </p>
        ) : null}
      </div>
    </aside>
  );
}

export function AudienceSplit({
  executive,
  technical,
}: {
  executive: ReactNode;
  technical: ReactNode;
}): ReactNode {
  return (
    <div className={styles.audienceGrid}>
      <section className={clsx(styles.callout, styles.audience)} aria-labelledby="ase-exec-view">
        <h3 id="ase-exec-view" className={styles.audienceTitle}>
          Executive view
        </h3>
        <div className={styles.body}>{executive}</div>
      </section>
      <section className={clsx(styles.callout, styles.audience)} aria-labelledby="ase-tech-view">
        <h3 id="ase-tech-view" className={styles.audienceTitle}>
          Technical view
        </h3>
        <div className={styles.body}>{technical}</div>
      </section>
    </div>
  );
}

export function KeyTakeaways({
  title = 'Key takeaways',
  children,
  className,
}: LabeledCalloutProps): ReactNode {
  return (
    <aside className={clsx(styles.callout, styles.takeaways, className)} aria-label={title}>
      <p className={styles.label}>{title}</p>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}

export function NextSteps({
  title = 'What to do next',
  children,
  className,
}: LabeledCalloutProps): ReactNode {
  return (
    <aside className={clsx(styles.callout, styles.next, className)} aria-label={title}>
      <p className={styles.label}>{title}</p>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}

export function Checklist({
  title = 'Decision checklist',
  children,
  className,
}: LabeledCalloutProps): ReactNode {
  return (
    <div className={clsx('ase-checklist', className)}>
      {title ? <h3>{title}</h3> : null}
      {children}
    </div>
  );
}
