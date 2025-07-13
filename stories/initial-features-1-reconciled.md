# Story: Core Domino Components and Visual Foundation (Rules-Reconciled)

## Overview
Create the fundamental domino visual components and basic game layout structure that will serve as the foundation for all other game features. This story focuses on authentic Texas 42 domino representation with **complete point value system** and the core visual building blocks.

**🔄 Rules Integration**: This story has been updated to incorporate findings from rules-research-1 (Equipment and Setup) and rules-research-2 (Domino Point Values).

## User Story
**As a player**, I want to see authentic-looking double-6 dominoes with proper visual representation and point values so that the game feels familiar and true to traditional Texas 42.

## Acceptance Criteria

### ✅ Authentic Domino Representation (Enhanced)
- [ ] Create visual components for all 28 double-6 dominoes
- [ ] **NEW**: Display point values for count dominoes (5-0, 4-1, 3-2, 6-4, 5-5)
- [ ] **NEW**: Visual indicators for count dominoes vs regular dominoes
- [ ] Support multiple domino states (face-up, face-down, selected, playable, disabled)
- [ ] Implement proper pip arrangements for each domino combination
- [ ] **NEW**: Validate total point system equals 42 (7 tricks + 35 count points)
- [ ] Add hover and selection animations
- [ ] Ensure accessibility with proper ARIA labels and keyboard navigation

### ✅ Enhanced Domino Data Model
- [ ] **NEW**: Implement complete Domino interface with point values
```typescript
interface Domino {
  high: number;        // 0-6
  low: number;         // 0-6
  id: string;          // unique identifier
  pointValue: number;  // 0, 5, or 10 points
  isCountDomino: boolean; // true for scoring dominoes
}
```
- [ ] **NEW**: Create point value calculation utilities
- [ ] **NEW**: Implement count domino identification logic
- [ ] **NEW**: Add domino factory functions with validation

### ✅ Basic Layout Structure
- [ ] Create main game container with responsive design
- [ ] Implement baseball diamond positioning system
- [ ] Create player position containers (North, East, South, West)
- [ ] Add center area for current trick display
- [ ] **NEW**: Add score display areas for partnerships
- [ ] **NEW**: Add trump suit indicator area
- [ ] Implement basic responsive breakpoints
- [ ] Create CSS grid/flexbox foundation for game layout

### ✅ Component Library Foundation
- [ ] Set up component directory structure
- [ ] Create shared styling system (CSS modules or styled-components)
- [ ] Implement basic color scheme and typography
- [ ] **NEW**: Add point value styling for count dominoes
- [ ] Create reusable UI primitives (buttons, cards, containers)
- [ ] Add proper TypeScript interfaces for all components
- [ ] Set up component testing infrastructure

## Rules Integration Details

### From Rules-Research-1 (Equipment and Setup)
- **Complete Double-6 Set**: All 28 dominoes properly represented
- **Partnership Layout**: North-South vs East-West arrangement
- **Visual Standards**: Authentic domino appearance matching traditional sets

### From Rules-Research-2 (Domino Point Values)
- **Count Dominoes**: 5-0, 4-1, 3-2 (5 points each), 6-4, 5-5 (10 points each)
- **Point Validation**: Total available points = 42 (7 tricks + 35 count points)
- **Visual Distinction**: Count dominoes should be visually distinguishable

## Technical Requirements

### Enhanced Domino Component
```typescript
interface DominoProps {
  domino: Domino;
  faceDown?: boolean;
  selected?: boolean;
  playable?: boolean;
  disabled?: boolean;
  showPointValue?: boolean;  // NEW: Show point value overlay
  highlightCount?: boolean;  // NEW: Highlight if count domino
  onClick?: (domino: Domino) => void;
  className?: string;
}
```

### Point Value Display
- **Count Dominoes**: Show point value (5 or 10) in corner or overlay
- **Regular Dominoes**: No point value display
- **Color Coding**: Different colors for 5-point vs 10-point dominoes
- **Accessibility**: Screen reader support for point values

### Visual Standards
- Authentic domino appearance with proper pip arrangements
- Consistent color scheme matching Texas 42 traditions
- **NEW**: Point value indicators that don't interfere with pip visibility
- Smooth hover and selection animations
- High contrast mode support
- Scalable design for different screen sizes

### Performance Requirements
- Fast rendering of domino components with point value calculations
- Efficient re-rendering when domino states change
- Minimal bundle size impact
- 60fps animations for hover/selection states

## Definition of Done
- [ ] All 28 domino combinations render correctly with point values
- [ ] **NEW**: Point value calculation logic is accurate and tested
- [ ] **NEW**: Count dominoes are visually distinguishable
- [ ] Domino components support all required states
- [ ] Baseball diamond layout structure is responsive
- [ ] Component tests cover all visual states and point value logic
- [ ] Accessibility requirements met including point value announcements
- [ ] Visual regression tests pass
- [ ] Components integrate with enhanced TypeScript interfaces
- [ ] **NEW**: Total point validation (42) passes in all scenarios
- [ ] Documentation for component usage including point value features

## Dependencies
- Initial project scaffold must be complete
- React and TypeScript setup
- CSS tooling configuration
- Testing framework setup
- **NEW**: Rules research validation (rules-research-1, rules-research-2)

## Estimated Effort
**6-8 hours** - Foundation components with visual polish and point value system (increased from 4-6 hours)

## Testing Strategy
- Component unit tests for all domino states and point values
- **NEW**: Point value calculation unit tests
- **NEW**: Count domino identification tests
- Visual regression tests for domino appearance
- Responsive design tests across breakpoints
- Accessibility testing with automated tools including point value announcements
- Cross-browser compatibility verification
- **NEW**: Total point validation tests (must equal 42)

## Rules Compliance Validation
- [ ] All 28 dominoes from double-6 set represented
- [ ] Correct point values: 5-0, 4-1, 3-2 (5pts), 6-4, 5-5 (10pts)
- [ ] Total available points equals 42
- [ ] Visual representation matches traditional Texas 42 dominoes
- [ ] Partnership layout follows North-South vs East-West convention

## Notes
- Focus on visual accuracy and authenticity to traditional Texas 42
- Components should be reusable across different game contexts
- **NEW**: Point value system is critical for authentic scoring
- Prepare for future animation and interaction features
- Ensure components work well with screen readers
- Consider performance implications of rendering many dominoes with point calculations
- **NEW**: Point value display should be toggleable for different game phases
