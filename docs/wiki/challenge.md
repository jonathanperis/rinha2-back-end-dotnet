# Challenge

## Rinha de Backend 2024/Q1

Rinha de Backend is a Brazilian backend challenge focused on constrained, concurrent API design. The 2024/Q1 edition models a small fictional bank called Rinha Financeira. The workload stresses debit and credit transactions plus balance statements for five predefined clients.

## Required endpoints

| Endpoint | Method | Purpose | Expected statuses |
|----------|--------|---------|-------------------|
| `/clientes/{id}/transacoes` | POST | Submit a debit (`d`) or credit (`c`) transaction for client IDs 1 through 5 | `200`, `404`, `422` for invalid payloads |
| `/clientes/{id}/extrato` | GET | Return balance, credit limit, statement time, and recent transactions | `200`, `404` |
| `/healthz` | GET | Local and CI health check for this implementation | `200` |

## Validation rules

- Only client IDs `1` through `5` exist.
- Transaction type must be debit (`d`) or credit (`c`).
- Transaction value must be a positive integer amount in cents (`valor > 0`).
- Description must be present, non-empty, and at most 10 characters.
- Transaction type must be checked by the API before the request reaches PostgreSQL.
- Debits are intended not to push the account beyond the configured credit limit.
- Statement responses return the current balance plus the latest 10 transactions.

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


## Current implementation compatibility note

Payload validation is split across the API and PostgreSQL:

- `Program.cs` rejects invalid client IDs, non-positive values, invalid transaction types, and missing/empty/long descriptions before calling the database.
- `InsertTransacao` in `docker-entrypoint-initdb.d/rinha.dump.sql` performs the atomic balance update and transaction insert.

One important edge case is worth calling out: when a debit would exceed the account limit, the current SQL function returns the existing balance without inserting a transaction. Because the route handler treats the returned balance as a successful result, this case can surface as `200 OK` with an unchanged balance rather than the strict Rinha `422` behavior. Treat this as a known implementation note until the SQL/API contract is changed.
