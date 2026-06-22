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
| `setup-build-test` | Restore and build the `net9.0` WebApi project with release/AOT flags |
| `build-push-amd64` | Build and push `linux/amd64` image to GHCR |
| `container-test` | Start the production compose stack and check `/healthz` |
| `load-test` | Run the k6 validation lane and upload the HTML stress-test report artifact |
| `build-push-arm64` | Build and push `linux/arm64/v8` image |
| `merge-manifest` | Publish the multi-arch `latest` manifest |

## Published artifacts

| Artifact | Location |
|----------|----------|
| Container image | `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest` |
| ARM64 image tag | `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest-arm64` |
| Docs site | `https://jonathanperis.github.io/rinha2-back-end-dotnet/` |
| Docs section | `https://jonathanperis.github.io/rinha2-back-end-dotnet/docs/` |

## Build/version matrix

| Path | SDK/runtime | Flags | Purpose |
|------|-------------|-------|---------|
| Local Docker/dev compose | .NET `10.0` SDK/runtime images from `src/WebApi/Dockerfile` | `AOT=true`, `TRIM=false`, `EXTRA_OPTIMIZE=false` | Local stack with OpenTelemetry support |
| PR Build Check | `actions/setup-dotnet` `9.0.x` | `AOT=true`, `TRIM=false`, `EXTRA_OPTIMIZE=true` | Fast compile gate plus compose health check |
| Main Release image | .NET `10.0` Docker build/runtime images | `AOT=true`, `TRIM=false`, `EXTRA_OPTIMIZE=true` | GHCR release image and multi-arch manifest |
| CodeQL | `actions/setup-dotnet` `9.0.x` | Plain Release build | Security analysis |
| Docs deploy | Bun + Astro `^7.0.0` | `NODE_ENV=production` base path | GitHub Pages static site |

The project targets `net9.0` even when Docker build images are `10.0`.

## Documentation deploy

The Pages workflow delegates to Jonathan's shared GitHub Pages workflow and uses Bun as the package manager. The docs package is an Astro 7 static site under `docs/`; Markdown content lives in `docs/wiki/`, and production routes are served under the `/rinha2-back-end-dotnet` base path. Astro 7 requires Node `>=22.12.0` for any shell that runs the build.

The docs site uses Astro's `markdown.processor` API with `@astrojs/markdown-satteri`. That keeps Markdown rendering explicit, but it also means future Remark/Rehype-style extensions should be tested against Sätteri before they are assumed to work.

Astro 7 features that fit this static Pages site are dependency-level speedups and local workflow improvements: the Rust `.astro` compiler, Vite 8/Rolldown path, queued rendering, Sätteri `0.3.x`, and managed background dev-server scripts. Route caching, CDN cache providers, and `src/fetch.ts` advanced routing stay out of scope unless the docs move from static GitHub Pages to an SSR/CDN runtime.

## Operational notes

- Use PR branches for this repository. The repo allows rebase merges and keeps main linear.
- Main releases are intentionally heavier than PR checks because they publish images and execute the load-test lane.
- Docs changes still trigger the main release workflow after merge, so report Pages status separately from image publishing when a change only affects documentation.
