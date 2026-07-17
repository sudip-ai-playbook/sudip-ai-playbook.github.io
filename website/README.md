# AI Solution Engineering Playbook — Learning site (Docusaurus)

Companion home, guide, framework docs and articles for the [AI Solution Engineering Playbook](https://sudip-ai-playbook.github.io), published at `/blog/`.

## Develop

```bash
cd website
npm install
npm start
```

Open http://localhost:3000/blog/

Use the navbar **search** for terms such as RAG, FinOps, GDPR, Bedrock, or governance.

## Key routes (after build)

| Path | Content |
| --- | --- |
| `/blog/` | Home — choose a path |
| `/blog/ai-solution-engineering/overview` | 18-part guide |
| `/blog/docs/ai-solution-engineering/8d-framework` | 8D framework |
| `/blog/docs/ai-solution-engineering/value-gate` | VALUE gate |
| `/blog/docs/playbook-page-template` | Reusable page template + MDX components |
| `/blog/articles` | Articles list |
| `/blog/articles/what-is-ai-solution-engineering` | Flagship article |

## Playbook MDX components

Guide and docs pages can use: `SeriesMeta`, `ExecSummary`, `WhenToUse`, `AudienceSplit`, `DecisionBox`, `RiskBox`, `RoleBox`, `DeliverableBox`, `Checklist`, `KeyTakeaways`, `NextSteps`.

See [Playbook page template](./docs/playbook-page-template.mdx).

## Build

```bash
cd website
npm run build
```

Output lands in `website/build/` and is copied into `app/dist/blog/` by GitHub Actions.

## Author an article

Add `website/blog/YYYY-MM-DD-slug.mdx` with front matter (`title`, `authors`, `tags`). See [Write a blog post](./docs/write-a-blog-post.mdx).
