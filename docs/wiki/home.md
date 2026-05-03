# rinha2-back-end-dotnet

C#/.NET 9 Native AOT implementation for the Rinha de Backend 2024/Q1 challenge. Manages a fictional bank API with transaction processing and balance statements under strict resource constraints (1.5 CPU, 550MB RAM total across all containers).

## Wiki Pages

| Page | Description |
|------|-------------|
| [Challenge](challenge) | What is Rinha de Backend 2024/Q1 |
| [Architecture](architecture) | Stack, services, resource constraints |
| [Getting Started](getting-started) | Prerequisites and how to run |
| [Performance](performance) | Results, benchmarks, resource usage |
| [CI/CD Pipeline](ci-cd-pipeline) | GitHub Actions workflows |

## Key Features

- .NET 9 with Native AOT compilation for zero-JIT startup
- System.Text.Json source generators for reflection-free serialization
- Npgsql 10.0.2 with connection pooling and multiplexing
- PostgreSQL stored procedures for server-side business logic
- All requests under 800ms at 250MB RAM usage
- Perfect Score badge achieved

---

*[GitHub](https://github.com/jonathanperis/rinha2-back-end-dotnet) · [Jonathan Peris](https://jonathanperis.github.io/)*
