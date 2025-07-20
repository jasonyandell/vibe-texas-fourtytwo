# Demo Plan Phase 4: Bidding System Display

## Prerequisites
**CRITICAL**: Read and understand all documentation in @docs/ before starting:
- `@docs/design.md` - TDD methodology and component architecture
- `@docs/rules/bidding-summary.md` - Texas 42 bidding mechanics
- `@stories/demo-plan-0.md` - Overview of demo showcase requirements
- Study existing `BiddingPanel.tsx` and trump suit logic

**Dependency**: Phase 3 (Players & Partnerships) must be complete with all tests passing.

## Goal
Create an interactive display of the Texas 42 bidding system with trump suit visualization and sample bidding sequences.

## What to Build
- Visual display of all 7 trump suits (blanks through sixes)
- Interactive bid amount controls (30-42 range)
- Sample bidding history panel showing realistic bid sequences
- Trump suit highlighting that shows which dominoes become trump
- Bid validation and minimum bid enforcement

## Key Features
- **Trump Suits Display**: Visual cards for each of the 7 trump suits
- **Interactive Bid Controls**: Slider/input for bid amounts with validation
- **Trump Domino Highlighting**: Click trump suit to highlight affected dominoes
- **Sample Bidding History**: Realistic bidding sequence with passes and bids
- **Bid Validation**: Show valid/invalid bid states with helpful messages
- **Current Bid Display**: Highlighted winning bid with trump suit

## Success Criteria
- All 7 trump suits display with clear labels and descriptions
- Bid amount controls work with proper validation (30-42 range)
- Trump suit selection highlights correct dominoes in domino grid
- Sample bidding history shows realistic Texas 42 bidding patterns
- Bid validation provides helpful feedback for invalid bids
- Current winning bid is clearly highlighted
- All Playwright tests pass

## TDD Approach
1. Write failing tests for trump suit display and bid controls
2. Create `BiddingSection` component with trump suit visualization
3. Add interactive bid controls and validation
4. Integrate with dominoes section for trump highlighting

## Key Components to Create
- `BiddingSection` - Main section component
- `TrumpSuitCard` - Individual trump suit display
- `BidHistoryPanel` - Sample bidding sequence display
- CSS module for bidding controls and trump suit styling
- Integration with existing bidding types and validation

## Testing Focus
- Trump suit display and selection
- Bid amount validation and controls
- Trump domino highlighting integration
- Bidding history display
- Responsive bidding interface
- Accessibility for bidding controls

This phase demonstrates the strategic bidding element that makes Texas 42 unique among domino games.
