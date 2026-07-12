# Sudip AI Playbook

Cross-cloud AI architecture playbook for comparing AWS, Azure, and Google Cloud services end to end — with FinOps LLM costing, an architecture canvas, and an **ConsultAI OS** consulting lifecycle playbook.

**Live:** https://sudip-ai-playbook.github.io

## Enter

Password: `sudipaiplaybook`

## Planes

| Plane | Purpose |
| --- | --- |
| Hub | Entry map to all planes |
| **ConsultAI OS** | End-to-end AI consulting lifecycle (stages 0–19), situation filters, HTML/Excel export |
| Architecture Map | 10-layer decision map from the workbook |
| Service Compare | Filter 268 scored capabilities |
| Quick Picks | Scenario defaults across clouds |
| Decision Assistant | Weighted scoring with ecosystem context |
| LLM FinOps | Model costs, alternatives, monthly estimates |
| Architecture Canvas | Compose a stack + [Excalidraw](https://excalidraw.com/) whiteboard |
| AI Platform | Foundry / Bedrock / Vertex + governance |

## ConsultAI OS

Guided consulting workspace — situation-first, stage-aware, and evidence-linked. Full-feature MVP (client-side SPA, localStorage; no backend).

### Navigation

1. **Home** — engagement health, open work, upcoming gates, benefits snapshot.
2. **Workspaces** — multi-client / multi-engagement setup, scope, stakeholders, RACI.
3. **Journey** — visual stages 0–19 with soft gate override.
4. **Playbook** — choose a business situation, filter by lifecycle step, open frameworks.
5. **Control** — status strip, phase gates, full registers (actions, risks, deliverables, benefits…).
6. **Framework Lab** — explanations + runnable canvases (18 specialized MVP canvases; workbooks for others).
7. **Workshop** — use-case card, editable agenda/questions, voting, decisions/actions, per-stage persistence.
8. **Decisions** — decision centre with options, recommendation, approval evidence.
9. **Governance** — AI inventory, policies/controls, assessments, exceptions; risks shared with Control.
10. **Architecture** — capability/process/system notes, ADRs; deep-links to `/canvas` and `/map`.
11. **Service** — catalogue, SLA targets, incidents, runbook, monthly report export.
12. **Deliverables** — generate drafts from engagement + workshop; write back to deliverable register.
13. **Copilot** — rule-based next-step, framework advice, quality findings (human approval required).

Persona selector is a **UI stub** (read-only hides edits). Not real RBAC.

### Persistence

Versioned workspace document in `localStorage` (`sudip-consult-workspace`). Legacy single engagement/workshop keys are migrated on first load.

Offline Excel workbook:

```bash
node --experimental-strip-types scripts/dump_consulting_os.mjs
.venv/bin/python scripts/export_consulting_excel.py
```

## Data source

Interactive architecture views are driven by `AI architecture.xlsx` (exported to `app/src/data/*.json`).

Consulting lifecycle content lives in `app/src/data/consultingOs.ts`.

LLM pricing snapshot sources:

- https://azure.microsoft.com/en-us/pricing/details/azure-openai/
- https://aws.amazon.com/bedrock/pricing/
- https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing

## Develop

```bash
cd app
npm install
npm run dev
```

## Quality

```bash
cd app
npm run lint
npm run test:coverage
npm run build
```

## Deploy (GitHub Pages)

Push to `main` on `sudip-ai-playbook/sudip-ai-playbook.github.io`.

GitHub Actions publishes to https://sudip-ai-playbook.github.io
