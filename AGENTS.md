# Rinha de Backend 2024/Q1 — .NET Implementation

High-performance banking API built with ASP.NET Core Minimal APIs targeting `net9.0` for the Rinha de Backend 2024/Q1 challenge. The runtime is designed for the challenge envelope of 1.5 CPU and 550MB RAM.

---

## Agent instruction standard

- Use this `AGENTS.md` file and the `.agents/` directory as the canonical repository guidance for automation harnesses.
- Do not add tool-specific duplicate instruction trees.
- Keep project guidance synchronized with the source files, compose files, and workflows before changing code or docs.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| .NET / C# (`net9.0`) | Runtime target and language |
| ASP.NET Core Minimal APIs | HTTP routing |
| Npgsql 10.0.2 | PostgreSQL driver with bounded pooling and multiplexing |
| System.Text.Json source generation | Reflection-free JSON serialization |
| Native AOT | Zero-JIT startup for release images |
| PostgreSQL | Database with stored procedures for atomic business rules |
| NGINX | Load balancer on port `9999` using `least_conn` |
| OpenTelemetry | Development observability, compiled out with `EXTRA_OPTIMIZE=true` |
| Docker / Compose | Multi-stage image builds and local/CI orchestration |

---

## Build Commands

```sh
cd src/WebApi
dotnet restore WebApi.csproj -p:Configuration=Release -p:AOT=true -p:Trim=false
dotnet build WebApi.csproj -c Release -p:AOT=true -p:Trim=false -p:ExtraOptimize=true
```

Full stack and stress-test lanes require Docker daemon access:

```sh
docker compose up nginx -d --build
docker compose up k6
```

Docs site validation runs from `docs/`:

```sh
bun install --frozen-lockfile
bun run build
bun run lint
```

### Build Arguments

| Arg | Values | Purpose |
|-----|--------|---------|
| `AOT` | `true` / `false` | Native AOT compilation |
| `TRIM` | `true` / `false` | ReadyToRun + SingleFile + SelfContained path |
| `EXTRA_OPTIMIZE` | `true` / `false` | Strip OpenTelemetry/runtime support guarded by `EXTRAOPTIMIZE` |
| `BUILD_CONFIGURATION` | `Debug` / `Release` | .NET build configuration |

---

## Architecture

```text
NGINX (:9999, least_conn)
├── webapi1-dotnet (:8080, 0.4 CPU, 100MB)
├── webapi2-dotnet (:8080, 0.4 CPU, 100MB)
└── PostgreSQL (0.5 CPU, 330MB)
    ├── InsertTransacao() — atomic balance + validation
    └── GetSaldoClienteById() — statement with JSONB
```

`src/WebApi/Program.cs` intentionally keeps the API thin. PostgreSQL stored procedures in `docker-entrypoint-initdb.d/rinha.dump.sql` own the race-sensitive transaction and statement logic.

---

## Key Patterns

- Keep routes in `Program.cs`; do not introduce MVC/controller layers for this challenge implementation.
- Use `JsonSerializerContext` and `JsonNamingPolicy.SnakeCaseLower` for challenge-compatible, source-generated JSON.
- Preserve `#if !EXTRAOPTIMIZE` around OpenTelemetry so production builds can remove observability overhead.
- Keep the compose connection string bounded: `Minimum Pool Size=10;Maximum Pool Size=10;Multiplexing=true;`.
- Preserve UNLOGGED database tables and stored procedure boundaries unless a benchmark-backed change proves otherwise.

---

## API Endpoints

| Method | Path | Status Codes |
|--------|------|--------------|
| `POST` | `/clientes/{id}/transacoes` | `200`, `404`, `422` |
| `GET` | `/clientes/{id}/extrato` | `200`, `404` |
| `GET` | `/healthz` | `200` |

---

## Project Structure

```text
rinha2-back-end-dotnet/
├── AGENTS.md                 # Canonical repository guidance for automation harnesses
├── .agents/memory/           # Additional standardized agent reference notes
├── src/WebApi/
│   ├── Program.cs            # Complete API routes, DI, config, DTOs
│   ├── WebApi.csproj         # net9.0, AOT, Trim, ExtraOptimize flags
│   ├── Dockerfile            # Multi-stage Docker build using .NET 10 SDK/runtime images
│   └── appsettings.json      # OpenTelemetry defaults used when ExtraOptimize=false
├── docker-entrypoint-initdb.d/
│   └── rinha.dump.sql        # Schema, stored procedures, seed data
├── docker-compose.yml        # Dev stack with observability
├── prod/docker-compose.yml   # Prod stack with GHCR images
├── nginx.conf                # Load balancer config
├── docs/wiki/                # Markdown source for documentation pages
├── docs/                     # Astro GitHub Pages site + published k6 reports
└── .github/workflows/        # CI/CD
```

---

## CI/CD

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Build Check | `build-check.yml` | PRs to `main`, manual dispatch | WebApi restore/build + Docker Compose health check |
| Main Release | `main-release.yml` | Push to `main`, manual dispatch | Multi-platform Docker push to GHCR + production compose/k6 validation |
| CodeQL | `codeql.yml` | PRs, pushes to `main`, weekly | Security analysis for C# |
| Deploy | `deploy.yml` | Push to `main`, manual dispatch | Build `docs/` with Bun/Astro and deploy to GitHub Pages |

- **Image:** `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest` plus `latest-arm64` before manifest merge.
- **Docs:** https://jonathanperis.github.io/rinha2-back-end-dotnet/
- **Documentation source:** `docs/wiki/*.md` rendered through the Astro docs site.

---

## Contribution Guidelines

- All changes require a branch + PR; never commit directly to `main`.
- PRs are rebase-only; no merge commits and no squash merges.
- Always sync `main` before creating a branch: `git fetch origin main && git pull --rebase origin main`.
- Always sync/rebase before opening a PR when `main` moved.
- Branch naming: use conventional prefixes such as `docs/`, `fix/`, `feat/`, `chore/`, `refactor/`, or `ci/`.
- Use the `gh` CLI for GitHub operations.
- Repo-wide files such as `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, funding files, and issue/PR templates live in `jonathanperis/.github`; do not duplicate them here.
