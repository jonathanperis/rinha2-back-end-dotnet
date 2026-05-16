# CI/CD Pipeline

## Workflow map

This repository uses GitHub Actions for PR validation, release image publishing, security analysis, and the public documentation deploy.

| Workflow | Trigger | What it proves |
|----------|---------|----------------|
| `build-check.yml` | Pull requests to `main`, manual dispatch | WebApi restores/builds and the compose stack answers `/healthz` |
| `main-release.yml` | Push to `main`, manual dispatch | GHCR images build, the production compose stack starts, load tests run, multi-arch manifest is created |
| `codeql.yml` | Pull requests, pushes, weekly schedule | C# security analysis completes successfully |
| `deploy.yml` | Push to `main`, manual dispatch | Astro docs build and deploy to GitHub Pages |

## PR gate

Pull requests run the fast safety checks before merge:

1. Checkout the repository.
2. Install the .NET 9 SDK.
3. Restore `src/WebApi/WebApi.csproj` with release flags.
4. Build the WebApi project with `AOT=true` and `EXTRA_OPTIMIZE=true`.
5. Start the compose stack through NGINX.
6. Check `http://localhost:9999/healthz`.
7. Run CodeQL analysis.

## Main release path

After a PR is rebased into `main`, the release workflow publishes the runtime image:

| Job | Purpose |
|-----|---------|
| `setup-build-test` | Restore and build the WebApi project |
| `build-push-amd64` | Build and push `linux/amd64` image to GHCR |
| `container-test` | Start the production compose stack and check `/healthz` |
| `load-test` | Run the k6 validation lane |
| `build-push-arm64` | Build and push `linux/arm64/v8` image |
| `merge-manifest` | Publish the multi-arch `latest` manifest |

## Published artifacts

| Artifact | Location |
|----------|----------|
| Container image | `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest` |
| ARM64 image tag | `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest-arm64` |
| Docs site | `https://jonathanperis.github.io/rinha2-back-end-dotnet/` |
| Docs section | `https://jonathanperis.github.io/rinha2-back-end-dotnet/docs/` |

## Documentation deploy

The Pages workflow delegates to the shared `jonathanperis/.github` Pages workflow and uses Bun as the package manager. The docs package is an Astro static site under `docs/`, with production routes served under the `/rinha2-back-end-dotnet` base path.

## Operational notes

- Use PR branches for this repository. The repo allows rebase merges and keeps main linear.
- Main releases are intentionally heavier than PR checks because they publish images and execute the load-test lane.
- Docs changes still trigger the main release workflow after merge, so report Pages status separately from image publishing when a change only affects documentation.
