# Docs

Astro static site deployed to GitHub Pages. The Markdown pages under `docs/wiki/` are the source for the public documentation routes at `/docs/`.

## Architecture

| Area | Source of truth |
|---|---|
| Site framework | Astro `^7.0.0` |
| Markdown renderer | Astro 7 `markdown.processor` using `@astrojs/markdown-satteri` `^0.3.1` |
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
| `bun run dev:background` | Start Astro's managed background dev server for agent/browser smoke tests |
| `bun run dev:status` | Check the managed background dev server status |
| `bun run dev:logs` | Print the managed background dev server logs |
| `bun run dev:stop` | Stop the managed background dev server |
| `NODE_ENV=production bun run build` | Build the GitHub Pages-shaped site to `./out/` with the repository base path |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |

Use Bun for this package so `bun.lock` stays authoritative. Astro 7 requires Node `>=22.12.0`; local and CI shells that run `astro build` must expose a compatible Node runtime before invoking Bun.

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

## Astro 7 feature fit

The upgrade adopts the static-site wins from Astro 7: the Rust `.astro` compiler, Vite 8/Rolldown bundling path, queued rendering, the Astro-7-compatible Sätteri Markdown processor, and managed background dev-server commands. The site remains `output: 'static'` on GitHub Pages, so SSR/request-pipeline features such as route caching, CDN cache providers, and `src/fetch.ts` advanced routing are intentionally not configured here.

## Environment

Copy `.env.example` to `.env` and fill in local values when needed.

| Variable | Description |
|---|---|
| `PUBLIC_GA_ID` | Optional Google Analytics 4 Measurement ID |
