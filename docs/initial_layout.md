# Texas 42 Web Game

A minimalist, elegant, real-time web implementation of the classic Texas 42 domino game. Built with a modern full-stack TypeScript architecture, optimized for clarity, testability, and deployment at scale.

---

## 🧱 Tech Stack

### Frontend
- Vite + React + TypeScript
- Real double-6 domino visuals
- Clean, responsive UI with baseball diamond layout
- Playwright for end-to-end testing

### Backend
- Node.js + Fastify + TypeScript
- REST API endpoints for game actions
- Core game logic: turn flow, trick validation, scorekeeping
- Vitest for unit testing

### Dev & Infra
- Docker + Docker Compose for local development
- PostgreSQL (RDS) for persistent state
- AWS Fargate (ECS) for deployment
- AWS CDK for infrastructure-as-code

---

## 🧪 Testing Requirements

✅ Unit tests (Vitest) for game logic  
✅ End-to-end tests (Playwright) for full game flow  
❗ All changes must pass tests before merge or deploy

---

## 🎮 Gameplay Flow

### Lobby View
- Sidebar shows all active lobbies
- Each game card displays:
  - Score
  - Game status (waiting / in progress)
  - 4 fixed player slots (with names or empty)
- Click a slot to join or leave ("stand up")
- Spectate any game anytime
- Game starts when 4 players click “Ready”

### In-Game View
#### Layout
- Players seated around a baseball diamond (N, E, S, W)
- Player cards with name + color
- Domino hands:
  - 7 dominoes in 2 rows (4 top, 3 bottom centered)
  - Hidden unless you’re the player or a spectator
  - Gaps appear where dominoes have been played

#### Current Trick
- Center screen ("pitcher's mound")
- Up to 4 dominoes played left-to-right
- Emphasized and re-centered dynamically

#### Caught Trick Stacks
- Top-left: player + partner tricks
- Top-right: opponent team tricks
- Each trick = 4 vertical dominoes
- Tricks stack top-down

---

## 🪜 Roadmap
- Social login support (OAuth)
- Real-time WebSocket game updates
- Persistent user accounts
- Match history and game replays
