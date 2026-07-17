export const APP_NAME = 'Sudip AI Playbook'
export const APP_TAGLINE = 'Compare. Decide. Architect.'
export const BLOG_BASE_PATH = '/blog/'

export const BLOG_FEATURED_LINKS = [
  {
    href: `${BLOG_BASE_PATH}what-is-ai-solution-engineering/`,
    title: 'What is AI Solution Engineering?',
    desc: '8D spine, VALUE gates, and how the playbook fits together',
  },
  {
    href: `${BLOG_BASE_PATH}ai-engineering-chip-huyen-deep-dive/`,
    title: 'AI Engineering deep dive',
    desc: 'Foundation models, evaluation, RAG, agents — practitioner take',
  },
  {
    href: `${BLOG_BASE_PATH}docs/ai-solution-engineering/8d-framework/`,
    title: '8D framework guide',
    desc: 'Define → Deliver with stage gates and legacy mapping',
  },
] as const

export const DEFAULT_CRITERIA_WEIGHTS = {
  capabilityDepth: 0.25,
  easeOfUse: 0.2,
  enterpriseIntegration: 0.15,
  dataAiFit: 0.15,
  portability: 0.1,
  operationalMaturity: 0.1,
  costPredictability: 0.05,
} as const

export type CriteriaKey = keyof typeof DEFAULT_CRITERIA_WEIGHTS

export const CRITERIA_LABELS: Record<CriteriaKey, string> = {
  capabilityDepth: 'Capability depth',
  easeOfUse: 'Ease of use',
  enterpriseIntegration: 'Enterprise integration',
  dataAiFit: 'Data & AI fit',
  portability: 'Portability',
  operationalMaturity: 'Operational maturity',
  costPredictability: 'Cost predictability',
}

export const PROVIDERS = ['aws', 'azure', 'gcp'] as const
export type ProviderId = (typeof PROVIDERS)[number]

export const PROVIDER_LABELS: Record<ProviderId, string> = {
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'Google Cloud',
}

export const ECOSYSTEM_OPTIONS = ['Neutral', 'AWS-centric', 'Azure-centric', 'GCP-centric'] as const
export type EcosystemOption = (typeof ECOSYSTEM_OPTIONS)[number]

export const DEPLOYMENT_OPTIONS = ['Cloud-native', 'Hybrid', 'Multicloud'] as const
export type DeploymentOption = (typeof DEPLOYMENT_OPTIONS)[number]

export { NAV_ITEMS } from './journey'
