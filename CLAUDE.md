# Rinha de Backend 2024/Q1 — .NET Implementation

High-performance banking API built with ASP.NET 9 Native AOT for the Rinha de Backend challenge. Handles concurrent transactions under strict resource constraints (1.5 CPU, 550MB RAM).

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| .NET 9 / C# | Runtime and language |
| ASP.NET Core Minimal APIs | HTTP routing |
| Npgsql 10.0.2 | PostgreSQL driver with multiplexing |
| System.Text.Json (source gen) | Reflection-free JSON serialization |
| Native AOT | Zero-JIT startup |
| PostgreSQL | Database with stored procedures |
| NGINX 1.27 | Load balancer (least_conn) |
| OpenTelemetry | Observability (conditional compilation) |
| Docker | Multi-stage builds |

---

## Build Commands

```sh
cd src/WebApi
dotnet restore WebApi.csproj -p:Configuration=Release -p:AOT=true
dotnet build WebApi.csproj -c Release -p:AOT=true -p:Trim=false
docker compose up nginx -d --build       # Full dev stack
docker compose up k6                     # Run stress tests
```

### Build Arguments

| Arg | Values | Purpose |
|-----|--------|---------|
| AOT | true/false | Native AOT compilation |
| TRIM | true/false | ReadyToRun + SingleFile + SelfContained |
| EXTRA_OPTIMIZE | true/false | Strip OpenTelemetry, remove symbols |
| BUILD_CONFIGURATION | Debug/Release | Build config |

---

## Architecture

```
NGINX (:9999, least_conn)
├── webapi1-dotnet (:8080, 0.4 CPU, 100MB)
├── webapi2-dotnet (:8080, 0.4 CPU, 100MB)
└── PostgreSQL (0.5 CPU, 330MB)
    ├── InsertTransacao() — atomic balance + validation
    └── GetSaldoClienteById() — statement with JSONB
```

**Single Program.cs** with Minimal APIs. Business logic in PostgreSQL stored procedures.

---

## Key Patterns

- **Native AOT** — no JIT warmup
- **Source generators** — `JsonSerializerContext` for zero-reflection JSON
- **Conditional compilation** — `#if !EXTRAOPTIMIZE` strips OpenTelemetry in prod
- **Connection multiplexing** — Npgsql `Multiplexing=true`
- **UNLOGGED tables** for write performance
- **Stored procedures** handle all transaction logic atomically

---

## API Endpoints

| Method | Path | Status Codes |
|--------|------|-------------|
| POST | `/clientes/{id}/transacoes` | 200, 404, 422 |
| GET | `/clientes/{id}/extrato` | 200, 404 |
| GET | `/healthz` | 200 |

---

## Project Structure

```
rinha2-back-end-dotnet/
├── src/WebApi/
│   ├── Program.cs       # Complete API (route handlers, DI, config)
│   ├── WebApi.csproj    # Project config (AOT, Trim, ExtraOptimize flags)
│   ├── Dockerfile        # Multi-stage: sdk:10.0 → aspnet:10.0
│   └── appsettings.json # OpenTelemetry config
├── docker-entrypoint-initdb.d/
│   └── rinha.dump.sql    # Schema + stored procedures + seed data
├── docker-compose.yml    # Dev stack with observability
├── prod/docker-compose.yml  # Prod stack with GHCR images
├── nginx.conf            # Load balancer config
├── grafana/              # Pre-configured dashboards
└── .github/workflows/    # CI/CD
```

---

## CI/CD

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Build Check | `build-check.yml` | PRs to main, push to main | dotnet build (Release, AOT=true) + Docker health check |
| Main Release | `main-release.yml` | Push to main | Multi-platform Docker push to GHCR + k6 load test + GitHub Pages report |
| CodeQL | `codeql.yml` | PRs to main, push to main, weekly | Security analysis for C# |
| Deploy Docs | `deploy-docs.yml` | Push to main, wiki changes | Clone wiki → generate HTML → commit to docs/ |

- **Image:** `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest` (amd64, arm64/v8)
- **Docs:** https://jonathanperis.github.io/rinha2-back-end-dotnet/ (GitHub Pages from `docs/`)
- **Wiki:** https://github.com/jonathanperis/rinha2-back-end-dotnet/wiki

---

## Contribution Guidelines

- **All changes require a branch + PR** — never commit directly to main
- **PRs are rebase-only** — no merge commits, no squash (required linear history)
- **Branch naming:** `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`
- **GitHub operations:** always use `gh` CLI (not curl/HTTP API)
- **Repo-wide files** (SECURITY.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, etc.) live in `jonathanperis/.github` — do NOT create them here
