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
| Architecture Canvas | Compose a stack + diagrams.net embed |
| AI Platform | Foundry / Bedrock / Vertex + governance |

## ConsultAI OS

Guided consulting playbook:

1. Choose **what you are trying to achieve** (business situation).
2. Filter by **lifecycle step** (Qualify → Close).
3. Search frameworks, actions and deliverables.
4. **Download HTML** or **Download Excel** of the filtered playbook to share.

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
