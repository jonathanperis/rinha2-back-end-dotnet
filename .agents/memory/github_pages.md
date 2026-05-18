---
name: GitHub Pages & Documentation
description: Astro docs site at jonathanperis.github.io/rinha2-back-end-dotnet served from docs/ and sourced from docs/wiki/
type: reference
---

- **GitHub Pages:** https://jonathanperis.github.io/rinha2-back-end-dotnet/ — deployed by `.github/workflows/deploy.yml`.
- **Documentation source:** Markdown files under `docs/wiki/` render into the Astro docs routes.
- **Docs package:** `docs/package.json`; use Bun for install/build/lint.
- **Deploy workflow:** `.github/workflows/deploy.yml` delegates to the shared Pages workflow and passes `package-manager: bun`.
- **Stress-test reports:** k6 HTML reports are published under `docs/reports/` when release/report artifacts are present.
- **Docker image:** `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest` — multi-platform manifest after the main release workflow completes.
