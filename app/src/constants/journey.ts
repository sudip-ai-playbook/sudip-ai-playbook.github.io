export const PROJECT_STORAGE_KEY = 'sudip-ai-playbook-project'

export const JOURNEY_STEPS = [
  {
    id: 'frame',
    path: '/frame',
    label: 'Frame',
    title: 'Frame the outcome',
    hint: 'Outcome before products',
    next: '/map',
  },
  {
    id: 'map',
    path: '/map',
    label: 'Map',
    title: 'Locate the layer',
    hint: 'Narrow the decision space',
    next: '/picks',
    prev: '/frame',
  },
  {
    id: 'picks',
    path: '/picks',
    label: 'Picks',
    title: 'Start from a default',
    hint: 'Scenario shortcuts',
    next: '/compare',
    prev: '/map',
  },
  {
    id: 'compare',
    path: '/compare',
    label: 'Compare',
    title: 'Compare services',
    hint: 'AWS · Azure · GCP side by side',
    next: '/decide',
    prev: '/picks',
  },
  {
    id: 'decide',
    path: '/decide',
    label: 'Decide',
    title: 'Score the trade-offs',
    hint: 'Weights + ecosystem context',
    next: '/finops',
    prev: '/compare',
  },
  {
    id: 'finops',
    path: '/finops',
    label: 'FinOps',
    title: 'Check LLM cost',
    hint: 'Token economics',
    next: '/canvas',
    prev: '/decide',
  },
  {
    id: 'canvas',
    path: '/canvas',
    label: 'Build',
    title: 'Assemble the stack',
    hint: 'Architecture canvas',
    next: '/summary',
    prev: '/finops',
  },
  {
    id: 'summary',
    path: '/summary',
    label: 'Record',
    title: 'Validate and record',
    hint: 'Export decision brief',
    prev: '/canvas',
  },
] as const

export type JourneyStepId = (typeof JOURNEY_STEPS)[number]['id']

/** Primary chrome only — journey steps live in JourneyRail. */
export const NAV_ITEMS = [
  { path: '/', label: 'Home', id: 'hub' },
  { path: '/consult', label: 'ConsultAI', id: 'consult' },
  { path: '/frame', label: 'Architecture', id: 'architecture' },
] as const

export function getJourneyStepByPath(pathname: string) {
  const normalized = pathname === '' ? '/' : pathname
  return JOURNEY_STEPS.find((step) => step.path === normalized)
}

export function getJourneyIndex(pathname: string): number {
  const step = getJourneyStepByPath(pathname)
  if (!step) return -1
  return JOURNEY_STEPS.findIndex((item) => item.id === step.id)
}
