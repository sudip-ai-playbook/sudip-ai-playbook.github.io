import { describe, expect, it } from 'vitest'
import {
  applyContextAdjustments,
  computeWeightedScores,
  estimateTokenCost,
  filterServices,
  monthlyCostFromDaily,
  normalizeWeights,
  recommendProvider,
  type CapabilityScores,
} from './decide.logic'
import { DEFAULT_CRITERIA_WEIGHTS } from '../../constants/playbook'

const sampleCapability: CapabilityScores = {
  capability: 'Managed foundation-model platform',
  layer: '07 AI & Intelligent Systems',
  subcategory: 'Foundation Models & GenAI',
  aws: 'Amazon Bedrock',
  azure: 'Microsoft Foundry',
  gcp: 'Vertex AI',
  awsDepth: 4,
  awsEase: 4,
  awsEnterprise: 4,
  awsDataAi: 4,
  awsPortability: 3,
  awsOperations: 4,
  awsCost: 3.5,
  azureDepth: 4.2,
  azureEase: 4,
  azureEnterprise: 4.5,
  azureDataAi: 4,
  azurePortability: 3,
  azureOperations: 4,
  azureCost: 3.5,
  gcpDepth: 4.5,
  gcpEase: 4.2,
  gcpEnterprise: 4,
  gcpDataAi: 4.8,
  gcpPortability: 3.2,
  gcpOperations: 4.1,
  gcpCost: 3.8,
}

describe('normalizeWeights', () => {
  it('returns defaults when total weight is zero', () => {
    const zero = {
      capabilityDepth: 0,
      easeOfUse: 0,
      enterpriseIntegration: 0,
      dataAiFit: 0,
      portability: 0,
      operationalMaturity: 0,
      costPredictability: 0,
    }
    expect(normalizeWeights(zero)).toEqual(DEFAULT_CRITERIA_WEIGHTS)
  })

  it('normalizes positive weights to sum to 1', () => {
    const weights = { ...DEFAULT_CRITERIA_WEIGHTS, capabilityDepth: 0.5 }
    const normalized = normalizeWeights(weights)
    const total = Object.values(normalized).reduce((sum, value) => sum + value, 0)
    expect(total).toBeCloseTo(1, 5)
  })
})

describe('computeWeightedScores', () => {
  it('scores providers from criterion weights', () => {
    const scores = computeWeightedScores(sampleCapability, DEFAULT_CRITERIA_WEIGHTS)
    expect(scores.gcp).toBeGreaterThan(scores.aws)
    expect(scores.azure).toBeGreaterThan(0)
  })
})

describe('recommendProvider', () => {
  it('returns tie when margin is small', () => {
    expect(recommendProvider({ aws: 4, azure: 3.95, gcp: 3.9 }).winner).toBe('tie')
  })

  it('returns clear winner when margin is large', () => {
    expect(recommendProvider({ aws: 3, azure: 4.5, gcp: 3.2 }).winner).toBe('azure')
  })
})

describe('applyContextAdjustments', () => {
  it('boosts azure for azure-centric hybrid context', () => {
    const base = { aws: 4, azure: 4, gcp: 4 }
    const adjusted = applyContextAdjustments(base, 'Azure-centric', 'Hybrid')
    expect(adjusted.azure).toBeGreaterThan(adjusted.aws)
  })
})

describe('filterServices', () => {
  const items = [
    { layer: '07 AI', capability: 'RAG', purpose: 'grounded answers', aws: 'Bedrock KB' },
    { layer: '05 Data', capability: 'PostgreSQL', purpose: 'OLTP', azure: 'Azure PG' },
  ]

  it('filters by layer and query', () => {
    expect(filterServices(items, 'rag', '07 AI')).toHaveLength(1)
    expect(filterServices(items, 'postgres', '')).toHaveLength(1)
    expect(filterServices(items, 'missing', '')).toHaveLength(0)
  })
})

describe('estimateTokenCost', () => {
  it('computes per-request cost from token pricing', () => {
    const cost = estimateTokenCost(1_000_000, 1_000_000, 1, 2)
    expect(cost).toBe(3)
  })

  it('computes monthly cost', () => {
    expect(monthlyCostFromDaily(100, 0.01)).toBe(30)
  })
})
