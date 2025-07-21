# Texas 42 Technical Architecture Review

## Overview

This document investigates frontend/backend model unification requirements, recommends data structure changes to support complete Texas 42 rule implementation, and assesses performance implications of the rules-compliant architecture.

## Current Architecture Analysis

### Existing Type System Issues

#### 1. **Duplicate Type Definitions**
**Problem**: Frontend and backend have identical but separate type definitions
```typescript
// backend/src/types/texas42.ts
export interface Domino {
  high: number;
  low: number;
  id: string;
}

// frontend/src/types/texas42.ts  
export interface Domino {  // DUPLICATE!
  high: number;
  low: number;
  id: string;
}
```

**Risk**: Type drift, inconsistent implementations, maintenance overhead

#### 2. **Incomplete Rule Support**
**Current State**: Basic interfaces lack rule-specific properties
**Missing**: Point values, trump mappings, special contracts, mark system

#### 3. **No Shared Validation Logic**
**Problem**: Rule validation logic will be duplicated between frontend/backend
**Impact**: Inconsistent validation, potential security issues

### Current Data Flow
```
Frontend State → API Calls → Backend Validation → Database → WebSocket → Frontend Update
```

**Issues**:
- No shared validation logic
- Potential state inconsistencies
- Complex synchronization requirements

## Recommended Architecture: Shared Types Package

### 1. **Monorepo Structure with Shared Package**
```
fourtytwo-rules/
├── packages/
│   ├── shared-types/          # NEW: Shared type definitions
│   │   ├── src/
│   │   │   ├── dominoes.ts
│   │   │   ├── bidding.ts
│   │   │   ├── trump.ts
│   │   │   ├── scoring.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── game-engine/           # NEW: Shared game logic
│   │   ├── src/
│   │   │   ├── rules/
│   │   │   ├── validation/
│   │   │   └── calculations/
│   │   └── package.json
├── frontend/
├── backend/
└── package.json
```

### 2. **Shared Types Package Design**

#### Core Types (`packages/shared-types/src/dominoes.ts`)
```typescript
export interface Domino {
  high: number;        // 0-6
  low: number;         // 0-6
  id: string;          // unique identifier
  pointValue: number;  // 0, 5, or 10 points
  isCountDomino: boolean; // true for scoring dominoes
}

export interface DominoSet {
  dominoes: Domino[];
  totalPoints: number; // Must equal 35 (count dominoes only)
  isValid: boolean;
}

// Factory functions with validation
export function createDomino(high: number, low: number): Domino;
export function createFullDominoSet(): DominoSet;
export function validateDominoSet(set: Domino[]): boolean;
```

#### Trump System (`packages/shared-types/src/trump.ts`)
```typescript
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

// Core trump logic
export function getDominoSuits(domino: Domino, trump: DominoSuit): DominoSuit[];
export function compareDominoes(a: Domino, b: Domino, trump: DominoSuit): number;
export function isTrumpDomino(domino: Domino, trump: DominoSuit): boolean;
```

#### Bidding System (`packages/shared-types/src/bidding.ts`)
```typescript
export interface Bid {
  playerId: string;
  amount: number;           // 30-41 for point bids
  marks?: number;           // 1+ for mark bids
  trump?: DominoSuit;       // chosen trump suit
  isSpecialContract: boolean;
  contractType?: SpecialContractType;
  doublesOption?: 'high' | 'low';
  timestamp: string;
}

export type SpecialContractType = 'nello' | 'plunge' | 'sevens' | 'follow-me';

export interface SpecialContract {
  type: SpecialContractType;
  bidder: string;
  partner?: string;
  requirements: string[];
  scoringRules: string[];
}

// Validation functions
export function isValidBid(bid: Bid, currentHighBid?: Bid, playerHand?: Domino[]): boolean;
export function canMakeSpecialContract(hand: Domino[], contractType: SpecialContractType): boolean;
export function convertBidToPoints(bid: Bid): number;
```

### 3. **Shared Game Engine Package**

#### Rule Validation (`packages/game-engine/src/validation/`)
```typescript
// Centralized validation logic used by both frontend and backend
export class RuleValidator {
  static validatePlay(domino: Domino, hand: Domino[], trick: Trick, trump: DominoSuit): ValidationResult;
  static validateBid(bid: Bid, gameState: GameState): ValidationResult;
  static validateGameState(state: GameState): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

#### Game Calculations (`packages/game-engine/src/calculations/`)
```typescript
export class ScoreCalculator {
  static calculateHandScore(tricks: Trick[]): HandScore;
  static calculateMarksAwarded(score: HandScore, bid: Bid): number;
  static determineGameWinner(marks: PartnershipMarks): string | null;
}

export class TrickCalculator {
  static determineTrickWinner(trick: Trick, trump: DominoSuit): string;
  static getValidPlays(hand: Domino[], ledDomino: Domino, trump: DominoSuit): Domino[];
  static calculateTrickPoints(trick: Trick): number;
}
```

## Data Structure Enhancements

### 1. **Enhanced Game State**
```typescript
export interface GameState {
  // Core identification
  id: string;
  phase: GamePhase;
  
  // Players and partnerships
  players: Player[];
  partnerships: PartnershipState;
  
