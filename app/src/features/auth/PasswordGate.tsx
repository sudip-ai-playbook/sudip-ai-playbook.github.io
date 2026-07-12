import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { motion } from 'motion/react'
import { Lock, ArrowRight } from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '../../constants/playbook'
import { useAuth } from './useAuth'

export function PasswordGate() {
  const { unlock } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setIsLoading(true)
    setError(undefined)
    const ok = unlock(password)
    if (!ok) {
      setError('Incorrect password')
      setIsLoading(false)
      return
    }
    setIsLoading(false)
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value)
    if (error) {
      setError(undefined)
    }
  }

  return (
    <div className="playbook-bg flex min-h-screen items-center justify-center p-6" data-testid="password-gate">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative z-10 w-full max-w-md p-8"
      >
        <div className="mb-8 text-center">
          <p className="font-[family-name:var(--font-display)] text-3xl font-800 tracking-tight">
            <span className="text-shimmer">{APP_NAME}</span>
          </p>
          <p className="mt-2 text-sm text-ink-secondary">{APP_TAGLINE}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="password-form">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted" htmlFor="playbook-password">
            Enter playbook
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              id="playbook-password"
              data-testid="password-input"
              type="password"
              autoComplete="current-password"
              className="field-input pl-10"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
            />
          </div>
          {error ? (
            <p className="text-sm text-cayenne-red" data-testid="password-error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            data-testid="password-submit"
            className="btn btn-accent w-full"
            disabled={isLoading || password.length === 0}
          >
            Unlock
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Cross-cloud architecture decisions · AWS · Azure · GCP
        </p>
      </motion.div>
    </div>
  )
}
