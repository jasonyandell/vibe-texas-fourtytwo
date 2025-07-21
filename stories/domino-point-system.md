# Story: Domino Point System Implementation

## Overview
Implement the complete Texas 42 domino point value system with count domino identification, point calculation, and validation. This story ensures authentic scoring by implementing the exact point values researched in rules-research-2.

**🔄 Rules Integration**: This story implements findings from rules-research-2 (Domino Point Values) to ensure accurate Texas 42 scoring.

## User Story
**As a player**, I want the game to correctly identify and score count dominoes so that the scoring matches authentic Texas 42 rules with exactly 42 points available per hand.

## Acceptance Criteria

### ✅ Point Value Implementation
- [ ] **NEW**: Implement exact point values from rules research
  - 5-0 (5 pips total) = 5 points
  - 4-1 (5 pips total) = 5 points  
  - 3-2 (5 pips total) = 5 points
  - 6-4 (10 pips total) = 10 points
  - 5-5 (10 pips total) = 10 points
- [ ] **NEW**: All other dominoes = 0 points
- [ ] **NEW**: Total count domino points = 35 (verified)

### ✅ Count Domino Identification
- [ ] **NEW**: Implement `isCountDomino()` function
- [ ] **NEW**: Create count domino lookup system
- [ ] **NEW**: Validate count domino identification logic
- [ ] **NEW**: Support efficient count domino filtering

### ✅ Point Calculation System
- [ ] **NEW**: Implement `calculateDominoPointValue()` function
```typescript
function calculateDominoPointValue(high: number, low: number): number {
  const total = high + low;
  if (total === 5) return 5;  // 5-0, 4-1, 3-2
  if (total === 10) return 10; // 6-4, 5-5
  return 0;
}
```
- [ ] **NEW**: Create point value validation utilities
- [ ] **NEW**: Implement total points validation (35 + 7 tricks = 42)

### ✅ Visual Point Indicators
- [ ] **NEW**: Add point value display to domino components
- [ ] **NEW**: Visual distinction for count dominoes vs regular dominoes
- [ ] **NEW**: Color coding for 5-point vs 10-point dominoes
- [ ] **NEW**: Optional point value overlay/corner indicators
- [ ] **NEW**: Accessibility support for point value announcements

### ✅ Backend Integration
- [ ] **NEW**: Update domino creation to include point values
- [ ] **NEW**: Enhance domino set validation with point totals
- [ ] **NEW**: Add point value to domino serialization
- [ ] **NEW**: Update database schema if needed for point storage

### ✅ Frontend Integration
- [ ] **NEW**: Update domino components to display point values
- [ ] **NEW**: Add count domino highlighting in hands
- [ ] **NEW**: Show point values in trick displays
- [ ] **NEW**: Update domino selection UI with point indicators

## Rules Integration Details

### From Rules-Research-2 (Domino Point Values)
- **5-Point Dominoes**: 5-0, 4-1, 3-2 (3 pieces = 15 points)
- **10-Point Dominoes**: 6-4, 5-5 (2 pieces = 20 points)
- **Total Count Points**: 35 points from count dominoes
- **Total Available Points**: 35 count points + 7 tricks = 42 points per hand
- **Validation**: Must verify total equals exactly 42

### From Gap Analysis
- **Missing Implementation**: Current domino interface lacks point values
- **Critical Gap**: No count domino identification in existing code
- **Scoring Foundation**: Required for authentic hand scoring calculation

## Technical Implementation

### Enhanced Domino Interface
```typescript
// From shared-types package
interface Domino {
  high: number;        // 0-6
  low: number;         // 0-6
  id: string;          // unique identifier
  pointValue: number;  // 0, 5, or 10 points (NEW)
  isCountDomino: boolean; // true for scoring dominoes (NEW)
}
```

### Point Calculation Logic
```typescript
// Core point value calculation
export function calculateDominoPointValue(high: number, low: number): number {
  const total = high + low;
  if (total === 5) return 5;   // 5-0, 4-1, 3-2
  if (total === 10) return 10; // 6-4, 5-5
  return 0;                    // All other dominoes
}

// Count domino identification
export function isCountDomino(domino: Domino): boolean {
  return domino.pointValue > 0;
}

// Get all count dominoes from a set
export function getCountDominoes(dominoes: Domino[]): Domino[] {
  return dominoes.filter(d => d.isCountDomino);
}

// Validate total points in domino set
export function validateDominoSetPoints(dominoes: Domino[]): boolean {
  const totalCountPoints = dominoes.reduce((sum, d) => sum + d.pointValue, 0);
  return totalCountPoints === 35; // Must equal 35 count points
}
```

