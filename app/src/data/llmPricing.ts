export type CloudProvider = 'azure' | 'aws' | 'gcp'

export interface LlmModel {
  id: string
  name: string
  provider: CloudProvider
  platform: string
  family: string
  tier: 'flagship' | 'balanced' | 'efficient' | 'reasoning'
  inputPerMillion: number
  outputPerMillion: number
  cachedInputPerMillion?: number
  contextWindow: string
  strengths: string
  alternatives: string[]
  sourceUrl: string
  notes?: string
}

export const LLM_MODELS: LlmModel[] = [
  {
    id: 'azure-gpt-5',
    name: 'GPT-5',
    provider: 'azure',
    platform: 'Azure OpenAI / Foundry Models',
    family: 'OpenAI',
    tier: 'flagship',
    inputPerMillion: 1.25,
    outputPerMillion: 10,
    cachedInputPerMillion: 0.13,
    contextWindow: '200K',
    strengths: 'Flagship reasoning, instruction following, and agentic production workloads on Azure.',
    alternatives: ['bedrock-claude-sonnet-5', 'gcp-gemini-3-1-pro', 'azure-gpt-5-mini'],
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/azure-openai/',
  },
  {
    id: 'azure-gpt-5-mini',
    name: 'GPT-5 mini',
    provider: 'azure',
    platform: 'Azure OpenAI / Foundry Models',
    family: 'OpenAI',
    tier: 'balanced',
    inputPerMillion: 0.25,
    outputPerMillion: 2,
    cachedInputPerMillion: 0.03,
    contextWindow: '128K',
    strengths: 'Balanced quality and cost for chat, tools, and high-volume Azure workloads.',
    alternatives: ['gcp-gemini-3-flash', 'bedrock-nova-pro', 'azure-gpt-5-nano'],
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/azure-openai/',
  },
  {
    id: 'azure-gpt-5-nano',
    name: 'GPT-5 nano',
    provider: 'azure',
    platform: 'Azure OpenAI / Foundry Models',
    family: 'OpenAI',
    tier: 'efficient',
    inputPerMillion: 0.05,
    outputPerMillion: 0.4,
    contextWindow: '128K',
    strengths: 'Ultra-low-cost classification, routing, and high-volume simple tasks.',
    alternatives: ['gcp-gemini-3-1-flash-lite', 'bedrock-nova-micro', 'azure-gpt-4-1-nano'],
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/azure-openai/',
  },
  {
    id: 'azure-gpt-4-1',
    name: 'GPT-4.1',
    provider: 'azure',
    platform: 'Azure OpenAI / Foundry Models',
    family: 'OpenAI',
    tier: 'flagship',
    inputPerMillion: 2,
    outputPerMillion: 8,
    cachedInputPerMillion: 0.5,
    contextWindow: '1M',
    strengths: 'Long-context general model for creative work and agentic planning.',
    alternatives: ['azure-gpt-5', 'bedrock-claude-sonnet-5', 'gcp-gemini-3-1-pro'],
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/azure-openai/',
  },
  {
    id: 'azure-gpt-4-1-mini',
    name: 'GPT-4.1 mini',
    provider: 'azure',
    platform: 'Azure OpenAI / Foundry Models',
    family: 'OpenAI',
    tier: 'balanced',
    inputPerMillion: 0.4,
    outputPerMillion: 1.6,
    cachedInputPerMillion: 0.1,
    contextWindow: '1M',
    strengths: 'Cost-efficient long-context model for RAG and app backends.',
    alternatives: ['azure-gpt-5-mini', 'gcp-gemini-3-flash', 'bedrock-nova-lite'],
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/azure-openai/',
  },
  {
    id: 'azure-gpt-4-1-nano',
    name: 'GPT-4.1 nano',
    provider: 'azure',
    platform: 'Azure OpenAI / Foundry Models',
    family: 'OpenAI',
    tier: 'efficient',
    inputPerMillion: 0.1,
    outputPerMillion: 0.4,
    cachedInputPerMillion: 0.025,
    contextWindow: '1M',
    strengths: 'Cheapest long-context OpenAI option for extraction and light reasoning.',
    alternatives: ['azure-gpt-5-nano', 'gcp-gemini-3-1-flash-lite', 'bedrock-nova-micro'],
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/azure-openai/',
  },
  {
    id: 'azure-o3',
    name: 'o3',
    provider: 'azure',
    platform: 'Azure OpenAI / Foundry Models',
    family: 'OpenAI',
    tier: 'reasoning',
    inputPerMillion: 2,
    outputPerMillion: 8,
    contextWindow: '200K',
    strengths: 'Deep multi-step reasoning across coding, math, science, and visual analysis.',
    alternatives: ['bedrock-claude-opus-4-8', 'gcp-gemini-3-1-pro', 'azure-gpt-5'],
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/azure-openai/',
    notes: 'Confirm regional Global Standard rates before budgeting.',
  },
  {
    id: 'bedrock-claude-opus-4-8',
    name: 'Claude Opus 4.8',
    provider: 'aws',
    platform: 'Amazon Bedrock',
    family: 'Anthropic',
    tier: 'flagship',
    inputPerMillion: 6,
    outputPerMillion: 30,
    cachedInputPerMillion: 0.6,
    contextWindow: '200K+',
    strengths: 'Highest Anthropic capability for complex agents, coding, and analysis on Bedrock.',
    alternatives: ['azure-gpt-5', 'gcp-gemini-3-1-pro', 'bedrock-claude-sonnet-5'],
    sourceUrl: 'https://aws.amazon.com/bedrock/pricing/',
  },
  {
    id: 'bedrock-claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'aws',
    platform: 'Amazon Bedrock',
    family: 'Anthropic',
    tier: 'balanced',
    inputPerMillion: 2,
    outputPerMillion: 10,
    contextWindow: '200K+',
    strengths: 'Strong coding and agent default; promo pricing through Aug 2026 then $3/$15.',
    alternatives: ['azure-gpt-5', 'gcp-gemini-3-flash', 'bedrock-nova-pro'],
    sourceUrl: 'https://aws.amazon.com/bedrock/pricing/',
    notes: 'Promotional $2/$10 through 31 Aug 2026; standard $3/$15 thereafter.',
  },
  {
    id: 'bedrock-nova-pro',
    name: 'Amazon Nova Pro',
    provider: 'aws',
    platform: 'Amazon Bedrock',
    family: 'Amazon',
    tier: 'balanced',
    inputPerMillion: 0.8,
    outputPerMillion: 3.2,
    contextWindow: '300K',
    strengths: 'AWS-native multimodal model with strong price/performance for enterprise apps.',
    alternatives: ['azure-gpt-5-mini', 'gcp-gemini-3-flash', 'bedrock-claude-sonnet-5'],
    sourceUrl: 'https://aws.amazon.com/bedrock/pricing/',
  },
  {
    id: 'bedrock-nova-lite',
    name: 'Amazon Nova Lite',
    provider: 'aws',
    platform: 'Amazon Bedrock',
    family: 'Amazon',
    tier: 'efficient',
    inputPerMillion: 0.06,
    outputPerMillion: 0.24,
    contextWindow: '300K',
    strengths: 'Low-cost multimodal understanding for high-throughput Bedrock workloads.',
    alternatives: ['azure-gpt-5-nano', 'gcp-gemini-3-1-flash-lite', 'bedrock-nova-micro'],
    sourceUrl: 'https://aws.amazon.com/bedrock/pricing/',
  },
  {
    id: 'bedrock-nova-micro',
    name: 'Amazon Nova Micro',
    provider: 'aws',
    platform: 'Amazon Bedrock',
    family: 'Amazon',
    tier: 'efficient',
    inputPerMillion: 0.035,
    outputPerMillion: 0.14,
    contextWindow: '128K',
    strengths: 'Text-only ultra-cheap model for classification and routing on AWS.',
    alternatives: ['azure-gpt-5-nano', 'gcp-gemini-3-1-flash-lite', 'bedrock-nova-lite'],
    sourceUrl: 'https://aws.amazon.com/bedrock/pricing/',
  },
  {
    id: 'bedrock-gpt-5-4',
    name: 'GPT-5.4 (Bedrock)',
    provider: 'aws',
    platform: 'Amazon Bedrock',
    family: 'OpenAI',
    tier: 'flagship',
    inputPerMillion: 2.75,
    outputPerMillion: 16.5,
    cachedInputPerMillion: 0.275,
    contextWindow: '200K+',
    strengths: 'OpenAI frontier models available via Bedrock geo / in-region inference.',
    alternatives: ['azure-gpt-5', 'bedrock-claude-sonnet-5', 'gcp-gemini-3-1-pro'],
    sourceUrl: 'https://aws.amazon.com/bedrock/pricing/',
  },
  {
    id: 'bedrock-deepseek-v3-2',
    name: 'DeepSeek v3.2',
    provider: 'aws',
    platform: 'Amazon Bedrock',
    family: 'DeepSeek',
    tier: 'balanced',
    inputPerMillion: 0.62,
    outputPerMillion: 1.85,
    contextWindow: '128K',
    strengths: 'Strong coding and reasoning at mid-tier Bedrock token economics.',
    alternatives: ['azure-gpt-5-mini', 'gcp-gemini-3-flash', 'bedrock-nova-pro'],
    sourceUrl: 'https://aws.amazon.com/bedrock/pricing/',
  },
  {
    id: 'gcp-gemini-3-1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'gcp',
    platform: 'Gemini Enterprise Agent Platform',
    family: 'Google',
    tier: 'flagship',
    inputPerMillion: 2,
    outputPerMillion: 12,
    cachedInputPerMillion: 0.2,
    contextWindow: '1M+',
    strengths: 'Frontier multimodal reasoning with strong Google data and agent platform fit.',
    alternatives: ['azure-gpt-5', 'bedrock-claude-sonnet-5', 'gcp-gemini-3-flash'],
    sourceUrl: 'https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing',
    notes: 'Prices shown for ≤200K input tokens; higher context bands cost more.',
  },
  {
    id: 'gcp-gemini-3-5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'gcp',
    platform: 'Gemini Enterprise Agent Platform',
    family: 'Google',
    tier: 'balanced',
    inputPerMillion: 1.5,
    outputPerMillion: 9,
    cachedInputPerMillion: 0.15,
    contextWindow: '1M+',
    strengths: 'High-throughput multimodal Flash model for agents and production apps.',
    alternatives: ['azure-gpt-5-mini', 'bedrock-claude-sonnet-5', 'gcp-gemini-3-flash'],
    sourceUrl: 'https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing',
  },
  {
    id: 'gcp-gemini-3-flash',
    name: 'Gemini 3 Flash',
    provider: 'gcp',
    platform: 'Gemini Enterprise Agent Platform',
    family: 'Google',
    tier: 'balanced',
    inputPerMillion: 0.5,
    outputPerMillion: 3,
    cachedInputPerMillion: 0.05,
    contextWindow: '1M+',
    strengths: 'Fast, affordable multimodal default for Gemini-centric architectures.',
    alternatives: ['azure-gpt-5-mini', 'bedrock-nova-pro', 'gcp-gemini-3-1-flash-lite'],
    sourceUrl: 'https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing',
  },
  {
    id: 'gcp-gemini-3-1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    provider: 'gcp',
    platform: 'Gemini Enterprise Agent Platform',
    family: 'Google',
    tier: 'efficient',
    inputPerMillion: 0.25,
    outputPerMillion: 1.5,
    cachedInputPerMillion: 0.025,
    contextWindow: '1M+',
    strengths: 'Lowest-cost Gemini text/vision option for scale-out inference.',
    alternatives: ['azure-gpt-5-nano', 'bedrock-nova-micro', 'gcp-gemini-3-flash'],
    sourceUrl: 'https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing',
  },
]

export const LLM_SOURCE_LINKS = [
  {
    label: 'Azure OpenAI pricing',
    url: 'https://azure.microsoft.com/en-us/pricing/details/azure-openai/',
  },
  {
    label: 'Amazon Bedrock pricing',
    url: 'https://aws.amazon.com/bedrock/pricing/',
  },
  {
    label: 'Google Gemini / Agent Platform pricing',
    url: 'https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing',
  },
] as const

export function getModelById(modelId: string): LlmModel | undefined {
  return LLM_MODELS.find((model) => model.id === modelId)
}

export function getAlternatives(model: LlmModel): LlmModel[] {
  return model.alternatives
    .map((alternativeId) => getModelById(alternativeId))
    .filter((item): item is LlmModel => Boolean(item))
}

export function sortModelsByBlendedCost(
  models: LlmModel[],
  inputShare = 0.7,
): LlmModel[] {
  return [...models].sort((left, right) => {
    const leftBlended = left.inputPerMillion * inputShare + left.outputPerMillion * (1 - inputShare)
    const rightBlended =
      right.inputPerMillion * inputShare + right.outputPerMillion * (1 - inputShare)
    return leftBlended - rightBlended
  })
}
