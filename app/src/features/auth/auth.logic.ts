import { AUTH_STORAGE_KEY, AUTH_TOKEN, PLAYBOOK_PASSWORD } from '../../constants/playbook'

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === AUTH_TOKEN
}

export function unlockWithPassword(password: string): boolean {
  if (password.trim() !== PLAYBOOK_PASSWORD) {
    return false
  }
  sessionStorage.setItem(AUTH_STORAGE_KEY, AUTH_TOKEN)
  return true
}

export function lockPlaybook(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}
