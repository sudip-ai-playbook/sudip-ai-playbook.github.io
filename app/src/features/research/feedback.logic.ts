export const FEEDBACK_STORAGE_KEY = 'sudip-ai-playbook-usability-feedback'
export const FEEDBACK_ROLES = [
  'consultant',
  'engagement_manager',
  'solution_engineer',
  'executive',
  'other',
] as const

export type FeedbackRole = (typeof FEEDBACK_ROLES)[number]

export type UsabilityFeedback = {
  id: string
  createdAt: string
  role: FeedbackRole
  task: string
  easeScore: number
  blockers: string
  delight: string
}

export function createFeedbackId(): string {
  return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function loadFeedbackEntries(): UsabilityFeedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as UsabilityFeedback[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveFeedbackEntries(entries: UsabilityFeedback[]): void {
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(entries))
}

export function addFeedbackEntry(
  input: Omit<UsabilityFeedback, 'id' | 'createdAt'>,
): UsabilityFeedback[] {
  const entry: UsabilityFeedback = {
    ...input,
    id: createFeedbackId(),
    createdAt: new Date().toISOString(),
  }
  const next = [entry, ...loadFeedbackEntries()]
  saveFeedbackEntries(next)
  return next
}

export function exportFeedbackJson(entries: UsabilityFeedback[]): string {
  return `${JSON.stringify({ kind: 'sudip-ai-playbook-usability-feedback', entries }, null, 2)}\n`
}

export function isValidEaseScore(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5
}
