# AI Playbook — Learning site (Docusaurus)

Companion **Library** home, Learning Map, Guide, Framework, Roadmaps, Startup and Articles for the [AI Playbook](https://sudip-ai-playbook.github.io), published at `/blog/`.

## How docs integrate with the app

| Surface | URL | Role |
| --- | --- | --- |
| Interactive app | `/` | Workshops, architecture tools, ConsultAI OS |
| Learn · Library | `/blog/` | Progressive home: Learn / Deliver / Grow (short paths) |
| Browse all | `/blog/catalog/` | Full catalog tree of every published page |
| Learning Map | `/blog/learning-map/` | 35 practice-first capability topics |
| Guide | `/blog/ai-solution-engineering/` | 18-part engagement playbooks |
| Framework | `/blog/docs/` | 8D + VALUE + catalogue |
| Roadmaps | `/blog/roadmaps/` | Career and capability paths |
| Startup | `/blog/startup-entrepreneurship/` | Founder practice |
| Articles | `/blog/articles/` | Short notes |

Deploy merges `website/build/` into `app/dist/blog/` so one GitHub Pages site serves both.

## Develop

```bash
cd website
npm install
npm start
```

Open http://localhost:3000/blog/

## Expand a Learning Map topic

1. Open the topic MDX under `learning-map/`.
2. Add definition → when to use → pitfalls under **Learn**.
3. Add a second **Real-world scenario** for your industry.
4. Keep the practice exercise and expected outputs.
5. Link related Guide pages — do not duplicate engagement playbooks.

Regenerate stubs (overwrites topic bodies): `node scripts/generate-learning-map.mjs`

## Build

```bash
cd website
npm run build
```
