# Texas 42 Comprehensive Test Plan

## Overview

This document defines a comprehensive test plan that validates all Texas 42 rules researched in the 8 rules research stories. The plan covers unit tests, integration tests, end-to-end tests, and acceptance criteria to ensure 100% authentic Texas 42 rule implementation.

## Test Strategy

### Test Pyramid Structure
- **Unit Tests (60%)**: Core rule logic, calculations, validations
- **Integration Tests (30%)**: Component interactions, game flow
- **End-to-End Tests (10%)**: Complete game scenarios, user workflows

### Test Categories
1. **Rule Validation Tests**: Verify each researched rule is correctly implemented
2. **Edge Case Tests**: Handle all special situations and error conditions
3. **Performance Tests**: Ensure game logic performs within acceptable limits
4. **Accessibility Tests**: Verify game is accessible to all players
5. **Cross-Browser Tests**: Ensure compatibility across platforms

## Unit Test Plan

### 1. Domino System Tests (From rules-research-1, rules-research-2)

#### 1.1 Domino Point Value Tests
```typescript
describe('Domino Point Values', () => {
  test('5-point dominoes are correctly identified', () => {
    expect(getDominoPointValue(5, 0)).toBe(5); // 5-0
    expect(getDominoPointValue(4, 1)).toBe(5); // 4-1
    expect(getDominoPointValue(3, 2)).toBe(5); // 3-2
  });
  
  test('10-point dominoes are correctly identified', () => {
    expect(getDominoPointValue(6, 4)).toBe(10); // 6-4
    expect(getDominoPointValue(5, 5)).toBe(10); // 5-5
  });
  
  test('non-count dominoes have 0 points', () => {
    expect(getDominoPointValue(6, 6)).toBe(0); // 6-6 double
    expect(getDominoPointValue(2, 1)).toBe(0); // 2-1 regular
  });
  
  test('total points in full set equals 42', () => {
    const fullSet = createFullDominoSet();
    const totalPoints = fullSet.reduce((sum, domino) => sum + domino.pointValue, 0);
    expect(totalPoints).toBe(35); // 35 count points + 7 tricks = 42
  });
});
```

#### 1.2 Domino Set Validation Tests
```typescript
describe('Domino Set Validation', () => {
  test('full double-6 set contains exactly 28 dominoes', () => {
    const fullSet = createFullDominoSet();
    expect(fullSet).toHaveLength(28);
  });
  
  test('all domino combinations are unique', () => {
    const fullSet = createFullDominoSet();
    const combinations = fullSet.map(d => `${d.high}-${d.low}`);
    const uniqueCombinations = new Set(combinations);
    expect(uniqueCombinations.size).toBe(28);
  });
  
  test('count dominoes are correctly identified', () => {
    const countDominoes = getCountDominoes();
    expect(countDominoes).toHaveLength(5);
    expect(countDominoes.every(d => d.isCountDomino)).toBe(true);
  });
});
```

### 2. Trump Suit System Tests (From rules-research-4)

#### 2.1 Trump Suit Mapping Tests
```typescript
describe('Trump Suit Mapping', () => {
  test('domino belongs to correct suits when trump is regular suit', () => {
    const domino = { high: 6, low: 3 }; // 6-3
    const suits = getDominoSuits(domino, 'sixes');
    expect(suits).toContain('sixes'); // Trump suit
  });
  
  test('doubles trump system works correctly', () => {
    const double = { high: 4, low: 4 }; // 4-4
    const suits = getDominoSuits(double, 'doubles');
    expect(suits).toEqual(['doubles']);
  });
  
  test('trump hierarchy within suit is correct', () => {
    const trump = 'fives';
    const domino1 = { high: 5, low: 6 }; // 5-6 (high five)
    const domino2 = { high: 5, low: 2 }; // 5-2 (low five)
    expect(compareTrumpDominoes(domino1, domino2, trump)).toBeGreaterThan(0);
  });
});
```

