import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type PathCard = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
};

const PATHS: PathCard[] = [
  {
    eyebrow: 'Start here',
    title: 'Learn the method',
    description:
      'An 18-part guide from opportunity discovery through delivery, governance and adoption.',
    primaryLabel: 'Read the guide overview',
    primaryTo: '/ai-solution-engineering/overview',
    secondaryLabel: 'What is AI Solution Engineering?',
    secondaryTo: '/articles/what-is-ai-solution-engineering',
  },
  {
    eyebrow: 'Core framework',
    title: 'Apply 8D and VALUE',
    description:
      'Define → Deliver with stage gates, plus the VALUE quality check before you commit.',
    primaryLabel: 'Open the 8D framework',
    primaryTo: '/docs/ai-solution-engineering/8d-framework',
    secondaryLabel: 'VALUE quality gate',
    secondaryTo: '/docs/ai-solution-engineering/value-gate',
  },
  {
    eyebrow: 'Hands-on',
    title: 'Use the interactive tools',
    description:
      'Run workshops, compare cloud AI services, score decisions and export briefs.',
    primaryLabel: 'Open the playbook app',
    primaryTo: 'https://sudip-ai-playbook.github.io/',
    secondaryLabel: 'ConsultAI OS',
    secondaryTo: 'https://sudip-ai-playbook.github.io/consult',
  },
];

const PHASES = [
  {
    title: 'Discover & prioritise',
    description: 'Frame the problem, stakeholders and business case.',
    to: '/ai-solution-engineering/discovery',
  },
  {
    title: 'Design the solution',
    description: 'Architecture, data, RAG, agents and AI patterns.',
    to: '/ai-solution-engineering/architecture',
  },
  {
    title: 'Trust & operate',
    description: 'Security, governance, evaluation and FinOps.',
    to: '/ai-solution-engineering/security-privacy',
  },
  {
    title: 'Deliver & scale',
    description: 'Delivery, adoption, industries and consulting craft.',
    to: '/ai-solution-engineering/delivery',
  },
];

function isExternal(path: string): boolean {
  return path.startsWith('http://') || path.startsWith('https://');
}

function PathCardLink({card}: {card: PathCard}): ReactNode {
  const primaryProps = isExternal(card.primaryTo)
    ? {href: card.primaryTo}
    : {to: card.primaryTo};

  return (
    <article className={styles.pathCard}>
      <p className={styles.pathEyebrow}>{card.eyebrow}</p>
      <Heading as="h2" className={styles.pathTitle}>
        {card.title}
      </Heading>
      <p className={styles.pathDescription}>{card.description}</p>
      <div className={styles.pathActions}>
        <Link className="button button--primary" {...primaryProps}>
          {card.primaryLabel}
        </Link>
        {card.secondaryLabel && card.secondaryTo ? (
          isExternal(card.secondaryTo) ? (
            <Link className={styles.pathSecondary} href={card.secondaryTo}>
              {card.secondaryLabel}
            </Link>
          ) : (
            <Link className={styles.pathSecondary} to={card.secondaryTo}>
              {card.secondaryLabel}
            </Link>
          )
        ) : null}
      </div>
    </article>
  );
}

function HomepageHeader(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={clsx('container', styles.heroInner)}>
        <p className={styles.heroEyebrow}>AI Solution Engineering Playbook</p>
        <Heading as="h1" className={styles.heroTitle}>
          Practical frameworks for enterprise AI solutions
        </Heading>
        <p className={styles.heroSubtitle}>
          Turn ambiguous business problems into secure, scalable and commercially
          valuable AI systems — with a clear path from learning to delivery.
        </p>
        <div className={styles.heroActions}>
          <Link
            className="button button--primary button--lg"
            to="/ai-solution-engineering/overview">
            Read the guide
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/ai-solution-engineering/8d-framework">
            View the 8D framework
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Practical frameworks for transforming ambiguous business problems into secure, scalable and commercially valuable AI solutions.">
      <HomepageHeader />
      <main>
        <section className={styles.section} aria-labelledby="choose-path">
          <div className="container">
            <Heading as="h2" id="choose-path" className={styles.sectionTitle}>
              Choose your path
            </Heading>
            <p className={styles.sectionLead}>
              Pick one starting point. Everything else stays one click away.
            </p>
            <div className={styles.pathGrid}>
              {PATHS.map((card) => (
                <PathCardLink key={card.title} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionMuted)} aria-labelledby="how-organised">
          <div className="container">
            <Heading as="h2" id="how-organised" className={styles.sectionTitle}>
              How the guide is organised
            </Heading>
            <p className={styles.sectionLead}>
              Four phases, eighteen chapters. Start at the phase that matches your current work.
            </p>
            <div className={styles.phaseGrid}>
              {PHASES.map((phase) => (
                <Link key={phase.title} className={styles.phaseCard} to={phase.to}>
                  <h3 className={styles.phaseTitle}>{phase.title}</h3>
                  <p className={styles.phaseDescription}>{phase.description}</p>
                  <span className={styles.phaseCta}>Open this phase</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="next-steps">
          <div className={clsx('container', styles.nextPanel)}>
            <div>
              <Heading as="h2" id="next-steps" className={styles.sectionTitle}>
                What to do next
              </Heading>
              <p className={styles.sectionLead}>
                New here? Read the overview, then skim 8D. Returning? Search for a term (RAG,
                FinOps, GDPR) or jump into articles and the app.
              </p>
            </div>
            <div className={styles.nextActions}>
              <Link className="button button--primary" to="/ai-solution-engineering/overview">
                Start with the overview
              </Link>
              <Link className="button button--secondary" to="/articles">
                Browse articles
              </Link>
              <Link
                className="button button--secondary"
                to="/docs/playbook-page-template">
                View page template
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
