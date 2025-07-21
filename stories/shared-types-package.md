# Story: Shared Types Package for Frontend/Backend Consistency

## Overview
Create a shared types package to eliminate frontend/backend type drift and ensure consistent Texas 42 rule implementation across all components. This foundational story establishes the architecture for authentic rule compliance.

**🔄 Rules Integration**: This story implements the technical architecture recommendations from the reconciliation plan to support complete Texas 42 rule implementation.

## User Story
**As a developer**, I want a shared types package between frontend and backend so that I can ensure consistent Texas 42 rule implementation and eliminate type drift issues.

## Acceptance Criteria

### ✅ Monorepo Structure Setup
- [ ] Create `packages/` directory structure
- [ ] Setup `packages/shared-types/` package with proper configuration
- [ ] Configure TypeScript compilation for shared package
- [ ] Setup package exports and imports
- [ ] Configure build pipeline for shared types
- [ ] Update frontend and backend to use shared types

### ✅ Enhanced Domino Types
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
- [ ] **NEW**: Create domino factory functions with validation
- [ ] **NEW**: Implement point value calculation utilities
- [ ] **NEW**: Add domino set validation (must total 35 count points)

### ✅ Complete Trump Suit System Types
- [ ] **NEW**: Enhanced DominoSuit type with all 7 suits
```typescript
type DominoSuit = 'blanks' | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'doubles';
```
- [ ] **NEW**: Trump system configuration interface
- [ ] **NEW**: Domino-to-suit mapping types
- [ ] **NEW**: Trump hierarchy and comparison types
- [ ] **NEW**: No-trump options (doubles high/low)

### ✅ Enhanced Bidding System Types
- [ ] **NEW**: Complete Bid interface with special contracts
```typescript
interface Bid {
  playerId: string;
  amount: number;           // 30-41 for point bids
  marks?: number;           // 1+ for mark bids
  trump?: DominoSuit;       // chosen trump suit
  isSpecialContract: boolean;
  contractType?: SpecialContractType;
  doublesOption?: 'high' | 'low';
  timestamp: string;
}
```
- [ ] **NEW**: Special contract types (Nello, Plunge, Sevens, Follow Me)
- [ ] **NEW**: Bidding validation types
- [ ] **NEW**: Mark conversion utilities

### ✅ Enhanced Game State Types
- [ ] **NEW**: Complete GameState with rule compliance
- [ ] **NEW**: Enhanced PartnershipState with marks
- [ ] **NEW**: Complete Trick and PlayedDomino interfaces
- [ ] **NEW**: Scoring state with hand scores and marks
- [ ] **NEW**: Game completion and winner determination types

### ✅ Shared Validation Types
- [ ] **NEW**: ValidationResult interface for consistent error handling
- [ ] **NEW**: Rule validation function signatures
- [ ] **NEW**: Error and warning type definitions
- [ ] **NEW**: Validation context types

## Rules Integration Details

### From Gap Analysis
- **Type Duplication**: Eliminates duplicate type definitions between frontend/backend
- **Inconsistent Implementation**: Provides single source of truth for all game types
- **Missing Rule Support**: Adds types for all researched Texas 42 rules

### From Technical Architecture Review
- **Shared Package Strategy**: Implements recommended monorepo structure
- **Model Unification**: Ensures consistent types across all components
- **Performance Considerations**: Optimized type definitions for game logic

## Technical Implementation

### Package Structure
```
packages/shared-types/
├── src/
│   ├── dominoes.ts      # Domino types and utilities
│   ├── trump.ts         # Trump suit system types
│   ├── bidding.ts       # Bidding and special contracts
│   ├── scoring.ts       # Scoring and marks system
│   ├── game-state.ts    # Complete game state types
│   ├── validation.ts    # Validation types and interfaces
│   └── index.ts         # Package exports
├── package.json
├── tsconfig.json
└── README.md
```

### Core Type Definitions

#### Dominoes (`src/dominoes.ts`)
```typescript
export interface Domino {
  high: number;
  low: number;
  id: string;
  pointValue: number;
  isCountDomino: boolean;
}

export interface DominoSet {
  dominoes: Domino[];
  totalPoints: number; // Must equal 35
  isValid: boolean;
}

export function createDomino(high: number, low: number): Domino;
export function createFullDominoSet(): DominoSet;
export function calculateDominoPointValue(high: number, low: number): number;
export function isCountDomino(domino: Domino): boolean;
```

#### Trump System (`src/trump.ts`)
```typescript
export type DominoSuit = 'blanks' | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'doubles';

export interface TrumpSystem {
  suit: DominoSuit;
  isNoTrump: boolean;
  doublesOption?: 'high' | 'low';
}

export interface DominoSuitMapping {
  domino: Domino;
  suits: DominoSuit[];
  isTrump: boolean;
  trumpRank?: number;
}
```

### Package Configuration

#### `package.json`
```json
{
  "name": "@texas42/shared-types",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

## Migration Strategy

### Phase 1: Package Setup (1-2 hours)
1. Create package structure and configuration
2. Implement basic type definitions
3. Setup build pipeline

### Phase 2: Type Migration (2-3 hours)
1. Move existing types to shared package
2. Enhance types with rule compliance features
3. Update imports in frontend and backend

### Phase 3: Validation (1 hour)
1. Ensure all imports work correctly
2. Run existing tests to verify no regressions
3. Add new tests for enhanced types

## Definition of Done
- [ ] Shared types package created with proper structure
- [ ] **NEW**: All domino types include point value system
- [ ] **NEW**: Complete 7-suit trump system types implemented
- [ ] **NEW**: Enhanced bidding types with special contracts
- [ ] **NEW**: Complete game state types with rule compliance
- [ ] Frontend successfully imports and uses shared types
- [ ] Backend successfully imports and uses shared types
- [ ] All existing tests pass with new type system
- [ ] **NEW**: Type validation ensures rule compliance
- [ ] Package builds and exports correctly
- [ ] Documentation for shared types usage

## Dependencies
- TypeScript configuration
- Build tooling setup
- **NEW**: Rules research documentation for type requirements

## Estimated Effort
**4-6 hours** - Package setup and type migration with rule enhancements

## Testing Strategy
- Type compilation tests
- Import/export validation tests
- **NEW**: Rule compliance type validation
- Frontend integration tests
- Backend integration tests
- Build pipeline validation

## Rules Compliance Validation
- [ ] All domino types support point value system from rules-research-2
- [ ] Trump suit types support complete 7-suit system from rules-research-4
- [ ] Bidding types support all special contracts from rules-research-3
- [ ] Scoring types support mark system from rules-research-6
- [ ] Game state types support complete rule implementation

## Notes
- This is the foundation story for all other reconciliation work
- Establishes single source of truth for all Texas 42 types
- **NEW**: Includes all rule compliance requirements from research
- Must be completed before any other reconciliation stories
- Sets up architecture for consistent rule implementation
- **NEW**: Enables authentic Texas 42 gameplay through proper type system
