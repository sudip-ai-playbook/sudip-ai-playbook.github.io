import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { APP_NAME } from '../../constants/playbook'
import { getJourneyProgress } from '../journey/journey.gates'
import { isFrameComplete } from '../journey/project.logic'
import { useProject } from '../journey/useProject'

export function HubView() {
  const { project } = useProject()
  const framed = isFrameComplete(project)
  const progress = getJourneyProgress(project)
  const architecturePath = framed ? progress.nextOpenPath : '/frame'
  const ctaLabel = framed ? 'Continue' : 'Start'

  return (
    <div
      data-testid="hub-view"
      className="flex min-h-[calc(100vh-7.5rem)] flex-col items-center justify-center px-2 py-10 text-center sm:min-h-[calc(100vh-6.5rem)]"
    >
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-2xl flex-col items-center"
        aria-labelledby="hub-hero-heading"
      >
        <p
          className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.04em] text-ink sm:text-4xl md:text-5xl"
          data-testid="hub-brand"
        >
          {APP_NAME}
        </p>
        <h1
          id="hub-hero-heading"
          className="mt-8 font-[family-name:var(--font-display)] text-xl font-600 tracking-[0.02em] text-ink sm:text-2xl"
        >
          From ambiguity to decision.
        </h1>
        <p className="mt-3 max-w-md text-sm font-normal leading-relaxed text-ink-secondary sm:text-base">
          Frame, compare, and brief stakeholders in one path.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <Link
            to={architecturePath}
            className="btn btn-primary px-8"
            data-testid="hub-primary-cta"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}
