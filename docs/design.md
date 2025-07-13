# Design Document: Texas 42 Web Game

This document serves as the single source of truth for all design decisions, principles, and guidelines for the Texas 42 web game project. It consolidates all design mandates, architecture decisions, and development practices into one authoritative reference.

---

## Table of Contents

1. [Core Philosophy & Principles](#1-core-philosophy--principles)
2. [Developer Experience & Workflows](#2-developer-experience--workflows)
3. [Development Practices](#3-development-practices)
4. [Application Architecture](#4-application-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Component Architecture](#6-component-architecture)
7. [Product Requirements](#7-product-requirements)
8. [Documentation Standards](#8-documentation-standards)

---

## 1. Core Philosophy & Principles

### 1.1 Simplicity First
- **CRITICAL**: Always prioritize simplicity and reduce cognitive load on developers
- **Do not reinvent the wheel**: Use standard, idiomatic tools and patterns
  - Example: Use npm for package management, not custom solutions
- **Prefer clear, simple solutions** over complex, clever ones
- **Standard tools over custom tools**: Use modern, popular, well-established tools

### 1.2 Developer-First Approach
- **Superior Developer Experience (DX)** is the central goal
- **Low-friction development process** with fast feedback loops
- **Clear error messages** and helpful debugging information
- **Minimal setup** - clone and run with a single command
- **Hot-reloading** is essential and must be respected, supported, and nurtured

### 1.3 Configuration Management
- **No Hard-Coded Configuration**: All configuration must be externalized
- **Use .env files** for environment-specific variables (ports, secrets, database URLs)
- **Use JSON files** for other application configuration
- **All settings read from outside the code** - never hardcoded values
- **Configuration is critical** to project success and must be handled properly

---

## 2. Developer Experience & Workflows

### 2.1 Clone and Go Philosophy
A new developer must be able to clone the repository and have the application running with a single command. The project provides two clear, supported paths orchestrated by npm scripts in the root package.json.

### 2.2 The Two Official Paths

#### 2.2.1 Run Path (`npm start`)
- **Purpose**: Production-like experience for seeing the final product
- **Mechanism**: Uses docker-compose to build and run the entire application stack (frontend, backend, database) in containers
- **Use Cases**: 
  - New contributors who want to see the app working
  - CI/CD environments
  - Product managers or stakeholders
  - Anyone needing to run the app without a development setup
- **Command**: `npm start`
- **Implementation**: Executes `docker-compose up --build`

#### 2.2.2 Develop Path (`npm run develop`)
- **Purpose**: High-velocity development with instant feedback
- **Mechanism**: Uses concurrently to orchestrate multiple processes:
  1. **Backing Services**: PostgreSQL runs in Docker
  2. **App Code**: Frontend and backend run natively on host for fastest hot-reloading
  3. **Tests**: Both frontend and backend test suites run in watch mode
- **Use Cases**: Day-to-day development and active coding
- **Command**: `npm run develop`

### 2.3 Automated Environment Setup

#### 2.3.1 Prerequisite Checks
Before either startup script executes, it must run prerequisite verification:
- **Verify installation** of Node.js, npm, and Docker
- **Never install system-level software** without explicit user consent
- **Provide clear installation instructions** if tools are missing
- **Windows Enhancement**: On Windows, offer guided installation via Chocolatey with user permission

#### 2.3.2 Environment File Management
- **Template Files**: Every service requiring environment variables must have a `.env.example` file
- **Automated Creation**: Startup scripts check for `.env` files and create them from templates if missing
- **Preserve Existing**: Never overwrite existing `.env` files to preserve developer customizations
- **Sensible Defaults**: `.env.example` files must contain non-secret defaults suitable for local development

### 2.4 Script Design Philosophy
- **Modularity**: Scripts must be short with single, clear purposes
- **Orchestration**: Prefer scripts that call other scripts over monolithic scripts
- **Readability**: Well-commented where necessary, but clarity comes from small scope and descriptive names
- **Root Directory**: All primary startup commands must be in root package.json

---

## 3. Development Practices

### 3.1 Test-Driven Development (TDD)
- **Mandatory**: TDD is strictly adhered to for ALL changes
- **Red-Green-Refactor cycle**: 
  1. Write failing test first
  2. Write minimal code to make test pass
  3. Refactor while keeping tests green
- **Test-first approach**: All test code must be written before implementation code
- **Complete only when**: All tests are green AND all documentation is updated

### 3.2 Testing Requirements
- **Complete Coverage**: The entire system must be testable by automated tests
- **Fast Execution**: Tests must be FAST - speed is critical for feedback loops
- **Watch Mode**: Tests run continuously in watch mode during development
- **Types of Tests**:
  - **Unit Tests**: Vitest for backend game logic
  - **End-to-End Tests**: Playwright for full game flow
  - **All changes must pass tests** before merge or deploy

### 3.3 Continuous Deployment Mindset
- **Assume every commit goes to production**
- **Plan for continuous deployment** even if not always practiced

### 3.4 Hot-Reloading
- **Essential for development velocity**
- **Must be supported and nurtured** in all development workflows
- **Instant feedback** on code changes is critical

---

## 4. Application Architecture

### 4.1 Game State Management
- **Complete Serialization**: All game state must be serializable to a single compact string
- **URL-Compatible**: Serialized state must be small enough for GET parameters
- **JSON Deserializable**: Must deserialize back to simple JSON
- **Self-Contained**: Game state is separate from lobby state and knows only about the game

#### 4.1.1 Game State Components
Game state includes but is not limited to:
- **Player Information**: Who has which dominoes, who bid what
- **Partnerships**: Partners always sit across from each other
- **Trick History**: For each partnership, what tricks caught and who played what
- **Turn Management**: Whose turn it is currently
- **Scoring**: Current game score and trick score (points earned by tricks)
- **Game Flow**: Who shuffled last

### 4.2 Separation of Concerns
- **Lobby State**: Separate from game state, handles player joining/leaving
- **Game State**: Only contains information about current game in progress
- **Clear Boundaries**: Each component has well-defined responsibilities

---

## 5. Technology Stack

### 5.1 Frontend
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

### 5.2 Backend
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

### 5.3 Database & Infrastructure
- **Database**: PostgreSQL
  - **Development**: Runs in Docker via docker-compose
  - **Production**: AWS RDS or compatible service
- **Containerization**: Docker + Docker Compose for local development
- **Deployment**: AWS Fargate (ECS) for production
- **Infrastructure**: AWS CDK for infrastructure-as-code

### 5.4 Development Tools
- **Monorepo**: npm workspaces for managing frontend/backend
- **Process Management**: concurrently for orchestrating multiple development processes
- **Environment**: .env files for configuration management

---

## 8. Documentation Standards

### 8.1 Documentation Philosophy
- **Always Up-to-Date**: Documentation is not an afterthought but a core part of development
- **Living Documents**: Documentation must be updated as part of every change
- **Task Not Complete**: Until all tests pass AND documentation is updated

### 8.2 Required Documentation

#### 8.2.1 README.md
- **Purpose**: The front door to the project
- **Requirements**: Must always be accurate and current
- **Content**: Project overview, quick start, basic usage

#### 8.2.2 docs/DEVELOPER.md
- **Purpose**: Information developers need to contribute
- **Style**: High-level, concrete, and CONCISE
- **Content**:
  - Common development workflows with illustrative examples
  - Technology-specific documentation only when framework acts in surprising ways
  - Setup and configuration details

#### 8.2.3 docs/DEBUGGING.md
- **Purpose**: Living document of common issues and resolutions
- **Maintenance**: ALWAYS add unexpected errors encountered during development
- **Content**:
  - Common issues and their solutions
  - Troubleshooting steps
  - Known limitations and workarounds

### 8.3 Documentation Maintenance
- **Update During Refactoring**: Documentation updates are part of the refactor phase in TDD
- **Include in Definition of Done**: Changes are not complete until documentation reflects them
- **Accuracy Over Completeness**: Better to have accurate, minimal docs than comprehensive but outdated ones

---

## Conclusion

This design document represents the consolidated wisdom and decisions from the project's design evolution. It serves as the authoritative reference for all design decisions, development practices, and architectural choices.

**Key Principles to Remember**:
1. **Simplicity First** - Always choose the simpler solution
2. **Developer Experience** - Optimize for developer productivity and happiness
3. **Test-Driven Development** - Red-Green-Refactor for all changes
4. **Documentation** - Keep it current and accurate

All team members should refer to this document when making design decisions, and it should be updated whenever new design decisions are made or existing ones are modified.
