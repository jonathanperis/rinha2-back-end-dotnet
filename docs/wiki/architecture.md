# Architecture

## Runtime topology

The production path follows the Rinha pattern: two API instances behind NGINX, one PostgreSQL database, and a separate load-test/observability lane for local and CI verification.

```text
client / k6
  -> nginx:9999 (least_conn)
    -> webapi1-dotnet:8080
    -> webapi2-dotnet:8080
      -> PostgreSQL 16 (stored procedures)
```

## Counted services

| Service | Role | CPU | RAM | Notes |
|---------|------|-----|-----|-------|
| `webapi1-dotnet` | .NET 9 Native AOT API instance | 0.4 | 100MB | ASP.NET Core Minimal API |
| `webapi2-dotnet` | .NET 9 Native AOT API instance | 0.4 | 100MB | Same image and config as instance 1 |
| `nginx` | Reverse proxy and load balancer | 0.2 | 20MB | Uses `least_conn` balancing |
| `db` | PostgreSQL 16 database | 0.5 | 330MB | Stores schema, limits, balances, transactions |
| **Total** | Counted challenge budget | **1.5** | **550MB** | Matches the contest envelope |

## Support services

| Service | Purpose | Counted in challenge budget? |
|---------|---------|------------------------------|
| `k6` | Drives stress tests through NGINX | No |
| `influxdb` | Stores k6 time-series output in dev mode | No |
| `otel-lgtm` | Local Grafana, Loki, Tempo, and metrics stack | No |

## API layer

The API is intentionally thin:

- `CreateSlimBuilder` trims default ASP.NET Core hosting overhead.
- Route handlers map directly to the required contest endpoints.
- JSON output uses `JsonNamingPolicy.SnakeCaseLower` and generated metadata from `SourceGenerationContext`.
- Client IDs and credit limits are kept in a small in-memory map for fast invalid-ID rejection.
- OpenTelemetry instrumentation is compiled out when `ExtraOptimize=true` defines `EXTRAOPTIMIZE`.

## Database boundary

PostgreSQL owns the race-sensitive work. The API calls stored procedures for balance reads and transaction inserts instead of doing multi-step application-side coordination.

| Procedure | Responsibility |
|-----------|----------------|
| `InsertTransacao` | Validate client, type, value, description, and credit limit, then insert atomically |
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
| `AOT` | `true` | Publishes Native AOT binaries |
| `TRIM` | `false` | Leaves trimming separate from AOT path |
| `EXTRA_OPTIMIZE` | `true` | Removes observability/runtime support guarded by `EXTRAOPTIMIZE` |
| `BUILD_CONFIGURATION` | `Release` | Uses optimized .NET build configuration |
