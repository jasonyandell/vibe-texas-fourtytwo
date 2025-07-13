---
type: "always_apply"
---

# Development Workflows & Environment Setup

## Clone and Go Philosophy
A new developer must be able to clone the repository and have the application running with a single command. The project provides two clear, supported paths orchestrated by npm scripts in the root package.json.

## The Two Official Paths

### Run Path (`npm start`)
- **Purpose**: Production-like experience for seeing the final product
- **Mechanism**: Uses docker-compose to build and run the entire application stack (frontend, backend, database) in containers
- **Use Cases**: 
  - New contributors who want to see the app working
  - CI/CD environments
  - Product managers or stakeholders
  - Anyone needing to run the app without a development setup
- **Command**: `npm start`
- **Implementation**: Executes `docker-compose up --build`

### Develop Path (`npm run develop`)
- **Purpose**: High-velocity development with instant feedback
- **Mechanism**: Uses concurrently to orchestrate multiple processes:
  1. **Backing Services**: PostgreSQL runs in Docker
  2. **App Code**: Frontend and backend run natively on host for fastest hot-reloading
  3. **Tests**: Both frontend and backend test suites run in watch mode
- **Use Cases**: Day-to-day development and active coding
- **Command**: `npm run develop`

## Automated Environment Setup

### Prerequisite Checks
Before either startup script executes, it must run prerequisite verification:
- **Verify installation** of Node.js, npm, and Docker
- **Never install system-level software** without explicit user consent
- **Provide clear installation instructions** if tools are missing
- **Windows Enhancement**: On Windows, offer guided installation via Chocolatey with user permission

### Environment File Management
- **Template Files**: Every service requiring environment variables must have a `.env.example` file
- **Automated Creation**: Startup scripts check for `.env` files and create them from templates if missing
- **Preserve Existing**: Never overwrite existing `.env` files to preserve developer customizations
- **Sensible Defaults**: `.env.example` files must contain non-secret defaults suitable for local development

## Script Design Philosophy
- **Modularity**: Scripts must be short with single, clear purposes
- **Orchestration**: Prefer scripts that call other scripts over monolithic scripts
- **Readability**: Well-commented where necessary, but clarity comes from small scope and descriptive names
- **Root Directory**: All primary startup commands must be in root package.json

## AI Assistant Guidelines for Workflows
- Always ensure both `npm start` and `npm run develop` paths work correctly
- When creating scripts, make them modular and single-purpose
- Always create .env.example files with sensible defaults
- Never hardcode configuration - always externalize to .env or config files
- Prioritize hot-reloading in development workflows
- Ensure prerequisite checks are in place before running setup scripts
