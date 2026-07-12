import { describe, expect, it } from 'vitest'
import {
  CONSULT_PERSONA,
  canEditEngagement,
  isClientFacingPersona,
  parseConsultPersona,
} from './roles.logic'

describe('roles.logic', () => {
  it('treats read-only as non-editable', () => {
    expect(canEditEngagement(CONSULT_PERSONA.READ_ONLY)).toBe(false)
    expect(canEditEngagement(CONSULT_PERSONA.CONSULTANT)).toBe(true)
  })

  it('detects client-facing personas', () => {
    expect(isClientFacingPersona(CONSULT_PERSONA.CLIENT_EXECUTIVE)).toBe(true)
    expect(isClientFacingPersona(CONSULT_PERSONA.CONSULTANT)).toBe(false)
  })

  it('parses unknown persona to consultant', () => {
    expect(parseConsultPersona('unknown')).toBe(CONSULT_PERSONA.CONSULTANT)
  })
})