### Visual Implementation
```typescript
// Enhanced domino component props
interface DominoProps {
  domino: Domino;
  showPointValue?: boolean;    // NEW: Show point value overlay
  highlightCount?: boolean;    // NEW: Highlight if count domino
  pointValuePosition?: 'corner' | 'overlay' | 'badge'; // NEW: Display style
  // ... existing props
}
```

### CSS Enhancements
```css
/* Count domino visual indicators */
.domino.count-domino {
  border: 2px solid var(--count-domino-border);
  box-shadow: 0 0 4px var(--count-domino-glow);
}

.domino .point-value {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--point-value-bg);
  color: var(--point-value-text);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.domino .point-value.five-points {
  background: var(--five-point-color);
}

.domino .point-value.ten-points {
  background: var(--ten-point-color);
}
```

## Game Logic Integration

### Domino Factory Enhancement
```typescript
// Enhanced domino creation
export function createDomino(high: number, low: number): Domino {
  const pointValue = calculateDominoPointValue(high, low);
  const isCountDomino = pointValue > 0;
  
  return {
    high,
    low,
    id: `${high}-${low}`,
    pointValue,
    isCountDomino
  };
}

// Create full domino set with point validation
export function createFullDominoSet(): DominoSet {
  const dominoes: Domino[] = [];
  
  // Generate all 28 domino combinations
  for (let high = 0; high <= 6; high++) {
    for (let low = 0; low <= high; low++) {
      dominoes.push(createDomino(high, low));
    }
  }
  
  const totalPoints = dominoes.reduce((sum, d) => sum + d.pointValue, 0);
  
  return {
    dominoes,
    totalPoints,
    isValid: totalPoints === 35 // Must equal 35 count points
  };
}
```

### Scoring Integration Preparation
```typescript
// Utilities for future scoring implementation
export function calculateTrickPoints(trick: Domino[]): number {
  return trick.reduce((sum, domino) => sum + domino.pointValue, 0);
}

export function calculateHandPoints(tricks: Domino[][]): number {
  const countPoints = tricks.flat().reduce((sum, d) => sum + d.pointValue, 0);
  const trickPoints = tricks.length; // 1 point per trick
  return countPoints + trickPoints;
}
```

## Definition of Done
- [ ] **NEW**: All 5 count dominoes correctly identified with exact point values
- [ ] **NEW**: Point calculation function returns correct values for all 28 dominoes
- [ ] **NEW**: Total domino set validation confirms 35 count points
- [ ] **NEW**: Visual indicators distinguish count dominoes from regular dominoes
- [ ] **NEW**: Point values display correctly in domino components
- [ ] All existing domino functionality preserved
- [ ] **NEW**: Count domino filtering and identification works correctly
- [ ] Comprehensive tests validate all point calculations
- [ ] **NEW**: Accessibility support for point value announcements
- [ ] **NEW**: Integration with shared types package

## Dependencies
- Shared types package (must be completed first)
- Existing domino components
- **NEW**: Rules-research-2 validation

## Estimated Effort
**3-4 hours** - Point system implementation with visual enhancements

## Testing Strategy
- **NEW**: Unit tests for point value calculation (all 28 dominoes)
- **NEW**: Count domino identification tests
- **NEW**: Total points validation tests (must equal 35)
- **NEW**: Visual component tests for point displays
- Integration tests with existing domino components
- **NEW**: Accessibility tests for point value announcements
- Performance tests for point calculations

## Rules Compliance Validation
- [ ] 5-0, 4-1, 3-2 dominoes each worth 5 points
- [ ] 6-4, 5-5 dominoes each worth 10 points
- [ ] All other 23 dominoes worth 0 points
- [ ] Total count points equals exactly 35
- [ ] Total available points per hand equals 42 (35 + 7 tricks)
- [ ] Point calculation matches rules-research-2 exactly

## Notes
- Foundation for authentic Texas 42 scoring system
- **NEW**: Critical for accurate hand scoring and bid fulfillment
- Visual indicators should not interfere with domino readability
- **NEW**: Point values are essential for authentic gameplay
- Prepare for integration with future scoring stories
- **NEW**: Must validate against rules research documentation
