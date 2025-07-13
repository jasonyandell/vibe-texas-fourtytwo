# Story: Texas 42 Equipment and Setup Research

## Overview
Research and document the exact equipment requirements and game setup procedures for Texas 42 to ensure accurate implementation.

## User Story
**As a** developer implementing Texas 42  
**I want** to understand the exact equipment and setup requirements  
**So that** I can implement the correct game initialization and player arrangement

## Acceptance Criteria
- [x] Document complete double-6 domino set (all 28 pieces listed)
- [x] Define partnership arrangement and seating
- [x] Specify dealing procedures and hand sizes
- [x] Document initial game state setup
- [x] Identify any special setup rules or variations

## Research Tasks
- [x] List all 28 dominoes in a double-6 set with their pip values
- [x] Research standard partnership arrangement (who sits where)
- [x] Determine how many dominoes each player receives
- [x] Document the dealing order and procedures
- [x] Research any special setup considerations (shuffling, cutting, etc.)

## Research Findings

### Complete Double-6 Domino Set (28 pieces)

**Doubles (7 pieces):**
- 0-0 (blank-blank)
- 1-1 (ace-ace)
- 2-2 (deuce-deuce)
- 3-3 (trey-trey)
- 4-4
- 5-5
- 6-6

**Singles (21 pieces):**
- Blanks: 0-1, 0-2, 0-3, 0-4, 0-5, 0-6
- Ones: 1-2, 1-3, 1-4, 1-5, 1-6
- Twos: 2-3, 2-4, 2-5, 2-6
- Threes: 3-4, 3-5, 3-6
- Fours: 4-5, 4-6
- Fives: 5-6

**Total: 28 dominoes** (verified complete set)

### Partnership Arrangement and Seating
- **4 players in fixed partnerships**
- **Partners sit opposite each other** (North-South vs East-West)
- Standard seating arrangement:
  ```
      North
  West    East
      South
  ```
- Partners cannot communicate during play except through legal plays

### Dealing Procedures and Hand Sizes
- **Each player receives exactly 7 dominoes**
- **Total dealt: 28 dominoes (entire set)**
- **No stock/boneyard remains**

**Dealing Order:**
1. Dealer shuffles dominoes face down on table
2. **Opponents draw first** (dealer's left, then dealer's right)
3. **Dealer's partner draws next**
4. **Dealer draws last**
5. Each player draws 7 dominoes total

### Initial Game State Setup
- Players arrange dominoes on edge so only they can see values
- First dealer selected randomly
- **Turn to deal rotates clockwise** after each hand
- Dominoes are mixed thoroughly face down before dealing
- No cutting procedure specified in standard rules

### Special Setup Rules and Variations
- **Forced Bid Variation**: If first three players pass, dealer must bid (cannot throw in hand)
- **No special markings** required on dominoes
- **Standard double-6 set** is sufficient (no special equipment needed)
- Game can be played on any flat surface
- **Tricks are kept face up** to the right of one team member in order played

## Deliverables
1. **Equipment Specification**
   - Complete list of 28 dominoes with visual descriptions
   - Any special markings or requirements for dominoes

2. **Setup Procedures Document**
   - Step-by-step setup instructions
   - Partnership arrangement diagram
   - Dealing procedures and hand sizes

3. **Implementation Notes**
   - Data structures needed for domino representation
   - Player positioning and partnership tracking
   - Initial game state requirements

## Implementation Specifications

### Data Structures Needed
```
DominoTile {
  high_end: number (0-6)
  low_end: number (0-6)
  point_value: number (0, 5, or 10)
  is_double: boolean
}

Player {
  id: string
  hand: DominoTile[]
  partnership: "North-South" | "East-West"
  position: "North" | "South" | "East" | "West"
}

GameState {
  players: Player[4]
  dealer: Player
  current_turn: Player
  dominoes_remaining: DominoTile[]
}
```

### Setup Validation Rules
- Exactly 28 unique dominoes must be present
- Each player must have exactly 7 dominoes
- No dominoes remain undealt
- Partners must be seated opposite each other
- Dealer position must rotate clockwise

### Implementation Notes
- Domino representation should include both ends and point values
- Partnership tracking is essential for scoring
- Turn order management needed for dealing and play
- Initial game state must be properly initialized before bidding

## Definition of Done
- [x] All 28 dominoes documented with pip values
- [x] Partnership arrangement clearly defined
- [x] Dealing procedures specified with exact hand sizes
- [x] Setup validated against 2+ authoritative sources (pagat.com, Wikipedia)
- [x] Implementation requirements identified

## Sources Consulted
1. **Pagat.com Texas 42 Rules** - https://www.pagat.com/domino/trick/42.html
2. **Wikipedia List of Domino Games** - https://en.wikipedia.org/wiki/List_of_domino_games
3. **Core Mechanics Summary** - docs/rules/core-mechanics-summary.md

## Story Status: COMPLETE ✅
All acceptance criteria met. Equipment and setup specifications are implementation-ready.

## Estimated Effort
4-6 hours

## Dependencies
None - this is foundational research

## Notes
This story focuses specifically on the physical/logical setup of the game before any gameplay begins. It should provide everything needed to initialize a game state.
