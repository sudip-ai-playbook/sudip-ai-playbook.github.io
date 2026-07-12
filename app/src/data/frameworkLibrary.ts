export type CanvasType =
  | 'mece'
  | 'fiveWhys'
  | 'sipoc'
  | 'vsm'
  | 'jtbd'
  | 'aiCanvas'
  | 'valueFeasibility'
  | 'rice'
  | 'swot'
  | 'pestle'
  | 'bmc'
  | 'mckinsey7s'
  | 'nistAiRmf'
  | 'raci'
  | 'raid'
  | 'adkar'
  | 'businessCase'
  | 'tcoRoi'
  | 'guidedNotes'

export interface MvpFramework {
  id: string
  name: string
  purpose: string
  businessQuestions: string[]
  suitableStageIds: string[]
  notFor: string[]
  inputs: string[]
  stakeholders: string[]
  durationMinutes: number
  steps: string[]
  commonMistakes: string[]
  outputFormat: string
  relatedFrameworkIds: string[]
  nextAction: string
  canvasType: CanvasType
  executable: true
  summary?: string
  whenUseful?: string
}

/** @deprecated All library frameworks are executable; kept for type compatibility during migration. */
export type ShortFramework = MvpFramework

export type FrameworkEntry = MvpFramework

function mvp(
  partial: Omit<MvpFramework, 'executable'>,
): MvpFramework {
  return { ...partial, executable: true }
}

