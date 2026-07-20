import {useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {LibraryAnchor} from '@site/src/components/Library';
import {
  CATALOG_PAGE_PATH,
  LIBRARY_GOALS,
  type LibraryGoal,
} from '@site/src/data/playbookLibrary';
import styles from './index.module.css';

function selectGoalById(goalId: string): LibraryGoal | undefined {
  return LIBRARY_GOALS.find((goal) => goal.id === goalId);
}

function handleGoalSelection(
  goalId: string,
  setSelectedGoalId: (goalId: string) => void,
): void {
  setSelectedGoalId(goalId);
}

function HomepageHeader(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={clsx('container', styles.heroInner)}>
        <p className={styles.heroEyebrow}>AI Playbook</p>
        <Heading as="h1" className={styles.heroTitle}>
          What do you want to do?
        </Heading>
        <p className={styles.heroSubtitle}>
          Pick one path. We show a short next-step list — not the whole library.
        </p>
      </div>
    </header>
  );
}

function GoalChooser({
  selectedGoalId,
  onSelectGoal,
}: {
  selectedGoalId: string;
  onSelectGoal: (goalId: string) => void;
}): ReactNode {
  return (
    <div className={styles.goalGrid} role="list">
      {LIBRARY_GOALS.map((goal) => {
        const isSelected = goal.id === selectedGoalId;

        function handleSelectGoal(): void {
          onSelectGoal(goal.id);
        }

        return (
          <button
            key={goal.id}
            type="button"
            role="listitem"
            className={clsx(styles.goalCard, isSelected && styles.goalCardSelected)}
            data-testid={`goal-${goal.id}`}
            aria-pressed={isSelected}
            onClick={handleSelectGoal}>
            <span className={styles.goalTitle}>{goal.title}</span>
            <span className={styles.goalDescription}>{goal.description}</span>
          </button>
        );
      })}
    </div>
  );
}

function ShortPath({goal}: {goal: LibraryGoal}): ReactNode {
  const firstStep = goal.steps[0];

  return (
    <section
      className={styles.pathPanel}
      aria-labelledby="short-path-heading"
      data-testid={`path-${goal.id}`}>
      <Heading as="h2" id="short-path-heading" className={styles.pathTitle}>
        Your next steps · {goal.title}
      </Heading>
      <p className={styles.pathLead}>
        One path only. Finish a step, then take the next.
      </p>
      <ol className={styles.stepList}>
        {goal.steps.map((step, index) => (
          <li key={`${goal.id}-${step.to}-${step.label}`} className={styles.stepItem}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <LibraryAnchor link={step} className={styles.stepLink} />
          </li>
        ))}
      </ol>
      <div className={styles.pathActions}>
        {firstStep ? (
          <LibraryAnchor
            link={{...firstStep, label: `Start: ${firstStep.label}`}}
            className="button button--primary"
          />
        ) : null}
        <Link className="button button--secondary" to={CATALOG_PAGE_PATH}>
          Browse all content
        </Link>
      </div>
    </section>
  );
}

function EscapeHatches(): ReactNode {
  return (
    <section className={styles.escapeSection} aria-labelledby="escape-heading">
      <Heading as="h2" id="escape-heading" className={styles.escapeTitle}>
        Looking for something specific?
      </Heading>
      <p className={styles.escapeLead}>
        Use search in the header, or open the full catalog when you need every
        page.
      </p>
      <div className={styles.escapeActions}>
        <Link className="button button--secondary" to={CATALOG_PAGE_PATH}>
          Browse all content
        </Link>
        <Link className={styles.escapeLink} to="/articles">
          Articles
        </Link>
        <Link className={styles.escapeLink} to="/notes">
          Daily Notes
        </Link>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const [selectedGoalId, setSelectedGoalId] = useState(LIBRARY_GOALS[0]?.id ?? 'learn');
  const selectedGoal = selectGoalById(selectedGoalId) ?? LIBRARY_GOALS[0];

  function onSelectGoal(goalId: string): void {
    handleGoalSelection(goalId, setSelectedGoalId);
  }

  return (
    <Layout
      title="Library"
      description="Choose Learn, Deliver, or Grow — a short next-step path for the AI Playbook.">
      <HomepageHeader />
      <main>
        <section className={styles.section} aria-labelledby="choose-path">
          <div className="container">
            <Heading as="h2" id="choose-path" className={styles.visuallyHidden}>
              Choose a path
            </Heading>
            <GoalChooser
              selectedGoalId={selectedGoalId}
              onSelectGoal={onSelectGoal}
            />
            {selectedGoal ? <ShortPath goal={selectedGoal} /> : null}
            <EscapeHatches />
          </div>
        </section>
      </main>
    </Layout>
  );
}
