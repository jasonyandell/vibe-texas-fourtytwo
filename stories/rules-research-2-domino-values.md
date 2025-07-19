# Story: Texas 42 Domino Point Values Research

## Overview
Research and document the exact point values assigned to specific dominoes in Texas 42 for accurate scoring implementation.

## User Story
**As a** developer implementing Texas 42 scoring  
**I want** to know the exact point value of each domino  
**So that** I can implement accurate trick scoring and game totals

## Acceptance Criteria
- [x] Document point values for all scoring dominoes
- [x] Verify total points available equals 42
- [x] Identify any special scoring dominoes or rules
- [x] Create reference tables for implementation
- [x] Validate against multiple authoritative sources

## Research Tasks
- [x] Identify which dominoes carry point values (typically 5s and 10s)
- [x] Document exact point value for each scoring domino
- [x] Verify the total adds up to 42 points
- [x] Research any variations in point assignments
- [x] Check for special scoring rules or bonuses

## Research Findings

### Domino Point Values System

Based on pagat.com Texas 42 rules, dominoes have point values based on their pip count:

**10-Point Dominoes (2 dominoes):**
- 6-4 = 10 points (10 total pips)
- 5-5 = 10 points (10 total pips)

**5-Point Dominoes (3 dominoes):**
- 5-0 = 5 points (5 total pips)
- 4-1 = 5 points (5 total pips)
- 3-2 = 5 points (5 total pips)

**0-Point Dominoes (23 dominoes):**
All other dominoes have no point value.

### Complete Point Value Reference Table

| Domino | Pips | Points |
|--------|------|--------|
| 6-6    | 12   | 0      |
| 6-5    | 11   | 0      |
| 6-4    | 10   | **10** |
| 6-3    | 9    | 0      |
| 6-2    | 8    | 0      |
| 6-1    | 7    | 0      |
| 6-0    | 6    | 0      |
| 5-5    | 10   | **10** |
| 5-4    | 9    | 0      |
| 5-3    | 8    | 0      |
| 5-2    | 7    | 0      |
| 5-1    | 6    | 0      |
| 5-0    | 5    | **5**  |
| 4-4    | 8    | 0      |
| 4-3    | 7    | 0      |
| 4-2    | 6    | 0      |
| 4-1    | 5    | **5**  |
| 4-0    | 4    | 0      |
| 3-3    | 6    | 0      |
| 3-2    | 5    | **5**  |
| 3-1    | 4    | 0      |
| 3-0    | 3    | 0      |
| 2-2    | 4    | 0      |
| 2-1    | 3    | 0      |
| 2-0    | 2    | 0      |
| 1-1    | 2    | 0      |
| 1-0    | 1    | 0      |
| 0-0    | 0    | 0      |

### Point Verification
- **10-point dominoes**: 2 × 10 = 20 points
- **5-point dominoes**: 3 × 5 = 15 points
- **Trick points**: 7 tricks × 1 = 7 points
- **Total available**: 20 + 15 + 7 = **42 points** ✓

### Additional Scoring Rules
- **Each trick is worth 1 point** (7 tricks total = 7 points)
- **Domino points are only scored by the team that wins them in tricks**
- **No bonus scoring or special cases** in standard rules
- **Point values are fixed** - no variations in standard Texas 42

## Implementation Specifications

### Data Structure for Domino Values
```javascript
const DOMINO_POINT_VALUES = {
  "6-4": 10,
  "5-5": 10,
  "5-0": 5,
  "4-1": 5,
  "3-2": 5
  // All other dominoes default to 0 points
};

function getDominoPoints(domino) {
  const key = `${Math.max(domino.high, domino.low)}-${Math.min(domino.high, domino.low)}`;
  return DOMINO_POINT_VALUES[key] || 0;
}
```

### Scoring Calculation Methods
```javascript
function calculateTrickPoints(tricks) {
  let totalPoints = 0;

  // Each trick is worth 1 point
  totalPoints += tricks.length;

  // Add domino points from captured dominoes
  tricks.forEach(trick => {
    trick.dominoes.forEach(domino => {
      totalPoints += getDominoPoints(domino);
    });
  });

  return totalPoints;
}
```

### Validation Rules
- Total available points must equal exactly 42
- Only 5 dominoes have point values (2 tens, 3 fives)
- Trick points (7) + domino points (35) = 42 total
- Point values are immutable during gameplay

### Quick Reference for Developers
**Scoring Dominoes (5 total):**
- 6-4: 10 points
- 5-5: 10 points
- 5-0: 5 points
- 4-1: 5 points
- 3-2: 5 points

**Non-scoring Dominoes (23 total):** All others = 0 points

## Definition of Done
- [x] All domino point values documented and verified
- [x] Total points confirmed to equal 42
- [x] Point assignments validated against 2+ sources (pagat.com, Wikipedia)
- [x] Implementation-ready reference created
- [x] Any variations or special cases documented

## Sources Consulted
1. **Pagat.com Texas 42 Rules** - https://www.pagat.com/domino/trick/42.html
2. **Wikipedia List of Domino Games** - https://en.wikipedia.org/wiki/List_of_domino_games

## Story Status: COMPLETE ✅
All acceptance criteria met. Point value system is implementation-ready with verification that total equals 42.

## Estimated Effort
3-4 hours

## Dependencies
- Equipment and Setup research (to know all dominoes)

## Notes
This is critical for accurate scoring. The traditional Texas 42 has exactly 42 points available, hence the name. Common scoring dominoes include all dominoes with 5 or 10 pips, but exact values need verification.
