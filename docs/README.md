# Docs

Astro static site deployed to GitHub Pages. The Markdown pages under `docs/wiki/` are the source for the public documentation routes at `/docs/`.

## Architecture

| Area | Source of truth |
|---|---|
| Site framework | Astro `^6.4.2` |
| Markdown renderer | Astro 6.4 `markdown.processor` using `@astrojs/markdown-satteri` |
| Markdown content | `docs/wiki/*.md` |
| Docs route renderer | `docs/src/pages/docs/[...slug].astro` |
| Sidebar/category order | `docs/src/sidebar.config.ts` |
| Reports archive | Static files in `docs/public/reports/*.html` rendered by `docs/src/pages/reports/index.astro` |
| Production base path | `/rinha2-back-end-dotnet` when `NODE_ENV=production` |
| Build output | `docs/out/` |

The docs are static. There is no server runtime after GitHub Pages publishes the generated HTML.

## Adding or editing a docs page

1. Add or edit Markdown in `docs/wiki/`.
2. If the page is new, add the slug to `SECTION_CATEGORIES` in `docs/src/sidebar.config.ts`.
3. Add a label and summary for the slug in `docs/src/pages/docs/[...slug].astro`.
4. Build locally before opening a PR.

The docs build has a build-time assertion that every sidebar slug maps to a real `docs/wiki/{slug}.md` file.

## Commands

Run from this directory (`docs/`):

| Command | Action |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server |
| `NODE_ENV=production bun run build` | Build the GitHub Pages-shaped site to `./out/` with the repository base path |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |

Use Bun for this package so `bun.lock` stays authoritative.

## Markdown processor notes

The site uses Sätteri through Astro's `markdown.processor` API:

```js
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  markdown: {
    processor: satteri(),
  },
});
```

Do not assume arbitrary Remark/Rehype plugin behavior unless it has been tested with Sätteri. If a future docs feature needs Markdown plugins, validate the build and the rendered Pages output before merging.

## Environment

Copy `.env.example` to `.env` and fill in local values when needed.

| Variable | Description |
|---|---|
| `PUBLIC_GA_ID` | Optional Google Analytics 4 Measurement ID |
