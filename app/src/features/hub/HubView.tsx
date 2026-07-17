import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Map,
  GitCompare,
  Zap,
  Scale,
  DollarSign,
  PenTool,
  Brain,
  ArrowRight,
  Compass,
  FileCheck,
  Briefcase,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'
import { BLOG_BASE_PATH, BLOG_FEATURED_LINKS } from '../../constants/playbook'
import { isFrameComplete } from '../journey/project.logic'
import { useProject } from '../journey/useProject'

type PlaneAccent = 'blue' | 'amber' | 'orange' | 'red'

type PlaneLink = {
  title: string
  desc: string
  icon: LucideIcon
  accent: PlaneAccent
} & ({ to: string; href?: never } | { href: string; to?: never })

const PLANES: PlaneLink[] = [
  {
    href: BLOG_BASE_PATH,
    title: 'Playbook Blog',
    desc: 'AI Solution Engineering, 8D, and AI engineering notes',
    icon: BookOpen,
    accent: 'blue',
  },
  {
    to: '/consult',
    title: 'ConsultAI OS',
    desc: 'Full consulting OS: home, workspaces, journey, centres & copilot',
    icon: Briefcase,
    accent: 'blue',
  },
  { to: '/map', title: 'Architecture Map', desc: 'Locate the layer', icon: Map, accent: 'blue' },
  { to: '/picks', title: 'Quick Picks', desc: 'Scenario defaults', icon: Zap, accent: 'orange' },
  {
    to: '/compare',
    title: 'Service Compare',
    desc: '268 scored capabilities',
    icon: GitCompare,
    accent: 'amber',
  },
  { to: '/decide', title: 'Decision Assistant', desc: 'Weighted trade-offs', icon: Scale, accent: 'blue' },
  { to: '/finops', title: 'LLM FinOps', desc: 'Model cost & alternatives', icon: DollarSign, accent: 'amber' },
  { to: '/canvas', title: 'Build Canvas', desc: 'Assemble the stack', icon: PenTool, accent: 'orange' },
  { to: '/ai', title: 'AI Platform', desc: 'Governance deep dive', icon: Brain, accent: 'red' },
  { to: '/summary', title: 'Record', desc: 'Export decision brief', icon: FileCheck, accent: 'blue' },
]

const ACCENT_CLASS: Record<PlaneAccent, string> = {
  blue: 'glass-card-accent-blue',
  amber: 'glass-card-accent-amber',
  orange: 'glass-card-accent-orange',
  red: 'glass-card-accent-red',
}

function planeTestId(plane: PlaneLink): string {
  if (plane.href !== undefined) {
    return 'plane-blog'
  }
  return `plane-${plane.to.replace('/', '')}`
}

function PlaneCard({ plane }: { plane: PlaneLink }) {
  const className = `glass-card ${ACCENT_CLASS[plane.accent]} block h-full p-4 hover:-translate-y-0.5`
  const content = (
    <>
      <plane.icon className="mb-2 h-5 w-5 text-slate-blue" />
      <h3 className="text-sm font-bold text-ink">{plane.title}</h3>
      <p className="mt-1 text-xs text-ink-secondary">{plane.desc}</p>
    </>
  )

  if (plane.href !== undefined) {
    return (
      <a href={plane.href} data-testid={planeTestId(plane)} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link to={plane.to} data-testid={planeTestId(plane)} className={className}>
      {content}
    </Link>
  )
}

export function HubView() {
  const { project } = useProject()
  const framed = isFrameComplete(project)
  const startPath = framed ? '/map' : '/frame'

  return (
    <div data-testid="hub-view" className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 text-center sm:p-12"
      >
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-800 tracking-tight sm:text-5xl">
          <span className="text-shimmer">Sudip AI Playbook</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-secondary">
          Architecture decisions, ConsultAI OS, and the{' '}
          <a href={BLOG_BASE_PATH} className="font-semibold text-indigo-velvet underline-offset-2 hover:underline">
            playbook blog
          </a>{' '}
          — filter by stage and share as HTML or Excel.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/consult" className="btn btn-accent" data-testid="start-consulting">
            <Briefcase className="h-4 w-4" />
            Open ConsultAI OS
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={BLOG_BASE_PATH} className="btn btn-ghost" data-testid="open-blog">
            <BookOpen className="h-4 w-4" />
            Open playbook blog
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link to={startPath} className="btn btn-ghost" data-testid="start-journey">
            <Compass className="h-4 w-4" />
            {framed ? 'Continue architecture journey' : 'Start architecture journey'}
          </Link>
          <Link to="/picks" className="btn btn-ghost" data-testid="jump-picks">
            Jump to Quick Picks
          </Link>
        </div>
        {framed ? (
          <p className="mx-auto mt-4 max-w-lg text-xs text-ink-muted" data-testid="hub-framed-outcome">
            Working on: {project.outcome}
          </p>
        ) : null}
      </motion.section>

      <section data-testid="hub-blog-featured">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-700">From the blog</h2>
          <a
            href={BLOG_BASE_PATH}
            className="text-xs font-semibold text-indigo-velvet hover:underline"
            data-testid="hub-blog-all"
          >
            View all posts
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {BLOG_FEATURED_LINKS.map((post) => (
            <a
              key={post.href}
              href={post.href}
              data-testid={`hub-blog-${post.href.split('/').filter(Boolean).pop()}`}
              className="glass-card glass-card-accent-blue block h-full p-4 hover:-translate-y-0.5"
            >
              <BookOpen className="mb-2 h-5 w-5 text-slate-blue" aria-hidden />
              <h3 className="text-sm font-bold text-ink">{post.title}</h3>
              <p className="mt-1 text-xs text-ink-secondary">{post.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-700">Or jump to a tool</h2>
          <p className="text-xs text-ink-muted">
            Stack {project.stack.length} ·{' '}
            {project.preferredProvider === 'undecided'
              ? 'provider TBD'
              : project.preferredProvider.toUpperCase()}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANES.map((plane, index) => (
            <motion.div
              key={plane.href ?? plane.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <PlaneCard plane={plane} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
