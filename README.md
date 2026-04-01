# rinha2-back-end-dotnet

> C#/.NET 9 Native AOT implementation for the Rinha de Backend 2024/Q1 challenge with Npgsql multiplexing and PostgreSQL stored procedures

[![CI](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/build-check-webapi.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/build-check-webapi.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## About

A C#/.NET implementation of the Brazilian backend challenge Rinha de Backend 2024/Q1, where a fictional bank API must handle concurrent transactions under strict resource constraints (1.5 CPU, 550MB RAM total). This implementation uses ASP.NET Core 9 Minimal API with Native AOT compilation for zero-JIT startup, System.Text.Json source generators for reflection-free serialization, and Npgsql multiplexing for high-throughput database access. Achieved a Perfect Score badge with all requests under 800ms at 250MB RAM usage.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| .NET / ASP.NET Core | 9.0 | Minimal API with Native AOT compilation |
| Npgsql | 9.0 | PostgreSQL driver with connection pooling and multiplexing |
| PostgreSQL | - | Database with stored procedures and tuned write settings |
| Nginx | 1.27 | Reverse proxy and load balancer (least-conn) |
| Docker | - | Multi-stage build and orchestration |
| k6 | - | Stress testing |

## Features

- Native AOT compilation for zero-JIT startup and minimal memory footprint
- System.Text.Json source generators for reflection-free JSON serialization
- Npgsql connection pool with multiplexing for concurrent query throughput
- PostgreSQL stored procedures for server-side business logic
- PostgreSQL tuned with synchronous_commit=0, fsync=0, full_page_writes=0
- Conditional compilation to strip OpenTelemetry in production builds

## Getting Started

### Prerequisites

- Docker with Docker Compose

### Quick Start

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-dotnet.git
cd rinha2-back-end-dotnet
docker compose up nginx -d --build
```

API available at `http://localhost:9999`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/clientes/{id}/transacoes` | POST | Submit debit or credit transaction |
| `/clientes/{id}/extrato` | GET | Get account balance statement |

## Project Structure

```
rinha2-back-end-dotnet/
├── src/WebApi/         — API implementation
├── docker-compose.yml  — Full stack: API x2, Nginx, PostgreSQL, k6, observability
└── .github/workflows/  — CI/CD pipelines
```

## CI/CD

Two GitHub Actions workflows: `build-check-webapi.yml` runs on pull requests to build and health-check the API, and `main-release-webapi.yml` runs on the main branch to build a multi-platform Docker image and push it to GHCR.

## License

MIT — see [LICENSE](LICENSE)
