# Story: Initial Project Scaffold

## Overview
Set up the complete foundational structure for the Texas 42 web game project following the technology scaffolding plan. This story implements the monorepo architecture with proper TDD infrastructure, environment configuration, and development workflows.

## User Story
**As a developer**, I want a complete project scaffold with all necessary tooling and configuration so that I can immediately begin implementing Texas 42 game features using Test-Driven Development.

## Acceptance Criteria

### ✅ Root Directory Structure
- [ ] Create monorepo structure with npm workspaces
- [ ] Set up root `package.json` with two-path workflow (`npm start` and `npm run develop`)
- [ ] Configure root `.env.example` with port configuration (4200, 4201, 5433)
- [ ] Create automation scripts for prerequisite checking and environment setup
- [ ] Set up shared TypeScript configuration

### ✅ Frontend Scaffold (React + Vite + TypeScript)
- [ ] Initialize Vite + React + TypeScript in `frontend/` workspace
- [ ] Configure Playwright for E2E testing with TDD support
- [ ] Set up environment configuration with configurable ports
- [ ] Create basic directory structure for Texas 42 components:
  - `src/components/` - Domino visuals and game board
  - `src/game/` - Game state management
  - `src/types/` - TypeScript types for Texas 42
  - `src/utils/` - Game utilities and serialization
- [ ] Configure hot-reloading with custom port support

### ✅ Backend Scaffold (Node.js + Fastify + TypeScript)
- [ ] Initialize Fastify + TypeScript in `backend/` workspace
- [ ] Configure Vitest for unit testing with TDD support
- [ ] Set up environment configuration with configurable ports
- [ ] Create basic directory structure for Texas 42 game engine:
  - `src/game/` - Texas 42 game logic and rules engine
  - `src/api/` - REST endpoints for game actions
  - `src/types/` - Shared TypeScript types
  - `src/utils/` - Game state serialization utilities
  - `src/test/` - Test utilities and setup
- [ ] Configure development server with hot-reloading

### ✅ Database & Docker Configuration
- [ ] Create `docker-compose.yml` for full stack (`npm start`)
- [ ] Create `docker-compose.db.yml` for database only (`npm run develop`)
- [ ] Configure PostgreSQL 15+ with health checks
- [ ] Set up environment variable integration for all services
- [ ] Configure volume persistence for development data

### ✅ Testing Infrastructure
- [ ] Set up Playwright configuration with custom ports
- [ ] Configure Vitest with coverage reporting
- [ ] Create test setup files and utilities
- [ ] Implement TDD workflow scripts (`npm run tdd`)
- [ ] Configure continuous testing in development mode

### ✅ Documentation & Developer Experience
- [ ] Create comprehensive `README.md` with quick start guide
- [ ] Set up `docs/DEVELOPER.md` with port configuration guide
- [ ] Create `docs/DEBUGGING.md` for common issues
- [ ] Document the two-path workflow clearly
- [ ] Include prerequisite installation instructions

### ✅ Automation Scripts
- [ ] Implement `scripts/check-prereqs.js` for cross-platform prerequisite checking
- [ ] Create `scripts/setup-env.js` for automatic environment file creation
- [ ] Add utility functions for common development tasks
- [ ] Ensure scripts work on Windows, macOS, and Linux

## Technical Requirements

### Port Configuration
- Frontend: 4200 (avoids common conflicts with 3000/5173)
- Backend: 4201 (avoids common conflicts with 3001)
- Database: 5433 (avoids common conflicts with 5432)
- All ports configurable via environment variables

### TDD Integration
- All development workflows include test watchers
- `npm run tdd` provides pure test-driven development mode
- `npm run develop` includes tests alongside hot-reloading
- Tests must pass before any implementation is considered complete

### Texas 42 Specific Structure
- Game state must be URL-serializable from the start
- Clear separation between game logic (backend) and validation (frontend)
- Directory structure supports domino components and baseball diamond layout
- Partnership and scoring system architecture prepared

## Definition of Done
- [ ] Both `npm start` and `npm run develop` work without errors
- [ ] All prerequisite checks pass on clean environment
- [ ] Environment files are created automatically from templates
- [ ] Hot-reloading works for both frontend and backend
- [ ] Test infrastructure runs successfully with sample tests
- [ ] Documentation is complete and accurate
- [ ] Port conflicts are avoided and configurable
- [ ] Project structure supports immediate Texas 42 development

## Dependencies
- Node.js 18+
- npm 9+
- Docker Desktop
- Git

## Estimated Effort
**4-6 hours** - This is foundational work that enables all future development

## Notes
- This scaffold must be completed before any game logic implementation
- All configuration should be environment-variable driven
- The structure must support the authentic Texas 42 implementation requirements
- TDD infrastructure is mandatory - no implementation without tests
- Port configuration is critical to avoid developer conflicts