export const MVP_FRAMEWORK_LIBRARY: MvpFramework[] = [
  mvp({
    id: 'mece',
    name: 'MECE',
    purpose:
      'Break a complicated business problem into categories that do not overlap and collectively cover the full problem.',
    businessQuestions: [
      'What are the mutually exclusive drivers of this problem?',
      'Have we covered the whole problem space?',
    ],
    suitableStageIds: ['stage-0', 'stage-1', 'stage-3', 'stage-5', 'stage-7', 'stage-8'],
    notFor: ['Detailed process mapping', 'Technical architecture decisions'],
    inputs: ['Problem statement', 'Known symptoms', 'Available data hypotheses'],
    stakeholders: ['Engagement lead', 'Business analysts', 'Client sponsor'],
    durationMinutes: 60,
    steps: [
      'State the problem in one sentence',
      'Propose first-level branches that do not overlap',
      'Check collective coverage (no major gaps)',
      'Decompose one level deeper where evidence is needed',
      'Flag branches that are symptoms versus causes',
      'List data and interviews required per branch',
    ],
    commonMistakes: [
      'Overlapping categories',
      'Inconsistent decomposition depth',
      'Treating symptoms as root causes',
      'Branches that cannot be measured',
    ],
    outputFormat: 'MECE issue tree with hypotheses and evidence requests',
    relatedFrameworkIds: ['fiveWhys', 'sipoc'],
    nextAction: 'Convert branches into interview questions and analysis tasks',
    canvasType: 'mece',
  }),
  mvp({
    id: 'fiveWhys',
    name: 'Five Whys',
    purpose: 'Drill from a visible symptom to a deeper root cause through successive why questions.',
    businessQuestions: ['Why is this happening?', 'What is the underlying cause we must fix?'],
    suitableStageIds: ['stage-1', 'stage-3', 'stage-5'],
    notFor: ['Complex multi-causal systems without evidence', 'Blame-focused sessions'],
    inputs: ['Observed problem', 'Process context', 'Evidence of failure'],
    stakeholders: ['Process owner', 'Front-line operators', 'Facilitator'],
    durationMinutes: 45,
    steps: [
      'Write the problem statement',
      'Ask why and capture the answer with evidence',
      'Repeat until a controllable root cause appears',
      'Stop when further whys become speculation',
      'Define a corrective action for the root cause',
    ],
    commonMistakes: ['Stopping at the first convenient answer', 'Asking leading questions', 'No evidence for each why'],
    outputFormat: 'Why-chain with root cause and corrective action',
    relatedFrameworkIds: ['mece', 'sipoc', 'vsm'],
    nextAction: 'Link the root cause to an intervention and owner',
    canvasType: 'fiveWhys',
  }),
  mvp({
    id: 'sipoc',
    name: 'SIPOC',
    purpose: 'Define the boundary of a process: suppliers, inputs, process, outputs and customers.',
    businessQuestions: ['What is in scope for this process?', 'Who supplies and who receives value?'],
    suitableStageIds: ['stage-3', 'stage-5'],
    notFor: ['Detailed swimlane design (use BPMN after SIPOC)'],
    inputs: ['Process name', 'Start and end events', 'Known stakeholders'],
    stakeholders: ['Process owner', 'Operations', 'IT liaison'],
    durationMinutes: 50,
    steps: [
      'Name the process and its start/end',
      'List suppliers',
      'List inputs',
      'Outline 5–7 high-level process steps',
      'List outputs',
      'List customers',
    ],
    commonMistakes: ['Too much detail too early', 'Missing the real customer', 'Blurry process boundaries'],
    outputFormat: 'Completed SIPOC table',
    relatedFrameworkIds: ['vsm', 'fiveWhys'],
    nextAction: 'Map the as-is flow with Value Stream Mapping or BPMN',
    canvasType: 'sipoc',
  }),
  mvp({
    id: 'vsm',
    name: 'Value Stream Mapping',
    purpose: 'Identify waste, delay and hand-offs across a value stream from trigger to outcome.',
    businessQuestions: ['Where does time and cost accumulate?', 'Which steps add value?'],
    suitableStageIds: ['stage-3', 'stage-5'],
    notFor: ['Organisation-wide strategy without a process focus'],
    inputs: ['SIPOC boundary', 'Cycle times', 'Wait times', 'Volumes'],
    stakeholders: ['Process owner', 'Operations analysts', 'Finance (optional)'],
    durationMinutes: 90,
    steps: [
      'Confirm process trigger and customer outcome',
      'Map process steps in sequence',
      'Capture cycle time, wait time and inventory/queues',
      'Mark value-adding versus non-value-adding steps',
      'Identify top waste themes',
      'Propose improvement hypotheses',
    ],
    commonMistakes: ['Mapping systems instead of value flow', 'No quantitative times', 'Skipping hand-offs'],
    outputFormat: 'Value stream sketch with waste themes and improvement ideas',
    relatedFrameworkIds: ['sipoc', 'fiveWhys', 'aiCanvas'],
    nextAction: 'Test whether AI is the simplest intervention for each waste theme',
    canvasType: 'vsm',
  }),
  mvp({
    id: 'jtbd',
    name: 'Jobs to Be Done',
    purpose: 'Frame the progress a user is trying to make, independent of a specific solution.',
    businessQuestions: ['What job is the user hiring a solution to do?', 'What success looks like in their context?'],
    suitableStageIds: ['stage-1', 'stage-5', 'stage-10'],
    notFor: ['Pure technology selection without user context'],
    inputs: ['User segment', 'Current workaround', 'Desired outcome'],
    stakeholders: ['Product owner', 'Business process owner', 'UX researcher'],
    durationMinutes: 60,
    steps: [
      'Define the user and context',
      'Write the functional job statement',
      'Capture emotional and social jobs',
      'List current alternatives and frictions',
      'Define success metrics for the job',
    ],
    commonMistakes: ['Writing solution statements instead of jobs', 'Mixing multiple jobs'],
    outputFormat: 'Job statements with frictions and success metrics',
    relatedFrameworkIds: ['aiCanvas', 'adkar'],
    nextAction: 'Translate jobs into use-case cards or prototype hypotheses',
    canvasType: 'jtbd',
  }),
  mvp({
    id: 'aiCanvas',
    name: 'AI Canvas',
    purpose: 'Structure an AI use case: prediction/generation, value, data, and learning loop.',
    businessQuestions: ['What does the AI produce?', 'What decision or action does it enable?', 'What data feeds it?'],
    suitableStageIds: ['stage-5', 'stage-6', 'stage-10'],
    notFor: ['Non-AI interventions that should stay process/policy changes'],
    inputs: ['Business problem', 'Users', 'Available data', 'Constraints'],
    stakeholders: ['Business owner', 'Data owner', 'Solution engineer'],
    durationMinutes: 75,
    steps: [
      'State the prediction or generation task',
      'Describe judgment / human oversight',
      'Describe action taken with the output',
      'List required data and labels',
      'Define value hypothesis and baseline KPI',
      'Identify risks and fall-back behaviour',
    ],
    commonMistakes: ['Starting with a model instead of a decision', 'Ignoring human oversight', 'No baseline KPI'],
    outputFormat: 'Completed AI Canvas and suitability note',
    relatedFrameworkIds: ['valueFeasibility', 'rice', 'jtbd'],
    nextAction: 'Score the use case with Value–Feasibility or RICE',
    canvasType: 'aiCanvas',
  }),
  mvp({
    id: 'valueFeasibility',
    name: 'Value-versus-Feasibility',
    purpose: 'Prioritise use cases on a value and feasibility matrix with evidence-backed scores.',
    businessQuestions: ['Which use cases are quick wins vs strategic bets?', 'What should be deferred?'],
    suitableStageIds: ['stage-6'],
    notFor: ['Single use-case detailed design'],
    inputs: ['Use-case cards', 'Scoring dimensions', 'Stakeholder scores'],
    stakeholders: ['Portfolio owner', 'Architecture', 'Risk', 'Business sponsors'],
    durationMinutes: 90,
    steps: [
      'Agree scoring dimensions and weights',
      'Score value with evidence notes',
      'Score feasibility with evidence notes',
      'Plot or classify into portfolio buckets',
      'Capture disagreements and next evidence needed',
    ],
    commonMistakes: ['Precise scores without evidence', 'Ignoring foundational enablers', 'Political scoring'],
    outputFormat: 'Scored portfolio with bucket classification',
    relatedFrameworkIds: ['rice', 'aiCanvas'],
    nextAction: 'Seek Portfolio Approval Gate with recommended shortlist',
    canvasType: 'valueFeasibility',
  }),
  mvp({
    id: 'rice',
    name: 'RICE',
    purpose: 'Score initiatives using Reach, Impact, Confidence and Effort.',
    businessQuestions: ['Which initiative delivers the best reach-adjusted impact for effort?'],
    suitableStageIds: ['stage-6', 'stage-9'],
    notFor: ['Regulatory must-dos that are non-optional'],
    inputs: ['Initiative list', 'Reach estimates', 'Effort estimates'],
    stakeholders: ['Product lead', 'Delivery lead', 'Sponsor'],
    durationMinutes: 45,
    steps: [
      'Define Reach (users/period)',
      'Score Impact',
      'Score Confidence',
      'Estimate Effort',
      'Compute RICE score and rank',
    ],
    commonMistakes: ['Inflated confidence', 'Incomparable reach units', 'Ignoring dependencies'],
    outputFormat: 'Ranked RICE table',
    relatedFrameworkIds: ['valueFeasibility', 'businessCase'],
    nextAction: 'Validate top items with data readiness and risk screening',
    canvasType: 'rice',
  }),
  mvp({
    id: 'swot',
    name: 'SWOT',
    purpose: 'Capture internal strengths/weaknesses and external opportunities/threats.',
    businessQuestions: ['Where are we strong or exposed?', 'What external shifts matter?'],
    suitableStageIds: ['stage-0', 'stage-3', 'stage-7'],
    notFor: ['Detailed root-cause analysis'],
    inputs: ['Strategy context', 'Competitive notes', 'Capability facts'],
    stakeholders: ['Leadership', 'Strategy', 'Domain experts'],
    durationMinutes: 60,
    steps: [
      'List strengths with evidence',
      'List weaknesses with evidence',
      'List opportunities',
      'List threats',
      'Derive 3–5 strategic implications',
    ],
    commonMistakes: ['Vague bullets without evidence', 'Mixing internal/external factors'],
    outputFormat: 'SWOT grid with implications',
    relatedFrameworkIds: ['pestle', 'bmc'],
    nextAction: 'Feed implications into strategy choices or discovery priorities',
    canvasType: 'swot',
  }),
  mvp({
    id: 'pestle',
    name: 'PESTLE',
    purpose: 'Scan political, economic, social, technological, legal and environmental factors.',
    businessQuestions: ['Which external forces shape this AI opportunity?'],
    suitableStageIds: ['stage-0', 'stage-3', 'stage-7'],
    notFor: ['Internal process redesign workshops'],
    inputs: ['Industry context', 'Regulatory landscape', 'Market trends'],
    stakeholders: ['Strategy', 'Legal/risk', 'Engagement lead'],
    durationMinutes: 60,
    steps: [
      'Scan each PESTLE dimension',
      'Rate relevance to the engagement',
      'Identify implications for AI ambition and risk',
      'List evidence to validate open questions',
    ],
    commonMistakes: ['Laundry lists with no implications', 'Ignoring legal/privacy drivers'],
    outputFormat: 'PESTLE scan with implications',
    relatedFrameworkIds: ['swot', 'nistAiRmf'],
    nextAction: 'Update opportunity brief and risk watchlist',
    canvasType: 'pestle',
  }),
  mvp({
    id: 'bmc',
    name: 'Business Model Canvas',
    purpose: 'Describe how the organisation creates, delivers and captures value.',
    businessQuestions: ['How does value flow today?', 'Where could AI change the model?'],
    suitableStageIds: ['stage-0', 'stage-3', 'stage-7'],
    notFor: ['Detailed solution architecture'],
    inputs: ['Customer segments', 'Value propositions', 'Channels', 'Cost/revenue facts'],
    stakeholders: ['Business leadership', 'Product', 'Finance'],
    durationMinutes: 90,
    steps: [
      'Map customer segments and value propositions',
      'Map channels and relationships',
      'Map key activities, resources and partners',
      'Map cost structure and revenue streams',
      'Highlight AI disruption or enablement points',
    ],
    commonMistakes: ['Generic canvas not grounded in client facts', 'Skipping cost/revenue'],
    outputFormat: 'Business Model Canvas with AI hotspot notes',
    relatedFrameworkIds: ['swot', 'jtbd'],
    nextAction: 'Identify opportunity areas for discovery',
    canvasType: 'bmc',
  }),
  mvp({
    id: 'mckinsey7s',
    name: 'McKinsey 7S',
    purpose: 'Assess organisational alignment across strategy, structure, systems, skills, staff, style and shared values.',
    businessQuestions: ['Is the organisation aligned to deliver AI ambition?'],
    suitableStageIds: ['stage-3', 'stage-4', 'stage-7', 'stage-14'],
    notFor: ['Single-process technical root cause'],
    inputs: ['Org charts', 'Operating model notes', 'Culture observations'],
    stakeholders: ['HR/OD', 'Leadership', 'Change lead'],
    durationMinutes: 75,
    steps: [
      'Score or describe each of the 7S elements',
      'Identify misalignments',
      'Link gaps to AI readiness',
      'Propose alignment actions',
    ],
    commonMistakes: ['Focusing only on hard Ss', 'No link to target operating model'],
    outputFormat: '7S assessment with alignment actions',
    relatedFrameworkIds: ['adkar', 'raci'],
    nextAction: 'Feed gaps into maturity and CoE design',
    canvasType: 'mckinsey7s',
  }),
  mvp({
    id: 'nistAiRmf',
    name: 'NIST AI RMF',
    purpose: 'Structure AI risk management across Govern, Map, Measure and Manage functions.',
    businessQuestions: ['How do we govern and manage AI risk across the lifecycle?'],
    suitableStageIds: ['stage-4', 'stage-8', 'stage-17'],
    notFor: ['Pure commercial prioritisation'],
    inputs: ['Use-case inventory', 'Risk appetite', 'Existing controls'],
    stakeholders: ['Risk', 'Legal', 'Security', 'AI CoE'],
    durationMinutes: 90,
    steps: [
      'Assess Govern practices',
      'Map context, risks and impacts',
      'Define Measure approaches and metrics',
      'Define Manage responses and residual risk owners',
    ],
    commonMistakes: ['Paper policy without operational controls', 'Skipping Measure'],
    outputFormat: 'NIST AI RMF assessment notes and control actions',
    relatedFrameworkIds: ['raid', 'raci'],
    nextAction: 'Produce governance approval pack for the risk gate',
    canvasType: 'nistAiRmf',
  }),
  mvp({
    id: 'raci',
    name: 'RACI',
    purpose: 'Clarify who is Responsible, Accountable, Consulted and Informed for key activities.',
    businessQuestions: ['Who owns each decision and deliverable?'],
    suitableStageIds: ['stage-2', 'stage-7', 'stage-14', 'stage-15'],
    notFor: ['Detailed task scheduling'],
    inputs: ['Activity list', 'Role list'],
    stakeholders: ['Engagement manager', 'Client counterparts'],
    durationMinutes: 45,
    steps: [
      'List critical activities',
      'List roles',
      'Assign R/A/C/I (one A per activity)',
      'Resolve conflicts and gaps',
    ],
    commonMistakes: ['Multiple Accountables', 'Everyone Consulted', 'Missing operational owners'],
    outputFormat: 'RACI matrix',
    relatedFrameworkIds: ['raid', 'adkar'],
    nextAction: 'Publish RACI into charter and governance calendar',
    canvasType: 'raci',
  }),
  mvp({
    id: 'raid',
    name: 'RAID',
    purpose: 'Track Risks, Assumptions, Issues and Dependencies through the engagement.',
    businessQuestions: ['What could block progress and who owns mitigation?'],
    suitableStageIds: ['stage-2', 'stage-8', 'stage-12', 'stage-19'],
    notFor: ['Standalone opportunity ideation'],
    inputs: ['Known risks', 'Open issues', 'External dependencies'],
    stakeholders: ['Engagement manager', 'Workstream leads', 'Risk reviewer'],
    durationMinutes: 40,
    steps: [
      'Capture risks with likelihood/impact',
      'Capture assumptions to validate',
      'Capture issues requiring action',
      'Capture dependencies and owners',
      'Set review cadence',
    ],
    commonMistakes: ['Static log never reviewed', 'No owners or due dates'],
    outputFormat: 'RAID log entries',
    relatedFrameworkIds: ['raci', 'nistAiRmf'],
    nextAction: 'Escalate red items into steering materials',
    canvasType: 'raid',
  }),
  mvp({
    id: 'adkar',
    name: 'ADKAR',
    purpose: 'Plan change adoption across Awareness, Desire, Knowledge, Ability and Reinforcement.',
    businessQuestions: ['Are people ready to adopt the AI solution?'],
    suitableStageIds: ['stage-13', 'stage-15'],
    notFor: ['Technical go-live checklists alone'],
    inputs: ['Impacted roles', 'Training plan draft', 'Resistance signals'],
    stakeholders: ['Change lead', 'Business owners', 'Champions'],
    durationMinutes: 60,
    steps: [
      'Assess Awareness',
      'Assess Desire',
      'Assess Knowledge',
      'Assess Ability',
      'Define Reinforcement mechanisms',
      'Create gap actions per ADKAR element',
    ],
    commonMistakes: ['Training-only change plans', 'No reinforcement after go-live'],
    outputFormat: 'ADKAR assessment and action plan',
    relatedFrameworkIds: ['jtbd', 'raci'],
    nextAction: 'Confirm Adoption Readiness Gate evidence',
    canvasType: 'adkar',
  }),
  mvp({
    id: 'businessCase',
    name: 'Business Case',
    purpose: 'Articulate benefits, costs, options and recommendation for investment decision.',
    businessQuestions: ['Why invest?', 'What options exist?', 'What is the recommendation?'],
    suitableStageIds: ['stage-9', 'stage-18'],
    notFor: ['Early ideation without baselines'],
    inputs: ['Baseline KPIs', 'Cost estimates', 'Benefit hypotheses', 'Risks'],
    stakeholders: ['Sponsor', 'Finance', 'Delivery lead'],
    durationMinutes: 75,
    steps: [
      'State the strategic case',
      'Define options (including do nothing)',
      'Estimate benefits and costs',
      'Assess risks and non-financial factors',
      'Write recommendation and decision ask',
    ],
    commonMistakes: ['Benefits without owners', 'Ignoring operating costs', 'No do-nothing option'],
    outputFormat: 'Business case summary for investment gate',
    relatedFrameworkIds: ['tcoRoi', 'rice'],
    nextAction: 'Table for Investment Gate approval',
    canvasType: 'businessCase',
  }),
  mvp({
    id: 'tcoRoi',
    name: 'TCO and ROI',
    purpose: 'Quantify total cost of ownership and return on investment scenarios.',
    businessQuestions: ['What is the full cost?', 'What payback and ROI should we expect?'],
    suitableStageIds: ['stage-9', 'stage-11', 'stage-17'],
    notFor: ['Qualitative strategy workshops'],
    inputs: ['Build costs', 'Run costs', 'Benefit estimates', 'Time horizon'],
    stakeholders: ['Finance', 'FinOps', 'Solution architect'],
    durationMinutes: 60,
    steps: [
      'List implementation cost items',
      'List annual operating costs',
      'Estimate annual benefit',
      'Compute ROI and payback for expected case',
      'Capture best/worst sensitivity notes',
    ],
    commonMistakes: ['Omitting human review and support costs', 'Token cost ignored for GenAI'],
    outputFormat: 'TCO/ROI worksheet with scenarios',
    relatedFrameworkIds: ['businessCase', 'rice'],
    nextAction: 'Attach to roadmap funding recommendation',
    canvasType: 'tcoRoi',
  }),
]

