# Sudip AI Playbook

Cross-cloud AI architecture playbook for comparing AWS, Azure, and Google Cloud services end to end — with FinOps LLM costing and an architecture canvas.

**Live:** https://sudipawtg.github.io/sudip-ai-playbook/

## Enter

Password: `sudipaiplaybook`

## Planes

| Plane | Purpose |
| --- | --- |
| Hub | Entry map to all planes |
| Architecture Map | 10-layer decision map from the workbook |
| Service Compare | Filter 268 scored capabilities |
| Quick Picks | Scenario defaults across clouds |
| Decision Assistant | Weighted scoring with ecosystem context |
| LLM FinOps | Model costs, alternatives, monthly estimates |
| Architecture Canvas | Compose a stack + diagrams.net embed |
| AI Platform | Foundry / Bedrock / Vertex + governance |

## Data source

Interactive views are driven by `AI architecture.xlsx` (exported to `app/src/data/*.json`).

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

Push to `main`. GitHub Actions builds `app/` and publishes `dist/` to Pages.

Project site URL: https://sudipawtg.github.io/sudip-ai-playbook/

`vite.config.ts` uses `base: '/sudip-ai-playbook/'` for this project Pages path.
