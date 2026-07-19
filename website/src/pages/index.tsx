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
    eyebrow: 'Curriculum',
    title: 'Learning Map',
    description:
      '35 practice-first topics from business fundamentals to leadership — with scenarios and exercises you can use on live work.',
    primaryLabel: 'Open the Learning Map',
    primaryTo: '/learning-map/overview',
    secondaryLabel: 'How to practise',
    secondaryTo: '/learning-map/how-to-use',
  },
  {
    eyebrow: 'Engagement playbooks',
    title: 'Guide and Framework',
    description:
      '18-part delivery guide plus 8D and VALUE for stage gates and quality checks.',
    primaryLabel: 'Read the guide overview',
    primaryTo: '/ai-solution-engineering/overview',
    secondaryLabel: '8D framework',
    secondaryTo: '/docs/ai-solution-engineering/8d-framework',
  },
  {
    eyebrow: 'Engineering journeys',
    title: 'Roadmaps',
    description:
      'Stage-by-stage paths to production capabilities and engineering leadership — AI engineering, agents, management and more.',
    primaryLabel: 'Open roadmaps',
    primaryTo: '/roadmaps/overview',
    secondaryLabel: 'AI Engineer',
    secondaryTo: '/roadmaps/ai-engineer',
  },
  {
    eyebrow: 'Founder practice',
    title: 'Startup and Entrepreneurship',
    description:
      'Practitioner synthesis from CS183B / YC: ideas, product, team, execution, growth, culture, fundraising and scaling.',
    primaryLabel: 'Open the Startup section',
    primaryTo: '/startup-entrepreneurship/overview',
    secondaryLabel: 'Great ideas',
    secondaryTo: '/startup-entrepreneurship/great-ideas',
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
    title: 'Stage 1 · Business & consulting',
    description: 'Explain why the client should invest.',
    to: '/learning-map/stage-1-business-consulting',
  },
  {
    title: 'Stage 2 · AI & data',
    description: 'Judge technical feasibility.',
    to: '/learning-map/stage-2-ai-data',
  },
  {
    title: 'Stage 3–4 · Architecture & trust',
    description: 'Design enterprise-grade, governable solutions.',
    to: '/learning-map/stage-3-architecture-cloud',
  },
  {
    title: 'Stage 5–6 · Delivery & leadership',
    description: 'Ship to production and lead teams.',
    to: '/learning-map/stage-5-commercial-delivery',
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
            to="/learning-map/overview">
            Open the Learning Map
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/ai-solution-engineering/overview">
            Read the guide
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
              How the curriculum is organised
            </Heading>
            <p className={styles.sectionLead}>
              Six stages, thirty-five topics. Each page includes a scenario, practice exercise and
              expected outputs.
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
                New here? Start the Learning Map Stage 1. Returning? Search (RAG, FinOps, GDPR) or
                jump into the Guide and app.
              </p>
            </div>
            <div className={styles.nextActions}>
              <Link className="button button--primary" to="/learning-map/overview">
                Start the Learning Map
              </Link>
              <Link className="button button--secondary" to="/learning-map/competency-test">
                Take the competency test
              </Link>
              <Link className="button button--secondary" to="/articles">
                Browse articles
              </Link>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}
