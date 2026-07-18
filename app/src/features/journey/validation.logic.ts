export const VALIDATION_CHECK_IDS = [
  'residency',
  'security',
  'sla',
  'finops',
  'poc',
] as const

export type ValidationCheckId = (typeof VALIDATION_CHECK_IDS)[number]

export type ValidationChecks = Record<ValidationCheckId, boolean>

export const VALIDATION_CHECK_LABELS: Record<ValidationCheckId, string> = {
  residency: 'Region / data residency confirmed',
  security: 'Security and identity model reviewed',
  sla: 'SLA / quotas checked',
  finops: 'Cost / FinOps estimate reviewed',
  poc: 'Proof of value / PoC criteria defined',
}

export function createEmptyValidationChecks(): ValidationChecks {
  return {
    residency: false,
    security: false,
    sla: false,
    finops: false,
    poc: false,
  }
}

export function normalizeValidationChecks(
  value: Partial<ValidationChecks> | undefined,
): ValidationChecks {
  const empty = createEmptyValidationChecks()
  if (!value) return empty
  return VALIDATION_CHECK_IDS.reduce<ValidationChecks>((checks, id) => {
    checks[id] = Boolean(value[id])
    return checks
  }, empty)
}

export function countCompletedValidationChecks(checks: ValidationChecks): number {
  return VALIDATION_CHECK_IDS.reduce((count, id) => (checks[id] ? count + 1 : count), 0)
}

export function areAllValidationChecksComplete(checks: ValidationChecks): boolean {
  return countCompletedValidationChecks(checks) === VALIDATION_CHECK_IDS.length
}
