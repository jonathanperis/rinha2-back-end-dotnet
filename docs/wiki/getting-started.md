# Getting Started

## Prerequisites

- Docker with Docker Compose.
- Git.
- Optional: .NET 9 SDK if you want to build `src/WebApi` outside Docker. Docker builds use the repository Dockerfile's .NET 10 SDK/runtime images while the project itself targets `net9.0`.

## Clone and run

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-dotnet.git
cd rinha2-back-end-dotnet
docker compose up nginx -d --build
```

The API is exposed through NGINX at:

```text
http://localhost:9999
```

## Smoke check

```bash
curl -i http://localhost:9999/healthz
```

A healthy stack returns `HTTP/1.1 200 OK`.

## API endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/clientes/{id}/transacoes` | POST | Submit a debit or credit transaction |
| `/clientes/{id}/extrato` | GET | Get account balance and recent transactions |
| `/healthz` | GET | Health check used by CI and local smoke tests |

## Example transaction

Credits use `tipo: "c"`, debits use `tipo: "d"`. Values are integer cents.

```bash
curl -X POST http://localhost:9999/clientes/1/transacoes \
  -H "Content-Type: application/json" \
  -d '{"valor": 1000, "tipo": "c", "descricao": "deposito"}'
```

## Example statement

```bash
curl http://localhost:9999/clientes/1/extrato
```

## Run the load-test lane

The compose file includes the shared k6 runner and observability services. After the API stack is up, run:

```bash
docker compose up k6
```

By default, the k6 service runs with `MODE=dev`, exports data to InfluxDB, and exposes the k6 web dashboard on port `5665`.

## Useful local ports

| Port | Service | Notes |
|------|---------|-------|
| `9999` | NGINX | Public API entrypoint |
| `5010` | API instance 1 | Direct container port for debugging |
| `5011` | API instance 2 | Direct container port for debugging |
| `5432` | PostgreSQL | Local database access |
| `3000` | Grafana LGTM | Observability UI |
| `5665` | k6 web dashboard | Enabled by `K6_WEB_DASHBOARD=true` |

## Stop and clean up

```bash
docker compose down
```

Add `-v` only when you intentionally want to remove database and telemetry volumes:

```bash
docker compose down -v
```
