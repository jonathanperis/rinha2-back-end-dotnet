---
name: Branch + PR Workflow & Rebase Strategy
description: All changes must use branch+PR strategy; PRs are rebase-only
type: feedback
---

All changes to this repository must follow a branch + PR workflow. Do not commit directly to `main`.

**Why:** The repository keeps linear history on `main`.

**How to apply:**
- Create a feature/fix/docs/chore branch before making changes.
- Create a PR with `gh pr create` targeting `main`.
- Merge using rebase strategy only; do not use merge commits or squash merges.
- Use conventional branch prefixes such as `docs/`, `fix/`, `feat/`, `chore/`, `refactor/`, and `ci/`.
