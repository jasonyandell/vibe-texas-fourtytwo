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

### Component Library

The frontend includes a comprehensive component library with authentic Texas 42 domino visuals:

#### Core Game Components

- **DominoComponent**: Renders individual dominoes with authentic double-6 visual design
  - Supports all 28 domino combinations (0-0 through 6-6)
  - Face-up/face-down states with proper pip layouts
  - Hover, selection, and interactive states
  - Horizontal/vertical orientations
  - Responsive scaling and accessibility features

- **DominoHand**: Displays 7 dominoes in traditional 2-row layout
  - 4 dominoes on top row, 3 on bottom (centered)
  - Supports gaps where dominoes have been played
  - Responsive design for different screen sizes
  - Interactive domino selection and click handling

- **GameBoard**: Baseball diamond layout for 4-player Texas 42
  - Responsive positioning system for North/East/South/West players
  - Center area for current trick display
  - Score tracking and game state visualization
  - Mobile-friendly responsive design

#### UI Primitives

- **Button**: Configurable button component with variants (primary, secondary, danger, ghost)
- **Card**: Flexible card container with header, content, and footer sections
- **CSS Modules**: Scoped styling with authentic Texas 42 color palette

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

## 🧩 Component Usage Guide

### DominoComponent

Basic domino rendering with authentic Texas 42 styling:

```tsx
import { DominoComponent } from '@/components/DominoComponent';

// Basic domino
<DominoComponent domino={{ id: '1', high: 6, low: 3 }} />

// Interactive domino with states
<DominoComponent
  domino={{ id: '2', high: 4, low: 4 }}
  isPlayable={true}
  selected={true}
  onClick={() => handleDominoClick(domino)}
  orientation="vertical"
/>

// Face-down domino (for opponents)
<DominoComponent
  domino={{ id: '3', high: 2, low: 1 }}
  faceDown={true}
/>
```

### DominoHand

Display a player's hand of dominoes:

```tsx
import { DominoHand } from '@/components/DominoHand';

// Player's hand (face-up, interactive)
<DominoHand
  dominoes={playerDominoes}
  onDominoClick={handleDominoPlay}
  playableDominoes={validMoves}
  selectedDomino={selectedDomino}
/>

// Opponent's hand (face-down)
<DominoHand
  dominoes={opponentDominoes}
  faceDown={true}
/>

// Hand with gaps (played dominoes)
<DominoHand
  dominoes={[domino1, null, domino3, domino4, null, domino6, domino7]}
/>
```

### GameBoard

Main game interface with baseball diamond layout:

```tsx
import { GameBoard } from '@/components/GameBoard';

<GameBoard
  gameState={currentGameState}
  currentPlayerId={userId}
  onDominoPlay={handleDominoPlay}
/>
```

### UI Components

```tsx
import { Button, Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

// Buttons with variants
<Button variant="primary" size="large" onClick={handleAction}>
  Primary Action
</Button>

<Button variant="secondary" loading={isLoading}>
  Secondary Action
</Button>

// Cards for game information
<Card variant="elevated">
  <CardHeader>Game Information</CardHeader>
  <CardContent>
    <p>Current phase: {gameState.phase}</p>
    <p>Trump: {gameState.trump}</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Close</Button>
  </CardFooter>
</Card>
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

## 🤖 Automated Workflow Management

### GitHub Project Integration

The project uses dynamic GitHub Project board integration for automated issue management:

```powershell
# Query current project state (Windows-compatible)
$projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json

# Filter and sort issues by priority
$workableIssues = $projectData.items | Where-Object {
    $_.labels -contains "e2e-tests" -and
    $_.status -in @("Backlog", "In Progress")
} | Select-Object @{Name='Number';Expression={$_.content.number}},
                  @{Name='Title';Expression={$_.title}},
                  @{Name='Priority';Expression={
                      switch -Regex ($_.labels -join ' ') {
                          'priority-1-critical' { 1 }
                          'priority-2-high' { 2 }
                          'priority-3-medium' { 3 }
                          'priority-4-low' { 4 }
                          'priority-5-later' { 5 }
                          default { 6 }
                      }
                  }} | Sort-Object Priority, Number
```

### Windows PowerShell Compatibility

All project automation scripts are Windows-compatible. Key patterns:

#### Branch Detection
```powershell
# Method 1: git branch --list (preferred)
$branchExists = git branch --list "*fix-e2e-$issueNumber*"

# Method 2: Select-String (alternative to grep)
$branchExists = git branch -a | Select-String "fix-e2e-$issueNumber"
```

#### JSON Processing
```powershell
# GitHub CLI with PowerShell JSON parsing
$prs = gh pr list --state open --json number,title,reviewDecision,mergeable | ConvertFrom-Json
```

### Priority-Based Issue Management

Issues are automatically sorted by priority labels:
- `priority-1-critical` → Highest priority (1)
- `priority-2-high` → High priority (2)
- `priority-3-medium` → Medium priority (3)
- `priority-4-low` → Low priority (4)
- `priority-5-later` → Lowest priority (5)

### Automated Workflow Scripts

Located in `docs/prompts/` and `docs/testing/`:
- **E2E Workflow Prompts**: Dynamic, project-aware automation
- **Test Validation Scripts**: Framework verification tools
- **Windows-Compatible Commands**: All scripts work on Windows PowerShell

## 📚 Additional Resources

- **[Design Document](design.md)**: Architecture decisions
- **[Technology Scaffold](technology_scaffold.md)**: Implementation details
- **[Debugging Guide](DEBUGGING.md)**: Troubleshooting help
- **[E2E Workflow Test Results](testing/e2e-workflow-test-results.md)**: Automation framework validation
- **[Texas 42 Rules](https://en.wikipedia.org/wiki/42_(dominoes))**: Game rules reference
