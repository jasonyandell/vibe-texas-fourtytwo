# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Texas 42 Web Game - An authentic web-based implementation of the Texas 42 domino game, featuring:
- 4-player partnership gameplay with baseball diamond layout
- Real double-6 domino visuals with authentic pip layouts
- Test-Driven Development (TDD) workflow
- Modern web technologies with hot-reloading

## Development Commands

### Quick Start
```bash
# Clone and go - production-like experience
npm start                    # Runs everything in Docker containers

# Development with hot-reloading
npm run develop             # Database in Docker, frontend/backend locally

# Pure TDD workflow
npm run tdd                 # Run test watchers without starting servers
```

### Individual Services
```bash
# Frontend (Vite + React)
npm run dev:frontend        # Start dev server on port 3000
npm run test:frontend       # Run Vitest unit tests
npm run test:frontend:watch # Watch mode for TDD
npm run test:e2e           # Run Playwright E2E tests

# Backend (Fastify + Node.js)
npm run dev:backend        # Start dev server on port 4201
npm run test:backend       # Run Vitest unit tests
npm run test:backend:watch # Watch mode for TDD

# Shared Types Package
npm run test:shared-types  # Test shared types package
npm run build:shared-types # Build shared types
```

### Code Quality
```bash
# Linting - MUST pass with zero warnings
npm run lint               # Check all workspaces
npm run lint:frontend      # Frontend only
npm run lint:backend       # Backend only
npm run lint:fix          # Auto-fix issues

# Type checking - MUST pass with zero errors
npm run type-check        # Check TypeScript in all workspaces
```

### Build & Clean
```bash
npm run build             # Build all packages
npm run clean             # Clean build artifacts
npm run cleanup           # Deep clean including node_modules
```

## Architecture & Code Structure

### Monorepo Organization
```
fourtytwo/
├── frontend/          # Vite + React + TypeScript
│   ├── src/
│   │   ├── components/    # UI components (DominoComponent, GameBoard, etc.)
│   │   ├── contexts/      # React contexts (GameStateContext, LobbyStateContext)
│   │   ├── hooks/         # Custom hooks (useGameState, useLobbyState)
│   │   ├── types/         # TypeScript types and interfaces
│   │   └── utils/         # Utilities (validation, serialization)
│   └── tests/e2e/        # Playwright E2E tests
├── backend/           # Fastify + TypeScript + PostgreSQL
│   ├── src/
│   │   ├── api/          # REST endpoints (game.ts, health.ts)
│   │   ├── game/         # Game engine (dominoes.ts, engine.ts)
│   │   ├── types/        # Backend types
│   │   └── utils/        # Backend utilities
│   └── sql/              # Database schemas and migrations
├── packages/          # Shared packages (@texas42/shared-types)
└── scripts/           # Development and automation scripts
```

### Key Components

**Frontend Components:**
- `DominoComponent`: Renders individual dominoes with authentic visuals
- `DominoHand`: Displays player's 7 dominoes in 2-row layout (4 top, 3 bottom)
- `GameBoard`: Baseball diamond layout for 4 players
- `BiddingPanel`: Bidding interface with trump selection
- `Lobby`: Game creation and player management

**Backend Systems:**
- `GameEngine`: Core game logic and state management
- `DominoSet`: Domino utilities and validation
- `BiddingSystem`: Bid validation and processing
- `ScoringSystem`: Texas 42 scoring calculation

**State Management:**
- Frontend: Zustand stores + React contexts
- Backend: PostgreSQL for persistence
- Shared: URL-serializable game state

## Development Workflow

### Enhanced TDD Process (MANDATORY)
1. **Red Phase**: Write failing test first
2. **Green Phase**: Write minimal code to pass
3. **Refactor Phase**: Clean up code AND eliminate ALL warnings
   - Run `npm run lint` - MUST pass with zero warnings
   - Run `npm run type-check` - MUST pass with zero errors
   - ALL WARNINGS ARE BLOCKERS before next cycle

