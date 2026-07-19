# Sitemap and page specification

**Product:** AI Playbook  
**Companion:** [Conceptual data model](./conceptual-data-model.md)  
**Primary methodology:** 8D AI Solution Engineering Framework  
**Source of existing IP:** [`app/src/data/consultingOs.ts`](../../app/src/data/consultingOs.ts), [`app/src/features/consulting/ConsultingView.tsx`](../../app/src/features/consulting/ConsultingView.tsx)

---

## 1. Global shell and IA principles

### 1.1 Product shell

| Zone | Purpose | Access |
| --- | --- | --- |
| Public marketing & learning | Credibility, methodology teaching, blank templates, practice cases | Anonymous |
| Authenticated workspace | Opportunity workspaces, artefacts, assessments, decisions | Signed-in user (V2+) |
| Team administration | Org members, roles, template libraries, capability dashboards | Org admin (V4) |

### 1.2 Design principles (enforced in every page)

1. **Output before content** — every page produces a reusable artefact or decision.
2. **Problem before AI** — no model/product selection before Define/Diagnose gates pass.
3. **One framework, many tools** — 8D remains the spine; tools hang off stages.
4. **Answer first** — top-down communication on every communication surface.
5. **Evidence over confidence** — label Fact / Assumption / Hypothesis.
6. **Trust by design** — risk and governance always visible in workspace chrome.
7. **Progressive disclosure** — headline → support → evidence on request.
8. **Practice over passive learning** — write, speak, score, reflect.
9. **Reusable by default** — outputs become templates and IP.
10. **Decision oriented** — every engagement ends in an explicit decision record.

### 1.3 URL conventions

| Pattern | Example | Notes |
| --- | --- | --- |
| Public content | `/playbook/define` | SEO-friendly paths (BrowserRouter when public site ships) |
| Framework detail | `/frameworks/:frameworkSlug` | Job-to-be-done category in query optional |
| Template detail | `/templates/:templateSlug` | Filter state in query string |
| Auth workspace | `/app/opportunities/:opportunityId` | Authenticated app prefix |
| Workspace module | `/app/opportunities/:opportunityId/risk` | Module slug after opportunity |
| Guided task | `/app/guided/:taskSlug` | Task OS entry |
| Legacy ConsultAI | `/app/legacy/stages/:stageId` | Compatibility view for stages 0–19 |
| Current SPA (today) | `/#/consult?tab=journey` | HashRouter prototype; not the target IA |

### 1.4 Navigation hierarchy

```text
Public
├── Home
├── The Playbook (8D)
│   ├── Define … Deliver
├── Framework Library
├── Template Library
├── Case Studies
├── Learning Notes
├── Practice Lab (public subset)
├── Glossary
└── Start assessment / Sign in

Authenticated (/app)
├── Dashboard
├── Opportunities
│   └── Opportunity workspace modules
├── Decision Centre (cross-opportunity)
├── Practice Lab (full)
├── Story Bank
├── Phrase Bank
├── Capability
├── Account & security
└── Team admin (V4)
```

### 1.5 Search, filter, progressive disclosure

| Surface | Behaviour |
| --- | --- |
| Global search (V2+) | Search frameworks, templates, glossary, opportunity titles (scoped by ACL) |
| Framework Library | Filter by job-to-be-done: Understand / Diagnose / Prioritise / Communicate / Deliver; also by 8D stage |
| Template Library | Filter by engagement stage, stakeholder, industry, deliverable type, meeting type, complexity, public/private |
| Progressive disclosure | Card/list shows purpose + outcome; detail expands questions, method, checklist, template |
| Evidence labels | UI chip: Fact / Assumption / Hypothesis / Unknown |

### 1.6 Accessibility and responsive expectations

- WCAG 2.2 AA for public and authenticated UI
- Keyboard-complete navigation for stage diagram, filters, and forms
- `data-testid` on interactive controls for tests
- Mobile: read and light edit; workflow mapper and canvas tools may be desktop-preferred with clear fallback list views
- Prefer `getByRole` / `getByLabel` in E2E; avoid CSS/nth selectors

### 1.7 Authentication boundary (target vs prototype)

| Concern | Target (V2+) | Current prototype |
| --- | --- | --- |
| Public content | No auth | Entire SPA behind password gate |
| Private client data | Real identity, tenant ACL | `localStorage` only |
| Password gate | Not a security boundary | Hardcoded unlock in bundle — **prototype only** |

