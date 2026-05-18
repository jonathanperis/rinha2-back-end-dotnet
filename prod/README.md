# Rinha de Backend 2024/Q1 submission

Production submission assets for Jonathan Peris' .NET implementation.

## Stack

- C# / ASP.NET Core Minimal API targeting `net9.0`
- Native AOT release image built from `src/WebApi/Dockerfile`
- Npgsql 10.0.2 with `Multiplexing=true`
- PostgreSQL with stored procedures for atomic transaction rules
- NGINX on port `9999` using `least_conn`
- k6 runner image for production-mode HTML report generation

## Runtime topology

`prod/docker-compose.yml` starts two API containers, one PostgreSQL container, one NGINX load balancer, and an optional `k6` validation lane. Counted resource limits match the challenge envelope:

| Service area | CPU | RAM |
|---|---:|---:|
| API (`webapi1-dotnet` + `webapi2-dotnet`) | 0.8 | 200MB |
| PostgreSQL (`db`) | 0.5 | 330MB |
| NGINX (`nginx`) | 0.2 | 20MB |
| **Total** | **1.5** | **550MB** |

## Run

From this directory:

```bash
docker compose up nginx -d
curl -i http://localhost:9999/healthz
```

Run the production-mode load-test/report lane:

```bash
docker compose up k6 --build --force-recreate
```

The generated report is mounted under `prod/conf/stress-test/reports/`.

## Repository

https://github.com/jonathanperis/rinha2-back-end-dotnet

## Social

[![Github](https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/jonathanperis)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2.svg?style=for-the-badge&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/jonathan-peris/)
[![X/Twitter](https://img.shields.io/badge/X/Twitter-a618de.svg?style=for-the-badge&logoColor=white&logo=x)](https://twitter.com/jperis_silva)
