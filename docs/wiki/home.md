# rinha2-back-end-dotnet

Operator documentation for a C#/.NET 9 Native AOT implementation of Rinha de Backend 2024/Q1. The system exposes the required fictional bank API behind NGINX, keeps transaction rules inside PostgreSQL stored procedures, and stays inside the 1.5 CPU / 550MB container budget.

## Start here

| Need | Read | Outcome |
|------|------|---------|
| Understand the contest rules | [Challenge](challenge) | Endpoints, validation rules, and scoring constraints |
| See the runtime topology | [Architecture](architecture) | Service map, CPU/RAM split, database strategy |
| Run the stack locally | [Getting Started](getting-started) | Compose commands, smoke checks, sample requests |
| Check endpoint contracts | [API Reference](api-reference) | Payloads, responses, status codes, and implementation notes |
| Review benchmark evidence | [Performance](performance) | Resource margins, test shape, and report links |
| Follow releases and deploys | [CI/CD Pipeline](ci-cd-pipeline) | PR gates, image publishing, Pages deploy flow |

## Implementation profile

- **Runtime:** ASP.NET Core Minimal API targeting `net9.0`, compiled with Native AOT for the release image.
- **Serialization:** `System.Text.Json` source generation with `snake_case` output and no reflection-heavy runtime path.
- **Database access:** Npgsql 10.0.2 with a bounded pool and `Multiplexing=true` in the compose connection string.
- **Consistency boundary:** PostgreSQL stored procedures validate limits and apply transactions atomically.
- **Topology:** Two API containers behind NGINX `least_conn`, backed by one PostgreSQL container (`postgres:16` in the development compose file).
- **Observability:** OpenTelemetry, Grafana LGTM, InfluxDB, and k6 dashboards are available in the development stack.

## Proof points

| Claim | Backing source |
|-------|----------------|
| Total challenge budget is 1.5 CPU / 550MB RAM | `docker-compose.yml` service resource limits |
| API containers run at 0.4 CPU / 100MB each | `webapi1-dotnet` and `webapi2-dotnet` compose definitions |
| Database owns the atomic business rules | `docker-entrypoint-initdb.d/rinha.dump.sql` stored procedures |
| Release images and the multi-arch manifest are pushed to GHCR | `.github/workflows/main-release.yml` |
| Docs publish to GitHub Pages after main merges | `.github/workflows/deploy.yml` |

## Quick command

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-dotnet.git
cd rinha2-back-end-dotnet
docker compose up nginx -d --build
curl http://localhost:9999/healthz
```

## Links

- [Repository](https://github.com/jonathanperis/rinha2-back-end-dotnet)
- [Live Pages site](https://jonathanperis.github.io/rinha2-back-end-dotnet/)
- [Original Rinha specification](https://github.com/zanfranceschi/rinha-de-backend-2024-q1)
