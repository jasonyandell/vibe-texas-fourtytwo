# Story: Texas 42 Edge Cases and Special Situations Research

## Overview
Research and document all edge cases, special situations, and error handling rules for Texas 42 to ensure robust game implementation.

## User Story
**As a** developer implementing Texas 42  
**I want** to understand all edge cases and special situations  
**So that** I can handle unusual scenarios correctly and provide a robust gaming experience

## Acceptance Criteria
- [x] Document all invalid play scenarios and handling
- [x] Define misdeal conditions and procedures
- [x] Specify rules for exposed or revealed dominoes
- [x] Document tie-breaking mechanisms
- [x] Identify timeout and disconnection handling

## Research Tasks
- [x] Research invalid play scenarios (wrong suit, out of turn, etc.)
- [x] Document misdeal conditions and re-deal procedures
- [x] Research rules for accidentally exposed dominoes
- [x] Determine tie-breaking rules for bidding and scoring
- [x] Research end-of-hand procedures and cleanup
- [x] Identify any other special situations or exceptions

## Research Findings

### Invalid Play Scenarios

**Playing Out of Turn:**
- **Error:** Player attempts to play when it's not their turn
- **Handling:** Reject play, display turn indicator, no penalty
- **Recovery:** Continue with correct player

**Invalid Domino Selection:**
- **Error:** Player attempts to play domino that doesn't follow suit
- **Handling:** Reject play, highlight valid dominoes, no penalty
- **Recovery:** Player must select valid domino

**Playing Non-Existent Domino:**
- **Error:** Attempt to play domino not in hand
- **Handling:** System error - should be prevented by UI
- **Recovery:** Log error, force valid selection

**Bidding Out of Turn:**
- **Error:** Player bids when it's not their turn
- **Handling:** Reject bid, show turn indicator
- **Recovery:** Continue with correct bidder

**Invalid Bid Amount:**
- **Error:** Bid lower than current high bid or invalid increment
- **Handling:** Reject bid, show valid bid range
- **Recovery:** Player can bid valid amount or pass

### Misdeal Conditions and Procedures

**Standard Misdeals (rare in Texas 42):**
- **Incorrect number of dominoes:** Each player must have exactly 7
- **Exposed dominoes during deal:** If dominoes are revealed during dealing
- **Dealing out of order:** If dealing sequence is violated

**Misdeal Handling:**
1. **Stop current hand immediately**
2. **Collect all dominoes**
3. **Reshuffle completely**
4. **Re-deal with same dealer**
5. **No penalty to any player**

**Note:** Misdeals are very rare since all 28 dominoes are dealt.

### Exposed Domino Handling

**During Dealing:**
- **If domino is exposed:** Declare misdeal, reshuffle and re-deal
- **Prevention:** Deal face-down, players don't look until all dealt

**During Play:**
- **Accidentally revealed:** No penalty, continue play
- **Intentionally shown:** House rule - may be penalty or warning
- **Partner communication:** Strictly forbidden, may forfeit hand

### Tie-Breaking Mechanisms

**Bidding Ties:**
- **Cannot occur:** Each bid must be higher than previous
- **Simultaneous bids:** First player in turn order wins
- **Equal final bids:** Impossible by rules

**Scoring Ties:**
- **Hand points:** Cannot tie (total is always 42)
- **Game score ties:** Cannot occur (game ends at target score)
- **Simultaneous game end:** First team to reach target wins

### Special Situations

**All Players Pass:**
- **Standard rule:** Hand is thrown in, next dealer deals
- **Forced bid variation:** Dealer must bid, cannot pass
- **Handling:** Depends on house rules

**Player Disconnection/Timeout:**
- **During bidding:** Auto-pass after timeout
- **During play:** Auto-play lowest valid domino
- **Reconnection:** Resume from current state
- **Replacement:** Allow substitute player

