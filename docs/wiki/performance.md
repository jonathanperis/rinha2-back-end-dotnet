# Performance

## Budget summary

The challenge allows 1.5 CPU and 550MB RAM across the counted runtime containers. This implementation uses the full CPU envelope deliberately, while keeping each component's responsibility narrow.

| Area | Limit | Repository split | Why it matters |
|------|-------|------------------|----------------|
| API CPU | 0.8 total | Two instances at 0.4 each | Parallel request handling behind NGINX |
| Database CPU | 0.5 | One PostgreSQL container | Atomic transaction and statement logic |
| NGINX CPU | 0.2 | One reverse proxy | Cheap load balancing on port `9999` |
| RAM | 550MB total | 200MB API, 330MB DB, 20MB NGINX | Fits the official container budget |

## Implementation choices that affect latency

| Choice | Performance intent |
|--------|--------------------|
| Native AOT | Avoid JIT warmup and reduce runtime footprint |
| `CreateSlimBuilder` | Keep ASP.NET Core hosting minimal |
| JSON source generation | Avoid reflection-heavy serialization paths |
| Stored procedures | Keep validation and writes atomic in PostgreSQL |
| Bounded Npgsql pool | Avoid unbounded database connections under load |
| Npgsql multiplexing | Improve throughput for compatible database work |
| `least_conn` NGINX balancing | Send new work to the less busy API instance |

## Stress testing

Load tests run through the shared [rinha2-back-end-k6](https://github.com/jonathanperis/rinha2-back-end-k6) test suite. The runner drives transaction and statement requests through NGINX, so the measured path includes load balancing, both API containers, and PostgreSQL.

```bash
docker compose up nginx -d --build
docker compose up k6
```

## Local observability path

The development compose file keeps telemetry separate from the counted service budget:

| Tool | Role |
|------|------|
| k6 web dashboard | Live load-test progress on port `5665` |
| InfluxDB | Time-series sink for k6 dev-mode output |
| Grafana LGTM | Local dashboards and OpenTelemetry endpoint |
| OpenTelemetry | API traces, metrics, and logs when not compiled out |

## Release validation

The `Main Release` workflow validates more than a build:

1. Restores and builds the WebApi project with `AOT=true` and `EXTRA_OPTIMIZE=true`.
2. Builds and pushes the amd64 image to GHCR.
3. Starts the production compose stack and checks `/healthz`.
4. Runs the load-test job.
5. Builds and pushes the arm64 image.
6. Merges the platform images into the `latest` manifest.

## Evidence links

| Evidence | Link |
|----------|------|
| Main release workflow | [`.github/workflows/main-release.yml`](https://github.com/jonathanperis/rinha2-back-end-dotnet/blob/main/.github/workflows/main-release.yml) |
| Build check workflow | [`.github/workflows/build-check.yml`](https://github.com/jonathanperis/rinha2-back-end-dotnet/blob/main/.github/workflows/build-check.yml) |
| Runtime compose budget | [`docker-compose.yml`](https://github.com/jonathanperis/rinha2-back-end-dotnet/blob/main/docker-compose.yml) |
| Published image | [`ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest`](https://github.com/jonathanperis/rinha2-back-end-dotnet/pkgs/container/rinha2-back-end-dotnet) |