---

## 2. Release tagging legend

| Tag | Meaning |
| --- | --- |
| **V1** | Content-led playbook; static/interactive teaching surfaces |
| **V2** | Accounts, opportunity workspaces, assessments, calculators, progress |
| **V3** | AI coaching: critique, adaptation, scoring, detection |
| **V4** | Shared workspaces, reviews, org libraries, benchmarks |

Pages list a **Minimum version**. Higher versions may extend the same route.

---

## 3. Detailed sitemap

### 3.1 Public routes

| Route | Page | Min version | Audience | Primary action | Canonical parent |
| --- | --- | --- | --- | --- | --- |
| `/` | Home | V1 | Prospect / practitioner | Start assessment or open Playbook | — |
| `/playbook` | Playbook overview (interactive 8D) | V1 | Practitioner | Enter a stage | Home |
| `/playbook/define` | Stage: Define | V1 | Practitioner | Complete problem statement | Playbook |
| `/playbook/discover` | Stage: Discover | V1 | Practitioner | Capture discovery lenses | Playbook |
| `/playbook/diagnose` | Stage: Diagnose | V1 | Practitioner | Produce root-cause map | Playbook |
| `/playbook/design` | Stage: Design | V1 | Practitioner | Produce to-be workflow | Playbook |
| `/playbook/de-risk` | Stage: De-risk | V1 | Practitioner | Complete risk register | Playbook |
| `/playbook/demonstrate` | Stage: Demonstrate | V1 | Practitioner | Build pilot charter | Playbook |
| `/playbook/decide` | Stage: Decide | V1 | Practitioner | Produce executive brief | Playbook |
| `/playbook/deliver` | Stage: Deliver | V1 | Practitioner | Produce roadmap | Playbook |
| `/frameworks` | Framework Library index | V1 | Practitioner | Browse by job | Home |
| `/frameworks/:frameworkSlug` | Framework detail | V1 | Practitioner | Open template / guided canvas | Frameworks |
| `/templates` | Template Library index | V1 | Practitioner | Filter and download | Home |
| `/templates/:templateSlug` | Template detail | V1 | Practitioner | Download / start in workspace | Templates |
| `/cases` | Case study index | V1 | Prospect / practitioner | Open case | Home |
| `/cases/:caseSlug` | Case study detail | V1 | Prospect / practitioner | Apply pattern to workspace | Cases |
| `/learn` | Learning notes index | V1 | Practitioner | Open article | Home |
| `/learn/:articleSlug` | Learning note | V1 | Practitioner | Practise related exercise | Learn |
| `/practice` | Communication practice hub (public) | V1 | Practitioner | Start daily exercise | Home |
| `/practice/:exerciseSlug` | Practice exercise (public subset) | V1 | Practitioner | Submit response | Practice |
| `/glossary` | Glossary | V1 | All | Look up term | Home |
| `/assessments/capability` | Capability assessment (public start) | V1 | Practitioner | Complete self-assessment | Home |
| `/guided` | Guided playbook mode index | V2* | Practitioner | Choose a task | Home / App |
| `/sign-in` | Sign in | V2 | User | Authenticate | — |
| `/legal/privacy` | Privacy | V1 | All | Read policy | — |
| `/legal/terms` | Terms | V1 | All | Read terms | — |

\* Guided mode may ship as static checklists in V1 and become interactive in V2.

### 3.2 Authenticated routes

