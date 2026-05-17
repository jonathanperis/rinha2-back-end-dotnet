---
name: .NET Rinha Architecture
description: Native AOT Minimal APIs, source-generated JSON, conditional OpenTelemetry compilation, Npgsql multiplexing
type: project
---

## Design Decisions

**Single Program.cs with Minimal APIs:**
- No controllers or MVC layers; route handlers are direct and compact.
- The minimal shape is intentional for challenge performance.

**Why:** Challenge constraints (1.5 CPU, 550MB RAM) favor zero-JIT startup and minimal allocations.

**How to apply:** Keep all challenge routes in `Program.cs`. Do not add controllers or service layers unless a measured change justifies the extra overhead.

## Key Technical Choices

- **Native AOT** (`AOT=true`): eliminates JIT warmup in release images.
- **Source generators**: `SourceGenerationContext` and `[JsonSerializable(...)]` metadata keep JSON compatible with AOT.
- **Conditional compilation**: `#if !EXTRAOPTIMIZE` wraps OpenTelemetry code. Release builds set `EXTRA_OPTIMIZE=true` so observability support is compiled out.
- **Npgsql multiplexing**: `Multiplexing=true` with a bounded pool in the compose connection string.
- **Snake_case JSON**: `JsonNamingPolicy.SnakeCaseLower` matches the challenge API shape.

## Build Flag Matrix

| Flag | Development compose | Release workflow |
|------|---------------------|------------------|
| `AOT` | `true` | `true` |
| `TRIM` | `false` | `false` |
| `EXTRA_OPTIMIZE` | `false` | `true` |
| `BUILD_CONFIGURATION` | `Release` | `Release` |

## Shared Infrastructure

This implementation follows the same broad Rinha2 infrastructure pattern as the sibling Rust, Go, and Python implementations: PostgreSQL stored procedures, NGINX on `9999`, and the shared `rinha2-back-end-k6` load-test image.
