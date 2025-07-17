# Demo Plan Phase 3: Players & Partnerships

## Prerequisites
**CRITICAL**: Read and understand all documentation in @docs/ before starting:
- `@docs/design.md` - TDD methodology and component architecture
- `@docs/initial_layout.md` - Baseball diamond layout requirements
- `@stories/demo-plan-0.md` - Overview of demo showcase requirements
- Study existing `GameBoard.tsx` player positioning

**Dependency**: Phase 2 (Dominoes Showcase) must be complete with all tests passing.

## Goal
Create the baseball diamond player layout with partnership visualization and interactive player management features.

## What to Build
- Baseball diamond layout with 4 player positions (North, East, South, West)
- Partnership highlighting system (North-South vs East-West teams)
- Player cards showing names, positions, and status indicators
- Hand visibility controls and dealer indicators
- Interactive partnership selection and highlighting

## Key Features
- **Baseball Diamond Layout**: Authentic 4-player positioning around diamond
- **Partnership Colors**: Visual distinction between North-South and East-West teams
- **Player Status Indicators**: Dealer badge, ready status, current turn indicators
- **Hand Visibility Toggle**: Show/hide player hands with face-down option
- **Partnership Highlighting**: Click player to highlight their partnership
- **Sample Player Data**: Mock players with realistic names and positions

## Success Criteria
- All 4 player positions display correctly in diamond formation
- Partnership highlighting works (click North highlights North-South)
- Player status indicators display properly (dealer, ready, current turn)
- Hand visibility toggle shows/hides domino hands
- Responsive layout works on mobile devices
- Partnership colors are visually distinct and accessible
- All Playwright tests pass

## TDD Approach
1. Write failing tests for player positioning and partnership highlighting
2. Create `PlayersSection` component with baseball diamond layout
3. Add interactive partnership selection and status indicators
4. Polish styling and accessibility

## Key Components to Create
- `PlayersSection` - Main section component
- `PlayerCard` - Individual player display component
- CSS module for diamond layout and partnership styling
- Integration with existing player types and positioning logic

## Testing Focus
- Baseball diamond layout positioning
- Partnership highlighting interactions
- Player status indicator display
- Hand visibility controls
- Responsive diamond layout
- Accessibility for partnership relationships

This phase creates the foundation for understanding Texas 42's partnership-based gameplay structure.
