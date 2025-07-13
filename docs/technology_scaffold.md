# Technology Scaffolding Plan

This document outlines the plan for scaffolding the initial project structure based on the design principles in `design.md`. It provides a complete implementation guide that adheres to all design mandates including simplicity, developer experience, testability, **Test-Driven Development (TDD)**, and **Texas 42 game-specific requirements**.

## Core Principles Integration

This scaffold strictly follows the established Augment Rules:
- **TDD Mandatory**: All implementation follows Red-Green-Refactor cycle
- **Game State Serialization**: Complete game state must be URL-compatible and serializable
- **Separation of Concerns**: Clear boundaries between game state and lobby state
- **Texas 42 Authenticity**: Implements authentic domino game rules and mechanics
- **Developer Experience**: Hot-reloading, fast feedback loops, and simple workflows

## 1. Root Directory Structure

The root directory will be a monorepo managed by npm workspaces. It includes **game-specific directories** for Texas 42 implementation and follows **TDD structure** with tests alongside implementation:

```
fourtytwo/
├── .gitignore                  # standard .gitignore for this type of project
├── package.json                # Central script manifest and workspace config
├── tsconfig.json               # Shared TypeScript configuration
├── .env.example                # Template for root-level environment variables (ports)
├── docker-compose.yml          # Full stack for `npm start` (production-like)
├── docker-compose.db.yml       # Database only for `npm run develop`
├── README.md                   # Project front door (always accurate)
├── frontend/                   # React frontend application
│   ├── package.json
│   ├── .env.example
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── playwright.config.ts
│   ├── src/
│   │   ├── components/         # React components (domino visuals, game board)
│   │   ├── game/              # Game state management and validation
│   │   ├── types/             # TypeScript types for Texas 42
│   │   └── utils/             # Game utilities and serialization
│   └── tests/                 # Playwright E2E tests
├── backend/                    # Node.js backend application
│   ├── package.json
│   ├── .env.example
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── src/
│   │   ├── game/              # Texas 42 game logic and rules engine
│   │   ├── api/               # REST endpoints for game actions
│   │   ├── types/             # Shared TypeScript types
│   │   ├── utils/             # Game state serialization utilities
│   │   └── test/              # Test utilities and setup
│   └── tests/                 # Vitest unit tests
├── scripts/                    # Helper scripts (modular, single-purpose)
│   ├── check-prereqs.js        # Prerequisite verification (Node.js)
│   ├── setup-env.js           # Environment file management
│   └── utils.js               # Shared script utilities
├── stories/                    # User stories and feature specifications
│   ├── game-state-management.md # Game state architecture story
│   ├── texas-42-rules-research.md # Texas 42 rules research
│   └── texas-42-implementation.md # Implementation strategy
└── docs/                      # Required documentation
    ├── design.md              # Single source of truth for design
    ├── DEVELOPER.md           # Developer contribution guide
    └── DEBUGGING.md           # Living troubleshooting document
```

### 1.1 Texas 42 Game Architecture Integration

The directory structure specifically supports Texas 42 game requirements:

#### Game State Management
- **Serializable State**: All game state must fit in URL parameters
- **Separation of Concerns**: Game state (current game) vs Lobby state (player management)
- **Frontend Validation**: Move validation happens in frontend for immediate feedback
- **Backend Authority**: All game logic computation happens in backend

#### Texas 42 Specific Structure
- **Domino Components**: Real double-6 domino visuals in frontend/src/components/
- **Game Logic**: Complete Texas 42 rules engine in backend/src/game/
- **State Serialization**: URL-compatible game state utilities in both frontend and backend
- **Baseball Diamond Layout**: UI components arranged in diamond formation

