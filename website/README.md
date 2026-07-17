# AI Solution Engineering Playbook — Blog (Docusaurus)

Companion blog and guides for the [AI Solution Engineering Playbook](https://sudip-ai-playbook.github.io), published at `/blog/`.

Primary content: **AI Solution Engineering**, the **8D** framework, and **VALUE** quality gates.

## Develop

```bash
cd website
npm install
npm start
```

Open http://localhost:3000/blog/

## Key routes (after build)

| Path | Content |
| --- | --- |
| `/blog/` | Blog list |
| `/blog/what-is-ai-solution-engineering` | Flagship post |
| `/blog/docs/ai-solution-engineering/8d-framework` | 8D guide |
| `/blog/docs/ai-solution-engineering/value-gate` | VALUE guide |

## Build

```bash
cd website
npm run build
```

Output lands in `website/build/` and is copied into `app/dist/blog/` by GitHub Actions.

## Author a post

Add `website/blog/YYYY-MM-DD-slug.mdx` with front matter (`title`, `authors`, `tags`). See [Write a blog post](./docs/write-a-blog-post.mdx).
