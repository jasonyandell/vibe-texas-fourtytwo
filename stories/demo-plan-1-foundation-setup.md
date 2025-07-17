# Demo Plan Phase 1: Foundation & Setup

## Prerequisites
**CRITICAL**: Read and understand all documentation in @docs/ before starting:
- `@docs/design.md` - TDD requirements and architecture principles
- `@docs/DEVELOPER.md` - Development workflows
- `@docs/technology_scaffold.md` - Project structure and patterns
- `@stories/demo-plan-0.md` - Overview of demo showcase requirements

## Goal
Create the basic demo page structure with navigation between sections.

## What to Build
- Demo route at `/demo` and `/demo/:section`
- Navigation tabs for 5 sections: Dominoes, Players, Bidding, Board, Flow
- Basic responsive layout grid
- Section routing that updates URL and highlights active tab

## Success Criteria
- Navigation works between all 5 sections
- URL updates correctly when clicking tabs
- Direct links to sections work (e.g., `/demo/dominoes`)
- Responsive layout on mobile and desktop
- All Playwright tests pass

## TDD Approach
1. Write failing tests for navigation and routing
2. Create minimal components to make tests pass
3. Add styling and polish while keeping tests green

## Key Components to Create
- `DemoShowcase` - Main container component
- `DemoNavigation` - Tab navigation component
- Basic CSS modules for layout and styling

## Testing Focus
- Route loading and navigation
- Tab highlighting and URL updates
- Responsive layout behavior
- Accessibility (keyboard navigation, ARIA labels)

This foundation enables all subsequent phases to build individual sections within the established navigation structure.
