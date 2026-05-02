# Challenge

## Rinha de Backend 2024/Q1

The Rinha de Backend is a Brazilian backend programming challenge. The 2024/Q1 edition simulates a fictional bank called "Rinha Financeira" that manages up to 5 named clients, each seeded at startup with a credit limit and initial balance.

## Endpoints

Two API endpoints are required:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/clientes/{id}/transacoes` | POST | Submit a debit or credit transaction for a client (IDs 1-5) |
| `/clientes/{id}/extrato` | GET | Get a client's current balance, credit limit, and recent transactions |

## Constraints

The challenge imposes strict resource limits across all containers combined:

- **1.5 CPU total** shared across all services
- **550MB RAM total** shared across all services
- The system is stress tested using Grafana k6 with concurrent users submitting transactions and querying statements

## Source

Full specification: [github.com/zanfranceschi/rinha-de-backend-2024-q1L(https://github.com/zanfranceschi/rinha-de-backend-2024-q1.md)