| Route | Page | Min version | Access | Primary action |
| --- | --- | --- | --- | --- |
| `/app` | My Dashboard | V2 | Member | Resume opportunity |
| `/app/opportunities` | Opportunity list | V2 | Member | Create / open workspace |
| `/app/opportunities/new` | Create opportunity | V2 | Contributor+ | Save workspace |
| `/app/opportunities/:id` | Workspace overview | V2 | Workspace ACL | Continue stage |
| `/app/opportunities/:id/stakeholders` | Stakeholders | V2 | Workspace ACL | Maintain map |
| `/app/opportunities/:id/discovery` | Discovery | V2 | Workspace ACL | Capture evidence |
| `/app/opportunities/:id/workflows` | Workflow mapper | V2 | Workspace ACL | Edit as-is / to-be |
| `/app/opportunities/:id/use-cases` | Use cases & scoring | V2 | Workspace ACL | Score opportunities |
| `/app/opportunities/:id/business-case` | ROI & business case | V2 | Workspace ACL | Model benefits |
| `/app/opportunities/:id/architecture` | Architecture | V2 | Workspace ACL | Capture ADRs |
| `/app/opportunities/:id/risk` | Risk & de-risk | V2 | Workspace ACL | Own controls |
| `/app/opportunities/:id/communication` | Communication spine | V2 | Workspace ACL | Build narrative |
| `/app/opportunities/:id/roadmap` | Roadmap & deliver | V2 | Workspace ACL | Plan horizons |
| `/app/opportunities/:id/decisions` | Workspace decisions | V2 | Workspace ACL | Decide / log |
| `/app/opportunities/:id/files` | Files | V2 | Workspace ACL | Upload / classify |
| `/app/opportunities/:id/lessons` | Lessons | V2 | Workspace ACL | Capture IP |
| `/app/opportunities/:id/meetings` | Meeting OS | V2 | Workspace ACL | Run meeting |
| `/app/opportunities/:id/artefacts/:artefactId` | Artefact editor | V2 | Workspace ACL | Edit / review / lock |
| `/app/opportunities/:id/assessments/:assessmentId` | Assessment runner | V2 | Workspace ACL | Complete scoring |
| `/app/decisions` | Decision Centre (portfolio) | V2 | Member | Clear decision path |
| `/app/guided/:taskSlug` | Guided task runner | V2 | Member | Produce draft output |
| `/app/practice` | Practice Lab (full) | V2 | Member | Daily streak |
| `/app/stories` | Story Bank | V2 | Member | Save story |
| `/app/phrases` | Phrase Bank | V2 | Member | Reuse phrases |
| `/app/capability` | Capability progress | V2 | Member | Submit evidence |
| `/app/account` | Account | V2 | User | Manage profile |
| `/app/account/security` | Security & data | V2 | User | Export / delete / AI restrictions |
| `/app/org` | Team admin | V4 | Org admin | Manage members |
| `/app/org/templates` | Org template library | V4 | Org admin | Publish templates |
| `/app/org/capability` | Org capability dashboard | V4 | Manager+ | Review evidence |
| `/app/legacy/stages` | Legacy 20-stage index | V2 | Member | Open legacy stage |
| `/app/legacy/stages/:stageId` | Legacy stage detail | V2 | Member | Use deep stage tools |

### 3.3 Cross-links (minimum)

| From | To |
| --- | --- |
| Any 8D stage page | Related frameworks, templates, practice exercise, guided task |
| Use-case score result | Design, De-risk, Demonstrate, Decide |
| Decision Centre | Supporting artefacts and evidence |
| Executive brief builder | Audience adaptation views |
| Capability matrix | Required artefact types |
| Legacy stage | Parent 8D stage (banner) |

---

## 4. Migration mapping: 20 stages → 8D

The 20-stage ConsultAI lifecycle is retained as **detailed content and tools** under 8D. Primary navigation uses 8D; legacy stage IDs remain addressable.

| 8D stage | Legacy stage IDs | Legacy titles (short) | Notes |
| --- | --- | --- | --- |
| **Define** | `stage-0`, `stage-1`, `stage-2`, `stage-5` | Qualify, Introduce, Mobilise, Identify | Problem / decision / scope without AI product; opportunity qualification folds into Define |
| **Discover** | `stage-3`, `stage-4` | Discover, Assess | Business / Systems / Team / AI lenses; maturity assessment |
| **Diagnose** | `stage-5`, `stage-6` | Identify, Prioritise | Root cause, MECE, pain-to-value; prioritisation themes |
| **Design** | `stage-7`, `stage-10` | Strategise, Design | Target workflow, human–AI allocation, architecture |
| **De-risk** | `stage-8` | Govern | Risk, ethics, privacy, controls — not end-of-project paperwork |
| **Demonstrate** | `stage-11` | Prototype | Pilot / PoV with evidence, not demo theatre |
| **Decide** | `stage-9`, `stage-18` | Roadmap (investment), Expand | Business case + executive decision narrative |
| **Deliver** | `stage-12`–`stage-17`, `stage-19` | Build → Optimise, Close | Roadmap horizons, adoption, ops, closure |

### 4.1 Current `/consult` tabs → target IA

