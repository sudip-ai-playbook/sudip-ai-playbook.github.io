import { describe, expect, it } from 'vitest'
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN,
  PLAYBOOK_PASSWORD,
} from '../../constants/playbook'
import { isAuthenticated, lockPlaybook, unlockWithPassword } from './auth.logic'

describe('auth.logic', () => {
  it('rejects incorrect password', () => {
    expect(unlockWithPassword('wrong')).toBe(false)
    expect(isAuthenticated()).toBe(false)
  })

  it('unlocks with correct password and persists session', () => {
    expect(unlockWithPassword(PLAYBOOK_PASSWORD)).toBe(true)
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBe(AUTH_TOKEN)
    expect(isAuthenticated()).toBe(true)
  })

  it('locks and clears session', () => {
    unlockWithPassword(PLAYBOOK_PASSWORD)
    lockPlaybook()
    expect(isAuthenticated()).toBe(false)
  })
})
