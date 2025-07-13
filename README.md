# Texas 42 Web Game

[![CI/CD Pipeline](https://github.com/jasonyandell/vibe-texas-fourtytwo/actions/workflows/ci.yml/badge.svg)](https://github.com/jasonyandell/vibe-texas-fourtytwo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)

An authentic implementation of the Texas 42 domino game for the web. Built with modern technologies and following Test-Driven Development practices.

## 🎯 Quick Start

Get up and running in under 2 minutes:

```bash
# Clone the repository
git clone https://github.com/jasonyandell/vibe-texas-fourtytwo.git
cd vibe-texas-fourtytwo

# Install dependencies
npm install

# Start the full application (production-like)
npm start
```

That's it! The application will be available at:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:4201
- **Database**: PostgreSQL on port 5433

## 🛠️ Development Workflows

This project supports two official development paths:

### 1. Full Stack Development (`npm start`)
- Runs the complete application in Docker containers
- Production-like environment
- Includes database, backend, and frontend
- Best for integration testing and demos

### 2. Local Development (`npm run develop`)
- Database runs in Docker
- Backend and frontend run locally with hot-reloading
- Fast feedback loops
- Best for active development

### 3. Test-Driven Development (`npm run tdd`)
- Runs test watchers for both frontend and backend
- Pure TDD workflow
- No servers running, just tests
- Best for implementing new features

## 📋 Prerequisites

The setup script will check these automatically:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

## 🏗️ Project Structure

```
fourtytwo/
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── game/         # Game state management
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utilities
│   └── tests/            # E2E tests (Playwright)
├── backend/           # Fastify + TypeScript
│   ├── src/
│   │   ├── api/          # REST endpoints
│   │   ├── game/         # Game engine
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utilities
│   └── tests/            # Unit tests (Vitest)
├── docs/              # Documentation
├── scripts/           # Automation scripts
└── stories/           # Development stories
```

## 🎮 Texas 42 Game Features

### ✅ Implemented (Story 1: Core Domino Components)
- **Authentic Domino Visuals**: Real double-6 domino components with proper pip layouts
- **Interactive Dominoes**: Hover, selection, and face-up/face-down states
- **Baseball Diamond Layout**: Responsive 4-player positioning system
- **Domino Hand Display**: Traditional 2-row layout (4 top, 3 bottom centered)
- **Component Library**: Reusable UI primitives with Texas 42 styling
- **Responsive Design**: Mobile-friendly layouts with proper scaling
- **Accessibility**: ARIA labels, keyboard support, and screen reader compatibility

### 🚧 Planned Features
- **Authentic Rules**: Implements traditional Texas 42 domino game
- **4-Player Partnership**: North-South vs East-West teams
- **Real-time Multiplayer**: WebSocket-based gameplay
- **Bidding System**: Traditional 30-42 bidding with trump selection
- **Scoring**: Accurate Texas 42 scoring with count dominoes
- **Game State Serialization**: Complete game state is URL-serializable

## 🧪 Testing

### Run All Tests
```bash
npm run test:frontend    # Frontend unit tests
npm run test:backend     # Backend unit tests
npm run test:e2e         # End-to-end tests
```

### Test-Driven Development
```bash
npm run tdd              # Watch mode for all tests
npm run test:frontend:watch  # Frontend tests only
npm run test:backend:watch   # Backend tests only
```

## 🔧 Configuration

All configuration is environment-driven. Copy `.env.example` files to `.env` and customize:

### Port Configuration
- **Frontend**: 4200 (configurable via `FRONTEND_PORT`)
- **Backend**: 4201 (configurable via `BACKEND_PORT`)  
- **Database**: 5433 (configurable via `DATABASE_PORT`)

These ports are chosen to avoid common conflicts with other development tools.

### Environment Files
- **Root**: `.env` - Docker and orchestration settings
- **Frontend**: `frontend/.env` - React/Vite configuration
- **Backend**: `backend/.env` - Server and database configuration

## 🚀 Deployment

### Production Build
```bash
npm run build            # Build both frontend and backend
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only
```

### Docker Production
```bash
docker-compose up --build
```

## 🛠️ Development Commands

### Project Management
```bash
npm run check-prereqs    # Verify system requirements
npm run setup-env        # Create environment files
npm run cleanup          # Clean build artifacts
```

### Development Servers
```bash
npm run dev:frontend     # Frontend dev server only
npm run dev:backend      # Backend dev server only
```

### Database Management
```bash
npm run --workspace=backend db:migrate  # Run database migrations
npm run --workspace=backend db:seed     # Seed development data
```

## 📚 Documentation

- **[Developer Guide](docs/DEVELOPER.md)** - Detailed development setup
- **[Debugging Guide](docs/DEBUGGING.md)** - Common issues and solutions
- **[Design Document](docs/design.md)** - Architecture and design decisions
- **[Technology Scaffold](docs/technology_scaffold.md)** - Technical implementation details

## 🤝 Contributing

1. Follow the Test-Driven Development workflow
2. All tests must pass before submitting changes
3. Use the provided development workflows
4. Refer to the design document for architectural decisions

## 📄 License

MIT License - see LICENSE file for details

## 🎲 About Texas 42

Texas 42 is the official domino game of Texas. It's a trick-taking game played with a double-six domino set by four players in partnerships. This implementation follows authentic Texas 42 rules and scoring.

---

**Need Help?** Check the [Developer Guide](docs/DEVELOPER.md) or [Debugging Guide](docs/DEBUGGING.md)
