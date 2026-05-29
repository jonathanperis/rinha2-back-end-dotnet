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

The homepage benchmark cards are intentionally treated as archived-run claims, not timeless guarantees. When updating numbers like `46k+ requests/second`, `<50ms p95 latency`, or `99.9% success rate`, tie the change to a concrete archived report and keep the report file in `docs/public/reports/`.

| Claim on homepage | What to verify before changing it |
|-------------------|-----------------------------------|
| Requests/second | The k6 report's request-throughput metric for the selected run |
| p95 latency | The report's p95 request-duration metric for the same run |
| Success rate | Failed request/check rate for the same run |
| PASS report link | The corresponding `stress-test-report-YYYYMMDDHHMMSS.html` file is present in the Pages report archive |

CI runners and local machines can vary. Prefer wording such as "archived run" or "representative run" unless the number comes from a repeatable benchmark protocol documented here.

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

1. Restores and builds the WebApi project with `AOT=true`, `TRIM=false`, and `EXTRA_OPTIMIZE=true`.
2. Builds and pushes the amd64 image to GHCR.
3. Starts the production compose stack and checks `/healthz`.
4. Runs the load-test job and uploads the HTML stress-test report artifact.
5. Builds and pushes the arm64 image.
6. Merges the platform images into the `latest` manifest.

## Report archive workflow

The release workflow uploads the HTML stress-test report as a GitHub Actions artifact. Reports that should be published on Pages are committed under `docs/public/reports/`; the Astro reports page indexes every `.html` file in that directory at build time. The reports index is an archive, not a parser, so summary metrics must be copied into docs/homepage copy deliberately.

## Evidence links

| Evidence | Link |
|----------|------|
| Main release workflow | [`.github/workflows/main-release.yml`](https://github.com/jonathanperis/rinha2-back-end-dotnet/blob/main/.github/workflows/main-release.yml) |
| Build check workflow | [`.github/workflows/build-check.yml`](https://github.com/jonathanperis/rinha2-back-end-dotnet/blob/main/.github/workflows/build-check.yml) |
| Runtime compose budget | [`docker-compose.yml`](https://github.com/jonathanperis/rinha2-back-end-dotnet/blob/main/docker-compose.yml) |
| Published image | [`ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest`](https://github.com/jonathanperis/rinha2-back-end-dotnet/pkgs/container/rinha2-back-end-dotnet) |