function guidedNotesFramework(input: {
  id: string
  name: string
  summary: string
  whenUseful: string
  suitableStageIds?: string[]
  questions?: string[]
}): MvpFramework {
  return mvp({
    id: input.id,
    name: input.name,
    purpose: input.summary,
    summary: input.summary,
    whenUseful: input.whenUseful,
    businessQuestions: input.questions ?? [
      `How does ${input.name} apply to this use case?`,
      'What evidence do we need?',
      'What decision or output should this produce?',
    ],
    suitableStageIds: input.suitableStageIds ?? [],
    notFor: ['Skipping use-case context'],
    inputs: ['Use case card', 'Evidence', 'Stakeholders'],
    stakeholders: ['Facilitator', 'Business owner', 'Relevant specialists'],
    durationMinutes: 45,
    steps: [
      'Confirm the use case context',
      `Apply ${input.name} prompts to the use case`,
      'Capture findings with evidence',
      'Record decisions and follow-up actions',
    ],
    commonMistakes: [
      'Running the framework without a use case',
      'Capturing opinions without evidence',
    ],
    outputFormat: `${input.name} working notes linked to the use case`,
    relatedFrameworkIds: [],
    nextAction: 'Save outputs and continue the workshop agenda',
    canvasType: 'guidedNotes',
  })
}

