# AI Playbook Blog (Docusaurus)

Companion blog and guides for the [Sudip AI Playbook](https://sudip-ai-playbook.github.io), published at `/blog/`.

## Develop

```bash
cd website
npm install
npm start
```

Open http://localhost:3000/blog/

## Build

```bash
cd website
npm run build
```

Output lands in `website/build/` and is copied into `app/dist/blog/` by GitHub Actions.

## Author a post

Add `website/blog/YYYY-MM-DD-slug.mdx` with front matter (`title`, `authors`, `tags`). See [Write a blog post](./docs/write-a-blog-post.mdx).
