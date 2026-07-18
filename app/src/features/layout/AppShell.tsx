import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Coffee, Heart } from 'lucide-react'
import {
  APP_NAME,
  BLOG_BASE_PATH,
  BUY_ME_A_COFFEE_URL,
  KO_FI_URL,
  NAV_ITEMS,
} from '../../constants/playbook'
import { JourneyRail } from '../journey/JourneyRail'

const SUPPORT_LINK_CLASS_NAME =
  'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-secondary transition hover:bg-white/70 hover:text-ink sm:text-sm'

export function AppShell() {
  return (
    <div className="playbook-bg min-h-screen" data-testid="app-shell">
      <header className="relative z-20 border-b border-slate-blue/15 bg-white/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <NavLink
            to="/"
            end
            data-testid="brand-home"
            className="font-[family-name:var(--font-display)] text-lg font-700 text-indigo-velvet"
          >
            {APP_NAME}
          </NavLink>
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
                      ? 'bg-slate-blue/15 text-indigo-velvet'
                      : 'text-ink-secondary hover:bg-white/70 hover:text-ink',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={BLOG_BASE_PATH}
              data-testid="nav-blog"
              className={`ml-1 ${SUPPORT_LINK_CLASS_NAME}`}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Learn
            </a>
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-buy-me-a-coffee"
              className={SUPPORT_LINK_CLASS_NAME}
            >
              <Coffee className="h-3.5 w-3.5" aria-hidden />
              Coffee
            </a>
            <a
              href={KO_FI_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-ko-fi"
              className={SUPPORT_LINK_CLASS_NAME}
            >
              <Heart className="h-3.5 w-3.5" aria-hidden />
              Ko-fi
            </a>
          </nav>
        </div>
      </header>
      <JourneyRail />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
