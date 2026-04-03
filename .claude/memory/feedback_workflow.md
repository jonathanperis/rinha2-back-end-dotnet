---
name: Branch + PR Workflow & Rebase Strategy
description: All changes must use branch+PR strategy; PRs are rebase-only (no merge commits)
type: feedback
---

All changes to this repository must follow a branch + PR workflow. Never commit directly to main.

**Why:** Repository has required linear history enabled on main branch. The owner enforces clean git history with no merge commits.

**How to apply:**
- Always create a feature/fix branch before making changes
- Create a PR using `gh pr create` to merge into main
- PRs use rebase strategy only (no merge commits, no squash)
- Branch naming: use conventional prefixes like `docs/`, `fix/`, `feat/`, `chore/`
