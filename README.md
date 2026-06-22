# rinha2-back-end-dotnet

> C#/.NET 9 Native AOT implementation for the Rinha de Backend 2024/Q1 challenge with Npgsql multiplexing and PostgreSQL stored procedures

[![Build Check](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/build-check.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/build-check.yml) [![Main Release](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/main-release.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/main-release.yml) [![CodeQL](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/codeql.yml/badge.svg)](https://github.com/jonathanperis/rinha2-back-end-dotnet/actions/workflows/codeql.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[Live demo →](https://jonathanperis.github.io/rinha2-back-end-dotnet/)** | **[Documentation →](https://jonathanperis.github.io/rinha2-back-end-dotnet/docs/)**

---

## About

A C#/.NET implementation of the Brazilian backend challenge Rinha de Backend 2024/Q1, where a fictional bank API must handle concurrent transactions under strict resource constraints (1.5 CPU, 550MB RAM total). This implementation targets `net9.0`, uses ASP.NET Core Minimal API with Native AOT compilation for zero-JIT startup, System.Text.Json source generators for reflection-free serialization, and Npgsql multiplexing for high-throughput database access. Current benchmark evidence is published in the GitHub Pages reports section rather than summarized as a fixed score in this README.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| .NET / ASP.NET Core | target `net9.0`; Docker build images `10.0` | Minimal API with Native AOT compilation |
| Npgsql | 10.0.2 | PostgreSQL driver with connection pooling and multiplexing |
| PostgreSQL | 16 in dev compose; default image in prod compose | Database with stored procedures and tuned write settings |
| Nginx | default image in compose files | Reverse proxy and load balancer (least_conn) |
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

For request/response payloads, validation behavior, and known implementation notes, see the [API Reference](https://jonathanperis.github.io/rinha2-back-end-dotnet/docs/api-reference/).

## Project Structure

```
rinha2-back-end-dotnet/
├── src/WebApi/
│   ├── Program.cs            — Complete API (route handlers, DI, config)
│   ├── WebApi.csproj         — Project config (net9.0, AOT, Trim, ExtraOptimize flags)
│   ├── Dockerfile            — Multi-stage Docker build using .NET 10 SDK/runtime images
│   └── appsettings.json      — OpenTelemetry defaults used when ExtraOptimize=false
├── docker-entrypoint-initdb.d/
│   └── rinha.dump.sql        — Schema, stored procedures, seed data
├── docker-compose.yml        — Dev stack: API x2, Nginx, PostgreSQL, observability
├── prod/docker-compose.yml   — Prod stack with GHCR images
├── nginx.conf                — Load balancer (least_conn)
├── grafana/                  — Legacy Grafana dashboard provisioning
├── docs/wiki/                — Markdown source rendered to the Pages docs routes
├── docs/                     — Astro 7 GitHub Pages site using Sätteri + published k6 reports
└── .github/workflows/        — CI/CD pipelines
```

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| Build Check | PRs to main, manual dispatch | WebApi restore/build + Docker Compose health check |
| Main Release | Push to main, manual dispatch | Multi-platform Docker push to GHCR + production compose/k6 validation |
| CodeQL | PRs, pushes to main, weekly | Security analysis |
| Deploy Docs | Push to main, manual dispatch | Build the Astro docs site from `docs/` and deploy to Pages |

Docker image: `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest`

## License

MIT — see [LICENSE](LICENSE)