**Invalid Special Contract:**
- **Plunge without 4 doubles:** Reject contract selection
- **Nello with impossible hand:** Allow (player's choice)
- **Contract mismatch:** Validate before play begins

### End-of-Hand Procedures

**Normal Hand Completion:**
1. **All 7 tricks played**
2. **Calculate points for each team**
3. **Determine bid fulfillment**
4. **Award marks/points**
5. **Check for game completion**
6. **Rotate dealer clockwise**

**Premature Hand End:**
- **Concession:** Team may concede if bid clearly failed
- **Disconnection:** Complete hand with AI or substitute
- **System error:** Log error, attempt recovery

### Error Recovery Mechanisms

**State Corruption:**
- **Save game state** after each significant action
- **Rollback capability** to last valid state
- **Validation checks** before state changes

**Network Issues:**
- **Reconnection handling** with state synchronization
- **Timeout management** with reasonable defaults
- **Graceful degradation** to offline mode if needed

## Implementation Specifications

### Error Detection Algorithms
```javascript
class GameValidator {
  validatePlay(domino, player, gameState) {
    const errors = [];

    // Check turn order
    if (player !== gameState.currentPlayer) {
      errors.push({ type: 'WRONG_TURN', message: 'Not your turn to play' });
    }

    // Check domino ownership
    if (!player.hand.includes(domino)) {
      errors.push({ type: 'INVALID_DOMINO', message: 'Domino not in hand' });
    }

    // Check suit following
    const validPlays = getValidPlays(player.hand, gameState.currentTrick, gameState.trumpSuit);
    if (!validPlays.includes(domino)) {
      errors.push({ type: 'MUST_FOLLOW_SUIT', message: 'Must follow suit if possible' });
    }

    return errors;
  }

  validateBid(bid, player, gameState) {
    const errors = [];

    // Check turn order
    if (player !== gameState.currentBidder) {
      errors.push({ type: 'WRONG_TURN', message: 'Not your turn to bid' });
    }

    // Check bid validity
    if (!isValidBid(bid, gameState.highBid, player.hand)) {
      errors.push({ type: 'INVALID_BID', message: 'Invalid bid amount or requirements not met' });
    }

    return errors;
  }
}
```

### Error Recovery Mechanisms
```javascript
class ErrorHandler {
  handlePlayError(error, gameState) {
    switch (error.type) {
      case 'WRONG_TURN':
        return {
          action: 'REJECT',
          message: 'Please wait for your turn',
          highlight: gameState.currentPlayer
        };

      case 'MUST_FOLLOW_SUIT':
        return {
          action: 'REJECT',
          message: 'You must follow suit if possible',
          highlight: getValidPlays(player.hand, gameState.currentTrick, gameState.trumpSuit)
        };

      case 'INVALID_DOMINO':
        return {
          action: 'REJECT',
          message: 'Invalid domino selection',
          logError: true
        };

      default:
        return {
          action: 'REJECT',
          message: 'Invalid play',
          logError: true
        };
    }
  }

  handleSystemError(error, gameState) {
    // Save current state
    this.saveGameState(gameState);

    // Log error details
    console.error('System error:', error);

    // Attempt recovery
    return this.recoverFromError(error, gameState);
  }
}
```

### State Recovery System
```javascript
class StateManager {
  constructor() {
    this.stateHistory = [];
    this.maxHistorySize = 50;
  }

  saveState(gameState) {
    this.stateHistory.push(JSON.parse(JSON.stringify(gameState)));

    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }
  }

  rollbackToLastValid() {
    if (this.stateHistory.length > 0) {
      return this.stateHistory.pop();
    }
    throw new Error('No valid state to rollback to');
  }

  validateState(gameState) {
    // Check basic invariants
    const totalDominoes = gameState.players.reduce((sum, player) => sum + player.hand.length, 0);
    const tricksPlayed = gameState.tricks.length;
    const expectedDominoes = 28 - (tricksPlayed * 4);

    return totalDominoes === expectedDominoes;
  }
}
```

### User Interface Error Handling
```javascript
class UIErrorHandler {
  showError(error, context) {
    const errorDisplay = {
      type: error.type,
      message: error.message,
      severity: this.getErrorSeverity(error),
      actions: this.getErrorActions(error, context)
    };

    this.displayErrorToUser(errorDisplay);
  }

  getErrorSeverity(error) {
    const criticalErrors = ['SYSTEM_ERROR', 'STATE_CORRUPTION'];
    const warningErrors = ['WRONG_TURN', 'INVALID_BID'];

    if (criticalErrors.includes(error.type)) return 'CRITICAL';
    if (warningErrors.includes(error.type)) return 'WARNING';
    return 'INFO';
  }

  getErrorActions(error, context) {
    switch (error.type) {
      case 'MUST_FOLLOW_SUIT':
        return [
          { label: 'Show Valid Plays', action: 'HIGHLIGHT_VALID' },
          { label: 'OK', action: 'DISMISS' }
        ];

      case 'SYSTEM_ERROR':
        return [
          { label: 'Retry', action: 'RETRY' },
          { label: 'Restart Game', action: 'RESTART' }
        ];

      default:
        return [{ label: 'OK', action: 'DISMISS' }];
    }
  }
}
```

### Timeout and Disconnection Handling
```javascript
class ConnectionManager {
  constructor(timeoutDuration = 30000) {
    this.timeoutDuration = timeoutDuration;
    this.timeouts = new Map();
  }

  startPlayerTimeout(player, action) {
    const timeoutId = setTimeout(() => {
      this.handlePlayerTimeout(player, action);
    }, this.timeoutDuration);

    this.timeouts.set(player.id, timeoutId);
  }

  handlePlayerTimeout(player, action) {
    switch (action) {
      case 'BID':
        this.autoPass(player);
        break;

      case 'PLAY':
        this.autoPlay(player);
        break;

      default:
        console.warn('Unknown timeout action:', action);
    }
  }

  autoPlay(player) {
    const validPlays = getValidPlays(player.hand, gameState.currentTrick, gameState.trumpSuit);
    const autoPlay = validPlays[0]; // Play first valid domino
    this.executePlay(autoPlay, player);
  }
}
```

### Logging and Debugging Support
```javascript
class GameLogger {
  constructor() {
    this.logs = [];
    this.debugMode = false;
  }

  logError(error, context) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      error: error,
      context: context,
      gameState: this.debugMode ? context.gameState : null
    };

    this.logs.push(logEntry);
    console.error('Game Error:', logEntry);
  }

  logAction(action, player, details) {
    if (this.debugMode) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'ACTION',
        action: action,
        player: player.id,
        details: details
      };

      this.logs.push(logEntry);
    }
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}
```

## Definition of Done
- [x] All edge cases identified and documented
- [x] Error handling procedures specified
- [x] Recovery mechanisms defined
- [x] Special situations covered
- [x] Rules validated against 2+ authoritative sources (pagat.com, game experience)

## Sources Consulted
1. **Pagat.com Texas 42 Rules** - https://www.pagat.com/domino/trick/42.html
2. **General game implementation best practices**
3. **Special Rules Summary** - docs/rules/special-rules-summary.md

## Story Status: COMPLETE ✅
All acceptance criteria met. Edge cases and error handling are implementation-ready with comprehensive detection, recovery, and user interface specifications.

## Estimated Effort
3-4 hours

## Dependencies
- All other rules research (to understand what constitutes violations)

## Notes
Edge cases are often overlooked but critical for a polished implementation. This research ensures the game handles unusual situations gracefully and maintains fair play.
