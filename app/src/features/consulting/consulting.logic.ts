import {
  BUSINESS_SITUATIONS,
  CONSULTING_STAGES,
  type BusinessSituation,
  type ConsultingStage,
} from '../../data/consultingOs'

export const FILTER_ALL = 'all' as const

export type StageFilterId = typeof FILTER_ALL | string

export function getStageById(stageId: string): ConsultingStage | undefined {
  return CONSULTING_STAGES.find((stage) => stage.id === stageId)
}

export function getSituationById(situationId: string): BusinessSituation | undefined {
  return BUSINESS_SITUATIONS.find((situation) => situation.id === situationId)
}

export function filterStagesById(
  stages: ConsultingStage[],
  stageFilter: StageFilterId,
): ConsultingStage[] {
  if (stageFilter === FILTER_ALL) {
    return stages
  }
  return stages.filter((stage) => stage.id === stageFilter)
}

export function filterStagesBySituation(
  stages: ConsultingStage[],
  situationId: string | null,
): ConsultingStage[] {
  if (!situationId) {
    return stages
  }
  const situation = getSituationById(situationId)
  if (!situation) {
    return stages
  }
  const allowed = new Set(situation.recommendedStageIds)
  return stages.filter((stage) => allowed.has(stage.id))
}

export function resolveConsultingStages(options: {
  stageFilter: StageFilterId
  situationId: string | null
}): ConsultingStage[] {
  const bySituation = filterStagesBySituation(CONSULTING_STAGES, options.situationId)
  return filterStagesById(bySituation, options.stageFilter)
}

export function searchStages(
  stages: ConsultingStage[],
  query: string,
): ConsultingStage[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return stages
  }
  return stages.filter((stage) => {
    const haystack = [
      stage.title,
      stage.purpose,
      stage.gate,
      stage.shortLabel,
      ...stage.frameworks,
      ...stage.actions,
      ...stage.deliverables,
      ...stage.questionsAnswered,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

export function buildConsultingFileStem(options: {
  stageFilter: StageFilterId
  situationId: string | null
}): string {
  const parts = ['consultai-os-playbook']
  if (options.situationId) {
    parts.push(options.situationId)
  }
  if (options.stageFilter !== FILTER_ALL) {
    parts.push(options.stageFilter)
  }
  return parts.join('-')
}
