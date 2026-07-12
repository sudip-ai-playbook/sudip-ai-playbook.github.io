import { describe, expect, it } from 'vitest'
import {
  createAdHocFramework,
  getFrameworkByName,
  isSpecializedCanvas,
  resolveFrameworkId,
  resolveStageFrameworkNames,
  searchFrameworks,
} from './framework.logic'

describe('framework.logic', () => {
  it('resolves aliases to MVP framework ids', () => {
    expect(resolveFrameworkId('Value-versus-Feasibility Matrix')).toBe('valueFeasibility')
    expect(resolveFrameworkId('Five Whys')).toBe('fiveWhys')
    expect(resolveFrameworkId('NIST AI Risk Management Framework')).toBe('nistAiRmf')
  })

  it('returns null for unknown library names but can create ad-hoc workbooks', () => {
    expect(resolveFrameworkId('Completely Unknown Framework')).toBeNull()
    const adHoc = createAdHocFramework('Completely Unknown Framework')
    expect(adHoc.canvasType).toBe('guidedNotes')
    expect(adHoc.executable).toBe(true)
  })

  it('loads specialized MVP frameworks by name', () => {
    const mece = getFrameworkByName('MECE')
    expect(mece).toBeDefined()
    expect(mece && isSpecializedCanvas(mece)).toBe(true)
  })

  it('searches frameworks by purpose keywords', () => {
    const results = searchFrameworks('root cause')
    expect(results.some((entry) => entry.id === 'fiveWhys')).toBe(true)
  })

  it('resolves every stage framework name into a workable canvas', () => {
    const resolved = resolveStageFrameworkNames([
      'MECE',
      'MECE issue decomposition',
      'Fishbone Diagram',
      'SIPOC',
    ])
    expect(resolved.map((entry) => entry.id)).toEqual([
      'mece',
      'adhoc-fishbone-diagram',
      'sipoc',
    ])
    expect(resolved.every((entry) => entry.executable)).toBe(true)
  })
})
