import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, Info } from 'lucide-react'

type CoachBannerProps = {
  testId: string
  tone: 'info' | 'warning'
  title: string
  message: string
  actionLabel?: string
  actionTo?: string
}

export function CoachBanner({
  testId,
  tone,
  title,
  message,
  actionLabel,
  actionTo,
}: CoachBannerProps) {
  const Icon = tone === 'warning' ? AlertCircle : Info
  const toneClass =
    tone === 'warning'
      ? 'border-tiger-orange/30 bg-amber-flame/15 text-ink'
      : 'border-slate-blue/25 bg-slate-blue/10 text-ink'

  return (
    <aside
      data-testid={testId}
      role="status"
      className={`flex flex-wrap items-start justify-between gap-3 rounded-xl border px-4 py-3 ${toneClass}`}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-blue" aria-hidden />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm text-ink-secondary">{message}</p>
        </div>
      </div>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="btn btn-primary" data-testid={`${testId}-action`}>
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </aside>
  )
}
