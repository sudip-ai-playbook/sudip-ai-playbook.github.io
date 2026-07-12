import type { ReactNode } from 'react'
import { createElement, useMemo, useState, useCallback } from 'react'
import { isAuthenticated, lockPlaybook, unlockWithPassword } from './auth.logic'
import { AuthContext } from './authContext.shared'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated())

  const unlock = useCallback((password: string): boolean => {
    const ok = unlockWithPassword(password)
    if (ok) {
      setAuthenticated(true)
    }
    return ok
  }, [])

  const lock = useCallback(() => {
    lockPlaybook()
    setAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      authenticated,
      unlock,
      lock,
    }),
    [authenticated, unlock, lock],
  )

  return createElement(AuthContext.Provider, { value }, children)
}
