# Demo Plan Phase 2: Dominoes Showcase

## Prerequisites
**CRITICAL**: Read and understand all documentation in @docs/ before starting:
- `@docs/design.md` - TDD methodology and component architecture
- `@docs/rules/core-mechanics-summary.md` - Authentic Texas 42 domino rules
- `@stories/demo-plan-0.md` - Overview of demo showcase requirements
- Study existing `DominoComponent.tsx` and `texas42.ts` types

**Dependency**: Phase 1 (Foundation & Setup) must be complete with all tests passing.

## Goal
Display all 28 dominoes from the double-6 set with interactive features for exploring point values and visual properties.

## What to Build
- Complete domino grid showing all 28 dominoes (0-0 through 6-6)
- Toggle controls for point values, count domino highlighting, and orientation
- Click interactions to select/deselect individual dominoes
- Responsive grid layout that works on mobile and desktop

## Key Features
- **Point Value Display**: Show/hide the 5 scoring dominoes (5-point and 10-point)
- **Count Domino Highlighting**: Visual emphasis on dominoes worth points
- **Orientation Toggle**: Switch between horizontal and vertical domino display
- **Selection System**: Click dominoes to select them, with visual feedback
- **Side-by-side Layout**: Controls on left, dominoes grid on right for optimal space usage

## Success Criteria
- All 28 dominoes render correctly using existing `DominoComponent`
- Point value toggle shows exactly 5 scoring dominoes with correct values
- Count domino highlighting works for all point-bearing dominoes
- Domino selection/deselection works with visual feedback
- Orientation toggle switches all dominoes between horizontal/vertical
- Grid layout is responsive and works on mobile devices
- All Playwright tests pass

## TDD Approach
1. Write failing tests for domino grid display and interactions
2. Create `DominoesSection` component using existing domino types
3. Add interactive controls and state management
4. Polish styling and accessibility

## Key Components to Create
- `DominoesSection` - Main section component
- CSS module for grid layout and controls
- Integration with existing `DominoComponent` and domino factory functions

## Testing Focus
- All 28 dominoes display correctly
- Interactive controls work (toggles, selection)
- Point value calculations are accurate
- Responsive grid behavior
- Accessibility for screen readers

This phase leverages existing domino infrastructure while creating an interactive showcase for exploring the complete domino set.

## ✅ PHASE 2 COMPLETE

**Implementation Status**: ✅ COMPLETE
- All 28 dominoes display correctly in responsive grid
- Interactive controls working (point values, highlighting, orientation)
- Selection system with visual feedback implemented
- Side-by-side layout with controls on left, dominoes on right
- Full keyboard accessibility and screen reader support
- 17/17 Playwright tests passing
- Mobile responsive design implemented

**Demo URL**: `http://localhost:3000/demo/dominoes`

**Key Components Created**:
- `DominoesSection.tsx` - Main showcase component
- `DominoesSection.module.css` - Responsive grid and control styling
- Comprehensive test suites (unit + e2e)

The dominoes showcase provides an excellent interactive way to explore the complete Texas 42 domino set with all required features successfully implemented.
