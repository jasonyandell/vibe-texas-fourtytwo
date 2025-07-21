# Demo Plan Phase 5: Game Board Elements

## Prerequisites
**CRITICAL**: Read and understand all documentation in @docs/ before starting:
- `@docs/design.md` - TDD methodology and component architecture
- `@docs/initial_layout.md` - Game board layout requirements
- `@stories/demo-plan-0.md` - Overview of demo showcase requirements
- Study existing `GameBoard.tsx` center play area and trick stacks

**Dependency**: Phase 4 (Bidding System) must be complete with all tests passing.

## Goal
Display the core game board elements including center play area, trick stacks, and scoring displays with interactive demonstrations.

## What to Build
- Center play area ("pitcher's mound") with sample current trick
- Trick stacks for both partnerships showing captured tricks
- Score displays for current hand and overall game scores
- Interactive trick cycling to show different trick examples
- Game phase indicators and status displays

## Key Features
- **Center Play Area**: Display of current trick with 4 dominoes played
- **Trick Stacks**: Visual stacks of captured tricks for each partnership
- **Score Displays**: Current hand scores and overall game scores
- **Trick Cycling**: Click to cycle through different trick examples
- **Game Status**: Phase indicators (bidding, playing, scoring, finished)
- **Partnership Scores**: Clear display of North-South vs East-West scores

## Success Criteria
- Center play area displays current trick with proper domino positioning
- Trick stacks show captured tricks for both partnerships
- Score displays show accurate point totals and game scores
- Trick cycling demonstrates different trick scenarios
- Game phase indicators work correctly
- Partnership score displays are clear and accessible
- All Playwright tests pass

## TDD Approach
1. Write failing tests for center play area and trick displays
2. Create `GameBoardSection` component with trick and scoring elements
3. Add interactive trick cycling and score displays
4. Polish layout and visual hierarchy

## Key Components to Create
- `GameBoardSection` - Main section component
- `CenterPlayArea` - Current trick display
- `TrickStacks` - Partnership trick stack displays
- `ScoreDisplay` - Score and game status component
- CSS module for game board layout and trick visualization

## Testing Focus
- Center play area trick display
- Trick stack visualization
- Score display accuracy
- Trick cycling interactions
- Game phase indicators
- Responsive game board layout
- Accessibility for score information

This phase showcases the active gameplay elements where tricks are played and scored in Texas 42.