| Current tab (`ConsultingView`) | Target home |
| --- | --- |
| `home` | `/app` Dashboard |
| `workspaces` | `/app/opportunities` |
| `journey` | `/playbook` + `/app/opportunities/:id` stage rail |
| `playbook` | `/playbook/*` + Framework Library |
| `control` | Workspace registers + Decision Centre |
| `lab` | Framework Library + guided canvases |
| `workshop` | Meeting OS + discovery/workshop modules |
| `decisions` | `/app/decisions` + workspace decisions |
| `governance` | De-risk + `/app/opportunities/:id/risk` |
| `architecture` | Design + architecture module (+ existing `/map`, `/canvas`) |
| `service` | Deliver (ops) |
| `deliverables` | Artefact centre per workspace |
| `copilot` | V3 AI coaching layer |

### 4.2 Existing architecture planes (retain)

These remain complementary **technical** planes; they are not the consulting spine:

| Route (today) | Role under 8D |
| --- | --- |
| `/frame`, `/map`, `/compare`, `/picks`, `/decide`, `/finops`, `/canvas`, `/ai`, `/summary` | Design / Decide tooling and cloud architecture reference |

---

## 5. Page-family specifications

Reusable families avoid duplicating eight nearly identical stage pages. Each concrete page instantiates a family with stage-specific content.

### Family A — 8D stage detail (public + workspace mirror)

**Used by:** `/playbook/{define|discover|diagnose|design|de-risk|demonstrate|decide|deliver}` and workspace stage rail.

| Field | Spec |
| --- | --- |
| Purpose | Teach and execute one dimension of the methodology |
| Audience | Practitioner; executives consume outputs, not the page |
| Entry | Home diagram, sitemap, guided task, workspace current stage |
| Primary action | Complete required outputs / open workspace tool |
| Content hierarchy | 1 Purpose → 2 Questions → 3 Frameworks → 4 Method steps → 5 Example → 6 Common mistakes → 7 Checklist → 8 Template → 9 Completion criteria / stage gate → 10 Related communication exercise |
| Required inputs (workspace) | Stage-specific; see §6 |
| Generated outputs | Stage required artefacts |
| Empty state | “No opportunity selected — practise with sample case or create workspace” |
| Loading | Skeleton for checklist and linked artefacts |
| Error | Soft fail on missing template; show local fallback checklist |
| Permission | Public read; workspace write needs Contributor+ |
| Completion criteria | Stage gate statement satisfied; VALUE check passed |
| Trust checks | Privacy/security/oversight prompts where stage touches data or automation |
| Next | Recommended next 8D stage + optional legacy deep-dive |

**Stage gates (must appear on page):**

| Stage | Gate |
| --- | --- |
| Define | Problem expressed without naming a particular AI product or model |
| Discover | Evidence-backed opportunity list exists |
| Diagnose | Every proposed solution addresses a verified cause |
| Design | Target workflow and human–AI allocation documented before tech lock-in |
| De-risk | Owner, control, evidence, residual risk for each material risk |
| Demonstrate | Go / modify / stop recommendation with evaluation evidence |
| Decide | Explicit ask and decision log entry |
| Deliver | Approved roadmap and benefits plan with owners |

### Family B — Framework detail

| Field | Spec |
| --- | --- |
| Purpose | Explain a framework by job-to-be-done |
| Hierarchy | Job category → When to use → How → Example → Anti-patterns → Linked 8D stages → Runnable canvas / workbook → Communication tip |
| Outputs | Framework canvas instance (V2) or downloadable blank (V1) |
| Negative | Unknown slug → 404 with search suggestions |

**Job-to-be-done categories:**

| Category | Example frameworks |
| --- | --- |
| Understand | Stakeholder mapping, Design thinking, Systems–Team–AI, Customer journey, SIPOC, JTBD |
| Diagnose | MECE, Issue trees, Five Whys, Pareto, Value-chain, VSM |
| Prioritise | Impact–effort, Value–feasibility–risk, RICE, MoSCoW, Weighted matrix, WSJF |
| Communicate | Pyramid Principle, SCQA, BLUF, What–So what–Now what, CLEAR, 3-2-1, Setup–Conflict–Resolution |
| Deliver | RACI, RAID, OODA, Benefits realisation, Change-impact, ADKAR, ITIL |

### Family C — Template detail

