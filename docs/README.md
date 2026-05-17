# Docs

Astro static site deployed to GitHub Pages. The Markdown pages under `docs/wiki/` are the source for the public documentation/wiki-style routes.

## Commands

Run from this directory (`docs/`):

| Command | Action |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server |
| `bun run build` | Build the Astro site to `./out/` |
| `bun run preview` | Preview production build locally |

## Environment

Copy `.env.example` to `.env` and fill in local values when needed.

| Variable | Description |
|---|---|
| `PUBLIC_GA_ID` | Optional Google Analytics 4 Measurement ID |
