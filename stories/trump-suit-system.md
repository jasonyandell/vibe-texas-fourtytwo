# Story: Trump Suit System Implementation

## Overview
Implement the complete Texas 42 trump suit system with all 7 trump suits, domino-to-suit mapping logic, trump hierarchy, and comparison algorithms. This story ensures authentic trick-taking by implementing the exact trump system researched in rules-research-4.

**🔄 Rules Integration**: This story implements findings from rules-research-4 (Trump Suit System) to ensure accurate Texas 42 trick-taking mechanics.

## User Story
**As a player**, I want the game to correctly handle all 7 trump suits with proper domino rankings so that trick-taking follows authentic Texas 42 rules.

## Acceptance Criteria

### ✅ Complete 7-Suit Trump System
- [ ] **NEW**: Implement all 7 trump suits from rules research
  - blanks (0s)
  - ones (1s) 
  - twos (2s)
  - threes (3s)
  - fours (4s)
  - fives (5s)
  - sixes (6s)
  - doubles (all doubles: 0-0, 1-1, 2-2, 3-3, 4-4, 5-5, 6-6)
- [ ] **NEW**: Support no-trump options (doubles high, doubles low)

### ✅ Domino-to-Suit Mapping Logic
- [ ] **NEW**: Implement domino suit determination
```typescript
function getDominoSuits(domino: Domino, trump: DominoSuit): DominoSuit[] {
  // Returns which suits a domino belongs to given current trump
}
```
- [ ] **NEW**: Handle trump vs non-trump suit membership
- [ ] **NEW**: Support dominoes belonging to multiple suits
- [ ] **NEW**: Special handling for doubles as trump

### ✅ Trump Hierarchy and Comparison
- [ ] **NEW**: Implement trump ranking within each suit
- [ ] **NEW**: Trump vs non-trump comparison logic
- [ ] **NEW**: Higher trump beats lower trump rules
- [ ] **NEW**: Double trump special ranking (highest in suit)
- [ ] **NEW**: Non-trump domino ranking by other end

### ✅ Trump Suit Selection System
- [ ] **NEW**: Trump selection interface after winning bid
- [ ] **NEW**: Validation of trump selection based on bid type
- [ ] **NEW**: Special contract trump handling
- [ ] **NEW**: No-trump option selection (doubles high/low)

### ✅ Trump Comparison Algorithm
- [ ] **NEW**: Complete domino comparison function
```typescript
function compareDominoes(a: Domino, b: Domino, trump: DominoSuit): number {
  // Returns positive if a > b, negative if a < b, 0 if equal
}
```
- [ ] **NEW**: Trump always beats non-trump
- [ ] **NEW**: Higher trump beats lower trump
- [ ] **NEW**: Non-trump comparison by suit led

## Rules Integration Details

### From Rules-Research-4 (Trump Suit System)
- **7 Trump Suits**: Complete suit system with hierarchy
- **Domino Mapping**: How dominoes belong to suits based on trump
- **Trump Hierarchy**: Ranking within trump suits (double highest, then by other end)
- **Comparison Rules**: Trump vs non-trump, higher vs lower trump
- **No Trump Options**: Doubles high, doubles low variations

### From Gap Analysis
- **Missing Implementation**: Current DominoSuit enum incomplete
- **Critical Gap**: No domino-to-suit mapping logic
- **Trick-Taking Foundation**: Required for authentic trick resolution

## Technical Implementation

### Enhanced Trump Types
```typescript
// Complete trump suit system
export type DominoSuit = 'blanks' | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'doubles';

export interface TrumpSystem {
  suit: DominoSuit;
  isNoTrump: boolean;
  doublesOption?: 'high' | 'low'; // for no-trump games
}

export interface DominoSuitMapping {
  domino: Domino;
  suits: DominoSuit[];
  isTrump: boolean;
  trumpRank?: number; // ranking within trump suit
}
```

### Core Trump Logic
```typescript
// Get suit name from number
export function getSuitName(value: number): DominoSuit {
  const suitNames: DominoSuit[] = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  return suitNames[value];
}

// Determine which suits a domino belongs to
export function getDominoSuits(domino: Domino, trump: DominoSuit): DominoSuit[] {
  if (trump === 'doubles') {
    // In doubles trump, all doubles are trump
    if (domino.high === domino.low) return ['doubles'];
    // Non-doubles belong to both number suits
    return [getSuitName(domino.high), getSuitName(domino.low)];
  }
  
  // Regular trump suit
  if (domino.high === domino.low) {
    // Doubles belong to their number suit when it's trump, otherwise both suits
    if (getSuitName(domino.high) === trump) return [trump];
    return [getSuitName(domino.high), getSuitName(domino.low)];
  }
  
  // Check if either end is trump
  const suits = [getSuitName(domino.high), getSuitName(domino.low)];
  if (suits.includes(trump)) return [trump];
  return suits;
}

// Check if domino is trump
export function isTrumpDomino(domino: Domino, trump: DominoSuit): boolean {
  const suits = getDominoSuits(domino, trump);
  return suits.includes(trump);
}

// Get trump rank within suit (higher rank = stronger)
export function getTrumpRank(domino: Domino, trump: DominoSuit): number {
  if (!isTrumpDomino(domino, trump)) return -1;
  
  if (trump === 'doubles') {
    // In doubles trump, rank by pip total
    return domino.high; // Since high === low for doubles
  }
  
  // For regular trump suits
  if (domino.high === domino.low) {
    // Double is highest in its suit
    return 7; // Higher than any single domino
  }
  
  // For non-double trump, rank by the non-trump end
  const trumpValue = trump === getSuitName(domino.high) ? domino.high : domino.low;
  const otherValue = trump === getSuitName(domino.high) ? domino.low : domino.high;
  return otherValue;
}
```