| Field | Spec |
| --- | --- |
| Filters | Stage, stakeholder, industry, deliverable, meeting type, complexity, public/private |
| Hierarchy | Purpose → Audience → When → Fields → Example (anonymised) → Download → Start in workspace |
| Classification | Public blank vs private filled instance |
| Negative | Private template never listed on public index |

### Family D — Case study

Fixed structure:

1. Context  
2. Problem  
3. Root cause  
4. Options  
5. Recommendation  
6. Architecture  
7. Risk  
8. Business value  
9. Outcome  
10. Lessons learned  

Must use action titles for recommendation section. No client confidential data on public cases.

### Family E — Learning note

Practitioner articles. Required footer: related 8D stage, frameworks, practice exercise, glossary terms. Suggested seed topics:

- How to run AI discovery  
- How to explain RAG to a CFO  
- How to construct an AI business case  
- How to challenge an unrealistic AI use case  
- How to prepare for a steering committee  
- How to communicate model risk  
- How to design human oversight  

### Family F — Guided task

Tasks:

| Task slug | Goal |
| --- | --- |
| `ai-opportunity-assessment` | Weighted use-case score |
| `discovery-workshop` | Agenda + questions |
| `evaluate-use-case` | VALUE + trust |
| `build-business-case` | ROI model |
| `design-pilot` | Pilot charter |
| `steering-update` | Action-title storyboard |
| `explain-technical-concept` | Audience translator |
| `difficult-executive-question` | Practice simulator |

Flow: Inputs required → Guided questions → Recommended framework → Example → Draft output → Quality assessment → Next stage.

### Family G — Workspace module

Common chrome for every `/app/opportunities/:id/*` module:

| Element | Behaviour |
| --- | --- |
| Stage rail | Current 8D stage + gate status |
| Decision strip | Open decision required / owner / deadline |
| Risk strip | Highest open material risks |
| Evidence drawer | Facts / assumptions / hypotheses |
| Confidentiality | Classification badge; “Do not send to AI” toggle |
| Version | Current revision, lock state, reviewers |
| Empty | Module-specific starter checklist |
| Permission denied | Explain role; link request access (V4) |
| Conflict | Optimistic lock message; reload / overwrite rules |

### Family H — Assessment runner

| Field | Spec |
| --- | --- |
| Types | Capability self-assessment; Systems–Team–AI; Use-case scoring; Client maturity |
| Inputs | Dimension scores, weights (defaults locked unless admin override), evidence links, confidence |
| Outputs | Weighted total, category label, **score explanation** (why), gaps, next actions |
| Use-case dimensions & weights | Business impact 20%; Strategic alignment 10%; User value 10%; Technical feasibility 10%; Data readiness 10%; Risk manageability 10%; Adoption readiness 10%; Time to value 10%; Operational sustainability 5%; Evidence confidence 5% |
| Result categories | Quick win; Strategic bet; Foundation first; Experiment; Do not pursue |
| Negative | Weights must sum to 100%; incomplete dimensions block final category; missing evidence lowers confidence, not silently ignored |

### Family I — Artefact editor / review

| Field | Spec |
| --- | --- |
| Lifecycle | `draft` → `in_review` → `approved` → `locked` (or `superseded`) |
| VALUE gate | V Valuable · A Actionable · L Logical · U Understandable · E Executable |
| Trust score | Privacy, Security, Fairness, Transparency, Human oversight, Auditability, Reliability |
| Edit after approve | Creates new revision; invalidates prior approval |
| Export | Markdown/HTML/PDF (V2+); idempotent export job id |
| AI assist (V3) | Blocked when classification forbids AI or user enabled “Do not send to AI” |

### Family J — Practice exercise

| Exercise | Structure | Scoring weights |
| --- | --- | --- |
| One-minute executive update | Recommendation, three reasons, risk, ask | Bottom line 20%; Audience 15%; Structure 15%; Concision 10%; Evidence 10%; Commercial 10%; Risk honesty 10%; Explicit ask 10% |
| 3-2-1 challenge | Three steps / two options / one takeaway | Same rubric |
| Jargon removal | Ban acronyms, product names, architecture jargon | Same + accuracy check |
| Story builder | Location, Action, Thought, Emotion, Dialogue, Meaning | Structure + meaning |
| Difficult-question simulator | Random executive challenge | Risk honesty + ask |

Public subset: sample prompts only. Full history and streak require auth (V2).

---

## 6. Concrete page specifications (priority surfaces)

