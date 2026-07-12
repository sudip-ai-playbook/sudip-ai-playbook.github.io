export const CONSULT_PERSONA = {
  CONSULTANT: 'ai_consultant',
  ENGAGEMENT_MANAGER: 'engagement_manager',
  SOLUTION_ENGINEER: 'solution_engineer',
  CLIENT_EXECUTIVE: 'client_executive',
  READ_ONLY: 'read_only',
} as const

export type ConsultPersona = (typeof CONSULT_PERSONA)[keyof typeof CONSULT_PERSONA]

export const CONSULT_PERSONA_LABELS: Record<ConsultPersona, string> = {
  [CONSULT_PERSONA.CONSULTANT]: 'AI consultant',
  [CONSULT_PERSONA.ENGAGEMENT_MANAGER]: 'Engagement manager',
  [CONSULT_PERSONA.SOLUTION_ENGINEER]: 'Solution engineer',
  [CONSULT_PERSONA.CLIENT_EXECUTIVE]: 'Client executive',
  [CONSULT_PERSONA.READ_ONLY]: 'Read-only reviewer',
}

export const CONSULT_PERSONA_OPTIONS: ReadonlyArray<{
  id: ConsultPersona
  label: string
}> = (
  Object.keys(CONSULT_PERSONA_LABELS) as ConsultPersona[]
).map((id) => ({ id, label: CONSULT_PERSONA_LABELS[id] }))

export function canEditEngagement(persona: ConsultPersona): boolean {
  return persona !== CONSULT_PERSONA.READ_ONLY
}

export function isClientFacingPersona(persona: ConsultPersona): boolean {
  return (
    persona === CONSULT_PERSONA.CLIENT_EXECUTIVE || persona === CONSULT_PERSONA.READ_ONLY
  )
}

export function parseConsultPersona(value: string | null | undefined): ConsultPersona {
  const match = CONSULT_PERSONA_OPTIONS.find((option) => option.id === value)
  return match?.id ?? CONSULT_PERSONA.CONSULTANT
}
