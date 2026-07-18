import { describe, expect, it, beforeEach } from 'vitest'
import {
  FEEDBACK_STORAGE_KEY,
  addFeedbackEntry,
  exportFeedbackJson,
  isValidEaseScore,
  loadFeedbackEntries,
} from './feedback.logic'

describe('feedback.logic', () => {
  beforeEach(() => {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY)
  })

  it('stores and exports usability feedback', () => {
    expect(isValidEaseScore(0)).toBe(false)
    expect(isValidEaseScore(5)).toBe(true)
    const entries = addFeedbackEntry({
      role: 'consultant',
      task: 'Frame an outcome',
      easeScore: 4,
      blockers: 'Unclear next step after map',
      delight: 'Journey rail',
    })
    expect(entries).toHaveLength(1)
    expect(loadFeedbackEntries()).toHaveLength(1)
    expect(exportFeedbackJson(entries)).toContain('Frame an outcome')
  })
})