### 6.1 Home (`/`)

| Field | Spec |
| --- | --- |
| Purpose | Convert visitors into practitioners who start the 8D journey |
| Hierarchy | Value proposition → Interactive 8D diagram → Featured playbooks → Case studies → Tools/templates → Practice challenge → Start assessment CTA |
| Primary action | Start assessment or open Define |
| Empty/error | Static fallback if featured content fails |
| Completion | N/A (marketing) |
| Next | `/playbook` or `/assessments/capability` |

### 6.2 Playbook overview (`/playbook`)

| Field | Spec |
| --- | --- |
| Purpose | Orient user to one methodology |
| Hierarchy | 8D interactive diagram → stage cards with purpose + gate → “How this maps from 20 stages” disclosure → start workspace CTA |
| Primary action | Enter current recommended stage |
| Next | Stage detail or `/app/opportunities/new` |

### 6.3 Define stage (`/playbook/define`)

| Field | Spec |
| --- | --- |
| Questions | Outcome, what changed, why now, decision required, owner, success, out of scope |
| Tools | Problem statement builder, SCQA, Decision statement, Stakeholder map, Outcome/KPI tree, Assumption register |
| Required outputs | One-sentence problem; decision required; business outcome; initial success metrics; stakeholders; scope/constraints |
| Gate | No AI product/model in problem statement |
| Communication exercise | One-minute problem framing without technology |
| Mistakes | Jumping to RAG/agents; solution-shaped problems; missing decision owner |

### 6.4 Discover stage

| Field | Spec |
| --- | --- |
| Lenses | Business, Systems, Team, AI (each with checklist from product vision) |
| Tools | Interview builders, workshop agenda, observation checklist, Systems–Team–AI assessment, maturity assessment, note repository, evidence tagging |
| Outputs | Stakeholder needs, as-is workflow, systems/data inventory, pain-point register, maturity score, evidence-backed opportunities |
| Principle | Diagnose before prescribing |

### 6.5 Diagnose stage

| Field | Spec |
| --- | --- |
| Distinction table | Observation \| Root cause \| Business consequence (required UI pattern) |
| Tools | Issue-tree, root-cause canvas, pain-to-value, bottleneck annotator, hypothesis tracker, evidence confidence, assumption validation |
| Outputs | Root-cause map, quantified pain, validated hypotheses, problem hierarchy, opportunity themes |
| Gate | Solutions only for verified causes |

### 6.6 Design stage

| Field | Spec |
| --- | --- |
| Layers | Journey → process → human → AI → rules → data → apps → security → governance → measurement |
| Human–AI allocation | Human only; AI assisted; HITL; HOTL; fully automated; prohibited |
| Tools | To-be workflow, RACI, CDA canvas, ADR, build–buy–partner, integration map, data-flow, operating model, NFR checklist |
| Outputs | Target workflow, options, recommendation, oversight model, conceptual architecture, operating model, dependencies |

### 6.7 De-risk stage

| Field | Spec |
| --- | --- |
| Risk categories | Strategic, financial, model, data protection, cyber, bias, hallucination, IP, third-party, resilience, regulatory, adoption, reputation, environmental/cost |
| Treatments | Avoid, Reduce, Transfer, Accept, Monitor, Escalate |
| Outputs | Risk register, control matrix, data-handling plan, governance model, evaluation criteria, escalation, residual-risk statement |
| Gate | Owner + control + evidence + residual risk per material risk |

### 6.8 Demonstrate stage

| Field | Spec |
| --- | --- |
| Proof dimensions | Business, user, accuracy, feasibility, security, compliance, adoption, scalability, reliability, cost, operability |
| Pilot builder fields | Hypothesis, users, boundary, baseline, metrics, eval dataset, human approval, test/failure scenarios, duration, cost ceiling, go/no-go |
| Outputs | Pilot plan, baselines, results, feedback, technical findings, updated risks, go/modify/stop |

### 6.9 Decide stage

| Field | Spec |
| --- | --- |
| Narrative | Bottom line → ≤4 pillars → evidence → explicit ask |
| Pillars default | Valuable; Feasible; Risk manageable; Adoptable/operable |
| Asks | Approve, Fund, Prioritise, Nominate, Decide, Escalate, Pause, Reject |
| Outputs | One-page brief, five-slide deck, business case, ROI, memo, decision log, next-step request |
| Communication | Pyramid, SCQA, action titles (titles alone tell the story) |