### Domino Comparison Algorithm
```typescript
// Complete domino comparison for trick-taking
export function compareDominoes(a: Domino, b: Domino, trump: DominoSuit): number {
  const aIsTrump = isTrumpDomino(a, trump);
  const bIsTrump = isTrumpDomino(b, trump);
  
  // Trump always beats non-trump
  if (aIsTrump && !bIsTrump) return 1;
  if (!aIsTrump && bIsTrump) return -1;
  
  // Both trump - compare by trump rank
  if (aIsTrump && bIsTrump) {
    const aRank = getTrumpRank(a, trump);
    const bRank = getTrumpRank(b, trump);
    return aRank - bRank;
  }
  
  // Both non-trump - compare by higher end
  const aHigh = Math.max(a.high, a.low);
  const bHigh = Math.max(b.high, b.low);
  return aHigh - bHigh;
}

// Compare trump dominoes within same suit
export function compareTrumpDominoes(a: Domino, b: Domino, trump: DominoSuit): number {
  const aRank = getTrumpRank(a, trump);
  const bRank = getTrumpRank(b, trump);
  return aRank - bRank;
}
```

### Trump Selection Interface
```typescript
// Trump selection after winning bid
export interface TrumpSelection {
  suit: DominoSuit;
  isNoTrump: boolean;
  doublesOption?: 'high' | 'low';
  isValid: boolean;
}

export function validateTrumpSelection(
  selection: TrumpSelection, 
  bid: Bid, 
  playerHand: Domino[]
): boolean {
  // Validate trump selection based on bid type and hand
  if (bid.isSpecialContract) {
    return validateSpecialContractTrump(selection, bid, playerHand);
  }
  
  // Regular bid - any trump suit allowed
  return selection.suit !== undefined;
}
```

### Visual Trump Indicators
```typescript
// Trump suit display component props
interface TrumpIndicatorProps {
  trump: DominoSuit;
  isNoTrump: boolean;
  doublesOption?: 'high' | 'low';
  className?: string;
}

// Trump suit selection component props
interface TrumpSelectorProps {
  availableSuits: DominoSuit[];
  onTrumpSelect: (selection: TrumpSelection) => void;
  allowNoTrump: boolean;
  playerHand: Domino[];
}
```

## Game Logic Integration

### Trick-Taking Preparation
```typescript
// Determine which suit was led (for follow-suit rules)
export function getLedSuit(domino: Domino, trump: DominoSuit): DominoSuit {
  const suits = getDominoSuits(domino, trump);
  
  if (suits.includes(trump)) {
    return trump; // Trump led
  }
  
  // Non-trump led - use higher numbered suit
  if (suits.length === 2) {
    const [suit1, suit2] = suits;
    const value1 = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(suit1);
    const value2 = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(suit2);
    return value1 > value2 ? suit1 : suit2;
  }
  
  return suits[0];
}

// Check if domino can follow suit
export function canFollowSuit(domino: Domino, ledSuit: DominoSuit, trump: DominoSuit): boolean {
  const dominoSuits = getDominoSuits(domino, trump);
  return dominoSuits.includes(ledSuit);
}
```

## Definition of Done
- [ ] **NEW**: All 7 trump suits implemented with correct hierarchy
- [ ] **NEW**: Domino-to-suit mapping works for all trump combinations
- [ ] **NEW**: Trump comparison algorithm correctly ranks all dominoes
- [ ] **NEW**: Trump vs non-trump comparison always favors trump
- [ ] **NEW**: Double trump handling works correctly
- [ ] **NEW**: No-trump options (doubles high/low) implemented
- [ ] **NEW**: Trump selection interface functional
- [ ] All trump logic validated against rules research
- [ ] Comprehensive tests cover all trump scenarios
- [ ] **NEW**: Integration with shared types package

## Dependencies
- Shared types package (must be completed first)
- Domino point system (for complete domino interface)
- **NEW**: Rules-research-4 validation

## Estimated Effort
**6-8 hours** - Complex trump system with all 7 suits and comparison logic

## Testing Strategy
- **NEW**: Unit tests for all 7 trump suits with all 28 dominoes
- **NEW**: Domino-to-suit mapping tests for every combination
- **NEW**: Trump comparison tests (trump vs non-trump, higher vs lower)
- **NEW**: Double trump special case tests
- **NEW**: No-trump option tests
- **NEW**: Trump selection validation tests
- Integration tests with domino components
- Performance tests for comparison algorithms

## Rules Compliance Validation
- [ ] All 7 trump suits work as specified in rules-research-4
- [ ] Trump hierarchy matches research (double highest, then by other end)
- [ ] Domino-to-suit mapping follows research specifications
- [ ] Trump vs non-trump comparison rules correct
- [ ] No-trump options work as researched
- [ ] Special trump rules for doubles implemented correctly

## Notes
- Foundation for authentic Texas 42 trick-taking
- **NEW**: Critical for correct trick resolution and follow-suit rules
- Complex logic requires extensive testing
- **NEW**: Must handle all edge cases identified in rules research
- Prepare for integration with trick-taking engine
- **NEW**: Performance critical for real-time gameplay
