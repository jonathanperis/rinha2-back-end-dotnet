# CI/CD Pipeline

## Workflows

This repository uses four GitHub Actions workflows:

### build-check.yml

- **Trigger:** Pull requests to main, push to main
- **Steps:** Builds the API (Release, AOT=true) and runs a Docker health check to verify the service starts correctly
- **Purpose:** Catch build failures and regressions before merging

### main-release.yml

- **Trigger:** Push to main branch
- **Steps:** Builds a multi-platform Docker image (amd64, arm64/v8), pushes it to GitHub Container Registry (GHCR), and runs k6 load tests
- **Purpose:** Automated release of production-ready container images with stress test validation

### codeql.yml

- **Trigger:** Pull requests to main, push to main, weekly schedule
- **Steps:** Runs GitHub CodeQL security analysis for C#
- **Purpose:** Automated security vulnerability detection

### deploy.yml

- **Trigger:** Push to main branch
- **Steps:** Deploys the `docs/` directory to GitHub Pages using the GitHub Actions deployment model
- **Purpose:** Publish the project documentation site

## Docker Image

Published to `ghcr.io/jonathanperis/rinha2-back-end-dotnet:latest` (amd64, arm64/v8)