#### 2.2 Trump Comparison Tests
```typescript
describe('Trump Comparison Logic', () => {
  test('trump always beats non-trump', () => {
    const trump = { high: 2, low: 1, suits: ['twos'] }; // Low trump
    const nonTrump = { high: 6, low: 6, suits: ['sixes'] }; // High non-trump
    expect(compareDominoes(trump, nonTrump, 'twos')).toBeGreaterThan(0);
  });
  
  test('higher trump beats lower trump', () => {
    const highTrump = { high: 5, low: 6 }; // 5-6
    const lowTrump = { high: 5, low: 1 }; // 5-1
    expect(compareTrumpDominoes(highTrump, lowTrump, 'fives')).toBeGreaterThan(0);
  });
});
```

### 3. Bidding System Tests (From rules-research-3)

#### 3.1 Bid Validation Tests
```typescript
describe('Bid Validation', () => {
  test('minimum bid is 30 points', () => {
    expect(isValidBid({ amount: 29 })).toBe(false);
    expect(isValidBid({ amount: 30 })).toBe(true);
  });
  
  test('each bid must be higher than previous', () => {
    const currentBid = { amount: 35 };
    expect(isValidBid({ amount: 35 }, currentBid)).toBe(false);
    expect(isValidBid({ amount: 36 }, currentBid)).toBe(true);
  });
  
  test('mark bids convert correctly to points', () => {
    expect(convertBidToPoints({ marks: 1 })).toBe(42);
    expect(convertBidToPoints({ marks: 2 })).toBe(84);
  });
});
```

#### 3.2 Special Contract Tests
```typescript
describe('Special Contracts', () => {
  test('plunge requires 4+ doubles', () => {
    const handWith4Doubles = [
      { high: 1, low: 1 }, { high: 2, low: 2 },
      { high: 3, low: 3 }, { high: 4, low: 4 },
      { high: 5, low: 6 }, { high: 2, low: 3 }, { high: 1, low: 4 }
    ];
    expect(canMakeSpecialContract(handWith4Doubles, 'plunge')).toBe(true);
    
    const handWith3Doubles = handWith4Doubles.slice(1); // Remove one double
    expect(canMakeSpecialContract(handWith3Doubles, 'plunge')).toBe(false);
  });
  
  test('nello can be bid by any player', () => {
    const anyHand = createRandomHand();
    expect(canMakeSpecialContract(anyHand, 'nello')).toBe(true);
  });
});
```

### 4. Trick-Taking Tests (From rules-research-5)

#### 4.1 Follow-Suit Validation Tests
```typescript
describe('Follow-Suit Rules', () => {
  test('must follow suit if possible', () => {
    const hand = [
      { high: 6, low: 3 }, // 6-3 (can follow sixes)
      { high: 2, low: 1 }  // 2-1 (cannot follow sixes)
    ];
    const ledDomino = { high: 6, low: 5 }; // 6-5 (sixes led)
    const validPlays = getValidPlays(hand, ledDomino, 'blanks');
    expect(validPlays).toContain(hand[0]); // Must include 6-3
    expect(validPlays).not.toContain(hand[1]); // Cannot include 2-1
  });
  
  test('can play any domino if cannot follow suit', () => {
    const hand = [
      { high: 2, low: 1 }, // 2-1 (cannot follow sixes)
      { high: 3, low: 4 }  // 3-4 (cannot follow sixes)
    ];
    const ledDomino = { high: 6, low: 5 }; // 6-5 (sixes led)
    const validPlays = getValidPlays(hand, ledDomino, 'blanks');
    expect(validPlays).toEqual(hand); // Can play any domino
  });
});
```