### GitHub Project Board Workflow
**One Action Per Step** - Execute ONE action then STOP:

1. **Check Open PRs**:
   - Merge one ready PR if approved → STOP
   - Fix one PR with blocking comments → STOP
   - Review one PR for alignment → STOP

2. **Work Issues**: If no PRs need attention
   - Work one issue from Project Board 1 → STOP
   - Use branch naming: `issue-{number}-{title-slug}`

### Branch Naming
- Issues: `issue-{number}-{title-slug}`
- Bug fixes: `fix-{number}-{description}`
- Documentation: `docs-{description}`

## Testing Requirements

### Test Frameworks
- **Frontend Unit Tests**: Vitest with React Testing Library
- **Backend Unit Tests**: Vitest with Node.js testing
- **E2E Tests**: Playwright (all browsers + mobile)

### Running Tests
```bash
# Single test runs
npm run test:frontend
npm run test:backend
npm run test:e2e

# TDD watch mode (recommended)
npm run tdd                # All tests in watch
npm run test:frontend:watch
npm run test:backend:watch
```

### Test Requirements
- Tests MUST be written before implementation code
- All tests MUST pass before committing
- Zero warnings policy during refactor phase
- Fast execution for quick feedback loops

## Configuration Management

### Environment Variables
All configuration externalized to `.env` files:

**Root `.env`:**
```bash
FRONTEND_PORT=4200    # Frontend dev server
BACKEND_PORT=4201     # Backend API server
DATABASE_PORT=5433    # PostgreSQL
```

**Frontend `.env`:**
```bash
VITE_API_URL=http://localhost:4201
VITE_WS_URL=ws://localhost:4201
```

**Backend `.env`:**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5433/texas42_dev
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

## Texas 42 Game Implementation

### Game Rules
- 4 players in partnerships (North-South vs East-West)
- Standard double-six domino set (28 dominoes)
- Bidding: 30-42 with trump selection
- Count dominoes: 5-0, 4-1, 3-2, 6-4, 5-5 (worth 5 points each)
- First team to 250 points wins

### Game State Requirements
- Complete serialization to compact string
- URL-compatible (fits in GET parameters)
- Self-contained (separate from lobby state)
- JSON deserializable

## Important Development Principles

1. **Simplicity First**: Choose standard solutions over custom
2. **Developer Experience**: Optimize for productivity
3. **Test-Driven**: Red-Green-Refactor for ALL changes
4. **Hot-Reloading**: Essential for development velocity
5. **Zero Warnings**: All warnings are blockers
6. **One Action Per Step**: Focus on single tasks

## Common Tasks

### Add a New Feature
1. Create issue in GitHub Project Board
2. Create branch: `issue-{number}-{feature-name}`
3. Write failing test
4. Implement minimal code to pass
5. Refactor and eliminate ALL warnings
6. Create PR when complete

### Fix a Bug
1. Write failing test that reproduces bug
2. Fix bug with minimal changes
3. Ensure all tests pass
4. Run lint and type-check
5. Submit PR with test

### Update Dependencies
```bash
# Update frontend dependency
npm install --workspace=frontend package-name@latest

# Update backend dependency
npm install --workspace=backend package-name@latest

# Update all dependencies
npm update
```

## Debugging & Troubleshooting

### Common Issues
- **Port conflicts**: Check `.env` files for port configuration
- **Docker issues**: Run `docker-compose down` then restart
- **Test failures**: Check for race conditions or timing issues
- **Build errors**: Run `npm run clean` then rebuild

### Useful Debug Commands
```bash
# Check running processes
docker ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Database access
docker exec -it texas42-db psql -U texas42_user -d texas42_dev
```

## Additional Resources
- [Developer Guide](docs/DEVELOPER.md) - Detailed development setup
- [Debugging Guide](docs/DEBUGGING.md) - Troubleshooting help
- [Design Document](docs/design.md) - Architecture decisions
- [Workflow Document](docs/WORKFLOW.md) - Development workflow details