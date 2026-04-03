---
name: GitHub Conventions & Shared .github Repo
description: Repo-wide community health files live in jonathanperis/.github; always use gh CLI for GitHub ops
type: feedback
---

Repo-wide community health files (CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md, FUNDING.yml, issue/PR templates, etc.) are managed centrally in the `jonathanperis/.github` repository. Do NOT create these files in individual project repos.

**Why:** GitHub automatically inherits community health files from the `.github` repo for all repositories under the owner. Duplicating them causes maintenance drift and was explicitly removed (see commit c79564e).

**How to apply:**
- Never create SECURITY.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, FUNDING.yml, or issue/PR templates in this repo
- Always use the `gh` CLI for GitHub operations (repos, PRs, issues, checks, releases, merges) instead of curl/HTTP API
- If a community health file is needed, add it to `jonathanperis/.github` instead
