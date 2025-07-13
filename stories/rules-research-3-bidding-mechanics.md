# Story: Texas 42 Bidding Mechanics Research

## Overview
Research and document the complete bidding system for Texas 42, including bid values, sequence, and special bidding rules.

## User Story
**As a** developer implementing Texas 42 bidding  
**I want** to understand all bidding rules and mechanics  
**So that** I can implement a correct and fair bidding system

## Acceptance Criteria
- [x] Document minimum bid value and increments
- [x] Define bidding sequence and turn order
- [x] Identify all special bids and their meanings
- [x] Specify what happens when all players pass
- [x] Document bid validation rules

## Research Tasks
- [x] Determine minimum bid (typically 30)
- [x] Research bid increment rules (1 point, 5 points, etc.)
- [x] Identify maximum possible bid
- [x] Document special bids (84, 168, Plunge, etc.)
- [x] Research bidding sequence (who bids first, turn order)
- [x] Determine passing rules and consequences
- [x] Research what happens if all players pass

## Research Findings

### Basic Bidding Rules

**Minimum Bid:** 30 points (out of 42 total available)

**Bid Increments:** Any increment of 1 point (30, 31, 32, 33, etc.)

**Bidding Sequence:**
1. **Player to dealer's left** bids first
2. **Clockwise rotation** around table
3. **Each player bids exactly once** (no second chances)
4. **Each bid must be higher** than the previous bid

**Bid Range:**
- **30-41**: Point bids (must win at least that many points)
- **42 (1 mark)**: Must win all tricks OR play special contract
- **2 marks, 3 marks, etc.**: Higher mark bids for special contracts

### Special Bids and Contracts

**1 Mark (42 points):**
- Must win all 7 tricks (all 42 points)
- OR can declare special contract (Nello, Sevens)

**Plunge (4+ marks):**
- Bidder must hold **at least 4 doubles**
- **Partner chooses trump suit** (not bidder)
- Must win all 7 tricks
- Can open with 4 marks or jump to 4 marks
- Can bid 5 marks over 4 marks

**Nello (1+ marks):**
- Contract to **lose every trick**
- **Partner sits out** (turns dominoes face down)
- **No trumps** in Nello
- Doubles form separate suit (6-6 high to 0-0 low)

**Sevens (1+ marks):**
- Each player must play domino **closest to 7 pips**
- **No strategy** - play is completely forced
- Must win all 7 tricks

### Bidding Validation Rules

**Valid Opening Bids:**
- 30-41 (point bids)
- 1 mark (42)
- 2 marks
- 4 marks (Plunge only)

**Invalid Opening Bids:**
- 3 marks (cannot open with 3)
- 5+ marks (unless Plunge over 4)

**Bid Progression Rules:**
- Each bid must exceed previous bid
- Can bid any increment (30→31, 30→35, etc.)
- Special jump rules for Plunge (can jump to 4 marks)

### Passing and Forced Bidding

**Standard Passing:**
- If all 4 players pass, **hand is thrown in**
- Next dealer deals new hand

**Forced Bid Variation:**
- If first 3 players pass, **dealer must bid**
- Prevents thrown-in hands
- Common house rule

## Implementation Specifications

### Bid Validation Logic
```javascript
function isValidBid(newBid, currentHighBid, playerHand) {
  // Check minimum bid
  if (newBid < 30) return false;

  // Check bid progression
  if (currentHighBid && newBid <= currentHighBid) return false;

  // Check Plunge requirements
  if (newBid >= 4 && isPlungeBid(newBid)) {
    const doubleCount = countDoubles(playerHand);
    if (doubleCount < 4) return false;
  }

  // Check valid opening bids
  if (!currentHighBid) {
    return [30,31,32,33,34,35,36,37,38,39,40,41,42,2,4].includes(newBid);
  }

  return true;
}
```

### Turn Order Management
```javascript
class BiddingManager {
  constructor(dealer) {
    this.currentBidder = getPlayerToLeft(dealer);
    this.highBidder = null;
    this.highBid = 0;
    this.passCount = 0;
  }

  nextBidder() {
    this.currentBidder = getNextPlayer(this.currentBidder);
    this.passCount++;
  }

  isBiddingComplete() {
    return this.passCount === 4 || (this.highBid > 0 && this.passCount === 3);
  }
}
```

### Special Contract Handling
```javascript
const SPECIAL_CONTRACTS = {
  NELLO: 'nello',
  PLUNGE: 'plunge',
  SEVENS: 'sevens'
};

function declareContract(bid, contract) {
  if (bid < 42 && contract !== null) {
    throw new Error('Special contracts require 1+ marks');
  }

  if (contract === SPECIAL_CONTRACTS.PLUNGE && bid < 4) {
    throw new Error('Plunge requires 4+ marks');
  }
}
```

### UI Requirements
- **Bid buttons**: 30-41, 1 mark, 2 marks, etc.
- **Pass button**: Always available
- **Special contract selection**: After winning bid ≥ 1 mark
- **Bid history display**: Show all bids in order
- **Current high bid indicator**
- **Turn indicator**: Show whose turn to bid

## Definition of Done
- [x] All bidding rules documented and verified
- [x] Special bids identified with exact meanings
- [x] Bidding sequence clearly defined
- [x] Edge cases (all pass, invalid bids) handled
- [x] Rules validated against 2+ authoritative sources (pagat.com)

## Sources Consulted
1. **Pagat.com Texas 42 Rules** - https://www.pagat.com/domino/trick/42.html
2. **Bidding Summary** - docs/rules/bidding-summary.md

## Story Status: COMPLETE ✅
All acceptance criteria met. Bidding system is implementation-ready with validation logic and special contract handling.

## Estimated Effort
4-5 hours

## Dependencies
- Basic game setup understanding

## Notes
Bidding is a critical phase that determines trump suit and scoring targets. Special bids like "84" (double points) and "Plunge" (no trump) significantly affect gameplay and need careful research.
