import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  type LucideIcon,
} from 'lucide-react'
import { LEARNING_MAP_PATH } from '../../constants/playbook'
import { WorkspaceSyncPanel } from '../persistence'
import { getJourneyProgress } from '../journey/journey.gates'
import { isFrameComplete } from '../journey/project.logic'
import { useProject } from '../journey/useProject'

type SecondaryPath = {
  testId: string
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  icon: LucideIcon
} & ({ to: string; href?: never } | { href: string; to?: never })

function SecondaryPathCard({ path }: { path: SecondaryPath }) {
  const className =
    'glass-card block h-full p-5 transition hover:-translate-y-0.5'
  const Icon = path.icon
  const content = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-blue">
        {path.eyebrow}
      </p>
      <div className="mt-3 flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-blue" aria-hidden />
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-base font-600 tracking-wide text-ink">
            {path.title}
          </h3>
          <p className="mt-1 text-sm font-normal text-ink-secondary">{path.description}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink">
            {path.primaryLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </>
  )

  if (path.href !== undefined) {
    return (
      <a href={path.href} data-testid={path.testId} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link to={path.to} data-testid={path.testId} className={className}>
      {content}
    </Link>
  )
}

export function HubView() {
  const { project } = useProject()
  const framed = isFrameComplete(project)
  const progress = getJourneyProgress(project)
  const architecturePath = framed ? progress.nextOpenPath : '/frame'

  const secondaryPaths: SecondaryPath[] = [
    {
      testId: 'start-consulting',
      eyebrow: 'Engagement workspace',
      title: 'Run a consulting engagement',
      description:
        'Workshops, stage gates, decisions and deliverables when you need the full engagement OS.',
      primaryLabel: 'Open engagement workspace',
      icon: Briefcase,
      to: '/consult',
    },
    {
      testId: 'path-learn',
      eyebrow: 'Learn',
      title: 'Open the Learning Map',
      description: 'Practice-first topics with scenarios and exercises — no toolkit required.',
      primaryLabel: 'Start the Learning Map',
      icon: BookOpen,
      href: LEARNING_MAP_PATH,
    },
  ]

  return (
    <div data-testid="hub-view" className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 sm:p-10"
        aria-labelledby="hub-hero-heading"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-blue">
          Primary path
        </p>
        <h1
          id="hub-hero-heading"
          className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em] text-ink sm:text-4xl"
        >
          Turn ambiguous AI problems into clear decisions
        </h1>
        <p className="mt-4 max-w-xl text-base font-normal leading-relaxed text-ink-secondary">
          Frame the outcome, compare cloud options, score trade-offs, and export a stakeholder
          brief — one guided architecture journey.
        </p>
        {framed ? (
          <p className="mt-3 text-sm text-ink-muted" data-testid="hub-progress">
            Progress: {progress.completedCount} of {progress.totalCount} steps · Working on:{' '}
            <span className="font-medium text-ink">{project.outcome}</span>
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={architecturePath}
            className="btn btn-primary"
            data-testid="hub-primary-cta"
          >
            <Compass className="h-4 w-4" aria-hidden />
            {framed ? 'Continue architecture journey' : 'Start architecture journey'}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            to={architecturePath}
            className="btn btn-ghost"
            data-testid="start-journey"
          >
            {framed ? 'Resume where you left off' : 'Begin with Frame'}
          </Link>
        </div>
      </motion.section>

      <section aria-labelledby="hub-secondary-heading">
        <h2
          id="hub-secondary-heading"
          className="font-[family-name:var(--font-display)] text-xl font-600 tracking-[0.02em]"
        >
          Need something else?
        </h2>
        <p className="mt-1 text-sm font-normal text-ink-muted">
          Secondary paths for engagement delivery and learning — keep architecture as the default.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {secondaryPaths.map((path, index) => (
            <motion.div
              key={path.testId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SecondaryPathCard path={path} />
            </motion.div>
          ))}
        </div>
      </section>

      <WorkspaceSyncPanel />
    </div>
  )
}