#### 4.2 Trick Winner Determination Tests
```typescript
describe('Trick Winner Logic', () => {
  test('highest trump wins trick', () => {
    const trick = [
      { domino: { high: 5, low: 6 }, playerId: 'p1' }, // High trump
      { domino: { high: 5, low: 2 }, playerId: 'p2' }, // Low trump
      { domino: { high: 6, low: 6 }, playerId: 'p3' }  // Non-trump
    ];
    const winner = determineTrickWinner(trick, 'fives');
    expect(winner).toBe('p1');
  });
  
  test('highest of suit led wins if no trump', () => {
    const trick = [
      { domino: { high: 6, low: 3 }, playerId: 'p1' }, // 6-3 (sixes)
      { domino: { high: 6, low: 5 }, playerId: 'p2' }, // 6-5 (sixes, higher)
      { domino: { high: 2, low: 1 }, playerId: 'p3' }  // 2-1 (different suit)
    ];
    const winner = determineTrickWinner(trick, 'blanks');
    expect(winner).toBe('p2'); // 6-5 is higher six
  });
});
```

### 5. Scoring System Tests (From rules-research-6)

#### 5.1 Hand Scoring Tests
```typescript
describe('Hand Scoring', () => {
  test('calculates count points correctly', () => {
    const tricks = [
      { dominoes: [{ pointValue: 5 }, { pointValue: 0 }] }, // 5 points
      { dominoes: [{ pointValue: 10 }, { pointValue: 0 }] } // 10 points
    ];
    const score = calculateHandScore(tricks);
    expect(score.countPoints).toBe(15);
    expect(score.trickPoints).toBe(2);
    expect(score.totalPoints).toBe(17);
  });
  
  test('determines bid fulfillment correctly', () => {
    const bid = { amount: 35 };
    const score = { totalPoints: 36 };
    expect(isBidFulfilled(score, bid)).toBe(true);
    
    const failedScore = { totalPoints: 34 };
    expect(isBidFulfilled(failedScore, bid)).toBe(false);
  });
});
```

#### 5.2 Mark System Tests
```typescript
describe('Mark System', () => {
  test('awards 1 mark for successful point bid', () => {
    const bid = { amount: 35, marks: undefined };
    const score = { totalPoints: 36, bidFulfilled: true };
    expect(calculateMarksAwarded(score, bid)).toBe(1);
  });
  
  test('awards correct marks for mark bids', () => {
    const bid = { marks: 2 }; // 2-mark bid
    const score = { totalPoints: 84, bidFulfilled: true };
    expect(calculateMarksAwarded(score, bid)).toBe(2);
  });
  
  test('opposing team gets marks when bid fails', () => {
    const bid = { amount: 35 };
    const score = { totalPoints: 30, bidFulfilled: false };
    const opposingMarks = calculateOpposingMarks(score, bid);
    expect(opposingMarks).toBe(1);
  });
});
```

## Integration Test Plan

### 1. Complete Game Flow Tests
```typescript
describe('Complete Game Flow', () => {
  test('full game from start to finish', async () => {
    const game = await createGame();
    await joinAllPlayers(game);
    await dealDominoes(game);
    await completeBiddingPhase(game);
    await playAllTricks(game);
    await calculateScores(game);
    expect(game.phase).toBe('finished');
    expect(game.winner).toBeDefined();
  });
  
  test('multiple hands until game completion', async () => {
    const game = await createGame();
    let handCount = 0;
    
    while (!game.gameComplete && handCount < 20) { // Safety limit
      await playCompleteHand(game);
      handCount++;
    }
    
    expect(game.gameComplete).toBe(true);
    expect(game.marks.northSouth >= 7 || game.marks.eastWest >= 7).toBe(true);
  });
});
```

### 2. Special Contract Integration Tests
```typescript
describe('Special Contract Integration', () => {
  test('nello contract complete flow', async () => {
    const game = await createGameWithNelloBid();
    await playNelloHand(game);
    const result = await calculateNelloScore(game);
    expect(result.nelloSuccessful).toBeDefined();
  });
  
  test('plunge contract with partner trump selection', async () => {
    const game = await createGameWithPlungeBid();
    await selectTrumpByPartner(game);
    await playPlung
```

Let me continue with the comprehensive test plan by extending the file:

<function_calls>
<invoke name="str-replace-editor">
<parameter name="command">str_replace
