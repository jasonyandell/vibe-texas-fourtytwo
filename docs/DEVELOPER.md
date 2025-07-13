# Developer Guide

This guide provides detailed information for developers working on the Texas 42 web game project.

## 🚀 Getting Started

### System Requirements

Before starting development, ensure you have the following installed:

- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **npm 9+**: Comes with Node.js, or update with `npm install -g npm@latest`
- **Docker Desktop**: Download from [docker.com](https://www.docker.com/products/docker-desktop)
- **Git**: Download from [git-scm.com](https://git-scm.com/)

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd fourtytwo
   npm install
   ```

2. **Verify Prerequisites**
   ```bash
   npm run check-prereqs
   ```

3. **Setup Environment**
   ```bash
   npm run setup-env
   ```

4. **Start Development**
   ```bash
   npm run develop
   ```

## 🏗️ Architecture Overview

### Monorepo Structure

The project uses npm workspaces to manage a monorepo with two main packages:

- **Frontend** (`frontend/`): React + Vite + TypeScript
- **Backend** (`backend/`): Fastify + TypeScript + PostgreSQL

### Technology Stack

#### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Zustand**: State management
- **React Router**: Client-side routing
- **Playwright**: E2E testing
- **Vitest**: Unit testing

#### Backend
- **Fastify**: Web framework
- **TypeScript**: Type safety
- **PostgreSQL**: Database
- **Redis**: Session storage
- **WebSockets**: Real-time communication
- **Vitest**: Unit testing

#### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-service orchestration
- **npm Workspaces**: Monorepo management

## 🔧 Development Workflows

### The Two-Path System

#### Path 1: Full Stack (`npm start`)
- **Use Case**: Integration testing, demos, production-like environment
- **What Runs**: Everything in Docker containers
- **Pros**: Production parity, isolated environment
- **Cons**: Slower feedback loops, resource intensive

#### Path 2: Local Development (`npm run develop`)
- **Use Case**: Active development, debugging, feature implementation
- **What Runs**: Database in Docker, backend/frontend locally
- **Pros**: Hot-reloading, fast feedback, easy debugging
- **Cons**: Less production-like

#### Path 3: Test-Driven Development (`npm run tdd`)
- **Use Case**: Pure TDD workflow, implementing new features
- **What Runs**: Only test watchers
- **Pros**: Fastest feedback, focuses on tests
- **Cons**: No running application

### Port Configuration

The project uses non-standard ports to avoid conflicts:

- **Frontend**: 4200 (not 3000/5173)
- **Backend**: 4201 (not 3001)
- **Database**: 5433 (not 5432)

All ports are configurable via environment variables.

## 🧪 Testing Strategy

### Test-Driven Development (TDD)

This project mandates TDD. The workflow is:

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Testing Layers

#### Unit Tests
- **Frontend**: Vitest + React Testing Library
- **Backend**: Vitest + Node.js testing utilities
- **Location**: `src/**/__tests__/` directories

#### Integration Tests
- **API Tests**: Test backend endpoints
- **Component Integration**: Test React component interactions

#### End-to-End Tests
- **Tool**: Playwright
- **Location**: `frontend/tests/e2e/`
- **Scope**: Full user workflows

### Running Tests

```bash
# All tests
npm test

# Specific test suites
npm run test:frontend
npm run test:backend
npm run test:e2e

# Watch modes
npm run tdd                    # All tests in watch mode
npm run test:frontend:watch    # Frontend only
npm run test:backend:watch     # Backend only

# Coverage
npm run test:coverage
```

## 🎮 Texas 42 Implementation

### Game Rules Implementation

The game engine implements authentic Texas 42 rules:

- **Players**: 4 players in partnerships (North-South vs East-West)
- **Dominoes**: Standard double-six set (28 dominoes)
- **Bidding**: 30-42 with trump selection
- **Scoring**: Count dominoes (5-0, 4-1, 3-2, 6-4, 5-5)
- **Winning**: First team to 250 points

### Game State Management

#### Frontend State
- **Validation**: Move validation and UI state
- **Stores**: Zustand for client-side state
- **Serialization**: URL-serializable game state

#### Backend State
- **Authority**: Server is authoritative for game logic
- **Persistence**: PostgreSQL for game state
- **Real-time**: WebSocket for live updates

### Key Components

#### Frontend
- `GameBoard`: Main game interface
- `DominoComponent`: Individual domino rendering
- `PlayerArea`: Player hand and information
- `BiddingInterface`: Bidding controls
- `ScoreDisplay`: Score tracking

#### Backend
- `GameEngine`: Core game logic
- `DominoSet`: Domino utilities
- `BiddingSystem`: Bid validation and processing
- `ScoringSystem`: Score calculation

## 🔧 Configuration Management

### Environment Variables

All configuration is externalized via environment variables:

#### Root Level (`.env`)
```bash
FRONTEND_PORT=4200
BACKEND_PORT=4201
DATABASE_PORT=5433
POSTGRES_DB=texas42_dev
POSTGRES_USER=texas42_user
POSTGRES_PASSWORD=texas42_password
```

#### Frontend (`.env`)
```bash
VITE_API_URL=http://localhost:4201
VITE_WS_URL=ws://localhost:4201
VITE_ENABLE_DEBUG_MODE=true
```

#### Backend (`.env`)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5433/texas42_dev
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

### Automatic Environment Setup

The `npm run setup-env` script automatically:
- Creates `.env` files from `.env.example` templates
- Generates secure secrets
- Validates required variables

## 🐛 Debugging

### Frontend Debugging
- **Browser DevTools**: React DevTools, Redux DevTools
- **Vite HMR**: Hot module replacement for instant feedback
- **Source Maps**: Full TypeScript debugging support

### Backend Debugging
- **Node.js Inspector**: Use `--inspect` flag
- **Logging**: Structured logging with Pino
- **Database**: pgAdmin available at http://localhost:5050

### Common Issues

See [DEBUGGING.md](DEBUGGING.md) for detailed troubleshooting.

## 📦 Package Management

### Adding Dependencies

Always use npm for dependency management:

```bash
# Frontend dependencies
npm install --workspace=frontend package-name

# Backend dependencies  
npm install --workspace=backend package-name

# Root dependencies (build tools, etc.)
npm install package-name
```

### Workspace Commands

```bash
# Run command in specific workspace
npm run --workspace=frontend dev
npm run --workspace=backend test

# Run command in all workspaces
npm run test --workspaces
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates:
- `frontend/dist/`: Static frontend assets
- `backend/dist/`: Compiled backend JavaScript

### Docker Deployment

```bash
# Production containers
docker-compose up --build

# Development database only
docker-compose -f docker-compose.db.yml up
```

## 🤝 Contributing Guidelines

1. **Follow TDD**: All code must be test-driven
2. **Use TypeScript**: Strict typing required
3. **Test Coverage**: Maintain high test coverage
4. **Code Style**: Use provided ESLint/Prettier configs
5. **Documentation**: Update docs for significant changes

### Git Workflow

1. Create feature branch from `main`
2. Implement using TDD workflow
3. Ensure all tests pass
4. Submit pull request
5. Code review and merge

## 📚 Additional Resources

- **[Design Document](design.md)**: Architecture decisions
- **[Technology Scaffold](technology_scaffold.md)**: Implementation details
- **[Debugging Guide](DEBUGGING.md)**: Troubleshooting help
- **[Texas 42 Rules](https://en.wikipedia.org/wiki/42_(dominoes))**: Game rules reference
