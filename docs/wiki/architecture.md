# Architecture

## Runtime topology

The production path follows the Rinha pattern: two API instances behind NGINX, one PostgreSQL database, and a separate load-test/observability lane for local and CI verification.

```text
client / k6
  -> nginx:9999 (least_conn)
    -> webapi1-dotnet:8080
    -> webapi2-dotnet:8080
      -> PostgreSQL (stored procedures)
```

## Counted services

| Service | Role | CPU | RAM | Notes |
|---------|------|-----|-----|-------|
| `webapi1-dotnet` | .NET 9 Native AOT API instance | 0.4 | 100MB | ASP.NET Core Minimal API |
| `webapi2-dotnet` | .NET 9 Native AOT API instance | 0.4 | 100MB | Same image and config as instance 1 |
| `nginx` | Reverse proxy and load balancer | 0.2 | 20MB | Uses `least_conn` balancing |
| `db` | PostgreSQL database (`postgres:16` in dev compose) | 0.5 | 330MB | Stores schema, limits, balances, transactions |
| **Total** | Counted challenge budget | **1.5** | **550MB** | Matches the contest envelope |

## Support services

| Service | Purpose | Counted in challenge budget? |
|---------|---------|------------------------------|
| `k6` | Drives stress tests through NGINX | No |
| `influxdb` | Stores k6 time-series output in dev mode | No |
| `otel-lgtm` | Local Grafana, Loki, Tempo, and metrics stack | No |

## API layer

The API project targets `net9.0`; its Dockerfile currently builds and runs it with Microsoft .NET `10.0` SDK/runtime images. The API is intentionally thin:

- `CreateSlimBuilder` trims default ASP.NET Core hosting overhead.
- Route handlers map directly to the required contest endpoints.
- JSON output uses `JsonNamingPolicy.SnakeCaseLower` and generated metadata from `SourceGenerationContext`.
- Client IDs and credit limits are kept in a small in-memory map for fast invalid-ID rejection.
- OpenTelemetry instrumentation is compiled out when `ExtraOptimize=true` defines `EXTRAOPTIMIZE`.

## Database boundary

PostgreSQL owns the race-sensitive work. The API calls stored procedures for balance reads and transaction inserts instead of doing multi-step application-side coordination. Payload-shape validation remains API-side; the stored procedure should be read as the atomic consistency boundary, not as the only validation layer.

| Procedure | Responsibility |
|-----------|----------------|
| `InsertTransacao` | Check client existence, apply the atomic balance update, enforce the database-side credit-limit guard, and insert the transaction row when the update succeeds |
| `GetSaldoClienteById` | Return balance metadata and recent transactions as JSONB |

The compose command also tunes write durability for the contest setting:

```text
checkpoint_timeout=600
max_wal_size=4096
synchronous_commit=0
fsync=0
full_page_writes=0
```

## Connection strategy

The API uses one Npgsql data source per process and a bounded connection string:

```text
Minimum Pool Size=10;Maximum Pool Size=10;Multiplexing=true;
```

That shape keeps database concurrency explicit, avoids unbounded connection growth, and lets Npgsql pipeline compatible work where possible.

## Release profile

| Build flag | Default in release workflow | Effect |
|------------|-----------------------------|--------|
| `AOT` | `true` | Publishes Native AOT binaries for the release image |
| `TRIM` | `false` | Leaves trimming separate from AOT path |
| `EXTRA_OPTIMIZE` | `true` | Removes observability/runtime support guarded by `EXTRAOPTIMIZE` |
| `BUILD_CONFIGURATION` | `Release` | Uses optimized .NET build configuration |


## API and database contract

| Rule | Enforced by | Source |
|------|-------------|--------|
| Client ID is one of `1..5` | API fast path and database existence check | `Program.cs`, `InsertTransacao` |
| `valor` is positive | API | `IsTransacaoValid` |
| `tipo` is exactly `c` or `d` | API | `IsTransacaoValid` |
| `descricao` is present and <= 10 chars | API, with SQL parameter width as a backstop | `IsTransacaoValid`, `InsertTransacao(... descricao VARCHAR(10))` |
| Balance update and transaction insert stay atomic | PostgreSQL | `InsertTransacao` |
| Statement returns newest 10 transactions | PostgreSQL | `GetSaldoClienteById` |

The NGINX config currently uses `least_conn`. If this repository is used as a strict official challenge submission, keep the config comments and docs aligned with whatever balancing policy is allowed by the target ruleset.
