---
type: "always_apply"
---

# Texas 42 Web Game - Project Overview & Quick Reference

## Project Summary
This is a web-based implementation of the Texas 42 domino game, built with a focus on superior developer experience and modern web technologies.

## Quick Reference - Key Principles
1. **Simplicity First** - Always choose the simpler, more standard solution
2. **Developer Experience** - Optimize for developer productivity and happiness
3. **Test-Driven Development** - Red-Green-Refactor for all changes
4. **Hot-Reloading** - Essential for development velocity
5. **Configuration Externalization** - Never hardcode values

## Project Structure
```
fourtytwo/
├── frontend/          # Vite + React + TypeScript
├── backend/           # Node.js + Fastify + TypeScript
├── docs/              # All project documentation
├── scripts/           # Development and setup scripts
├── .augment/rules/    # Augment AI assistant rules
└── package.json       # Root workspace configuration
```

## Two Development Paths
- **`npm start`**: Production-like experience using Docker Compose
- **`npm run develop`**: High-velocity development with hot-reloading

## Technology Stack Summary
- **Frontend**: Vite + React + TypeScript + Playwright (E2E tests)
- **Backend**: Node.js + Fastify + TypeScript + Vitest (unit tests)
- **Database**: PostgreSQL (Docker for dev, AWS RDS for prod)
- **Infrastructure**: Docker + Docker Compose + AWS CDK

## Game-Specific Requirements
- **Texas 42 domino game** with authentic rules and scoring
- **4 players in partnerships** arranged in baseball diamond layout
- **Complete game state serialization** for URL compatibility
- **Separation of lobby state and game state**

## Development Workflow
1. **Write failing test first** (TDD requirement)
2. **Write minimal code** to make test pass
3. **Refactor** while keeping tests green
4. **Update documentation** as part of the change
5. **Verify hot-reloading** still works

## Definition of Done
- [ ] All tests pass (unit and E2E)
- [ ] Documentation is updated
- [ ] Hot-reloading works correctly
- [ ] Configuration is externalized
- [ ] Code follows simplicity-first principle

## AI Assistant Behavior Guidelines
- Always prioritize developer experience and simplicity
- Use standard tools and patterns over custom solutions
- Ensure TDD practices are followed
- Maintain hot-reloading functionality
- Keep documentation current and accurate
- Externalize all configuration
- Respect the separation between game state and lobby state

## Critical Success Factors
- **Clone and Go**: New developers can run the app with one command
- **Fast Feedback Loops**: Tests and hot-reloading provide instant feedback
- **Clear Documentation**: Always current and developer-focused
- **Standard Tools**: Use npm, Docker, established frameworks
- **Game State Management**: Serializable, URL-compatible, self-contained
