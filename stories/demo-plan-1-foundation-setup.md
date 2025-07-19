# Demo Plan Phase 1: Foundation & Setup

## Prerequisites
**CRITICAL**: Read and understand all documentation in @docs/ before starting:
- `@docs/design.md` - TDD requirements and architecture principles
- `@docs/DEVELOPER.md` - Development workflows
- `@docs/technology_scaffold.md` - Project structure and patterns
- `@stories/demo-plan-0.md` - Overview of demo showcase requirements

## Goal
Create the basic demo page structure with navigation between sections as a completely isolated showcase that does not interfere with the main game application.

## Isolation Requirements
**CRITICAL**: The demo must be completely self-contained:
- Demo components should be separate from main game components
- Demo routes should not conflict with game routes
- Demo styling should not affect main application styling
- Demo state should be independent of game state
- Demo should work even if main game features are broken or incomplete

## What to Build
- Demo route at `/demo` and `/demo/:section`
- Navigation tabs for 5 sections: Dominoes, Players, Bidding, Board, Flow
- Basic responsive layout grid with mobile-first approach
- Section routing that updates URL and highlights active tab
- Comprehensive data-testid strategy for reliable testing

## Success Criteria
- Navigation works between all 5 sections with smooth transitions
- URL updates correctly when clicking tabs and supports browser back/forward
- Direct links to sections work (e.g., `/demo/dominoes`) and maintain state
- Responsive layout adapts gracefully on mobile, tablet, and desktop
- All Playwright tests pass across multiple browsers and devices
- Comprehensive accessibility compliance (WCAG 2.1 AA)
- Complete isolation from main application functionality

## TDD Approach
1. Write comprehensive failing tests with extensive data-testid coverage
2. Create minimal components to make tests pass
3. Implement accessibility features and ARIA compliance
4. Add responsive styling and visual polish while keeping tests green
5. Verify cross-browser compatibility and performance

## Data-TestId Strategy
**CRITICAL**: Implement comprehensive data-testid attributes following these principles:
- **Hierarchical naming**: Use consistent patterns like `demo-{component}-{element}-{modifier}`
- **Semantic descriptors**: Names should clearly indicate what the element is and does
- **State indicators**: Include state information in testids or data attributes
- **Component isolation**: Each demo component should have its own testid namespace
- **Action specificity**: Interactive elements should indicate their purpose

### Naming Conventions
- Container level: `demo-showcase`, `demo-navigation`
- Section level: `demo-section-{name}`, `demo-section-{name}-header`
- Navigation: `demo-nav-tab-{section}`, `demo-nav-indicator-{section}`
- Interactive: `demo-{component}-{action}-button`, `demo-{component}-toggle`
- States: Use data attributes like `data-state="active"` or `data-loading="true"`

## Key Components to Create
- `DemoShowcase` - Main container with proper semantic structure
- `DemoNavigation` - Tab navigation with keyboard support and state management
- `DemoSection` - Reusable section wrapper with consistent styling
- CSS modules with responsive design and accessibility considerations

## Testing Focus
- **Navigation flow**: Route loading, tab switching, URL synchronization
- **Accessibility compliance**: Keyboard navigation, screen reader support, ARIA labels
- **Responsive behavior**: Mobile-first design, tablet breakpoints, desktop optimization
- **State management**: Active tab highlighting, section visibility, browser history
- **Error handling**: Invalid routes, missing sections, network failures
- **Performance**: Load times, animation smoothness, memory usage

## Accessibility Requirements
- Skip links for keyboard navigation
- Proper heading hierarchy (h1 > h2 > h3)
- ARIA landmarks and labels for all interactive elements
- Focus management and visible focus indicators
- High contrast mode support
- Reduced motion preferences
- Screen reader announcements for dynamic content

## Browser Compatibility
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile Safari and Chrome on iOS/Android
- Keyboard navigation support across all browsers
- Touch interaction support for mobile devices

This foundation enables all subsequent phases to build individual sections within the established navigation structure while maintaining complete isolation from the main application.
