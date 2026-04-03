---
name: .NET Rinha Architecture
description: Native AOT Minimal APIs, source-gen JSON, conditional OpenTelemetry compilation, Npgsql multiplexing
type: project
---

## Design Decisions

**Single Program.cs with Minimal APIs:**
- No controllers, no middleware abstractions — direct route handlers
- Intentionally minimal for challenge performance

**Why:** Challenge constraints (1.5 CPU, 550MB RAM) favor zero-JIT startup and minimal allocations.

**How to apply:** Keep all routes in Program.cs. Don't add MVC controllers or service layers.

## Key Technical Choices

- **Native AOT** (`AOT=true`): Eliminates JIT warmup. Binary starts instantly.
- **Source generators**: `[JsonSerializable(typeof(TransacaoDto))]` on `SourceGenerationContext` — zero reflection JSON at runtime.
- **Conditional compilation**: `#if !EXTRAOPTIMIZE` wraps all OpenTelemetry code. In production builds (EXTRA_OPTIMIZE=true), observability is completely stripped.
- **Npgsql multiplexing**: `Multiplexing=true` in connection string — multiple logical connections over single physical connection.
- **Snake_case JSON**: `JsonNamingPolicy.SnakeCaseLower` matches the challenge API spec.

## Build Flag Matrix

| Flag | PR/Debug | Release/Prod |
|------|----------|--------------|
| AOT | true | true |
| TRIM | false | false |
| EXTRA_OPTIMIZE | false | true |
| BUILD_CONFIGURATION | Debug | Release |

## Shared Infrastructure

Same PostgreSQL schema, stored procedures, NGINX config, and k6 tests as the Rust, Go, and Python implementations.
