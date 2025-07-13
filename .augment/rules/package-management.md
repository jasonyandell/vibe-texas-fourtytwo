---
type: "always_apply"
---

# Package Management & Dependency Guidelines

## Package Manager Requirements
- **Use npm for package management**: Standard, well-established tool
- **npm workspaces**: For managing monorepo structure (frontend/backend)
- **Never manually edit package files**: Always use package manager commands

## Package Management Best Practices

### Installation Commands
- **Use `npm install <package>`** for adding dependencies
- **Use `npm install -D <package>`** for dev dependencies
- **Use `npm uninstall <package>`** for removing dependencies
- **Never manually edit package.json** for dependency management

### Workspace Management
- **Root package.json**: Contains workspace configuration and shared scripts
- **Individual workspaces**: Frontend and backend have their own package.json files
- **Shared dependencies**: Install common dependencies at root level when appropriate
- **Workspace-specific dependencies**: Install in individual workspace directories

### Script Organization
- **Root scripts**: Primary commands (`start`, `develop`, `test`)
- **Workspace scripts**: Specific to each service (`dev`, `build`, `test`)
- **Orchestration**: Use `concurrently` for running multiple processes
- **Modularity**: Scripts should be short and single-purpose

## Dependency Categories

### Production Dependencies
- **Frontend**: React, TypeScript, Vite
- **Backend**: Fastify, TypeScript, Node.js
- **Shared**: Any utilities used by both frontend and backend

### Development Dependencies
- **Testing**: Vitest (backend), Playwright (frontend)
- **Build Tools**: TypeScript compiler, Vite
- **Development Tools**: concurrently, nodemon, hot-reloading tools

### Infrastructure Dependencies
- **Docker**: For containerization and local database
- **PostgreSQL**: Database (runs in Docker for development)

## Configuration Management
- **Use .env files**: For environment-specific configuration
- **Use JSON files**: For application configuration
- **Never hardcode**: All configuration must be externalized
- **Template files**: Provide .env.example with sensible defaults

## AI Assistant Guidelines for Package Management
- Always use npm commands instead of manually editing package.json
- Respect the workspace structure when installing dependencies
- Ensure scripts are modular and well-organized
- Use concurrently for orchestrating multiple development processes
- Always externalize configuration to .env or config files
- Maintain clear separation between production and development dependencies