### 1.2 Root Environment Configuration (`.env.example`)
```env
# Port Configuration - Centralized port management
# These ports are chosen to avoid common conflicts

# Frontend Development Server
FRONTEND_PORT=4200

# Backend API Server
PORT=4201

# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=fourtytwo
DB_USER=postgres
DB_PASSWORD=password

# Derived URLs (used by Docker Compose)
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

## 2. Root `package.json`

This file is the central script manifest and main entry point for developers. It implements the two-path workflow mandated by the design and **supports TDD workflow** with continuous testing:

```json
{
  "name": "fourtytwo-monorepo",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "//-- CLONE AND GO PATHS --//": "",
    "start": "node scripts/check-prereqs.js && node scripts/setup-env.js && docker-compose --env-file .env up --build",
    "develop": "node scripts/check-prereqs.js && node scripts/setup-env.js && concurrently --names \"DB,BE,FE,BE_TEST,FE_TEST\" -c \"bgBlue.bold,bgMagenta.bold,bgGreen.bold,bgYellow.bold,bgCyan.bold\" \"npm:dev:db\" \"npm:dev:backend\" \"npm:dev:frontend\" \"npm:test:backend\" \"npm:test:frontend\"",

    "//-- ORCHESTRATION SCRIPTS --//": "",
    "dev:db": "docker-compose --env-file .env -f docker-compose.db.yml up",
    "dev:backend": "npm run dev --workspace=backend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "test:backend": "npm run test:watch --workspace=backend",
    "test:frontend": "npm run test:watch --workspace=frontend",

    "//-- UTILITY SCRIPTS --//": "",
    "test": "npm run test --workspace=backend && npm run test --workspace=frontend",
    "test:unit": "npm run test --workspace=backend",
    "test:e2e": "npm run test --workspace=frontend",
    "tdd": "concurrently --names \"BE_TDD,FE_TDD\" -c \"bgRed.bold,bgBlue.bold\" \"npm:test:backend\" \"npm:test:frontend\"",
    "build": "npm run build --workspace=backend && npm run build --workspace=frontend",
    "clean": "npm run clean --workspace=backend && npm run clean --workspace=frontend",
    "install-all": "npm install && npm install --workspace=frontend && npm install --workspace=backend",
    "typecheck": "npm run typecheck --workspace=backend && npm run typecheck --workspace=frontend"
  },
  "devDependencies": {
    "concurrently": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Key Features:
- **Two-Path Workflow**: `npm start` (production-like) and `npm run develop` (high-velocity)
- **TDD Support**: `npm run tdd` for pure test-driven development workflow
- **Continuous Testing**: Tests run in watch mode during development
- **Prerequisite Automation**: Both paths run prerequisite and environment checks first
- **Modular Scripts**: Short, single-purpose scripts that call other scripts
- **Workspace Integration**: Uses npm workspaces for seamless monorepo management
- **Clear Organization**: Comments separate different script categories

## 3. Frontend (`frontend/`)

### 3.1 Technology Stack
- **Framework**: Vite + React + TypeScript
- **Testing**: Playwright for end-to-end tests (TDD approach)
- **State Management**: React Context + Custom Hooks for game state
- **Styling**: CSS Modules for domino and game board components
- **Game Features**:
  - **Real Domino Visuals**: Authentic double-6 domino components
  - **Baseball Diamond Layout**: 4-player arrangement in diamond formation
  - **Move Validation**: Frontend validates moves before sending to backend
  - **Game State Serialization**: URL-compatible state management

### 3.2 Package.json Configuration
```json
{
  "name": "fourtytwo-frontend",
  "private": true,
  "scripts": {
    "dev": "vite --host --port ${VITE_PORT:-4200}",
    "build": "tsc && vite build",
    "preview": "vite preview --port ${VITE_PORT:-4200}",
    "test": "playwright test",
    "test:watch": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist .vite"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

### 3.3 Environment Configuration (`.env.example`)
```env
# Frontend Configuration
VITE_PORT=4200
VITE_API_BASE_URL=http://localhost:4201
VITE_WS_URL=ws://localhost:4201
VITE_APP_NAME=Texas 42

# Development
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

## 4. Backend (`backend/`)

### 4.1 Technology Stack
- **Framework**: Node.js + Fastify + TypeScript
- **Testing**: Vitest for unit tests (TDD approach)
- **Database**: PostgreSQL with connection pooling
- **Validation**: Zod for request/response validation
- **Hot-Reloading**: tsx for development
- **Game Engine Features**:
  - **Texas 42 Rules Engine**: Complete implementation of authentic game rules
  - **Game State Authority**: Backend is source of truth for all game logic
  - **Serialization**: Compact, URL-compatible game state encoding
  - **Partnership Logic**: Handles 4-player partnership mechanics
  - **Scoring System**: Authentic Texas 42 scoring and trick calculation

### 4.2 Package.json Configuration
```json
{
  "name": "fourtytwo-backend",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "fastify": "^4.0.0",
    "@fastify/cors": "^8.0.0",
    "@fastify/websocket": "^8.0.0",
    "pg": "^8.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/pg": "^8.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### 4.3 Environment Configuration (`.env.example`)
```env
# Server Configuration
PORT=4201
HOST=0.0.0.0
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_NAME=fourtytwo
DB_USER=postgres
DB_PASSWORD=password
DATABASE_URL=postgresql://postgres:password@localhost:5433/fourtytwo
DB_POOL_MIN=2
DB_POOL_MAX=10

# Development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:4200
```

## 5. Database & Docker Configuration

### 5.1 PostgreSQL Setup
- **Engine**: PostgreSQL 15+
- **Development**: Runs in Docker via docker-compose
- **Production**: AWS RDS or compatible service
- **Connection**: Pooled connections for performance

### 5.2 Docker Compose Files

#### `docker-compose.yml` (Full Stack - `npm start`)
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ${DB_NAME:-fourtytwo}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
    ports:
      - "${DB_PORT:-5433}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "${PORT:-4201}:${PORT:-4201}"
    environment:
      PORT: ${PORT:-4201}
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-password}@db:5432/${DB_NAME:-fourtytwo}
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "${FRONTEND_PORT:-4200}:${FRONTEND_PORT:-4200}"
    environment:
      VITE_PORT: ${FRONTEND_PORT:-4200}
      VITE_API_BASE_URL: http://localhost:${PORT:-4201}
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### `docker-compose.db.yml` (Database Only - `npm run develop`)
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ${DB_NAME:-fourtytwo}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
    ports:
      - "${DB_PORT:-5433}:5432"
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data_dev:
```

## 6. Automation Scripts

### 6.1 Prerequisite Checker (`scripts/check-prereqs.js`)

A Node.js script (cross-platform compatible) that verifies development environment:

```javascript
#!/usr/bin/env node
const { execSync } = require('child_process');
const os = require('os');

function checkCommand(command, name, installUrl) {
  try {
    const version = execSync(`${command} --version`, { encoding: 'utf8' }).trim();
    console.log(`✅ ${name} found: ${version}`);
    return true;
  } catch (error) {
    console.log(`❌ ERROR: ${name} is not installed.`);
    console.log(`   Please install from: ${installUrl}`);

    // Windows Chocolatey helper
    if (os.platform() === 'win32') {
      console.log(`   Or run: choco install ${name.toLowerCase()}`);
    }

    return false;
  }
}

function checkDocker() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    console.log('✅ Docker is running');
    return true;
  } catch (error) {
    console.log('❌ ERROR: Docker is not running');
    console.log('   Please start Docker Desktop and try again');
    return false;
  }
}

function main() {
  console.log('🔍 Checking prerequisites...\n');

  const checks = [
    checkCommand('node', 'Node.js', 'https://nodejs.org/'),
    checkCommand('npm', 'npm', 'https://nodejs.org/'),
    checkDocker()
  ];

  if (checks.every(Boolean)) {
    console.log('\n🎉 All prerequisites met!');
    process.exit(0);
  } else {
    console.log('\n🚫 Please install missing tools and try again');
    process.exit(1);
  }
}

main();
```

### 6.2 Environment Setup (`scripts/setup-env.js`)

Handles `.env` file creation from templates:

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function setupEnvFile(dir, serviceName) {
  const envPath = path.join(dir, '.env');
  const examplePath = path.join(dir, '.env.example');

  if (!fs.existsSync(examplePath)) {
    console.log(`⚠️  No .env.example found in ${serviceName}`);
    return;
  }

  if (fs.existsSync(envPath)) {
    console.log(`✅ ${serviceName}/.env already exists`);
    return;
  }

  fs.copyFileSync(examplePath, envPath);
  console.log(`📝 Created ${serviceName}/.env from template`);
}

function main() {
  console.log('🔧 Setting up environment files...\n');

  // Setup root .env if needed
  setupEnvFile('.', 'root');

  // Setup frontend .env
  setupEnvFile('frontend', 'frontend');

  // Setup backend .env
  setupEnvFile('backend', 'backend');

  console.log('\n✅ Environment setup complete!');
}

main();
```

## 7. TypeScript Configuration

### 7.1 Root `tsconfig.json` (Shared Base)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 7.2 Frontend `tsconfig.json`
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 7.3 Backend `tsconfig.json`
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 8. Testing Infrastructure

### 8.1 Frontend Testing Setup (Playwright)
```typescript
// frontend/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const frontendPort = process.env.VITE_PORT || '4200';
const baseURL = `http://localhost:${frontendPort}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 8.2 Backend Testing Setup (Vitest)
```typescript
// backend/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

## 9. Documentation Structure

### 9.1 Required Documentation Files

#### `README.md` (Project Front Door)
```markdown
# Texas 42 Web Game

A minimalist, elegant, real-time web implementation of the classic Texas 42 domino game.

## Quick Start

1. Clone the repository
2. Run `npm install`
3. Choose your path:
   - **See the app**: `npm start` (production-like)
   - **Develop**: `npm run develop` (hot-reloading + tests)

## Prerequisites

- Node.js 18+
- npm 9+
- Docker Desktop

The startup scripts will check these automatically and provide installation instructions if needed.

## Port Configuration

Default ports (can be changed in `.env` file):
- Frontend: http://localhost:4200
- Backend API: http://localhost:4201
- Database: localhost:5433

## Documentation

- [Design Document](docs/design.md) - Single source of truth for all design decisions
- [Developer Guide](docs/DEVELOPER.md) - How to contribute to the project
- [Debugging Guide](docs/DEBUGGING.md) - Common issues and solutions
```

#### `docs/DEVELOPER.md` Template
```markdown
# Developer Guide

## Development Workflows

### Daily Development
```bash
npm run develop  # Starts everything with hot-reloading
```

### Testing
```bash
npm test         # Run all tests once
npm run develop  # Includes test watchers
```

## Port Configuration

The application uses configurable ports to avoid conflicts:

### Default Ports
- Frontend: 4200 (instead of common 3000/5173)
- Backend: 4201 (instead of common 3001)
- Database: 5433 (instead of common 5432)

### Changing Ports
1. Copy `.env.example` to `.env` in the root directory
2. Modify the port values:
   ```env
   FRONTEND_PORT=4200
   PORT=4201
   DB_PORT=5433
   ```
3. Restart the development servers

### Port Conflicts
If you encounter port conflicts:
1. Check what's using the port: `lsof -i :4200` (macOS/Linux) or `netstat -ano | findstr :4200` (Windows)
2. Either stop the conflicting service or change the port in `.env`

## Common Tasks
[Specific examples of common development workflows]
```

#### `docs/DEBUGGING.md` Template
```markdown
# Debugging Guide

## Common Issues

### Port Conflicts
**Problem**: "Port already in use" errors when starting development servers
**Symptoms**:
- `npm run develop` fails with EADDRINUSE error
- Frontend or backend won't start

**Solutions**:
1. **Check what's using the port**:
   - macOS/Linux: `lsof -i :4200` or `lsof -i :4201`
   - Windows: `netstat -ano | findstr :4200`
2. **Change ports in .env file**:
   ```env
   FRONTEND_PORT=4300
   PORT=4301
   DB_PORT=5434
   ```
3. **Kill conflicting processes** (if safe to do so)

### Database Connection Issues
**Problem**: Cannot connect to PostgreSQL
**Symptoms**: Backend fails to start with database connection errors
**Solutions**:
- Ensure Docker is running and database is healthy
- Check database port in `.env` matches docker-compose configuration
- Verify database credentials in `.env` file

### Hot Reload Not Working
**Problem**: Changes not reflected in browser
**Solutions**:
- Check Vite dev server is running on correct port (check VITE_PORT in .env)
- Verify browser is pointing to correct URL (http://localhost:4200 by default)
- Clear browser cache and restart dev server

### Environment Variables Not Loading
**Problem**: Application using default values instead of .env values
**Solutions**:
- Ensure `.env` file exists in root directory (copy from `.env.example`)
- Restart all development servers after changing .env
- Check .env file has no spaces around = signs

[More issues will be added as they're encountered]
```

## 10. Test-Driven Development Implementation Strategy

### 10.1 TDD Workflow Integration
All implementation must follow the **Red-Green-Refactor** cycle:

1. **Red Phase**: Write failing test first
   - Define expected behavior before implementation
   - Tests should fail for the right reason
   - Use `npm run tdd` for continuous test feedback

2. **Green Phase**: Write minimal code to pass test
   - Implement only what's needed to make the test pass
   - No premature optimization or extra features
   - Focus on making the test green as quickly as possible

3. **Refactor Phase**: Improve code while keeping tests green
   - Clean up implementation
   - Update documentation
   - Ensure hot-reloading still works

### 10.2 Texas 42 TDD Approach
Game implementation follows specific TDD patterns:

#### Game State Tests First
```typescript
// Example: Write test before implementing game state
describe('GameState serialization', () => {
  it('should serialize complete game state to URL-compatible string', () => {
    const gameState = createTestGameState();
    const serialized = serializeGameState(gameState);
    expect(serialized.length).toBeLessThan(2000); // URL limit
    expect(deserializeGameState(serialized)).toEqual(gameState);
  });
});
```

#### Game Rules Tests First
```typescript
// Example: Write test before implementing Texas 42 rules
describe('Texas 42 bidding', () => {
  it('should require minimum bid of 30', () => {
    const game = createNewGame();
    expect(() => placeBid(game, 'player1', 25)).toThrow('Minimum bid is 30');
    expect(placeBid(game, 'player1', 30)).toBeTruthy();
  });
});
```

### 10.3 TDD Tools and Scripts
- **`npm run tdd`**: Pure TDD mode with only test watchers
- **`npm run develop`**: Full development mode including tests
- **`npm test`**: Run all tests once (for CI/CD)
- **Test Coverage**: Vitest provides coverage reports for backend
- **E2E Coverage**: Playwright tests cover complete user workflows

## 11. Implementation Checklist

### Phase 1: Foundation (TDD Setup)
- [ ] Create root directory structure with game-specific folders
- [ ] Set up root `package.json` with workspaces and TDD scripts
- [ ] Create root `.env.example` with port configuration
- [ ] Create prerequisite checker script
- [ ] Create environment setup script
- [ ] Set up Docker compose files with environment variable support
- [ ] **Write first failing test** for basic project structure

### Phase 2: Frontend Scaffold (TDD Game Components)
- [ ] **Write failing tests** for domino component rendering
- [ ] Initialize Vite + React + TypeScript
- [ ] Configure Vite to use VITE_PORT environment variable
- [ ] Set up Playwright testing with configurable ports
- [ ] **Write failing tests** for game state serialization
- [ ] Implement game state management with URL compatibility
- [ ] **Write failing tests** for baseball diamond layout
- [ ] Create domino visual components
- [ ] **Write failing tests** for move validation
- [ ] Implement frontend move validation logic

### Phase 3: Backend Scaffold (TDD Game Engine)
- [ ] **Write failing tests** for Texas 42 game rules
- [ ] Initialize Fastify + TypeScript
- [ ] Configure server to use PORT environment variable
- [ ] Set up Vitest testing with coverage
- [ ] **Write failing tests** for game state serialization
- [ ] Implement game state serialization utilities
- [ ] **Write failing tests** for partnership logic
- [ ] Implement Texas 42 rules engine
- [ ] **Write failing tests** for scoring system
- [ ] Implement authentic Texas 42 scoring
- [ ] Create database connection with configurable host/port

### Phase 4: Integration & Game Flow (TDD End-to-End)
- [ ] **Write failing E2E tests** for complete game flow
- [ ] Test both development paths with custom ports
- [ ] Verify hot-reloading works on configured ports
- [ ] **Write failing tests** for game state URL serialization
- [ ] Implement complete game state URL compatibility
- [ ] **Write failing tests** for lobby/game state separation
- [ ] Test port conflict resolution
- [ ] **Write failing tests** for authentic Texas 42 gameplay
- [ ] Verify all Texas 42 rules work correctly
- [ ] Create initial documentation with port configuration guide
- [ ] **Ensure all tests pass** before considering phase complete

### Phase 5: Texas 42 Game Completion (TDD Polish)
- [ ] **Write failing tests** for edge cases in Texas 42 rules
- [ ] Handle all game edge cases and error conditions
- [ ] **Write failing tests** for performance requirements
- [ ] Optimize game state serialization for URL limits
- [ ] **Write failing tests** for accessibility features
- [ ] Implement keyboard navigation and screen reader support
- [ ] **All tests must pass** and documentation must be current

This scaffold plan ensures complete adherence to the design mandates while providing a solid foundation for rapid, **test-driven development** with **authentic Texas 42 implementation** and configurable ports to avoid common conflicts.
```
