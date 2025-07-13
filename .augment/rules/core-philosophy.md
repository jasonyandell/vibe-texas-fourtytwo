---
type: "always_apply"
---

# Core Philosophy & Development Principles

## Simplicity First
- **CRITICAL**: Always prioritize simplicity and reduce cognitive load on developers
- **Do not reinvent the wheel**: Use standard, idiomatic tools and patterns
  - Example: Use npm for package management, not custom solutions
- **Prefer clear, simple solutions** over complex, clever ones
- **Standard tools over custom tools**: Use modern, popular, well-established tools

## Developer-First Approach
- **Superior Developer Experience (DX)** is the central goal
- **Low-friction development process** with fast feedback loops
- **Clear error messages** and helpful debugging information
- **Minimal setup** - clone and run with a single command
- **Hot-reloading** is essential and must be respected, supported, and nurtured

## Configuration Management
- **No Hard-Coded Configuration**: All configuration must be externalized
- **Use .env files** for environment-specific variables (ports, secrets, database URLs)
- **Use JSON files** for other application configuration
- **All settings read from outside the code** - never hardcoded values
- **Configuration is critical** to project success and must be handled properly

## Key Decision-Making Guidelines
When making any technical decision, always ask:
1. Does this reduce cognitive load for developers?
2. Is this the simplest solution that works?
3. Are we using standard, well-established tools?
4. Does this improve the developer experience?
5. Is configuration properly externalized?

## What This Means for AI Assistance
- Always suggest the simplest, most standard approach first
- Prioritize developer productivity and ease of understanding
- Ensure all configuration is externalized and never hardcoded
- Support and enhance hot-reloading workflows
- Choose established tools over custom solutions
