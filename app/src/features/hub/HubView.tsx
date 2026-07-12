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
} from 'lucide-react'
import meta from '../../data/meta.json'

const PLANES = [
  {
    to: '/map',
    title: 'Architecture Map',
    desc: '10 layers · start from outcomes, not products',
    icon: Map,
    accent: 'blue' as const,
  },
  {
    to: '/compare',
    title: 'Service Compare',
    desc: '268 scored capabilities across AWS · Azure · GCP',
    icon: GitCompare,
    accent: 'amber' as const,
  },
  {
    to: '/picks',
    title: 'Quick Picks',
    desc: 'Scenario defaults that cut search time',
    icon: Zap,
    accent: 'orange' as const,
  },
  {
    to: '/decide',
    title: 'Decision Assistant',
    desc: 'Weight criteria · adjust ecosystem context',
    icon: Scale,
    accent: 'blue' as const,
  },
  {
    to: '/finops',
    title: 'LLM FinOps',
    desc: 'Model costs, alternatives, and monthly estimates',
    icon: DollarSign,
    accent: 'amber' as const,
  },
  {
    to: '/canvas',
    title: 'Architecture Canvas',
    desc: 'Compose a stack · open in diagrams.net',
    icon: PenTool,
    accent: 'orange' as const,
  },
  {
    to: '/ai',
    title: 'AI Platform',
    desc: 'Foundry · Bedrock · Vertex · governance controls',
    icon: Brain,
    accent: 'red' as const,
  },
]

const ACCENT_CLASS = {
  blue: 'glass-card-accent-blue',
  amber: 'glass-card-accent-amber',
  orange: 'glass-card-accent-orange',
  red: 'glass-card-accent-red',
}

export function HubView() {
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
        <p className="mx-auto mt-4 max-w-2xl text-base text-ink-secondary sm:text-lg">
          End-to-end cloud architecture decisions — find the right service across every dimension.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          <span className="rounded-full bg-white/80 px-4 py-2 font-semibold text-ink-secondary">
            268 capabilities
          </span>
          <span className="rounded-full bg-white/80 px-4 py-2 font-semibold text-ink-secondary">
            3 clouds
          </span>
          <span className="rounded-full bg-white/80 px-4 py-2 font-semibold text-ink-secondary">
            FinOps + Canvas
          </span>
        </div>
      </motion.section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-700">Planes</h2>
          <p className="text-xs text-ink-muted">Less text · more signal</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANES.map((plane, index) => (
            <motion.div
              key={plane.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={plane.to}
                data-testid={`plane-${plane.to.replace('/', '') || 'hub'}`}
                className={`glass-card ${ACCENT_CLASS[plane.accent]} block h-full p-5 hover:-translate-y-0.5`}
              >
                <plane.icon className="mb-3 h-6 w-6 text-slate-blue" />
                <h3 className="font-bold text-ink">{plane.title}</h3>
                <p className="mt-1 text-sm text-ink-secondary">{plane.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-blue">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="glass-panel p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-700">Five steps</h2>
        <ol className="grid gap-3 sm:grid-cols-5">
          {meta.steps.map((step) => (
            <li key={step.step} className="rounded-xl bg-white/60 p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-blue/15 text-xs font-bold text-slate-blue">
                {step.step}
              </span>
              <p className="mt-2 text-sm font-bold text-ink">{step.title}</p>
              <p className="mt-1 text-xs text-ink-muted">{step.guardrail}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
