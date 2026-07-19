import { Link, NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Coffee, ClipboardList, Heart, Notebook } from 'lucide-react'
import {
  APP_NAME,
  APP_TAGLINE,
  BLOG_BASE_PATH,
  BUY_ME_A_COFFEE_URL,
  DAILY_NOTES_PATH,
  KO_FI_URL,
  LEARNING_MAP_PATH,
  NAV_ITEMS,
} from '../../constants/playbook'
import { UndoToast } from '../guidance'
import { JourneyRail } from '../journey/JourneyRail'
import { JourneyCoach } from '../journey/JourneyCoach'
import { JourneyHelpHost } from '../journey/JourneyHelpHost'
import { JourneyKeyboardShortcuts } from '../journey/JourneyKeyboardShortcuts'

const FOOTER_LINK_CLASS =
  'inline-flex items-center gap-1.5 text-sm font-medium text-ink-secondary transition hover:text-ink'

export function AppShell() {
  return (
    <div className="playbook-bg flex min-h-screen flex-col" data-testid="app-shell">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2 focus:text-surface-soft"
      >
        Skip to main content
      </a>
      <header className="relative z-20 border-b border-ink/10 bg-white/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <NavLink
              to="/"
              end
              data-testid="brand-home"
              className="font-[family-name:var(--font-display)] text-lg font-600 tracking-[0.06em] text-ink"
            >
              {APP_NAME}
            </NavLink>
            <p className="truncate text-[11px] font-medium tracking-wide text-ink-muted">
              {APP_TAGLINE}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                data-testid={`nav-${item.id}`}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition sm:text-sm',
                    isActive
                      ? 'bg-slate-blue/15 text-ink'
                      : 'text-ink-secondary hover:bg-white/70 hover:text-ink',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={LEARNING_MAP_PATH}
              data-testid="nav-blog"
              className="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-secondary transition hover:bg-white/70 hover:text-ink sm:text-sm"
            >
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                Learn
              </span>
            </a>
            <a
              href={DAILY_NOTES_PATH}
              data-testid="nav-notes"
              aria-label="Daily Notes"
              title="Daily Notes"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition hover:bg-white/70 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-blue active:scale-95"
            >
              <Notebook className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </a>
          </nav>
        </div>
      </header>
      <JourneyRail />
      <main
        id="main-content"
        className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
        tabIndex={-1}
      >
        <JourneyCoach />
        <JourneyHelpHost />
        <Outlet />
      </main>
      <footer
        className="relative z-10 border-t border-ink/10 bg-white/40 backdrop-blur-md"
        data-testid="app-footer"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <p className="text-xs text-ink-muted">
            Built for consultants who turn ambiguity into decisions.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={BLOG_BASE_PATH} className={FOOTER_LINK_CLASS} data-testid="footer-learn">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Learning Map
            </a>
            <Link to="/research" className={FOOTER_LINK_CLASS} data-testid="footer-research">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden />
              Research
            </Link>
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={FOOTER_LINK_CLASS}
              data-testid="nav-buy-me-a-coffee"
            >
              <Coffee className="h-3.5 w-3.5" aria-hidden />
              Coffee
            </a>
            <a
              href={KO_FI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={FOOTER_LINK_CLASS}
              data-testid="nav-ko-fi"
            >
              <Heart className="h-3.5 w-3.5" aria-hidden />
              Ko-fi
            </a>
            <Link to="/" className={FOOTER_LINK_CLASS}>
              Home
            </Link>
          </div>
        </div>
      </footer>
      <UndoToast />
      <JourneyKeyboardShortcuts />
    </div>
  )
}
