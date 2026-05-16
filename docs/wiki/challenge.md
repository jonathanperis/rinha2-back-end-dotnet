# Challenge

## Rinha de Backend 2024/Q1

Rinha de Backend is a Brazilian backend challenge focused on constrained, concurrent API design. The 2024/Q1 edition models a small fictional bank called Rinha Financeira. The workload stresses debit and credit transactions plus balance statements for five predefined clients.

## Required endpoints

| Endpoint | Method | Purpose | Expected statuses |
|----------|--------|---------|-------------------|
| `/clientes/{id}/transacoes` | POST | Submit a debit (`d`) or credit (`c`) transaction for client IDs 1 through 5 | `200`, `404`, `422` |
| `/clientes/{id}/extrato` | GET | Return balance, credit limit, statement time, and recent transactions | `200`, `404` |
| `/healthz` | GET | Local and CI health check for this implementation | `200` |

## Validation rules

- Only client IDs `1` through `5` exist.
- Transaction type must be debit (`d`) or credit (`c`).
- Transaction value must be an integer amount.
- Description must be present and short enough for the contest schema.
- Debits cannot push the account beyond the configured credit limit.
- Statement responses return the current balance plus the latest transactions.

## Resource envelope

The official workload is intentionally small but hostile to inefficient coordination. All counted runtime containers must fit inside:

| Budget | Limit | This repository's counted split |
|--------|-------|---------------------------------|
| CPU | 1.5 total | API 0.8, PostgreSQL 0.5, NGINX 0.2 |
| RAM | 550MB total | API 200MB, PostgreSQL 330MB, NGINX 20MB |

The k6 runner and observability containers are test infrastructure. They are useful for local inspection, but they are not part of the counted API budget.

## What makes the challenge hard

- Concurrent requests can target the same client at the same time.
- Balance updates and statement reads must stay consistent.
- The database budget is tight enough that careless connection pools or chatty queries can dominate latency.
- The API budget leaves little room for runtime warmup, reflection, or over-instrumented production paths.

## Source

Full specification: [github.com/zanfranceschi/rinha-de-backend-2024-q1](https://github.com/zanfranceschi/rinha-de-backend-2024-q1)
