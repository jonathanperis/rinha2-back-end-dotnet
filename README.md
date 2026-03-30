# rinha2-back-end-dotnet

High-performance backend implementation for the **Rinha de Backend** challenge (2nd Edition, 2024/Q1) — built with **ASP.NET 9**, **PostgreSQL**, and **Nginx**.

**Live results:** [jonathanperis.github.io/rinha2-back-end-dotnet](https://jonathanperis.github.io/rinha2-back-end-dotnet/)

---

## About

A C#/.NET implementation of the Brazilian backend programming challenge that pushes API performance to the limit under strict resource constraints. The API manages fictional bank clients with credit/debit transactions and balance statements.

### Endpoints

- `POST /clientes/{id}/transacoes` — Create a transaction (credit or debit)
- `GET /clientes/{id}/extrato` — Get client balance and recent transactions

### Results

All requests completed under 800ms using only **250MB of RAM** — 60% less than the challenge allows.

## Tech Stack

| Technology | Purpose |
|---|---|
| ASP.NET 9.0 | Minimal API with Native AOT compilation |
| PostgreSQL | Database with stored procedures and UNLOGGED tables |
| Nginx | Reverse proxy / load balancer (least-conn) |
| Docker | Multi-stage build and orchestration |
| Npgsql 9.0 | PostgreSQL driver with connection pooling |
| OpenTelemetry | Tracing, metrics, and logging |
| Grafana + InfluxDB | Observability and load test metrics |
| k6 | Stress testing |

## Architecture

- **2 API instances** behind Nginx (0.4 CPU, 100MB RAM each)
- **1 PostgreSQL** database (0.5 CPU, 330MB RAM)
- **1 Nginx** load balancer (0.2 CPU, 20MB RAM)
- Business logic pushed into PostgreSQL stored functions
- Native AOT compilation for minimal startup time and memory footprint
- System.Text.Json source generators for zero-reflection serialization

## Performance Optimizations

- Native AOT (ahead-of-time compilation)
- Trimming and extra optimization flags
- PstgreSQL tuned: `synchronous_commit=0`, `fsync=0`, UNLOGGED tables
- Connection pooling with multiplexing via Npgsql
- Conditional compilation to strip telemetry in production builds

## Getting Started

```bash
docker compose up nginx -d --build
```

The API will be available at `http://localhost:9999`.

## Other Implementations

- [rinha2-back-end-go](https://github.com/jonathanperis/rinha2-back-end-go) — Go
- [rinha2-back-end-rust](https://github.com/jonathanperis/rinha2-back-end-rust) — Rust
- [rinha2-back-end-python](https://github.com/jonathanperis/rinha2-back-end-python) — Python
- [rinha2-back-end-k6](https://github.com/jonathanperis/rinha2-back-end-k6) — k6 stress tests

## License

Licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
