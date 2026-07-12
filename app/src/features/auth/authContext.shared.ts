import { createContext } from 'react'

export interface AuthContextValue {
  authenticated: boolean
  unlock: (password: string) => boolean
  lock: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
