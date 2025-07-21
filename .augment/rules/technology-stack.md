# Technology Stack & Architecture Guidelines

## Frontend Stack
- **Framework**: Vite + React + TypeScript
- **UI Features**:
  - Real double-6 domino visuals
  - Clean, responsive UI with baseball diamond layout
  - Hot-reloading development server
- **Testing**: Playwright for end-to-end testing
- **Package Scripts**:
  - `dev`: Starts Vite development server
  - `build`: Builds production-ready application
  - `test`: Runs Playwright tests
  - `test:watch`: Runs tests in watch mode

## Backend Stack
- **Framework**: Node.js + Fastify + TypeScript
- **Features**:
  - REST API endpoints for game actions
  - Core game logic: turn flow, trick validation, scorekeeping
  - Hot-reloading development server
- **Testing**: Vitest for unit testing
- **Package Scripts**:
  - `dev`: Starts Fastify development server with hot-reloading
  - `build`: Compiles TypeScript to JavaScript
  - `start`: Runs compiled JavaScript
  - `test`: Runs Vitest tests
  - `test:watch`: Runs tests in watch mode

## Database & Infrastructure
- **Database**: PostgreSQL
  - **Development**: Runs in Docker via docker-compose
  - **Production**: AWS RDS or compatible service
- **Containerization**: Docker + Docker Compose for local development
- **Deployment**: AWS Fargate (ECS) for production
- **Infrastructure**: AWS CDK for infrastructure-as-code

## Development Tools
- **Monorepo**: npm workspaces for managing frontend/backend
- **Process Management**: concurrently for orchestrating multiple development processes
- **Environment**: .env files for configuration management

## Game State Architecture
- **Complete Serialization**: All game state must be serializable to a single compact string
- **URL-Compatible**: Serialized state must be small enough for GET parameters
- **JSON Deserializable**: Must deserialize back to simple JSON
- **Self-Contained**: Game state is separate from lobby state and knows only about the game

## Separation of Concerns
- **Lobby State**: Separate from game state, handles player joining/leaving
- **Game State**: Only contains information about current game in progress
- **Clear Boundaries**: Each component has well-defined responsibilities

## AI Assistant Guidelines for Technology Choices
- Always use the specified technology stack (Vite+React+TypeScript, Fastify+Node.js)
- Ensure hot-reloading is preserved and enhanced
- Use npm workspaces for monorepo management
- Use concurrently for process orchestration
- Maintain clear separation between game state and lobby state
- Ensure game state is always serializable and URL-compatible
- Use PostgreSQL for data persistence, Docker for local development
