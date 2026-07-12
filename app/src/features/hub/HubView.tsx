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
} from 'lucide-react'
import { isFrameComplete } from '../journey/project.logic'
import { useProject } from '../journey/useProject'

const PLANES = [
  {
    to: '/consult',
    title: 'ConsultAI OS',
    desc: 'Full consulting OS: home, workspaces, journey, centres & copilot',
    icon: Briefcase,
    accent: 'blue' as const,
  },
  { to: '/map', title: 'Architecture Map', desc: 'Locate the layer', icon: Map, accent: 'blue' as const },
  { to: '/picks', title: 'Quick Picks', desc: 'Scenario defaults', icon: Zap, accent: 'orange' as const },
  { to: '/compare', title: 'Service Compare', desc: '268 scored capabilities', icon: GitCompare, accent: 'amber' as const },
  { to: '/decide', title: 'Decision Assistant', desc: 'Weighted trade-offs', icon: Scale, accent: 'blue' as const },
  { to: '/finops', title: 'LLM FinOps', desc: 'Model cost & alternatives', icon: DollarSign, accent: 'amber' as const },
  { to: '/canvas', title: 'Build Canvas', desc: 'Assemble the stack', icon: PenTool, accent: 'orange' as const },
  { to: '/ai', title: 'AI Platform', desc: 'Governance deep dive', icon: Brain, accent: 'red' as const },
  { to: '/summary', title: 'Record', desc: 'Export decision brief', icon: FileCheck, accent: 'blue' as const },
]

const ACCENT_CLASS = {
  blue: 'glass-card-accent-blue',
  amber: 'glass-card-accent-amber',
  orange: 'glass-card-accent-orange',
  red: 'glass-card-accent-red',
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
          Architecture decisions plus an end-to-end AI consulting playbook — filter by stage and
          share as HTML or Excel.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/consult" className="btn btn-accent" data-testid="start-consulting">
            <Briefcase className="h-4 w-4" />
            Open ConsultAI OS
            <ArrowRight className="h-4 w-4" />
          </Link>
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

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-700">Or jump to a tool</h2>
          <p className="text-xs text-ink-muted">
            Stack {project.stack.length} · {project.preferredProvider === 'undecided' ? 'provider TBD' : project.preferredProvider.toUpperCase()}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANES.map((plane, index) => (
            <motion.div
              key={plane.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                to={plane.to}
                data-testid={`plane-${plane.to.replace('/', '')}`}
                className={`glass-card ${ACCENT_CLASS[plane.accent]} block h-full p-4 hover:-translate-y-0.5`}
              >
                <plane.icon className="mb-2 h-5 w-5 text-slate-blue" />
                <h3 className="text-sm font-bold text-ink">{plane.title}</h3>
                <p className="mt-1 text-xs text-ink-secondary">{plane.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
