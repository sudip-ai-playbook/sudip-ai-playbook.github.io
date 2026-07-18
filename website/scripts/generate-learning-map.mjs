/**
 * Generates Learning Map MDX pages from structured curriculum data.
 * Run: node scripts/generate-learning-map.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'learning-map');

const STAGES = [
  {
    id: 'stage-1',
    title: 'Stage 1: Business and consulting foundations',
    outcome: 'Explain why a client should invest in an AI solution.',
    topics: [1, 2, 3, 4, 5, 27, 28],
  },
  {
    id: 'stage-2',
    title: 'Stage 2: AI and data foundations',
    outcome: 'Judge whether a use case is technically feasible.',
    topics: [9, 10, 11, 12, 13, 14, 21],
  },
  {
    id: 'stage-3',
    title: 'Stage 3: Architecture and cloud',
    outcome: 'Design an enterprise-grade solution.',
    topics: [8, 15, 16, 24],
  },
  {
    id: 'stage-4',
    title: 'Stage 4: Trust and control',
    outcome: 'Demonstrate the solution is safe and governable.',
    topics: [17, 18, 19, 20],
  },
  {
    id: 'stage-5',
    title: 'Stage 5: Commercialisation and delivery',
    outcome: 'Take a solution from opportunity to production.',
    topics: [6, 7, 22, 23, 25, 26, 29, 30, 31, 32],
  },
  {
    id: 'stage-6',
    title: 'Stage 6: Leadership',
    outcome: 'Lead clients and multidisciplinary teams through AI transformation.',
    topics: [33, 34, 35],
  },
];

/** @type {Array<{n:number,slug:string,title:string,summary:string,learn:string[],questions:string[],outputs:string[],example:string,practice:string,related:string}>} */
const TOPICS = [
  {
    n: 1,
    slug: '01-business-fundamentals',
    title: 'Business Fundamentals',
    summary:
      'Understand how organisations make money, spend money, manage risk and measure success—so AI work maps to P&L impact.',
    learn: [
      'Business models: B2B, B2C, B2B2C, marketplace; subscription, usage-based, outcome-based; professional and managed services',
      'Financial concepts: revenue, margin, EBITDA, CAPEX vs OPEX, unit economics, CAC, LTV, payback, ROI, NPV, IRR, TCO, cost of delay',
      'Performance: KPIs, OKRs, SLAs, CSAT/NPS, retention, conversion, leading vs lagging indicators',
    ],
    questions: [
      'How does this organisation make money?',
      'Which cost or revenue line will the AI solution affect?',
      'How quickly will the investment pay back if the project fails?',
    ],
    outputs: ['Value hypothesis', 'Baseline metric set', 'Payback sketch'],
    example:
      'A UK retail bank wants an “AI chatbot”. You reframe it to claims/servicing: average handle time is 12 minutes; 40% of contacts are policy lookup. A knowledge assistant that cuts 3 minutes off those contacts affects operating cost, not “AI adoption”. You size annual contacts × time saved × loaded cost, then compare to TCO.',
    practice:
      'Pick one public company in financial services. Write one paragraph on how it makes money, three KPIs an AI assistant could move, and a one-line payback hypothesis.',
    related: '/ai-solution-engineering/business-case',
  },
  {
    n: 2,
    slug: '02-business-strategy',
    title: 'Business Strategy',
    summary:
      'AI must support strategy—competitive advantage, capabilities and operating model—not sit as an isolated tech project.',
    learn: [
      'Vision, mission, corporate vs BU strategy, differentiation vs cost leadership, operating models, value chains',
      'Build / buy / partner / outsource; core vs non-core; platform, data and cloud strategy',
      'Frameworks: SWOT, PESTLE, Porter, Business Model Canvas, Jobs to Be Done, Wardley, Three Horizons, Playing to Win',
    ],
    questions: [
      'Which strategic theme does this use case support?',
      'Is this capability core enough to build, or better to partner?',
      'What does the target operating model look like after adoption?',
    ],
    outputs: [
      'Strategic alignment statement',
      'AI opportunity map',
      'Build-vs-buy recommendation',
      'Executive decision paper',
    ],
    example:
      'An insurer’s strategy is “reduce loss ratio and improve retention”. An underwriting RAG assistant aligns; a generic marketing image generator does not. You produce a one-page alignment statement tying the use case to loss-ratio and retention themes, then a build-vs-buy note for knowledge platform components.',
    practice:
      'Write a five-line strategic alignment statement for a proposed AI use case against a fictional bank’s “digitise servicing, reduce cost-to-serve” strategy.',
    related: '/ai-solution-engineering/discovery',
  },
  {
    n: 3,
    slug: '03-industry-domain-knowledge',
    title: 'Industry and Domain Knowledge',
    summary:
      'Industry shape—processes, regulation, data and terminology—determines whether an AI pattern is viable.',
    learn: [
      'Study major industries: FS, healthcare, retail, telco, energy, manufacturing, public sector, professional services, SaaS',
      'For each industry: money model, processes, customers, data, platforms, regulation, risks, AI use cases, procurement cycles',
      'Financial services deep dive: KYC/AML, fraud, credit risk, claims, underwriting, MRM, conduct, explainability',
    ],
    questions: [
      'What regulation constrains model use and data movement?',
      'What does “good” look like for this process today?',
      'Which industry terms must appear in the problem statement?',
    ],
    outputs: ['Domain glossary', 'Process brief', 'Regulatory constraint list'],
    example:
      'For a wealth manager’s research assistant, “suitability” and “inducements” language matters. You interview advisers, map the research-to-recommendation process, and list FCA-relevant constraints before proposing RAG over research notes.',
    practice:
      'Choose insurance claims. List five process steps, three data sources, two regulations, and one AI use case that is NOT a chatbot.',
    related: '/ai-solution-engineering/industries',
  },
  {
    n: 4,
    slug: '04-consulting-problem-solving',
    title: 'Consulting and Problem Solving',
    summary:
      'Structure unclear problems with hypotheses, MECE decomposition and evidence—so recommendations survive challenge.',
    learn: [
      'Hypothesis-driven solving, first principles, systems thinking, root-cause analysis, trade-off analysis',
      'Frameworks: MECE, issue trees, Five Whys, SIPOC, MoSCoW, RICE, value-risk-feasibility scoring',
      'Skills: discovery workshops, executive questions, synthesising complexity, facilitating decisions',
    ],
    questions: [
      'What is the problem in one sentence without naming AI?',
      'Which assumptions, if false, kill the case?',
      'What evidence would change your recommendation?',
    ],
    outputs: [
      'Problem statement',
      'Issue tree',
      'Hypothesis register',
      'Assumption register',
      'Decision log',
    ],
    example:
      'Stakeholders say “AI will fix complaints”. Five Whys shows root causes are policy ambiguity and handoffs, not chat UX. You build an issue tree: knowledge quality vs process design vs capacity. Recommendation: fix knowledge + workflow before any agent.',
    practice:
      'Take “we need GenAI”. Build a 2-level MECE issue tree and three falsifiable hypotheses.',
    related: '/ai-solution-engineering/discovery',
  },
  {
    n: 5,
    slug: '05-ai-opportunity-discovery',
    title: 'AI Opportunity Discovery',
    summary:
      'Not every problem needs AI. Identify high-value cognitive work and prioritise with value, feasibility and risk.',
    learn: [
      'Patterns: repetitive cognitive work, high-volume decisions, search, prediction, classification, optimisation, document processing',
      'Discovery questions: who, frequency, time, data, error cost, human control, trust',
      'Prioritisation: value, data readiness, regulatory risk, adoption complexity, time to value, sponsorship',
    ],
    questions: [
      'Does this need prediction, generation, search, automation or optimisation?',
      'What must remain under human control?',
      'Why is this better than a rules or workflow change?',
    ],
    outputs: [
      'Use-case inventory',
      'Prioritisation matrix',
      'Pilot recommendation',
      'Portfolio roadmap',
    ],
    example:
      'A contact centre lists 40 “AI ideas”. You score on value × data readiness × risk. Top pilot: policy Q&A with citations for Tier-1 agents. Bottom: fully autonomous complaint resolution (high risk, weak data).',
    practice:
      'Create a 2×2 (value vs feasibility) for five use cases in retail banking and pick one pilot with a one-sentence rationale.',
    related: '/ai-solution-engineering/discovery',
  },
  {
    n: 6,
    slug: '06-product-management',
    title: 'Product Management',
    summary:
      'Treat AI as a product: personas, journeys, MVP, feedback loops—and AI-specific trust, override and evaluation.',
    learn: [
      'Vision, personas, JTBD, journeys, roadmap, backlog, MVP, experiments, adoption metrics',
      'AI product: confidence, uncertainty UX, human override, hallucination handling, escalation, continuous evaluation',
    ],
    questions: [
      'Who is the primary user and what job are they hiring the product for?',
      'What is in/out of MVP vs later releases?',
      'How do users correct the system and how does that improve it?',
    ],
    outputs: [
      'PRD',
      'User stories + acceptance criteria',
      'MVP definition',
      'Success metric framework',
    ],
    example:
      'MVP for a servicing assistant: retrieve approved articles, cite sources, escalate when confidence is low. Explicitly out of scope: executing transactions. Acceptance criteria include citation presence and escalation rate targets.',
    practice:
      'Write three user stories with acceptance criteria for a claims assistant, including one for human override.',
    related: '/ai-solution-engineering/adoption',
  },
  {
    n: 7,
    slug: '07-commercial-financial-modelling',
    title: 'Commercial and Financial Modelling',
    summary:
      'Explain whether the solution is worth funding with TCO, ROI, benefits realisation and AI cost drivers.',
    learn: [
      'Business case, CBA, TCO, ROI, sensitivity, pricing, commercial risk',
      'AI costs: tokens, GPU, vector DB, pipelines, eval, human review, change, maintenance',
      'Benefits: revenue, cost, productivity, risk reduction, CX/EX, compliance',
      'Models: fixed price, T&M, subscription, consumption, managed service, outcome-based',
    ],
    questions: [
      'What is year-1 TCO including human review?',
      'Which benefits are cashable vs non-cashable?',
      'What sensitivity breaks the case?',
    ],
    outputs: ['Business case', 'ROI/TCO model', 'Benefits register', 'Pricing recommendation'],
    example:
      'Pilot cost looks cheap until you add evaluation, red-team, human review and knowledge ops. Your TCO shows ops cost dominates API cost. You recommend consumption pricing for the client’s internal chargeback plus a managed knowledge service.',
    practice:
      'List ten cost lines for a RAG assistant and mark each as build, run or change. Estimate which is largest in year 2.',
    related: '/ai-solution-engineering/finops-commercial',
  },
  {
    n: 8,
    slug: '08-enterprise-architecture',
    title: 'Enterprise Architecture',
    summary:
      'Place AI in the enterprise: business, application, data, integration, security and technology views with ADRs.',
    learn: [
      'Architecture domains and EA governance',
      'APIs, events, scaling, multi-tenancy, resilience, HA/DR, residency, zero trust',
      'C4, DDD awareness, Well-Architected, ADRs',
    ],
    questions: [
      'What systems own the workflow and data?',
      'Where does the AI component sit in the C4 context/container view?',
      'Which ADRs are non-negotiable (identity, residency, logging)?',
    ],
    outputs: ['Context/container diagrams', 'Data-flow', 'ADR set', 'HLD'],
    example:
      'You draw a C4 container diagram: Agent UI → Orchestration API → RAG service → Vector index → Policy CMS → IdP. ADR-001: no customer PII in prompts without Presidio masking.',
    practice:
      'Sketch a one-page C4 context diagram for a HR policy assistant integrating IdP, SharePoint and ServiceNow.',
    related: '/ai-solution-engineering/architecture',
  },
  {
    n: 9,
    slug: '09-data-engineering-architecture',
    title: 'Data Engineering and Data Architecture',
    summary:
      'AI quality depends on data quality, lineage, access and readiness—not just model choice.',
    learn: [
      'Stores: RDBMS, NoSQL, graph, vector, warehouse, lake, lakehouse',
      'Pipelines: ETL/ELT, streaming, CDC, validation, lineage, orchestration',
      'Management: quality, MDM, classification, retention, anonymisation, consent, residency',
    ],
    questions: [
      'Is the data available, accurate, timely and legally usable?',
      'Who owns each source and how is access controlled?',
      'What is the ingestion path for knowledge freshness?',
    ],
    outputs: [
      'Data-source inventory',
      'Data-quality assessment',
      'Data readiness score',
      'Lineage sketch',
    ],
    example:
      'Policy PDFs are three versions behind SharePoint. Readiness score fails on freshness and ownership. You gate the pilot until a owned CMS feed and weekly re-ingest exist.',
    practice:
      'Score a fictional knowledge corpus on availability, quality, ownership, sensitivity (1–5 each) and decide go/no-go for RAG.',
    related: '/ai-solution-engineering/data-knowledge',
  },
  {
    n: 10,
    slug: '10-machine-learning-foundations',
    title: 'Machine Learning Foundations',
    summary:
      'Strong conceptual ML literacy: problem types, metrics, leakage risks and lifecycle—without needing research depth.',
    learn: [
      'Supervised/unsupervised/RL; classification, regression, ranking, forecasting, anomaly detection',
      'Train/val/test, bias-variance, overfitting, leakage, imbalance, calibration',
      'Metrics: precision/recall/F1, AUC, MAE/RMSE, business-weighted metrics',
      'Lifecycle: experiment → deploy → monitor → retrain → retire',
    ],
    questions: [
      'Is this a prediction, ranking or generation problem?',
      'Which metric matches business cost of false positives vs negatives?',
      'How could leakage make the offline score look better than production?',
    ],
    outputs: ['Problem-type choice', 'Metric definition', 'Eval plan outline'],
    example:
      'Fraud alert triage: false negatives are costly. You optimise recall at a fixed precision floor and refuse accuracy as the headline metric.',
    practice:
      'For credit document classification, define primary metric, secondary metric, and one leakage risk to watch.',
    related: '/ai-solution-engineering/ai-patterns',
  },
  {
    n: 11,
    slug: '11-generative-ai-llm-fundamentals',
    title: 'Generative AI and LLM Fundamentals',
    summary:
      'Understand transformers, tokens, context, fine-tuning options and model selection trade-offs for enterprise use.',
    learn: [
      'Tokens, embeddings, context windows, attention, pretraining, instruction tuning, PEFT, quantisation, inference sampling',
      'Selection: quality, latency, cost, privacy, residency, tools, multimodal, lock-in, safety',
    ],
    questions: [
      'Why this model family versus a smaller or local model?',
      'What is the residency and training-data policy impact?',
      'Where do we need structured outputs or tool use?',
    ],
    outputs: ['Model selection matrix', 'Deployment pattern choice'],
    example:
      'You compare a hosted frontier model vs a regional smaller model for PII-heavy servicing. Latency and residency win for the smaller private deployment; complex reasoning routes to a stronger model behind masking.',
    practice:
      'Build a weighted scorecard (5 criteria) comparing two model options for an internal knowledge assistant.',
    related: '/ai-solution-engineering/ai-patterns',
  },
  {
    n: 12,
    slug: '12-prompt-context-engineering',
    title: 'Prompt and Context Engineering',
    summary:
      'Prompting matters, but enterprise solutions need versioning, schemas, controls and evaluation—not prompts alone.',
    learn: [
      'System/user messages, few-shot, structured prompting, schemas, tool descriptions, context assembly/compression',
      'Versioning, testing, injection resistance',
      'Principle: prompts + data + access control + eval + monitoring + human review',
    ],
    questions: [
      'What is the contract for output schema?',
      'How do we regression-test prompt changes?',
      'What injection paths exist via retrieved documents?',
    ],
    outputs: ['Prompt template pack', 'Output schema', 'Prompt test set'],
    example:
      'A “friendly” system prompt causes inconsistent claim summaries. You replace it with a schema (fields, citations required) and a golden test set of 50 cases in CI.',
    practice:
      'Write a system prompt + JSON schema for “policy answer with citations” and list three regression tests.',
    related: '/ai-solution-engineering/rag',
  },
  {
    n: 13,
    slug: '13-retrieval-augmented-generation',
    title: 'Retrieval-Augmented Generation',
    summary:
      'Design grounded generation: ingest, chunk, retrieve, rerank, cite and ACL—then evaluate faithfulness and cost.',
    learn: [
      'Ingest, parse, OCR limits, chunking, metadata, hybrid search, rerank, query rewrite, GraphRAG, citations, ACL retrieval',
      'Eval: precision/recall, faithfulness, citation correctness, latency, cost',
    ],
    questions: [
      'How is access enforced at retrieval time?',
      'What chunking strategy fits this corpus?',
      'How do we measure faithfulness before launch?',
    ],
    outputs: [
      'RAG architecture',
      'Chunking strategy',
      'Retrieval eval set',
      'Attribution design',
    ],
    example:
      'Without ACL filtering, junior staff retrieve restricted credit memos. You push identity into the retriever filter and fail the pipeline if citations lack source IDs.',
    practice:
      'Design chunking + metadata fields for a 10k-page policy corpus and define five retrieval eval queries.',
    related: '/ai-solution-engineering/rag',
  },
  {
    n: 14,
    slug: '14-agentic-ai-workflow-automation',
    title: 'Agentic AI and Workflow Automation',
    summary:
      'Prefer deterministic workflows when the process is known; use agents where flexibility creates real value—with gates and limits.',
    learn: [
      'Tools, planning, memory, state, HITL, multi-agent, routing, durable execution, MCP concepts',
      'Risks: loops, spend, unauthorised tools, leakage, goal drift, cascading failure',
    ],
    questions: [
      'Why not a deterministic workflow?',
      'Which tools are allow-listed and how are they authorised?',
      'Where are approval gates and step/token budgets?',
    ],
    outputs: ['Agent vs workflow decision', 'Tool allow-list', 'HITL design'],
    example:
      'Complaint handling: classification and routing stay deterministic; a constrained agent drafts a response from approved macros with mandatory human send.',
    practice:
      'Split a “book travel” employee assistant into deterministic vs agent steps and list three kill-switches.',
    related: '/ai-solution-engineering/agentic-ai',
  },
  {
    n: 15,
    slug: '15-software-engineering',
    title: 'Software Engineering',
    summary:
      'Ship reliable systems: APIs, auth, testing, CI/CD, containers—and AI-specific prompt/model regression tests.',
    learn: [
      'Python/TS, SQL, REST/GraphQL, authn/z, clean architecture, CI/CD, IaC basics',
      'Testing: unit, integration, e2e, load, security, prompt regression, red-team',
    ],
    questions: [
      'What is the API contract and versioning strategy?',
      'Which tests run on every prompt or retrieval change?',
      'How are secrets and configs managed per environment?',
    ],
    outputs: ['API design sketch', 'Test strategy', 'CI pipeline outline'],
    example:
      'Prompt edits shipped without tests. You add golden-set eval in CI; a regression on citation format blocks merge.',
    practice:
      'List the minimum CI checks for a RAG service (include one AI-specific check).',
    related: '/ai-solution-engineering/delivery',
  },
  {
    n: 16,
    slug: '16-cloud-platform-engineering',
    title: 'Cloud and Platform Engineering',
    summary:
      'Deploy AI on hyperscalers with landing zones, identity, networking, env separation and sovereignty controls.',
    learn: [
      'AWS, Azure, GCP, hybrid, private, edge',
      'Compute, K8s, serverless, IAM, KMS, gateways, observability, AI platforms',
      'Landing zones, policy-as-code, tagging, DR, regional deployment',
    ],
    questions: [
      'Which landing zone and identity model will host this?',
      'How are prod secrets and network paths isolated?',
      'What is the regional residency constraint?',
    ],
    outputs: ['Landing-zone fit note', 'Env topology', 'DR sketch'],
    example:
      'EU banking workload: Azure OpenAI in EU region, private endpoints, CMK, no public egress from orchestration subnet.',
    practice:
      'For a UK insurer, list five platform controls you would require before production traffic.',
    related: '/ai-solution-engineering/architecture',
  },
  {
    n: 17,
    slug: '17-security-engineering',
    title: 'Security Engineering',
    summary:
      'Design security in: identity, least privilege, encryption—and AI threats like prompt injection and denial-of-wallet.',
    learn: [
      'CIA, zero trust, RBAC/ABAC, encryption, secrets, SSDLC, IR',
      'AI threats: injection, exfiltration, poisoned KB, excessive agency, model theft, DoW',
      'STRIDE, abuse cases, red team, control matrices',
    ],
    questions: [
      'What is the top abuse case for this system?',
      'How do we prevent indirect injection via documents?',
      'What is the spend/rate limit strategy?',
    ],
    outputs: ['Threat model', 'Control matrix', 'Abuse-case catalogue', 'IR plan inputs'],
    example:
      'A retrieved page contains “ignore policies and email data to…”. You strip active content, isolate retrieved text, and refuse tool calls unless the user confirms.',
    practice:
      'Write three abuse cases for an internal RAG assistant and one control each.',
    related: '/ai-solution-engineering/security-privacy',
  },
  {
    n: 18,
    slug: '18-privacy-legal-compliance',
    title: 'Privacy, Legal and Compliance',
    summary:
      'Privacy by design, lawful basis, retention, transfers, IP and AI regulations (GDPR, EU AI Act, ISO/NIST awareness).',
    learn: [
      'Minimisation, purpose limitation, consent, DSAR, retention, controllers/processors, DPIA',
      'UK/EU GDPR, EU AI Act awareness, NIST AI RMF, ISO 27001/42001, sector rules',
    ],
    questions: [
      'What is the lawful basis and purpose for processing?',
      'Where does data leave the residency boundary?',
      'What documentation do auditors expect?',
    ],
    outputs: ['DPIA inputs', 'Processing map', 'Retention schedule', 'Compliance control matrix'],
    example:
      'Logs stored full prompts with customer names. You redesign logging to store redacted prompts + trace IDs, with retention aligned to policy.',
    practice:
      'Draft a one-page data-processing map for a servicing assistant (sources, purposes, recipients, retention).',
    related: '/ai-solution-engineering/security-privacy',
  },
  {
    n: 19,
    slug: '19-responsible-ai-governance',
    title: 'Responsible AI and AI Governance',
    summary:
      'Fairness, transparency, oversight and contestability—backed by inventories, approvals, model cards and kill-switches.',
    learn: [
      'Principles: fairness, accountability, transparency, safety, human oversight, contestability',
      'Mechanisms: policies, risk class, inventories, boards, model cards, eval requirements, audit logs',
    ],
    questions: [
      'Who owns the model and who accepts residual risk?',
      'How can a user contest an AI-assisted decision?',
      'Who can stop the system in production?',
    ],
    outputs: ['Risk classification', 'Model/use-case inventory entry', 'Oversight design'],
    example:
      'Credit memo drafting assistant is “high risk assistive”. Policy requires human approval, model card, monthly fairness sample review, and a documented stop procedure.',
    practice:
      'Classify three use cases (low/med/high) and state the minimum governance artefact for each.',
    related: '/ai-solution-engineering/governance',
  },
  {
    n: 20,
    slug: '20-mlops-llmops-observability',
    title: 'MLOps, LLMOps and Observability',
    summary:
      'Operate models and prompts with registries, eval pipelines, drift detection, tracing and reliability targets.',
    learn: [
      'Experiment tracking, registries, versioning, canaries, shadow, A/B, continuous eval',
      'LLM observability: prompts, tokens, latency, retrieval sources, tools, cost, traces, overrides',
      'SLI/SLO/SLA, error budgets, MTTR',
    ],
    questions: [
      'What SLOs matter for this assistant?',
      'How do we detect prompt or retrieval regressions?',
      'Can we roll back model/prompt versions in minutes?',
    ],
    outputs: ['Observability plan', 'SLO draft', 'Rollback runbook outline'],
    example:
      'Faithfulness drops after a corpus update. Traces show chunker change; you roll back index build and add a canary eval gate.',
    practice:
      'Define three SLIs and one SLO for a RAG assistant, plus the dashboard panels you would check first in an incident.',
    related: '/ai-solution-engineering/evaluation-observability',
  },
  {
    n: 21,
    slug: '21-ai-evaluation-quality-assurance',
    title: 'AI Evaluation and Quality Assurance',
    summary:
      'Evaluation is a core ASE skill: match methods and bars to risk—golden sets, humans, judges, red teams, online feedback.',
    learn: [
      'Dimensions: accuracy, faithfulness, safety, fairness, latency, cost, task completion',
      'Methods: golden sets, human eval, LLM-as-judge, adversarial, regression, A/B',
      'Risk-based bars: marketing assistant ≠ credit decisioning',
    ],
    questions: [
      'What is the evaluation bar for this risk class?',
      'What golden set covers critical failure modes?',
      'How do online metrics relate to offline scores?',
    ],
    outputs: ['Eval strategy', 'Golden dataset outline', 'Release quality gate'],
    example:
      'You refuse launch when citation correctness is 71% on the golden set. Gate is 90% for servicing answers that influence customers.',
    practice:
      'Write a release gate table (metric, threshold, owner) for a policy Q&A assistant.',
    related: '/ai-solution-engineering/evaluation-observability',
  },
  {
    n: 22,
    slug: '22-performance-finops',
    title: 'Performance Engineering and AI FinOps',
    summary:
      'Optimise latency and cost: caching, routing, smaller models, budgets, chargeback and anomaly detection.',
    learn: [
      'Latency, concurrency, rate limits, batching, streaming, routing, fallbacks, quantisation, capacity',
      'FinOps: cost per task/outcome, token budgets, GPU util, showback, alerts',
    ],
    questions: [
      'What is cost per successful completed task?',
      'Which requests can use a smaller model?',
      'Where do we cache safely?',
    ],
    outputs: ['Performance budget', 'Cost model', 'Optimisation backlog'],
    example:
      'Agent loops spike spend overnight. You add step caps, cache FAQ answers, and route simple intents to a small classifier + template.',
    practice:
      'Propose three cost cuts for a chatty multi-tool agent without harming answer quality on goldens.',
    related: '/ai-solution-engineering/finops-commercial',
  },
  {
    n: 23,
    slug: '23-ux-human-factors',
    title: 'User Experience and Human Factors',
    summary:
      'Calibrate trust: show uncertainty and sources, make correction easy, avoid false certainty and unsafe anthropomorphism.',
    learn: [
      'UCD, accessibility, conversational UX, progressive disclosure, error states, onboarding',
      'AI UX: uncertainty, sources, override, limitations, safe failure',
    ],
    questions: [
      'How does the UI show uncertainty?',
      'How does a user correct a wrong answer?',
      'What happens when the system should refuse?',
    ],
    outputs: ['UX principles checklist', 'Key screens/flows', 'Trust copy guidelines'],
    example:
      'UI said “I’m sure” on every answer. You replace with confidence bands + citations and a one-click “this was wrong” that opens a ticket with trace ID.',
    practice:
      'Rewrite three UI strings for a RAG answer that might be wrong, including a refuse state.',
    related: '/ai-solution-engineering/adoption',
  },
  {
    n: 24,
    slug: '24-integration-enterprise-systems',
    title: 'Integration and Enterprise Systems',
    summary:
      'AI must integrate with CRM, ERP, ITSM, IdP, DMS and data platforms via durable, versioned contracts.',
    learn: [
      'CRM/ERP/contact centre/HR/DMS/IdP/ITSM/collab/payments/workflow/BI',
      'APIs, events, SSO, service accounts, idempotency, retries, DLQ, versioning, legacy',
    ],
    questions: [
      'What is the system of record for each action?',
      'How do we authenticate service-to-service?',
      'What is the failure/retry behaviour?',
    ],
    outputs: ['Integration map', 'API contract list', 'Failure-mode notes'],
    example:
      'Assistant creates ServiceNow tickets twice on timeout. You add idempotency keys and a DLQ with replay runbook.',
    practice:
      'List integrations for a servicing assistant and mark each as read, write, or both—with auth method.',
    related: '/ai-solution-engineering/architecture',
  },
  {
    n: 25,
    slug: '25-delivery-programme-management',
    title: 'Delivery and Programme Management',
    summary:
      'Deliver with governance: agile/hybrid models, RAID, quality gates and a clear path from discovery to operate.',
    learn: [
      'Agile/Scrum/Kanban/hybrid, programme governance, dependencies, capacity, change control',
      'Registers: risk, assumption, issue, dependency, decision, action, benefits',
      'Stages: qualify → discover → design → prototype → case → build → launch → operate',
    ],
    questions: [
      'What is the critical path and top dependency?',
      'Which quality gate blocks production?',
      'Who owns RAID items this week?',
    ],
    outputs: ['Delivery roadmap', 'RAID log', 'Quality gate checklist'],
    example:
      'Security review is late. You surface it on the critical path, add a gate, and re-sequence non-blocking UX polish.',
    practice:
      'Draft a 6-week pilot plan with three gates and five RAID entries.',
    related: '/ai-solution-engineering/delivery',
  },
  {
    n: 26,
    slug: '26-change-management-adoption',
    title: 'Change Management and Adoption',
    summary:
      'Technical success fails without adoption: readiness, training, champions, process redesign and adoption metrics.',
    learn: [
      'Impact assessment, resistance, comms, training, champions, role redesign',
      'ADKAR, Kotter, influence-interest mapping',
      'Metrics: active users, task completion, time saved, overrides, escalations',
    ],
    questions: [
      'Whose job changes and how do we train them?',
      'What does adoption success look like in 30/90 days?',
      'How do we handle power users vs sceptics?',
    ],
    outputs: ['Change plan', 'Training outline', 'Adoption dashboard definition'],
    example:
      'Agents ignore the assistant. You embed it in the desktop they already use, train champions, and measure assisted vs unassisted AHT.',
    practice:
      'Write an ADKAR checklist for rolling out a policy assistant to 200 agents.',
    related: '/ai-solution-engineering/adoption',
  },
  {
    n: 27,
    slug: '27-stakeholder-management',
    title: 'Stakeholder Management',
    summary:
      'Map power and interest across C-suite, risk, delivery and users; set decision rights with RACI/RAPID.',
    learn: [
      'Stakeholders: CEO/CIO/CTO/CDO/CAIO/CISO/CFO, BU, product, architects, security, legal, risk, procurement, users, vendors',
      'Mapping, sponsorship, conflict, escalation, RACI, RAPID, steering vs working groups',
    ],
    questions: [
      'Who decides, who advises, who must be informed?',
      'Where will conflict appear first?',
      'What does the steering pack need each month?',
    ],
    outputs: ['Stakeholder map', 'RACI', 'Escalation path'],
    example:
      'CISO and BU disagree on public LLM use. RAPID clarifies CISO as Decide on data egress; BU as Recommend on value; steering records the decision.',
    practice:
      'Build a RACI for “approve production RAG launch” with five roles.',
    related: '/ai-solution-engineering/consulting',
  },
  {
    n: 28,
    slug: '28-communication-executive-articulation',
    title: 'Communication and Executive Articulation',
    summary:
      'Communicate differently to engineers and executives: BLUF, pyramid, SCQA, clear asks and options.',
    learn: [
      'Technical vs business communication surfaces',
      'Executive structure: what / why / impact / options / recommend / decision / next',
      'Pyramid, SCQA, BLUF, storytelling with data, facilitation, negotiation',
    ],
    questions: [
      'What decision do you need in this meeting?',
      'Can a busy executive understand the ask in 60 seconds?',
      'Are facts, assumptions and hypotheses labelled?',
    ],
    outputs: ['Executive brief', 'Decision slide', 'Workshop agenda'],
    example:
      'A 20-slide architecture deep dive fails. You rewrite to BLUF: “Approve EU private deployment (+£X/year) to meet residency; alternative is no-go.” Append detail.',
    practice:
      'Write a 7-line executive brief for funding a RAG pilot using the structure above.',
    related: '/ai-solution-engineering/consulting',
  },
  {
    n: 29,
    slug: '29-presales-solution-shaping',
    title: 'Presales and Solution Shaping',
    summary:
      'Qualify opportunities, shape solutions, estimate, demo responsibly and run technical due diligence.',
    learn: [
      'Qualification, discovery, positioning, estimation, proposals, PoCs, bid management',
      'BANT, MEDDIC/MEDDPICC, SPIN, value-based selling',
    ],
    questions: [
      'Is there a funded problem and economic buyer?',
      'What evidence does the client need to decide?',
      'What would prevent the deal?',
    ],
    outputs: ['Qualification scorecard', 'Solution outline', 'PoC plan'],
    example:
      'MEDDPICC shows no Champion and fuzzy Metrics. You pause the demo circus and run a discovery workshop to create a Champion-ready value hypothesis.',
    practice:
      'Score a fictional opportunity with MEDDPICC (one line each) and recommend pursue/pause.',
    related: '/ai-solution-engineering/consulting',
  },
  {
    n: 30,
    slug: '30-rfp-procurement-contracting',
    title: 'RFP, Procurement and Contracting',
    summary:
      'Navigate RFI/RFP/RFQ, SOWs, MSAs, DPAs, SLAs, liability and acceptance—without promising unsafe AI outcomes.',
    learn: [
      'RFI/RFP/RFQ, SOW, MSA, CR, SLA, acceptance, IP, DPA, security schedules, liability, indemnity',
      'Evaluation: functional/technical fit, security, pricing, delivery, support, compliance',
    ],
    questions: [
      'What are acceptance criteria for AI quality?',
      'Who owns IP in prompts, models and fine-tunes?',
      'What happens if the model provider changes terms?',
    ],
    outputs: ['SOW outline', 'Acceptance criteria', 'Risk clauses checklist'],
    example:
      'RFP demands “100% accurate answers”. You negotiate to measurable faithfulness/citation thresholds with human escalation, not absolute accuracy.',
    practice:
      'Draft five acceptance criteria for a RAG pilot that a procurement team can test.',
    related: '/ai-solution-engineering/finops-commercial',
  },
  {
    n: 31,
    slug: '31-vendor-technology-evaluation',
    title: 'Vendor and Technology Evaluation',
    summary:
      'Score providers on capability, cost, security, residency, lock-in and exit—with PoC evidence.',
    learn: [
      'Assess models, cloud, vector DB, observability, agents, security, governance platforms',
      'Criteria: function, integration, performance, cost, compliance, support, portability, exit',
    ],
    questions: [
      'What is our exit plan if the vendor fails?',
      'Does the PoC measure production-like constraints?',
      'Where is lock-in unacceptable?',
    ],
    outputs: ['Vendor scorecard', 'Weighted matrix', 'PoC results', 'Exit plan'],
    example:
      'Vector DB choice optimises only for demo latency. Your matrix weights residency + backup + open standards; you pick the slightly slower option with clearer exit.',
    practice:
      'Weight five criteria for choosing an LLM API vendor for a bank and score two options.',
    related: '/docs/ai-solution-engineering/8d-framework',
  },
  {
    n: 32,
    slug: '32-operations-production-support',
    title: 'Operations and Production Support',
    summary:
      'Transition to run: readiness, incidents, runbooks and AI-specific failure modes (drift, cost spikes, safety).',
    learn: [
      'ITIL-ish: incident/problem/change/release/capacity/knowledge, on-call, DR/BCP',
      'AI ops issues: degradation, retrieval fail, safety, cost, provider outage, prompt regression, misuse',
    ],
    questions: [
      'Who is on-call and what is the first checklist?',
      'How do we detect a safety incident?',
      'What is RTO/RPO for the knowledge index?',
    ],
    outputs: ['ORR checklist', 'Runbook', 'Support model', 'DR plan inputs'],
    example:
      'Provider outage: failover to secondary model with reduced capability mode and banner; runbook includes customer comms template.',
    practice:
      'Write a one-page runbook section for “faithfulness drop” including detect → contain → fix → communicate.',
    related: '/ai-solution-engineering/delivery',
  },
  {
    n: 33,
    slug: '33-leadership-people-management',
    title: 'Leadership and People Management',
    summary:
      'Lead multidisciplinary delivery: clarity, coaching, hiring, accountability and calm decisions under uncertainty.',
    learn: [
      'Delegation, coaching, performance, hiring, workforce planning, psychological safety',
      'Lead without authority; manage seniors; escalate early; connect tech to outcomes',
    ],
    questions: [
      'What decision am I uniquely positioned to make?',
      'Who needs development to unblock delivery?',
      'What risk am I avoiding escalating?',
    ],
    outputs: ['Team skills matrix', 'Decision log habit', 'Coaching plan sketch'],
    example:
      'Two seniors deadlock on agent vs workflow. You time-box a spike, set decision criteria, decide, and document ADR—protecting delivery date.',
    practice:
      'Write a 5-bullet “decision memo” resolving a conflict between security and delivery speed.',
    related: '/ai-solution-engineering/career-roadmap',
  },
  {
    n: 34,
    slug: '34-ethics-sustainability-social-impact',
    title: 'Ethics, Sustainability and Social Impact',
    summary:
      'Account for energy cost, inclusion, workforce impact, discrimination risk and responsible automation.',
    learn: [
      'Energy/carbon-aware computing, digital inclusion, accessibility',
      'Workforce displacement, algorithmic discrimination, misinformation, social impact assessment',
    ],
    questions: [
      'Who could be harmed if this works as designed?',
      'What is the energy/cost trade-off of the chosen model size?',
      'How do we include users with accessibility needs?',
    ],
    outputs: ['Impact notes', 'Accessibility requirements', 'Model-size justification'],
    example:
      'You reject always-on largest model for routine FAQ; route to small model to cut cost and energy while reserving large model for complex cases.',
    practice:
      'List three stakeholder groups who could be harmed by a claims assistant and one mitigation each.',
    related: '/ai-solution-engineering/governance',
  },
  {
    n: 35,
    slug: '35-personal-effectiveness',
    title: 'Personal Effectiveness',
    summary:
      'Build systems for learning and reuse: priorities, decision journal, pattern library and templates.',
    learn: [
      'Time, prioritisation, deep work, notes, meeting/decision discipline, writing, speaking, resilience',
      'Systems: weekly priorities, decision journal, learning backlog, pattern library, discovery questions, proposal templates',
    ],
    questions: [
      'What are my three outcomes this week?',
      'What decision did I make and what evidence would change it?',
      'Which template can I reuse next engagement?',
    ],
    outputs: ['Weekly priority card', 'Decision journal entry', 'Personal pattern note'],
    example:
      'After each engagement you file a one-page “pattern”: problem type, architecture sketch, failure mode, metric. Next FS pitch starts from that library, not a blank page.',
    practice:
      'Create a personal learning backlog of five items from this map with a practice exercise attached to each.',
    related: '/ai-solution-engineering/career-roadmap',
  },
];

