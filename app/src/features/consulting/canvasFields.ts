import type { CanvasType } from '../../data/frameworkLibrary'

export interface CanvasFieldDef {
  key: string
  label: string
  multiline?: boolean
  placeholder?: string
}

export function getCanvasFieldDefs(canvasType: CanvasType): CanvasFieldDef[] {
  switch (canvasType) {
    case 'mece':
      return [
        { key: 'problem', label: 'Problem statement', multiline: true },
        { key: 'branch1', label: 'Branch 1', multiline: true },
        { key: 'branch2', label: 'Branch 2', multiline: true },
        { key: 'branch3', label: 'Branch 3 (optional)', multiline: true },
        { key: 'gaps', label: 'Coverage gaps / overlap checks', multiline: true },
        { key: 'evidence', label: 'Evidence / interviews needed', multiline: true },
      ]
    case 'fiveWhys':
      return [
        { key: 'problem', label: 'Problem', multiline: true },
        { key: 'why1', label: 'Why 1' },
        { key: 'why2', label: 'Why 2' },
        { key: 'why3', label: 'Why 3' },
        { key: 'why4', label: 'Why 4' },
        { key: 'why5', label: 'Why 5' },
        { key: 'rootCause', label: 'Root cause', multiline: true },
        { key: 'action', label: 'Corrective action', multiline: true },
      ]
    case 'sipoc':
      return [
        { key: 'processName', label: 'Process name' },
        { key: 'suppliers', label: 'Suppliers', multiline: true },
        { key: 'inputs', label: 'Inputs', multiline: true },
        { key: 'process', label: 'Process steps (5–7)', multiline: true },
        { key: 'outputs', label: 'Outputs', multiline: true },
        { key: 'customers', label: 'Customers', multiline: true },
      ]
    case 'vsm':
      return [
        { key: 'trigger', label: 'Trigger / start' },
        { key: 'outcome', label: 'Customer outcome' },
        { key: 'steps', label: 'Process steps with times', multiline: true },
        { key: 'wasteThemes', label: 'Waste themes', multiline: true },
        { key: 'improvements', label: 'Improvement hypotheses', multiline: true },
      ]
    case 'jtbd':
      return [
        { key: 'user', label: 'User / context' },
        { key: 'job', label: 'Functional job', multiline: true },
        { key: 'emotional', label: 'Emotional / social jobs', multiline: true },
        { key: 'frictions', label: 'Current frictions', multiline: true },
        { key: 'success', label: 'Success metrics', multiline: true },
      ]
    case 'aiCanvas':
      return [
        { key: 'prediction', label: 'Prediction / generation task', multiline: true },
        { key: 'judgment', label: 'Human judgment / oversight', multiline: true },
        { key: 'action', label: 'Action enabled', multiline: true },
        { key: 'data', label: 'Required data', multiline: true },
        { key: 'value', label: 'Value hypothesis + baseline KPI', multiline: true },
        { key: 'risks', label: 'Risks and fall-back', multiline: true },
      ]
    case 'valueFeasibility':
      return [
        { key: 'useCase', label: 'Use case' },
        { key: 'valueScore', label: 'Value score (1–5) + evidence', multiline: true },
        { key: 'feasibilityScore', label: 'Feasibility score (1–5) + evidence', multiline: true },
        { key: 'bucket', label: 'Portfolio bucket' },
        { key: 'disagreements', label: 'Stakeholder disagreements', multiline: true },
      ]
    case 'rice':
      return [
        { key: 'initiative', label: 'Initiative' },
        { key: 'reach', label: 'Reach (number)' },
        { key: 'impact', label: 'Impact (0.25–3)' },
        { key: 'confidence', label: 'Confidence (0–100)' },
        { key: 'effort', label: 'Effort (person-months)' },
        { key: 'notes', label: 'Evidence notes', multiline: true },
      ]
    case 'swot':
      return [
        { key: 'strengths', label: 'Strengths', multiline: true },
        { key: 'weaknesses', label: 'Weaknesses', multiline: true },
        { key: 'opportunities', label: 'Opportunities', multiline: true },
        { key: 'threats', label: 'Threats', multiline: true },
        { key: 'implications', label: 'Strategic implications', multiline: true },
      ]
    case 'pestle':
      return [
        { key: 'political', label: 'Political', multiline: true },
        { key: 'economic', label: 'Economic', multiline: true },
        { key: 'social', label: 'Social', multiline: true },
        { key: 'technological', label: 'Technological', multiline: true },
        { key: 'legal', label: 'Legal', multiline: true },
        { key: 'environmental', label: 'Environmental', multiline: true },
        { key: 'implications', label: 'Implications', multiline: true },
      ]
    case 'bmc':
      return [
        { key: 'segments', label: 'Customer segments', multiline: true },
        { key: 'valueProps', label: 'Value propositions', multiline: true },
        { key: 'channels', label: 'Channels', multiline: true },
        { key: 'activities', label: 'Key activities', multiline: true },
        { key: 'resources', label: 'Key resources', multiline: true },
        { key: 'aiHotspots', label: 'AI hotspots', multiline: true },
      ]
    case 'mckinsey7s':
      return [
        { key: 'strategy', label: 'Strategy', multiline: true },
        { key: 'structure', label: 'Structure', multiline: true },
        { key: 'systems', label: 'Systems', multiline: true },
        { key: 'skills', label: 'Skills', multiline: true },
        { key: 'staff', label: 'Staff', multiline: true },
        { key: 'style', label: 'Style', multiline: true },
        { key: 'sharedValues', label: 'Shared values', multiline: true },
        { key: 'misalignments', label: 'Misalignments + actions', multiline: true },
      ]
    case 'nistAiRmf':
      return [
        { key: 'govern', label: 'Govern', multiline: true },
        { key: 'map', label: 'Map', multiline: true },
        { key: 'measure', label: 'Measure', multiline: true },
        { key: 'manage', label: 'Manage', multiline: true },
      ]
    case 'raci':
      return [
        { key: 'activity', label: 'Activity' },
        { key: 'responsible', label: 'Responsible (R)' },
        { key: 'accountable', label: 'Accountable (A)' },
        { key: 'consulted', label: 'Consulted (C)' },
        { key: 'informed', label: 'Informed (I)' },
      ]
    case 'raid':
      return [
        { key: 'entryType', label: 'Type (Risk / Assumption / Issue / Dependency)' },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'owner', label: 'Owner' },
        { key: 'due', label: 'Due / review date' },
        { key: 'mitigation', label: 'Mitigation / validation', multiline: true },
      ]
    case 'adkar':
      return [
        { key: 'awareness', label: 'Awareness', multiline: true },
        { key: 'desire', label: 'Desire', multiline: true },
        { key: 'knowledge', label: 'Knowledge', multiline: true },
        { key: 'ability', label: 'Ability', multiline: true },
        { key: 'reinforcement', label: 'Reinforcement', multiline: true },
        { key: 'gapActions', label: 'Gap actions', multiline: true },
      ]
    case 'businessCase':
      return [
        { key: 'strategicCase', label: 'Strategic case', multiline: true },
        { key: 'options', label: 'Options (incl. do nothing)', multiline: true },
        { key: 'benefits', label: 'Benefits', multiline: true },
        { key: 'costs', label: 'Costs', multiline: true },
        { key: 'risks', label: 'Risks', multiline: true },
        { key: 'recommendation', label: 'Recommendation / decision ask', multiline: true },
      ]
    case 'tcoRoi':
      return [
        { key: 'implementationCost', label: 'Implementation cost' },
        { key: 'annualOperatingCost', label: 'Annual operating cost' },
        { key: 'annualBenefit', label: 'Annual benefit' },
        { key: 'payback', label: 'Payback notes' },
        { key: 'scenarios', label: 'Best / expected / worst', multiline: true },
      ]
    case 'guidedNotes':
      return [
        {
          key: 'useCaseContext',
          label: 'Use case context (auto-filled — edit if needed)',
          multiline: true,
          placeholder: 'Use case, problem, users, outcome…',
        },
        {
          key: 'frameworkPrompts',
          label: 'Framework prompts / checklist',
          multiline: true,
          placeholder: 'Questions this framework asks of your use case',
        },
        {
          key: 'findings',
          label: 'Findings for this use case',
          multiline: true,
          placeholder: 'What did the framework reveal?',
        },
        {
          key: 'evidence',
          label: 'Evidence / sources',
          multiline: true,
          placeholder: 'Interviews, data, documents',
        },
        {
          key: 'decisionOrOutput',
          label: 'Decision / output',
          multiline: true,
          placeholder: 'What do we conclude or produce?',
        },
        {
          key: 'nextActions',
          label: 'Next actions',
          multiline: true,
          placeholder: 'Owners and due dates',
        },
      ]
    default:
      return [{ key: 'notes', label: 'Notes', multiline: true }]
  }
}
