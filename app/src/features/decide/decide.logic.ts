import type { CriteriaKey, EcosystemOption, DeploymentOption, ProviderId } from '../../constants/playbook'
import { DEFAULT_CRITERIA_WEIGHTS, PROVIDERS } from '../../constants/playbook'

export interface CapabilityScores {
  capability: string
  layer: string
  subcategory: string
  aws: string
  azure: string
  gcp: string
  awsDepth: number
  awsEase: number
  awsEnterprise: number
  awsDataAi: number
  awsPortability: number
  awsOperations: number
  awsCost: number
  azureDepth: number
  azureEase: number
  azureEnterprise: number
  azureDataAi: number
  azurePortability: number
  azureOperations: number
  azureCost: number
  gcpDepth: number
  gcpEase: number
  gcpEnterprise: number
  gcpDataAi: number
  gcpPortability: number
  gcpOperations: number
  gcpCost: number
  awsScore?: number
  azureScore?: number
  gcpScore?: number
  recommendation?: string
}

const CRITERIA_TO_FIELD: Record<CriteriaKey, Record<ProviderId, keyof CapabilityScores>> = {
  capabilityDepth: { aws: 'awsDepth', azure: 'azureDepth', gcp: 'gcpDepth' },
  easeOfUse: { aws: 'awsEase', azure: 'azureEase', gcp: 'gcpEase' },
  enterpriseIntegration: { aws: 'awsEnterprise', azure: 'azureEnterprise', gcp: 'gcpEnterprise' },
  dataAiFit: { aws: 'awsDataAi', azure: 'azureDataAi', gcp: 'gcpDataAi' },
  portability: { aws: 'awsPortability', azure: 'azurePortability', gcp: 'gcpPortability' },
  operationalMaturity: { aws: 'awsOperations', azure: 'azureOperations', gcp: 'gcpOperations' },
  costPredictability: { aws: 'awsCost', azure: 'azureCost', gcp: 'gcpCost' },
}

export type CriteriaWeights = Record<CriteriaKey, number>

export function normalizeWeights(weights: CriteriaWeights): CriteriaWeights {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0)
  if (total <= 0) {
    return { ...DEFAULT_CRITERIA_WEIGHTS }
  }
  const normalized = { ...weights }
  ;(Object.keys(normalized) as CriteriaKey[]).forEach((key) => {
    normalized[key] = weights[key] / total
  })
  return normalized
}

export function computeWeightedScores(
  capability: CapabilityScores,
  weights: CriteriaWeights,
): Record<ProviderId, number> {
  const normalized = normalizeWeights(weights)
  const result: Record<ProviderId, number> = { aws: 0, azure: 0, gcp: 0 }

  PROVIDERS.forEach((provider) => {
    let score = 0
    ;(Object.keys(normalized) as CriteriaKey[]).forEach((criterion) => {
      const field = CRITERIA_TO_FIELD[criterion][provider]
      const value = Number(capability[field] ?? 0)
      score += value * normalized[criterion]
    })
    result[provider] = Math.round(score * 100) / 100
  })

  return result
}

export function ecosystemAdjustment(
  ecosystem: EcosystemOption,
): Record<ProviderId, number> {
  if (ecosystem === 'AWS-centric') return { aws: 0.15, azure: -0.05, gcp: -0.05 }
  if (ecosystem === 'Azure-centric') return { aws: -0.05, azure: 0.15, gcp: -0.05 }
  if (ecosystem === 'GCP-centric') return { aws: -0.05, azure: -0.05, gcp: 0.15 }
  return { aws: 0, azure: 0, gcp: 0 }
}

export function deploymentAdjustment(
  deployment: DeploymentOption,
): Record<ProviderId, number> {
  if (deployment === 'Hybrid') return { aws: 0.05, azure: 0.1, gcp: 0.05 }
  if (deployment === 'Multicloud') return { aws: 0.02, azure: 0.05, gcp: 0.08 }
  return { aws: 0, azure: 0, gcp: 0 }
}

export function applyContextAdjustments(
  baseScores: Record<ProviderId, number>,
  ecosystem: EcosystemOption,
  deployment: DeploymentOption,
): Record<ProviderId, number> {
  const eco = ecosystemAdjustment(ecosystem)
  const deploy = deploymentAdjustment(deployment)
  const result: Record<ProviderId, number> = { aws: 0, azure: 0, gcp: 0 }
  PROVIDERS.forEach((provider) => {
    result[provider] =
      Math.round((baseScores[provider] + eco[provider] + deploy[provider]) * 100) / 100
  })
  return result
}

export function recommendProvider(scores: Record<ProviderId, number>): {
  winner: ProviderId | 'tie'
  margin: number
} {
  const ranked = PROVIDERS.map((provider) => ({ provider, score: scores[provider] })).sort(
    (left, right) => right.score - left.score,
  )
  const margin = Math.round((ranked[0].score - ranked[1].score) * 100) / 100
  if (margin < 0.1) {
    return { winner: 'tie', margin }
  }
  return { winner: ranked[0].provider, margin }
}

export function filterServices<T extends { layer?: string; capability?: string; subcategory?: string; purpose?: string; aws?: string; azure?: string; gcp?: string }>(
  items: T[],
  query: string,
  layer: string,
): T[] {
  const normalizedQuery = query.trim().toLowerCase()
  return items.filter((item) => {
    if (layer && item.layer !== layer) {
      return false
    }
    if (!normalizedQuery) {
      return true
    }
    const haystack = [
      item.capability,
      item.subcategory,
      item.purpose,
      item.aws,
      item.azure,
      item.gcp,
      item.layer,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalizedQuery)
  })
}

export function estimateTokenCost(
  inputTokens: number,
  outputTokens: number,
  inputPerMillion: number,
  outputPerMillion: number,
): number {
  const inputCost = (inputTokens / 1_000_000) * inputPerMillion
  const outputCost = (outputTokens / 1_000_000) * outputPerMillion
  return Math.round((inputCost + outputCost) * 10000) / 10000
}

export function monthlyCostFromDaily(
  dailyRequests: number,
  costPerRequest: number,
): number {
  return Math.round(dailyRequests * costPerRequest * 30 * 100) / 100
}