function pageMd(topic) {
  const learnList = topic.learn.map((item) => `- ${item}`).join('\n');
  const qList = topic.questions.map((item) => `- ${item}`).join('\n');
  const outList = topic.outputs.map((item) => `- ${item}`).join('\n');
  const next =
    topic.n < 35
      ? TOPICS.find((item) => item.n === topic.n + 1)
      : null;
  const nextLink = next
    ? `[${next.n}. ${next.title}](./${next.slug})`
    : '[Competency test](./competency-test)';

  return `---
sidebar_position: ${topic.n + 10}
slug: ${topic.slug}
title: "${topic.n}. ${topic.title}"
description: "${topic.summary.replace(/"/g, '\\"')}"
---

# ${topic.n}. ${topic.title}

<ExecSummary>
${topic.summary}
</ExecSummary>

<WhenToUse>
- Study this topic when you need to **use it on a live engagement**, not only recognise the vocabulary.
- Complete the practice exercise before moving on.
- Pair with related playbook pages for delivery artefacts.
</WhenToUse>

<AudienceSplit
  executive={<>Focus on the questions, expected outputs and the real-world scenario. Ask whether the team can produce the artefacts.</>}
  technical={<>Work the Learn list into checklists, then run the practice exercise and keep outputs in your engagement pack.</>}
/>

## Why this matters

An AI Solution Engineer uses this capability to turn ambiguity into decisions. Reading is not enough—you should leave with artefacts you can reuse.

## Learn

${learnList}

## Real-world scenario

${topic.example}

## Practice exercise

${topic.practice}

## Questions you should be able to answer

${qList}

<DeliverableBox>
Expected outputs for this topic:

${outList}
</DeliverableBox>

<Checklist title="Practice checklist">

- [ ] I can explain this topic without naming a vendor first
- [ ] I completed the practice exercise in writing
- [ ] I produced at least one expected output artefact
- [ ] I know which stakeholder challenges this topic

</Checklist>

## Related playbook content

- [Guide link](${topic.related})
- [How to use this Learning Map](./how-to-use)
- [8D Framework](/docs/ai-solution-engineering/8d-framework)

<KeyTakeaways>

- Master the questions and outputs, not only the vocabulary list.
- Use the scenario as a template for your industry context.
- File practice artefacts into a personal pattern library.

</KeyTakeaways>

<NextSteps>

1. Finish the practice exercise.
2. Continue with ${nextLink}.
3. Open the [interactive playbook](https://sudip-ai-playbook.github.io/) when you need workshops or architecture tools.

</NextSteps>
`;
}

fs.mkdirSync(root, {recursive: true});

for (const topic of TOPICS) {
  fs.writeFileSync(path.join(root, `${topic.slug}.mdx`), pageMd(topic));
}

console.log(`Wrote ${TOPICS.length} topic pages to ${root}`);
