# Architecture

## Overview

The system follows a shared architecture across all Rinha de Backend implementations: two API instances behind an Nginx reverse proxy, with a single PostgreSQL database and an observability stack.

## Services

| Service | Role | CPU | RAM |
|---------|------|-----|-----|
| webapi1 | .NET 9 Native AOT API instance | 0.4 | 100MB |
| webapi2 | .NET 9 Native AOT API instance | 0.4 | 100MB |
| nginx | Reverse proxy / load balancer (least-conn) | 0.2 | 20MB |
| postgresql | Database with stored procedures | 0.5 | 330MB |
| k6 | Load testing | (not counted) | (not counted) |
| grafana + influxdb | Observability dashboards | (not counted) | (not counted) |

## Load Balancing

Nginx uses `least_conn` strategy to distribute requests across the two API instances.

## Database

Business logic is implemented in PostgreSQL stored procedures. The database is tuned for maximum write performance:

- `synchronous_commit=0` — no wait for WAL flush
- `fsync=0` — skip fsync on writes
- `full_page_writes=0` — skip full page writes

## Implementation Details

- Native AOT compilation for zero-JIT startup and minimal memory footprint
- System.Text.Json source generators for reflection-free JSON serialization
- Npgsql 10.0.2 with connection pooling and multiplexing for high-throughput database access
- Conditional compilation to strip OpenTelemetry in production builds
