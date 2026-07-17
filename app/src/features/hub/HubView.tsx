import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  DollarSign,
  FileCheck,
  GitCompare,
  Map,
  PenTool,
  Scale,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  ARTICLES_PATH,
  BLOG_FEATURED_LINKS,
  GUIDE_OVERVIEW_PATH,
} from '../../constants/playbook'
import { isFrameComplete } from '../journey/project.logic'
import { useProject } from '../journey/useProject'

type PathCard = {
  testId: string
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  icon: LucideIcon
} & ({ to: string; href?: never } | { href: string; to?: never })

type ToolLink = {
  title: string
  desc: string
  icon: LucideIcon
  to: string
}

const TOOL_LINKS: ToolLink[] = [
  { to: '/map', title: 'Architecture Map', desc: 'Locate the layer', icon: Map },
  { to: '/picks', title: 'Quick Picks', desc: 'Scenario defaults', icon: Zap },
  { to: '/compare', title: 'Service Compare', desc: 'Cross-cloud capabilities', icon: GitCompare },
  { to: '/decide', title: 'Decision Assistant', desc: 'Weighted trade-offs', icon: Scale },
  { to: '/finops', title: 'LLM FinOps', desc: 'Model cost & alternatives', icon: DollarSign },
  { to: '/canvas', title: 'Build Canvas', desc: 'Assemble the stack', icon: PenTool },
  { to: '/summary', title: 'Record', desc: 'Export decision brief', icon: FileCheck },
]

function PathActionCard({ path }: { path: PathCard }) {
  const className =
    'glass-card glass-card-accent-blue block h-full p-5 transition hover:-translate-y-0.5'
  const Icon = path.icon
  const content = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-velvet">
        {path.eyebrow}
      </p>
      <div className="mt-3 flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-blue" aria-hidden />
        <div>
          <h2 className="text-base font-bold text-ink">{path.title}</h2>
          <p className="mt-1 text-sm text-ink-secondary">{path.description}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-velvet">
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
  const architecturePath = framed ? '/map' : '/frame'

  const paths: PathCard[] = [
    {
      testId: 'path-learn',
      eyebrow: 'Learn',
      title: 'Read the guide',
      description: '18-part curriculum and methodology notes for enterprise AI solutions.',
      primaryLabel: 'Open the guide overview',
      icon: BookOpen,
      href: GUIDE_OVERVIEW_PATH,
    },
    {
      testId: 'start-consulting',
      eyebrow: 'Engage',
      title: 'Run ConsultAI OS',
      description: 'Workshops, journey stages, decisions and deliverables in one workspace.',
      primaryLabel: 'Open ConsultAI OS',
      icon: Briefcase,
      to: '/consult',
    },
    {
      testId: 'start-journey',
      eyebrow: 'Architect',
      title: framed ? 'Continue architecture journey' : 'Choose architecture',
      description: framed
        ? `Working on: ${project.outcome}`
        : 'Frame the outcome, compare services, score trade-offs and export a brief.',
      primaryLabel: framed ? 'Continue where you left off' : 'Start architecture journey',
      icon: Compass,
      to: architecturePath,
    },
  ]

  return (
    <div data-testid="hub-view" className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 sm:p-10"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-velvet">
          AI Solution Engineering Playbook
        </p>
        <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-800 tracking-tight sm:text-4xl">
          Turn ambiguous AI problems into clear decisions
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink-secondary">
          One place to learn the method, run consulting engagements, and choose a cloud AI
          architecture — without hunting through every tool at once.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/consult" className="btn btn-accent" data-testid="hub-primary-cta">
            <Briefcase className="h-4 w-4" aria-hidden />
            Open ConsultAI OS
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href={GUIDE_OVERVIEW_PATH} className="btn btn-ghost" data-testid="open-blog">
            <BookOpen className="h-4 w-4" aria-hidden />
            Read the guide
          </a>
        </div>
      </motion.section>

      <section aria-labelledby="hub-paths-heading">
        <h2
          id="hub-paths-heading"
          className="font-[family-name:var(--font-display)] text-xl font-700"
        >
          Choose your path
        </h2>
        <p className="mt-1 text-sm text-ink-muted">Three starting points. Pick one.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {paths.map((path, index) => (
            <motion.div
              key={path.testId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PathActionCard path={path} />
            </motion.div>
          ))}
        </div>
      </section>

      <section data-testid="hub-blog-featured" aria-labelledby="hub-learn-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2
            id="hub-learn-heading"
            className="font-[family-name:var(--font-display)] text-xl font-700"
          >
            Featured reading
          </h2>
          <a
            href={ARTICLES_PATH}
            className="text-xs font-semibold text-indigo-velvet hover:underline"
            data-testid="hub-blog-all"
          >
            Browse all articles
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {BLOG_FEATURED_LINKS.map((post) => (
            <a
              key={post.href}
              href={post.href}
              data-testid={`hub-blog-${post.href.split('/').filter(Boolean).pop()}`}
              className="glass-card block h-full p-4 hover:-translate-y-0.5"
            >
              <h3 className="text-sm font-bold text-ink">{post.title}</h3>
              <p className="mt-1 text-xs text-ink-secondary">{post.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="hub-tools-heading">
        <h2
          id="hub-tools-heading"
          className="font-[family-name:var(--font-display)] text-xl font-700"
        >
          Architecture tools
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Jump to a specific step when you already know what you need.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOL_LINKS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              data-testid={`plane-${tool.to.replace('/', '')}`}
              className="glass-card flex items-start gap-3 p-3 hover:-translate-y-0.5"
            >
              <tool.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-blue" aria-hidden />
              <span>
                <span className="block text-sm font-bold text-ink">{tool.title}</span>
                <span className="mt-0.5 block text-xs text-ink-secondary">{tool.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
