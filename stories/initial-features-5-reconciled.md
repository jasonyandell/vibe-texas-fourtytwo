# Story: Texas 42 Bidding System (Rules-Reconciled)

## Overview
Implement the complete Texas 42 bidding phase including bid validation, trump suit selection, special contracts, and the transition from bidding to playing. This story brings authentic Texas 42 bidding mechanics to the web game with full rules compliance.

**🔄 Rules Integration**: This story has been updated to incorporate findings from rules-research-3 (Bidding Mechanics) and rules-research-4 (Trump Suits).

## User Story
**As a player**, I want to participate in the Texas 42 bidding phase with proper rules and validation so that I can compete for the right to name trump and set the game's target score using authentic bidding mechanics.

## Acceptance Criteria

### ✅ Complete Bidding Interface (Enhanced)
- [ ] Create bidding panel with all valid bid options
- [ ] **NEW**: Support point bids (30-41) and mark bids (1+ marks = 42+ points)
- [ ] **NEW**: Implement special contract bidding (Nello, Plunge, Sevens, Follow Me)
- [ ] **NEW**: Add forced bid variation support (dealer must bid if all pass)
- [ ] Display current high bid and bidding history
- [ ] Show valid bid options for current player
- [ ] **NEW**: Implement bid increment validation (any 1-point increment)
- [ ] Add pass option with proper validation
- [ ] **NEW**: Support simultaneous bid handling (first in turn order wins)

### ✅ Enhanced Trump Suit Selection
- [ ] **NEW**: Complete 7-suit trump system (blanks, ones, twos, threes, fours, fives, sixes, doubles)
- [ ] **NEW**: Trump suit selection after winning bid
- [ ] **NEW**: No-trump options (doubles high, doubles low)
- [ ] **NEW**: Special contract trump handling (Plunge: partner chooses, Nello: no trump advantage)
- [ ] Visual trump suit indicators
- [ ] **NEW**: Trump suit validation based on bid type

### ✅ Special Contracts Implementation (NEW)
- [ ] **Nello Contract**: Bid to lose all tricks (1+ marks)
  - [ ] Validate player can attempt Nello
  - [ ] Special scoring rules (reverse objective)
  - [ ] UI indicators for Nello attempt
- [ ] **Plunge Contract**: Must hold 4+ doubles, partner chooses trump (4+ marks)
  - [ ] Validate 4+ doubles in hand before allowing bid
  - [ ] Partner trump selection interface
  - [ ] Double points scoring
- [ ] **Sevens Contract**: Play dominoes closest to 7 pips (1+ marks)
  - [ ] Special domino ranking system
  - [ ] Modified trick-taking rules
- [ ] **Follow Me (No Trump)**: Doubles high or doubles low options
  - [ ] Doubles high/low selection
  - [ ] Modified domino hierarchy

