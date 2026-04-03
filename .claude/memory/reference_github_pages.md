---
name: GitHub Pages & Wiki Documentation
description: Docs site at jonathanperis.github.io/rinha2-back-end-dotnet served from docs/ dir; wiki synced via deploy-docs workflow
type: reference
---

- **GitHub Pages**: https://jonathanperis.github.io/rinha2-back-end-dotnet/ — served from `docs/` directory on main branch
- **Wiki**: https://github.com/jonathanperis/rinha2-back-end-dotnet/wiki — source of truth for documentation pages
- **Deploy Docs workflow** (`.github/workflows/deploy-docs.yml`): clones wiki, generates HTML docs via `.github/generate-docs.js`, commits to `docs/` directory
- **Stress test reports**: k6 HTML reports deployed to `docs/reports/` with timestamps by the main-release workflow
- **Docker image**: `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest` — multi-platform (amd64, arm64/v8)
