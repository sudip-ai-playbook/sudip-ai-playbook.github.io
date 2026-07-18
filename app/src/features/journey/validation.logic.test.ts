import { describe, expect, it } from 'vitest'
import {
  areAllValidationChecksComplete,
  countCompletedValidationChecks,
  createEmptyValidationChecks,
  normalizeValidationChecks,
} from './validation.logic'

describe('validation.logic', () => {
  it('normalizes missing checks to false', () => {
    expect(normalizeValidationChecks(undefined).residency).toBe(false)
    expect(countCompletedValidationChecks(createEmptyValidationChecks())).toBe(0)
  })

  it('counts completed checks', () => {
    const checks = normalizeValidationChecks({ residency: true, security: true })
    expect(countCompletedValidationChecks(checks)).toBe(2)
    expect(areAllValidationChecksComplete(checks)).toBe(false)
    expect(
      areAllValidationChecksComplete({
        residency: true,
        security: true,
        sla: true,
        finops: true,
        poc: true,
      }),
    ).toBe(true)
  })
})
