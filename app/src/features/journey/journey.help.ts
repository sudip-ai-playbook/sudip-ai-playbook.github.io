import type { JourneyStepId } from '../../constants/journey'

export type JourneyHelpContent = {
  stepId: JourneyStepId
  title: string
  whyItMatters: string
  goodExample: string
  antiPattern: string
  tip: string
}

export const JOURNEY_HELP: Record<JourneyStepId, JourneyHelpContent> = {
  frame: {
    stepId: 'frame',
    title: 'How to frame a strong outcome',
    whyItMatters:
      'Teams that skip framing jump to products and reopen the decision three workshops later.',
    goodExample:
      'Reduce average claims handling time by 30% with a grounded assistant that cites policy clauses and leaves an audit trail.',
    antiPattern: 'Build a GPT chatbot on Azure OpenAI.',
    tip: 'Write the outcome so a sponsor can say yes/no without knowing cloud jargon.',
  },
  map: {
    stepId: 'map',
    title: 'Locate the decision layer',
    whyItMatters:
      'Comparing every cloud service at once creates noise. Narrowing the layer makes trade-offs discussable.',
    goodExample: 'Focus on 07 AI & Intelligent Systems for a RAG assistant before debating networking.',
    antiPattern: 'Open every catalogue tab and score 40 services in one sitting.',
    tip: 'If two layers feel equally important, pick the one that blocks value delivery first.',
  },
  picks: {
    stepId: 'picks',
    title: 'Start from a proven default',
    whyItMatters:
      'Defaults encode patterns from similar engagements so you do not redesign from a blank page.',
    goodExample: 'Select a RAG / knowledge assistant pick, then adapt constraints to your client.',
    antiPattern: 'Ignore picks and invent a novel architecture before any reference pattern.',
    tip: 'Treat picks as hypotheses — keep what fits, discard what does not.',
  },
  compare: {
    stepId: 'compare',
    title: 'Compare like-for-like services',
    whyItMatters:
      'Stakeholders need a fair AWS / Azure / GCP view on the same capability, not brochure feature lists.',
    goodExample: 'Compare managed knowledge bases for RAG across the three providers side by side.',
    antiPattern: 'Compare an Azure PaaS service to an AWS IaaS DIY stack as if they were equal.',
    tip: 'Add the leading option to the stack only when you can explain why the others lose.',
  },
  decide: {
    stepId: 'decide',
    title: 'Score trade-offs with weights',
    whyItMatters:
      'Unweighted debates privilege the loudest voice. Weights make preference and risk explicit.',
    goodExample:
      'Raise enterprise integration and data residency weights for a regulated insurer, then re-rank.',
    antiPattern: 'Pick a provider because the team already has certifications and skip scoring.',
    tip: 'Record the rejected options in notes — that is gold for the ADR.',
  },
  finops: {
    stepId: 'finops',
    title: 'Pressure-test LLM economics',
    whyItMatters:
      'Token cost surprises kill pilots at scale. A rough FinOps pass prevents silent budget risk.',
    goodExample: 'Estimate monthly tokens for 200 handlers × 40 queries/day before recommending GPT-class models.',
    antiPattern: 'Assume model cost is negligible compared to cloud spend.',
    tip: 'Capture assumptions (users, queries, context size) in the brief notes.',
  },
  canvas: {
    stepId: 'canvas',
    title: 'Assemble a coherent stack',
    whyItMatters:
      'A recommendation is a system, not a single API. The canvas shows how pieces connect.',
    goodExample: 'Identity → API gateway → orchestration → model → grounding store → observability.',
    antiPattern: 'A flat list of five unrelated services with no trust boundary or data flow.',
    tip: 'Remove anything you cannot justify in one sentence to the sponsor.',
  },
  summary: {
    stepId: 'summary',
    title: 'Close with a stakeholder brief',
    whyItMatters:
      'Decisions die in decks without an exportable brief, validation gates, and clear next owners.',
    goodExample:
      'Export the markdown brief, tick residency/security/FinOps gates, and schedule a PoC checkpoint.',
    antiPattern: 'End the workshop with a verbal “we like Azure” and no artefact.',
    tip: 'A recommendation is not approval — the checklist is how you earn it.',
  },
}

export function getJourneyHelp(stepId: JourneyStepId): JourneyHelpContent {
  return JOURNEY_HELP[stepId]
}