  // Game progression
  handNumber: number;
  dealer: string;
  currentPlayer?: string;
  
  // Bidding state
  biddingState: BiddingState;
  currentBid?: Bid;
  specialContract?: SpecialContract;
  
  // Playing state
  trump?: DominoSuit;
  tricks: Trick[];
  currentTrick?: Trick;
  
  // Scoring state
  handScores: HandScore[];
  marks: PartnershipMarks;
  gameScore: PartnershipScore;
  marksToWin: number; // typically 7
  
  // Game completion
  gameComplete: boolean;
  winner?: 'northSouth' | 'eastWest';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  
  // Validation
  isValid: boolean;
  validationErrors: string[];
}
```

### 2. **Enhanced Partnership System**
```typescript
export interface PartnershipState {
  northSouth: Partnership;
  eastWest: Partnership;
}

export interface Partnership {
  players: [string, string]; // [player1_id, player2_id]
  currentHandScore: number;
  marks: number;
  totalGameScore: number;
  tricksWon: number;
  isBiddingTeam: boolean;
  specialContractActive?: SpecialContract;
}

export interface PartnershipMarks {
  northSouth: number;
  eastWest: number;
}
```

### 3. **Enhanced Trick System**
```typescript
export interface Trick {
  id: string;
  handNumber: number;
  trickNumber: number; // 1-7
  dominoes: PlayedDomino[];
  winner?: string;
  leadPlayer: string;
  suitLed?: DominoSuit;
  pointValue: number; // count dominoes + 1 for trick
  isComplete: boolean;
}

export interface PlayedDomino {
  domino: Domino;
  playerId: string;
  playOrder: number; // 1-4
  isValidPlay: boolean;
  timestamp: string;
}
```

## Performance Implications

### 1. **Bundle Size Impact**
**Shared Types Package**: ~15-20KB (minified + gzipped)
**Game Engine Package**: ~50-75KB (minified + gzipped)
**Total Addition**: ~65-95KB

**Mitigation**:
- Tree shaking for unused exports
- Lazy loading of game engine components
- Code splitting by game phase

### 2. **Runtime Performance**
**Validation Overhead**: 
- Point value calculations: ~0.1ms per domino
- Trump suit mapping: ~0.5ms per domino
- Trick validation: ~2-5ms per play
- Total per game action: ~5-10ms

**Optimization Strategies**:
- Memoization of expensive calculations
- Precomputed lookup tables for trump mappings
- Batch validation for multiple operations

### 3. **Memory Usage**
**Enhanced Game State**: ~50-100KB per game (vs ~20KB current)
**Shared Validation Cache**: ~10-20KB
**Trump Mapping Cache**: ~5-10KB

**Memory Management**:
- Cleanup completed games
- Lazy initialization of validation caches
- Efficient data structures for large game states

## Implementation Strategy

### Phase 1: Create Shared Packages (1-2 weeks)
1. **Setup monorepo structure** with Lerna or Nx
2. **Create shared-types package** with core interfaces
3. **Create game-engine package** with validation logic
4. **Setup build and publish pipeline**

### Phase 2: Backend Integration (1-2 weeks)
1. **Replace backend types** with shared package
2. **Integrate shared validation logic**
3. **Update API endpoints** to use enhanced types
4. **Migrate database schema** for new data structures

### Phase 3: Frontend Integration (1-2 weeks)
1. **Replace frontend types** with shared package
2. **Integrate shared validation** for immediate feedback
3. **Update components** to use enhanced data structures
4. **Implement new UI features** for special contracts

### Phase 4: Testing and Optimization (1 week)
1. **Performance testing** and optimization
2. **Bundle size analysis** and optimization
3. **Memory usage profiling**
4. **Cross-platform compatibility testing**

## Risk Assessment

### High Risk Areas
1. **Breaking Changes**: Existing API contracts will change
2. **Performance Regression**: Additional validation overhead
3. **Complexity**: Increased codebase complexity

### Mitigation Strategies
1. **Gradual Migration**: Implement changes incrementally
2. **Backward Compatibility**: Maintain old API during transition
3. **Performance Monitoring**: Continuous performance tracking
4. **Comprehensive Testing**: Extensive test coverage for all changes

## Success Metrics

### Technical Metrics
- [ ] Zero type inconsistencies between frontend/backend
- [ ] <10ms additional latency for game actions
- [ ] <100KB bundle size increase
- [ ] 100% rule coverage in shared validation

### Quality Metrics
- [ ] Reduced code duplication (target: 50% reduction)
- [ ] Improved maintainability (single source of truth)
- [ ] Enhanced developer experience (shared types)
- [ ] Consistent rule implementation across all components

## Conclusion

The recommended shared types and game engine architecture provides:

1. **Single Source of Truth**: Eliminates type drift and inconsistencies
2. **Consistent Validation**: Same rules enforced everywhere
3. **Maintainability**: Centralized rule logic reduces duplication
4. **Scalability**: Easier to add new features and rules
5. **Performance**: Optimized for Texas 42 specific operations

The implementation requires significant refactoring but provides long-term benefits for maintainability, consistency, and authentic Texas 42 rule implementation.