### ✅ Enhanced Bidding Validation
- [ ] **NEW**: Minimum bid enforcement (30 points)
- [ ] **NEW**: Maximum point bid (41 points, then marks)
- [ ] **NEW**: Mark bid conversion (1 mark = 42 points, 2 marks = 84 points)
- [ ] **NEW**: Special contract eligibility validation
- [ ] Turn order enforcement (clockwise from dealer's left)
- [ ] **NEW**: Single bid per player rule
- [ ] **NEW**: Each bid must be higher than previous
- [ ] **NEW**: All players pass handling (throw in hand or forced bid)

### ✅ Bidding State Management (Enhanced)
```typescript
interface BiddingState {
  bidHistory: Bid[];
  currentHighBid?: Bid;
  biddingComplete: boolean;
  passCount: number;
  minimumBid: number;        // Always 30
  forcedBidActive: boolean;  // NEW: For forced bid variation
  specialContractActive?: SpecialContract; // NEW
}

interface Bid {
  playerId: string;
  amount: number;           // 30-41 for point bids
  marks?: number;           // 1+ for mark bids
  trump?: DominoSuit;       // chosen trump suit
  isSpecialContract: boolean; // NEW
  contractType?: 'nello' | 'plunge' | 'sevens' | 'follow-me'; // NEW
  doublesOption?: 'high' | 'low'; // NEW: for no-trump contracts
  timestamp: string;
}
```

## Rules Integration Details

### From Rules-Research-3 (Bidding Mechanics)
- **Minimum Bid**: 30 points (out of 42 total available)
- **Bid Increments**: Any 1-point increment (30, 31, 32, etc.)
- **Bidding Sequence**: Player to dealer's left bids first, clockwise rotation
- **Mark System**: 1 mark = 42 points, 2 marks = 84 points, etc.
- **Special Contracts**: Nello, Plunge, Sevens, Follow Me with specific requirements
- **Forced Bid Variation**: Dealer must bid if all players pass

### From Rules-Research-4 (Trump Suits)
- **7 Trump Suits**: blanks, ones, twos, threes, fours, fives, sixes, doubles
- **Trump Selection**: Winning bidder chooses trump after bidding complete
- **No Trump Options**: Doubles high, doubles low variations
- **Special Trump Rules**: Different for each special contract

## Technical Implementation

### Enhanced Bidding Logic
```typescript
// Bid validation with special contracts
export function isValidBid(bid: Bid, currentHighBid?: Bid, playerHand?: Domino[]): boolean {
  // Point bid validation
  if (!bid.isSpecialContract) {
    if (bid.amount < 30 || bid.amount > 41) return false;
    if (currentHighBid && bid.amount <= currentHighBid.amount) return false;
    return true;
  }
  
  // Special contract validation
  return validateSpecialContract(bid, playerHand);
}

// Special contract validation
export function validateSpecialContract(bid: Bid, playerHand: Domino[]): boolean {
  switch (bid.contractType) {
    case 'plunge':
      // Must have 4+ doubles
      const doubles = playerHand.filter(d => d.high === d.low);
      return doubles.length >= 4;
    case 'nello':
      // Any player can bid Nello
      return true;
    case 'sevens':
      // Any player can bid Sevens
      return true;
    case 'follow-me':
      // Any player can bid Follow Me
      return true;
    default:
      return false;
  }
}

// Mark conversion
export function convertBidToPoints(bid: Bid): number {
  if (bid.marks) {
    return bid.marks * 42; // 1 mark = 42 points
  }
  return bid.amount;
}
```

### UI Components
- **BiddingPanel**: Main bidding interface
- **BidButton**: Individual bid option buttons
- **SpecialContractSelector**: Interface for special contract selection
- **TrumpSelector**: Trump suit selection after winning bid
- **BidHistory**: Display of all bids made
- **BidValidation**: Real-time validation feedback

## Game Logic Integration

### Bidding Flow
1. **Deal Complete**: Transition to bidding phase
2. **Turn-Based Bidding**: Clockwise from dealer's left
3. **Bid Validation**: Real-time validation with rules compliance
4. **Special Contract Handling**: Additional validation and UI
5. **Trump Selection**: Winner chooses trump suit
6. **Transition to Play**: Begin trick-taking phase

### Error Handling
- **Invalid Bid Amount**: Show valid range, reject bid
- **Out of Turn**: Display turn indicator, reject bid
- **Special Contract Ineligible**: Show requirements, reject bid
- **All Players Pass**: Handle based on house rules (throw in or forced bid)

## Definition of Done
- [ ] Complete bidding interface with all bid types
- [ ] **NEW**: All special contracts implemented and validated
- [ ] **NEW**: Complete 7-suit trump selection system
- [ ] **NEW**: Mark-based bidding system functional
- [ ] Bidding state properly managed and serialized
- [ ] Smooth transition from bidding to playing
- [ ] **NEW**: Forced bid variation support
- [ ] Error handling for all invalid bid scenarios
- [ ] Real-time updates for all players
- [ ] Accessibility requirements met
- [ ] **NEW**: Special contract UI and validation
- [ ] Comprehensive tests for all bidding scenarios
- [ ] Integration with overall game flow

## Dependencies
- Game state management system (Story 2)
- Baseball diamond layout (Story 4)
- **NEW**: Complete domino point value system (Story 1-reconciled)
- **NEW**: Trump suit mapping system
- Backend API for bid validation
- Game phase management

## Estimated Effort
**8-12 hours** - Complex bidding mechanics with special contracts (increased from 4-6 hours)

## Testing Strategy
- Unit tests for all bidding validation logic
- **NEW**: Special contract validation tests
- **NEW**: Mark conversion and point calculation tests
- Integration tests for complete bidding flow
- E2E tests for all bidding scenarios including special contracts
- Error condition testing for all invalid scenarios
- Multi-player bidding simulation
- **NEW**: Trump suit selection testing
- State serialization testing

## Rules Compliance Validation
- [ ] Minimum bid of 30 points enforced
- [ ] All special contracts work according to research
- [ ] Trump suit system matches 7-suit Texas 42 standard
- [ ] Mark system correctly converts to points (1 mark = 42 points)
- [ ] Bidding sequence follows clockwise from dealer's left
- [ ] All edge cases handled (all pass, forced bid, etc.)

## Notes
- Bidding is critical to authentic Texas 42 experience
- **NEW**: Special contracts add significant complexity but are essential for authentic play
- Must handle edge cases like all players passing
- Consider future features like bid suggestions
- Ensure bidding works well for spectators
- Plan for potential bid timing limits
- Frontend validation for UX, backend for authority
- **NEW**: Special contract UI should be intuitive and well-documented