export const SHORT_FRAMEWORK_LIBRARY: MvpFramework[] = [
  guidedNotesFramework({
    id: 'bant',
    name: 'BANT',
    summary: 'Qualify opportunities on Budget, Authority, Need and Timing.',
    whenUseful: 'Stage 0 pursuit decisions',
    suitableStageIds: ['stage-0'],
    questions: ['Budget?', 'Authority?', 'Need?', 'Timing?'],
  }),
  guidedNotesFramework({
    id: 'meddicc',
    name: 'MEDDICC',
    summary:
      'Complex opportunity qualification across metrics, economic buyer, decision criteria and process.',
    whenUseful: 'Enterprise pursuits',
    suitableStageIds: ['stage-0'],
  }),
  guidedNotesFramework({
    id: 'spin',
    name: 'SPIN questioning',
    summary:
      'Situation, Problem, Implication, Need-payoff questioning for discovery conversations.',
    whenUseful: 'First client meetings',
    suitableStageIds: ['stage-1'],
    questions: ['Situation?', 'Problem?', 'Implication?', 'Need-payoff?'],
  }),
  guidedNotesFramework({
    id: 'bpmn',
    name: 'BPMN',
    summary: 'Standard notation for detailed process flows and hand-offs.',
    whenUseful: 'After SIPOC when detail is required',
    suitableStageIds: ['stage-3', 'stage-5'],
  }),
  guidedNotesFramework({
    id: 'togaf',
    name: 'TOGAF',
    summary: 'Enterprise architecture method for capability and architecture governance.',
    whenUseful: 'Solution design and architecture reviews',
    suitableStageIds: ['stage-10'],
  }),
  guidedNotesFramework({
    id: 'c4',
    name: 'C4 Model',
    summary: 'Context, Containers, Components, Code views for software architecture.',
    whenUseful: 'Solution design workshops',
    suitableStageIds: ['stage-10'],
  }),
  guidedNotesFramework({
    id: 'wsjf',
    name: 'WSJF',
    summary: 'Weighted Shortest Job First prioritisation from SAFe.',
    whenUseful: 'Portfolio sequencing alternatives to RICE',
    suitableStageIds: ['stage-6'],
  }),
  guidedNotesFramework({
    id: 'itil',
    name: 'ITIL',
    summary: 'Service management practices for transition, incidents and SLAs.',
    whenUseful: 'Go-live and service management stages',
    suitableStageIds: ['stage-15', 'stage-16'],
  }),
  guidedNotesFramework({
    id: 'leanStartup',
    name: 'Lean Startup',
    summary: 'Build–Measure–Learn loops for prototype validation.',
    whenUseful: 'Proof of value',
    suitableStageIds: ['stage-11'],
  }),
  guidedNotesFramework({
    id: 'kotter',
    name: 'Kotter Eight-Step Model',
    summary: 'Leadership-led change sequence from urgency to institutionalisation.',
    whenUseful: 'Large-scale adoption programmes',
    suitableStageIds: ['stage-13'],
  }),
  guidedNotesFramework({
    id: 'iso42001',
    name: 'ISO/IEC 42001',
    summary: 'Management system standard for AI.',
    whenUseful: 'Governance and CoE design',
    suitableStageIds: ['stage-8', 'stage-14'],
  }),
  guidedNotesFramework({
    id: 'stride',
    name: 'STRIDE',
    summary: 'Threat modelling categories for security design reviews.',
    whenUseful: 'Risk and solution design',
    suitableStageIds: ['stage-8', 'stage-10'],
  }),
]

