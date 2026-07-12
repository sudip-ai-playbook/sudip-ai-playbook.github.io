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

Guided consulting playbook with executable frameworks and workshop facilitation:

1. **Playbook** — choose a business situation, filter by lifecycle step, open framework explanations.
2. **Framework Lab** — explanations + runnable canvases for every framework (18 specialized MVP canvases; use-case workbooks for all others).
3. **Workshop Studio** — define your **use case card** once, run frameworks against it (fields pre-fill), capture notes/decisions/actions.
4. **Export** — download playbook HTML/Excel, or a **workshop pack** (HTML + Excel + Markdown) including the use case.

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
