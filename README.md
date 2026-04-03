# rinha2-back-end-dotnet

> C#/.NET 9 Native AOT implementation for the Rinha de Backend 2024/Q1 challenge with Npgsql multiplexing and PostgreSQL stored procedures

[![Build Check](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/build-check.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/build-check.yml) [![Main Release](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/main-release.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/main-release.yml) [![CodeQL](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/codeql.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/codeql.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[Live demo →](https://jonathanperis.github.io/rinha2-back-end-dotnet/)** | **[Documentation →](https://github.com/jonathanperis/rinha2-back-end-dotnet/wiki)**

---

## About

A C#/.NET implementation of the Brazilian backend challenge Rinha de Backend 2024/Q1, where a fictional bank API must handle concurrent transactions under strict resource constraints (1.5 CPU, 550MB RAM total). This implementation uses ASP.NET Core 9 Minimal API with Native AOT compilation for zero-JIT startup, System.Text.Json source generators for reflection-free serialization, and Npgsql multiplexing for high-throughput database access. Achieved a Perfect Score badge with all requests under 800ms at 250MB RAM usage.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| .NET / ASP.NET Core | 9.0 | Minimal API with Native AOT compilation |
| Npgsql | 10.0.2 | PostgreSQL driver with connection pooling and multiplexing |
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
| `/healthz` | GET | Health check |

## Project Structure

```
rinha2-back-end-dotnet/
├── src/WebApi/
│   ├── Program.cs            — Complete API (route handlers, DI, config)
│   ├── WebApi.csproj         — Project config (AOT, Trim, ExtraOptimize flags)
│   └── Dockerfile            — Multi-stage build
├── docker-entrypoint-initdb.d/
│   └── rinha.dump.sql        — Schema, stored procedures, seed data
├── docker-compose.yml        — Dev stack: API x2, Nginx, PostgreSQL, observability
├── prod/docker-compose.yml   — Prod stack with GHCR images
├── nginx.conf                — Load balancer (least_conn)
├── grafana/                  — Pre-configured dashboards
├── wiki/                     — GitHub Wiki (submodule)
├── docs/                     — GitHub Pages site + k6 reports
└── .github/workflows/        — CI/CD pipelines
```

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| Build Check | PRs to main | Build + Docker health check |
| Main Release | Push to main | Multi-platform Docker push to GHCR + k6 load test |
| CodeQL | PRs + weekly | Security analysis |
| Deploy Docs | Push to main + wiki changes | Generate docs site from wiki |

Docker image: `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest`

## License

MIT — see [LICENSE](LICENSE)
