import {
  ALL_FRAMEWORKS,
  FRAMEWORK_NAME_ALIASES,
  MVP_FRAMEWORK_LIBRARY,
  type FrameworkEntry,
  type MvpFramework,
} from '../../data/frameworkLibrary'

const adHocCache = new Map<string, MvpFramework>()

export function normalizeFrameworkName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replaceAll('–', '-')
    .replaceAll('—', '-')
    .replace(/\s+/g, ' ')
}

function slugifyFrameworkName(name: string): string {
  return normalizeFrameworkName(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64)
}

export function createAdHocFramework(name: string): MvpFramework {
  const normalized = normalizeFrameworkName(name)
  const cached = adHocCache.get(normalized)
  if (cached) return cached

  const framework: MvpFramework = {
    id: `adhoc-${slugifyFrameworkName(name)}`,
    name: name.trim(),
    purpose: `Apply ${name.trim()} directly to your use case and capture working notes, evidence and decisions.`,
    summary: `Working canvas for ${name.trim()}.`,
    whenUseful: 'Whenever this framework is recommended for the current stage',
    businessQuestions: [
      `What does ${name.trim()} tell us about this use case?`,
      'What evidence supports the conclusion?',
      'What should we decide or do next?',
    ],
    suitableStageIds: [],
    notFor: ['Running without a defined use case'],
    inputs: ['Use case card', 'Evidence', 'Stakeholders'],
    stakeholders: ['Facilitator', 'Business owner'],
    durationMinutes: 40,
    steps: [
      'Confirm use case context',
      `Work through ${name.trim()} against the use case`,
      'Capture findings and evidence',
      'Record decisions and actions',
    ],
    commonMistakes: ['Generic notes not tied to the use case', 'No owner for follow-ups'],
    outputFormat: `${name.trim()} use-case working notes`,
    relatedFrameworkIds: [],
    nextAction: 'Save to workshop and continue the stage agenda',
    canvasType: 'guidedNotes',
    executable: true,
  }
  adHocCache.set(normalized, framework)
  return framework
}

export function resolveFrameworkId(nameOrId: string): string | null {
  const trimmed = nameOrId.trim()
  if (!trimmed) return null
  const direct = ALL_FRAMEWORKS.find((entry) => entry.id === trimmed)
  if (direct) return direct.id
  const normalized = normalizeFrameworkName(trimmed)
  const aliased = FRAMEWORK_NAME_ALIASES[normalized]
  if (aliased) return aliased
  const byName = ALL_FRAMEWORKS.find(
    (entry) => normalizeFrameworkName(entry.name) === normalized,
  )
  return byName?.id ?? null
}

export function getFrameworkById(id: string): FrameworkEntry | undefined {
  const fromLibrary = ALL_FRAMEWORKS.find((entry) => entry.id === id)
  if (fromLibrary) return fromLibrary
  if (id.startsWith('adhoc-')) {
    for (const framework of adHocCache.values()) {
      if (framework.id === id) return framework
    }
  }
  return undefined
}

export function getFrameworkByName(name: string): FrameworkEntry | undefined {
  const id = resolveFrameworkId(name)
  if (id) return getFrameworkById(id)
  if (!name.trim()) return undefined
  return createAdHocFramework(name)
}

export function resolveFrameworkForWork(nameOrId: string): MvpFramework {
  const byId = getFrameworkById(nameOrId)
  if (byId) return byId
  const byName = getFrameworkByName(nameOrId)
  if (byName) return byName
  return createAdHocFramework(nameOrId)
}

export function isMvpFramework(entry: FrameworkEntry): entry is MvpFramework {
  return entry.executable === true
}

export function isSpecializedCanvas(entry: FrameworkEntry): boolean {
  return entry.canvasType !== 'guidedNotes'
}

export function listMvpFrameworks(): MvpFramework[] {
  return MVP_FRAMEWORK_LIBRARY
}

export function searchFrameworks(query: string): FrameworkEntry[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return ALL_FRAMEWORKS
  return ALL_FRAMEWORKS.filter((entry) => {
    const haystack = [
      entry.name,
      entry.purpose,
      entry.summary ?? '',
      entry.whenUseful ?? '',
      ...entry.businessQuestions,
      ...entry.steps,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

export function filterMvpByStage(stageId: string | null): MvpFramework[] {
  if (!stageId) return MVP_FRAMEWORK_LIBRARY
  return MVP_FRAMEWORK_LIBRARY.filter((framework) =>
    framework.suitableStageIds.includes(stageId),
  )
}

export function resolveStageFrameworkNames(names: string[]): FrameworkEntry[] {
  const seen = new Set<string>()
  const result: FrameworkEntry[] = []
  for (const name of names) {
    const entry = resolveFrameworkForWork(name)
    if (seen.has(entry.id)) continue
    seen.add(entry.id)
    result.push(entry)
  }
  return result
}
