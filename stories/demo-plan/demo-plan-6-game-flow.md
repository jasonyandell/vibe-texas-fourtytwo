# Demo Plan Phase 6: Game Flow States

## Prerequisites
**CRITICAL**: Read and understand all documentation in @docs/ before starting:
- `@docs/design.md` - TDD methodology and component architecture
- `@docs/initial_layout.md` - Lobby and game management requirements
- `@stories/demo-plan-0.md` - Overview of demo showcase requirements
- Study existing `Lobby.tsx` and game state management

**Dependency**: Phase 5 (Game Board) must be complete with all tests passing.

## Goal
Demonstrate the complete game flow from lobby to finished game with interactive state transitions and player management.

## What to Build
- Lobby game cards showing different game states (waiting, playing, finished)
- Player management interface with join/leave/ready system
- Game creation modal and form
- Spectator mode demonstration
- Game state transitions and status indicators

## Key Features
- **Lobby Game Cards**: Sample games in various states with player counts
- **Player Management**: Join/leave slots and ready system visualization
- **Game Creation**: Modal form for creating new games
- **Spectator Mode**: View-only game state demonstration
- **State Transitions**: Show progression from lobby to playing to finished
- **Status Indicators**: Clear visual feedback for game and player states

## Success Criteria
- Lobby displays multiple game cards with different statuses
- Player management shows join/leave and ready functionality
- Game creation modal works with form validation
- Spectator mode demonstrates view-only access
- Game state transitions are clear and intuitive
- Status indicators provide helpful feedback
- All Playwright tests pass

## TDD Approach
1. Write failing tests for lobby display and player management
2. Create `GameFlowSection` component with lobby and state demos
3. Add interactive player management and game creation
4. Polish state transition animations and feedback

## Key Components to Create
- `GameFlowSection` - Main section component
- `LobbyDemo` - Game cards and lobby interface
- `PlayerManagementDemo` - Join/leave/ready system
- `GameCreationDemo` - Game creation modal
- CSS module for lobby layout and state indicators

## Testing Focus
- Lobby game card display
- Player management interactions
- Game creation form validation
- Spectator mode functionality
- State transition clarity
- Responsive lobby layout
- Accessibility for game status information

This phase completes the demo by showing how players interact with the game system from start to finish.