### 6.10 Deliver stage

| Field | Spec |
| --- | --- |
| Horizons | 0–30d; 30–90d; 3–6m; 6–12m; 12m+ |
| Elements | Roadmap, workstreams, dependencies, ownership, forums, architecture reviews, release criteria, training, change, comms, benefits, monitoring, incidents, continuous eval, model/prompt updates, vendors |
| Outputs | Approved roadmap, governance cadence, benefits plan, change plan, handover, CI backlog |

### 6.11 My Dashboard (`/app`)

Show: active opportunities; current stage; upcoming decisions; overdue actions; unvalidated assumptions; high risks; artefacts awaiting review; practice streak; capability progress.

Empty: create first opportunity CTA + capability assessment CTA.

### 6.12 Opportunity workspace overview

Modules listed in §3.2. Overview shows stage progress, VALUE status of latest artefacts, open decisions, top risks, next gate.

### 6.13 Decision Centre

Single view: decision required, owner, options, recommendation, evidence, risks, dependencies, deadline, status, history. Prevents document piles without a decision path.

### 6.14 Workflow mapper (V2)

Objects: Person, Activity, Decision, System, Data, Document, Delay, Error, Control, Handoff, AI opportunity.  
Tags: value-adding, necessary NVA, waste, repetitive, delayed, error-prone, decision-heavy, regulated, sensitive data, automation candidate.  
Outputs: as-is, bottleneck summary, to-be, before/after.  
Desktop-first; list fallback on small screens.

### 6.15 ROI calculator (V2)

Inputs: volume, time/task, labour cost, error rate, cost/error, revenue opportunity, implementation, licence/infra, support, adoption, productivity, confidence.  
Outputs: annual baseline, benefit, net, payback, ROI, cost/transaction, best/likely/worst, sensitivity, benefit confidence.  
**Assumptions must be labelled; never presented as facts.**

### 6.16 Executive narrative builder (V2)

Produces SCQA, Pyramid, and action-title storyboard. Rejects passive titles (“Market overview”) in favour of action titles.

### 6.17 Technical-to-business translator (V2 content / V3 AI)

Levels: Executive, Business, Technically aware, Engineering specialist. Accuracy preserved; simplification without falsehood.

### 6.18 Meeting operating system (V2)

Before / during / after structure per product vision. Auto-structure post-meeting summary with owners and deadlines.

### 6.19 Story Bank & Phrase Bank (V2)

Categories and fields per product vision. Confidentiality status required on every story.

### 6.20 Audience adaptation engine (cross-cutting)

Same recommendation reframed for: CEO, CFO/procurement, CIO/CTO, CISO, Legal/risk/compliance, Operational leadership, Employee. Available on Decide artefacts and translator tool.

### 6.21 Communication spine (cross-cutting)

Before any email/meeting/slide: Audience, Purpose, Bottom line, Supporting structure, Evidence, Action. Embedded in every 8D stage page and workspace Communication module.

---

## 7. VALUE quality gate and trust score

Applied to every artefact before stage advance or executive send:

| Letter | Question |
| --- | --- |
| **V** Valuable | Material business need? |
| **A** Actionable | Specific enough to execute? |
| **L** Logical | Structured and evidence-backed? |
| **U** Understandable | Audience can grasp without unnecessary effort? |
| **E** Executable | Ownership, constraints, risks, next steps clear? |

**Trust score (separate):** Privacy · Security · Fairness · Transparency · Human oversight · Auditability · Reliability.

---

## 8. Capability framework (learning)

| Level | Name | Evidence artefacts required (not reading alone) |
| --- | --- | --- |
| 1 | Foundation | Problem statement; simple explanation of a technical concept |
| 2 | Practitioner | Workflow map; issue tree; use-case assessment; structured update; small workshop plan |
| 3 | Consultant | Root-cause map; business case; roadmap; recommendation presentation |
| 4 | Manager | Complex opportunity shaping; governance leadership; commercial outcome ownership |
| 5 | Trusted adviser | Executive influence artefacts; portfolio strategy; reusable IP contribution |

Progression requires completed, reviewed artefacts listed in the data model capability evidence entity.

---

## 9. Recommended user journeys

### 9.1 First visit

1. Capability assessment  
2. Select role and target skill  
3. Choose practice case or real opportunity  
4. Create workspace  
5. Begin at Define  

