# Getting Started

## Prerequisites

- Docker with Docker Compose

## Clone and Run

```bash
git clone https://github.com/jonathanperis/rinha2-back-end-dotnet.git
cd rinha2-back-end-dotnet
docker compose up nginx -d --build
```

## Access

The API is available at `http://localhost:9999`

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/clientes/{id}/transacoes` | POST | Submit debit or credit transaction |
| `/clientes/{id}/extrato` | GET | Get account balance statement |
| `/healthz` | GET | Health check |

## Example Requests

### Create Transaction

```bash
curl -X POST http://localhost:9999/clientes/1/transacoes \
  -H "Content-Type: application/json" \
  -d '{"valor": 1000, "tipo": "c", "descricao": "deposito"}'
```

### Get Statement

```bash
curl http://localhost:9999/clientes/1/extrato
```
