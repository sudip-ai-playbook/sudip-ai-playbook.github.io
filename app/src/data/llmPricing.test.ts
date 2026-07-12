import { describe, expect, it } from 'vitest'
import {
  LLM_MODELS,
  getAlternatives,
  getModelById,
  sortModelsByBlendedCost,
} from './llmPricing'

describe('llmPricing', () => {
  it('contains models from all three clouds', () => {
    const providers = new Set(LLM_MODELS.map((model) => model.provider))
    expect(providers.has('azure')).toBe(true)
    expect(providers.has('aws')).toBe(true)
    expect(providers.has('gcp')).toBe(true)
  })

  it('resolves alternatives for a selected model', () => {
    const model = getModelById('azure-gpt-5')
    expect(model).toBeDefined()
    const alternatives = getAlternatives(model!)
    expect(alternatives.length).toBeGreaterThan(0)
  })

  it('sorts by blended token cost ascending', () => {
    const sorted = sortModelsByBlendedCost(LLM_MODELS)
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    const firstBlended = first.inputPerMillion * 0.7 + first.outputPerMillion * 0.3
    const lastBlended = last.inputPerMillion * 0.7 + last.outputPerMillion * 0.3
    expect(firstBlended).toBeLessThanOrEqual(lastBlended)
  })
})