/** Maps stage display names / aliases to library ids. */
export const FRAMEWORK_NAME_ALIASES: Record<string, string> = {
  mece: 'mece',
  'mece issue decomposition': 'mece',
  'five whys': 'fiveWhys',
  sipoc: 'sipoc',
  'value stream mapping': 'vsm',
  'jobs to be done': 'jtbd',
  'ai canvas': 'aiCanvas',
  'lean ai canvas': 'aiCanvas',
  'value-versus-feasibility': 'valueFeasibility',
  'value-versus-feasibility matrix': 'valueFeasibility',
  'value versus feasibility': 'valueFeasibility',
  rice: 'rice',
  'rice or wsjf': 'rice',
  swot: 'swot',
  pestle: 'pestle',
  'business model canvas': 'bmc',
  'mckinsey 7s': 'mckinsey7s',
  'nist ai rmf': 'nistAiRmf',
  'nist ai risk management framework': 'nistAiRmf',
  raci: 'raci',
  raid: 'raid',
  adkar: 'adkar',
  'business case': 'businessCase',
  'tco and roi': 'tcoRoi',
  tco: 'tcoRoi',
  roi: 'tcoRoi',
  bant: 'bant',
  meddicc: 'meddicc',
  'spin questioning': 'spin',
  bpmn: 'bpmn',
  togaf: 'togaf',
  'c4 model': 'c4',
  c4: 'c4',
  wsjf: 'wsjf',
  itil: 'itil',
  'lean startup': 'leanStartup',
  'kotter eight-step model': 'kotter',
  'iso/iec 42001': 'iso42001',
  stride: 'stride',
}

export const ALL_FRAMEWORKS: FrameworkEntry[] = [
  ...MVP_FRAMEWORK_LIBRARY,
  ...SHORT_FRAMEWORK_LIBRARY,
]
