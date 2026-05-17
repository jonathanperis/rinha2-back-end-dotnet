---
name: GitHub Conventions & Shared .github Repo
description: Repo-wide community health files live in jonathanperis/.github; use gh CLI for GitHub operations
type: feedback
---

Repo-wide community health files (`CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `FUNDING.yml`, issue/PR templates, and related files) are managed centrally in the `jonathanperis/.github` repository. Do not create these files in individual project repos.

**Why:** GitHub automatically inherits community health files from the owner's `.github` repository. Duplicating them causes maintenance drift.

**How to apply:**
- Do not create community health files in this repo.
- Use `gh` for repository, PR, issue, check, release, and merge operations.
- If a community health file is needed, add it to `jonathanperis/.github` instead.