### 9.2 During engagement

1. Stage questions → 2. Artefacts → 3. Quality check → 4. Improvements → 5. Peer/manager review → 6. Lock version → 7. Next stage  

### 9.3 After engagement

1. Record outcome → 2. Estimated vs realised benefits → 3. Lessons → 4. Promote templates → 5. Anonymised case → 6. Update capability evidence  

---

## 10. Public vs private content rules

| Public | Private (auth) |
| --- | --- |
| Framework explanations | Client names |
| Blank templates | Interview notes |
| Anonymised examples | Business data, architecture, risks, financials |
| Practice cases | Internal decisions, recordings, drafts |
| Articles, learning paths, glossary, general calculators | Anything classified Confidential / Restricted |

Private controls: classification, redaction, retention, export/deletion, version history, confidentiality labels, **Do not send to AI** mode.

---

## 11. MVP scope checklist (traceability to vision)

### V1 — Content-led playbook

- [x] Specified: Home, 8D pages, Framework library, Templates, Practice cases, Communication exercises, Glossary, Downloadable checklists  
- [ ] Implementation: deferred (documentation phase)

### V2 — Interactive toolkit

- [x] Specified: Accounts, workspaces, assessments, workflow mapper, use-case scoring, ROI, executive brief, progress  
- [ ] Implementation: deferred

### V3 — AI coaching

- [x] Specified: critique, audience adaptation, jargon simplification, issue-tree suggestions, question simulator, communication scoring, missing-evidence / assumption / risk detection  
- [ ] Implementation: deferred

### V4 — Team platform

- [x] Specified: shared workspaces, review/approval, comments, version control, org libraries, capability dashboards, benchmarks, retrospectives  
- [ ] Implementation: deferred

---

## 12. Interactive features → routes

| Feature | Primary route(s) | Min version |
| --- | --- | --- |
| Guided playbook mode | `/app/guided/:taskSlug` | V2 (V1 static) |
| AI opportunity assessment | `/app/opportunities/:id/use-cases` | V2 |
| Workflow mapper | `/app/opportunities/:id/workflows` | V2 |
| ROI calculator | `/app/opportunities/:id/business-case` | V2 |
| Executive narrative builder | `/app/opportunities/:id/communication` | V2 |
| Technical-to-business translator | Guided task + Communication | V2/V3 |
| Meeting OS | `/app/opportunities/:id/meetings` | V2 |
| Communication practice lab | `/practice`, `/app/practice` | V1/V2 |
| Story bank | `/app/stories` | V2 |
| Phrase bank | `/app/phrases` | V2 |

---

## 13. Stage-required outputs (quick reference)

| 8D | Required outputs |
| --- | --- |
| Define | Problem statement; decision; outcome; metrics; stakeholders; scope |
| Discover | Needs; as-is; systems/data; pains; maturity; opportunities |
| Diagnose | Root-cause map; quantified pain; hypotheses; hierarchy; themes |
| Design | To-be; options; recommendation; oversight; architecture; operating model; dependencies |
| De-risk | Register; controls; data plan; governance; eval; escalation; residual risk |
| Demonstrate | Pilot; baselines; results; feedback; findings; risks; go/modify/stop |
| Decide | Brief; deck; business case; ROI; memo; decision log; ask |
| Deliver | Roadmap; cadence; benefits; change; handover; CI backlog |

---

## 14. Implementation-readiness (sitemap)

### Assumptions

- 8D replaces 20-stage primary navigation; legacy stages remain addressable.
- Public site can ship before real auth (V1).
- Existing architecture planes stay; consulting spine is 8D.
- Glassmorphism / neon design system from project rules applies to new UI.

### Deferred decisions

- BrowserRouter vs HashRouter for public SEO site  
- Auth provider (OIDC vendor)  
- File storage provider  
- Whether workflow mapper uses Excalidraw, custom graph, or both  

### Recommended first implementation slice (not in this documentation phase)

1. Public Home + Playbook overview + eight stage pages (content from this spec + mapped legacy stage content).  
2. Framework Library reorganised by job-to-be-done.  
3. Glossary + one practice exercise.  
4. Keep existing `/consult` behind “Legacy ConsultAI” until workspace migration.

### Documentation quality notes

See [conceptual data model](./conceptual-data-model.md) § integrity, migration, and requirements traceability checklist.
