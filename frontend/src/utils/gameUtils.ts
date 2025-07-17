import { Domino, GameState, DominoSuit, Bid } from '@/types/texas42';

/**
 * Utility functions for Texas 42 game logic
 */

/**
 * Calculate the point value of a domino according to Texas 42 rules
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns Point value: 0, 5, or 10
 */
export function calculateDominoPointValue(high: number, low: number): number {
  const total = high + low;
  if (total === 5) return 5;   // 5-0, 4-1, 3-2
  if (total === 10) return 10; // 6-4, 5-5
  return 0;                    // All other dominoes
}

/**
 * Get the point value of a domino (legacy function for compatibility)
 * @param domino The domino to evaluate
 * @returns Point value: 0, 5, or 10
 */
export function getDominoValue(domino: Domino): number {
  return calculateDominoPointValue(domino.high, domino.low);
}

/**
 * Check if a domino is a count domino (has point value > 0)
 * @param domino The domino to check
 * @returns True if the domino has points
 */
export function isCountDomino(domino: Domino): boolean {
  return calculateDominoPointValue(domino.high, domino.low) > 0;
}

/**
 * Get all count dominoes from a set
 * @param dominoes Array of dominoes
 * @returns Array of count dominoes only
 */
export function getCountDominoes(dominoes: Domino[]): Domino[] {
  return dominoes.filter(d => isCountDomino(d));
}

/**
 * Validate that a domino set has exactly 35 count points
 * @param dominoes Array of dominoes to validate
 * @returns True if total count points equals 35
 */
export function validateDominoSetPoints(dominoes: Domino[]): boolean {
  const totalCountPoints = dominoes.reduce((sum, d) =>
    sum + calculateDominoPointValue(d.high, d.low), 0);
  return totalCountPoints === 35;
}

/**
 * Create a single domino with point values
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns A complete domino with point values
 */
export function createDomino(high: number, low: number): Domino {
  const pointValue = calculateDominoPointValue(high, low);
  const isCountDomino = pointValue > 0;

  return {
    high,
    low,
    id: `${high}-${low}`,
    pointValue,
    isCountDomino
  };
}

/**
 * Create a full domino set with validation
 * @returns Object containing all 28 dominoes and validation info
 */
export function createFullDominoSet(): { dominoes: Domino[], totalPoints: number, isValid: boolean } {
  const dominoes: Domino[] = [];

  // Generate all 28 domino combinations
  for (let high = 0; high <= 6; high++) {
    for (let low = 0; low <= high; low++) {
      dominoes.push(createDomino(high, low));
    }
  }

  const totalPoints = dominoes.reduce((sum, d) => sum + d.pointValue, 0);

  return {
    dominoes,
    totalPoints,
    isValid: totalPoints === 35 // Must equal 35 count points
  };
}

export function isDouble(domino: Domino): boolean {
  return domino.high === domino.low;
}

export function getDominoSuit(domino: Domino): DominoSuit {
  if (isDouble(domino)) {
    return 'doubles';
  }
  
  // Return the higher number as the suit
  switch (domino.high) {
    case 0: return 'blanks';
    case 1: return 'ones';
    case 2: return 'twos';
    case 3: return 'threes';
    case 4: return 'fours';
    case 5: return 'fives';
    case 6: return 'sixes';
    default: return 'blanks';
  }
}

/**
 * Frontend validation for domino plays
 * This provides immediate feedback before backend submission
 */
export function canPlayDomino(domino: Domino, gameState: GameState, playerId: string): { valid: boolean; error?: string } {
  // Check if it's the player's turn
  if (gameState.currentPlayer !== playerId) {
    return { valid: false, error: 'Not your turn to play' };
  }

  // Check if player has the domino
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) {
    return { valid: false, error: 'Player not found' };
  }

  const hasDomino = player.hand.some(d => d.id === domino.id);
  if (!hasDomino) {
    return { valid: false, error: 'You do not have this domino' };
  }

  // Check if domino can be played (follow suit rules)
  if (gameState.currentTrick && gameState.currentTrick.dominoes.length > 0) {
    const leadSuit = gameState.currentTrick.leadSuit;
    const dominoSuit = getDominoSuit(domino);

    // Must follow suit if possible (unless playing trump)
    if (leadSuit && dominoSuit !== leadSuit) {
      // Check if player has non-trump dominoes of the lead suit
      const canFollowSuit = player.hand.some(d => {
        const dSuit = getDominoSuit(d);
        return dSuit === leadSuit && dSuit !== gameState.trump;
      });

      // If can follow suit with non-trump, must do so (unless playing trump)
      if (canFollowSuit && dominoSuit !== gameState.trump) {
        return { valid: false, error: 'Must follow suit if possible' };
      }
    }
  }

  return { valid: true };
}

/**
 * Frontend validation for bids
 * This provides immediate feedback before backend submission
 */
export function canBid(bid: Bid, gameState: GameState): { valid: boolean; error?: string } {
  // Check if it's the player's turn to bid
  if (gameState.currentPlayer !== bid.playerId) {
    return { valid: false, error: 'Not your turn to bid' };
  }

  // Check bid amount
  if (bid.amount !== 0 && (bid.amount < 30 || bid.amount > 42)) {
    return { valid: false, error: 'Bid must be between 30-42 or 0 (pass)' };
  }

  // Check if bid is higher than current bid
  if (gameState.currentBid && bid.amount !== 0 && bid.amount <= gameState.currentBid.amount) {
    return { valid: false, error: 'Bid must be higher than current bid' };
  }

  // Check trump selection for non-pass bids
  if (bid.amount > 0 && !bid.trump) {
    return { valid: false, error: 'Must select trump suit for non-pass bids' };
  }

  return { valid: true };
}

/**
 * Get valid dominoes that a player can play
 */
export function getValidDominoes(gameState: GameState, playerId: string): Domino[] {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player || gameState.currentPlayer !== playerId) {
    return [];
  }

  // If no current trick or it's empty, can play any domino
  if (!gameState.currentTrick || gameState.currentTrick.dominoes.length === 0) {
    return player.hand;
  }

  const leadSuit = gameState.currentTrick.leadSuit;
  if (!leadSuit) {
    return player.hand;
  }

  // Find dominoes that follow suit
  const followSuitDominoes = player.hand.filter(d => getDominoSuit(d) === leadSuit);

  // If can follow suit, must follow suit
  if (followSuitDominoes.length > 0) {
    return followSuitDominoes;
  }

  // If can't follow suit, can play any domino
  return player.hand;
}

export function formatGameState(gameState: GameState): string {
  // TODO: Implement game state serialization for URLs
  return JSON.stringify(gameState);
}

export function parseGameState(serialized: string): GameState | null {
  try {
    return JSON.parse(serialized) as GameState;
  } catch {
    return null;
  }
}

export function calculateHandValue(hand: Domino[]): number {
  return hand.reduce((total, domino) => total + getDominoValue(domino), 0);
}

export function sortDominoes(dominoes: Domino[]): Domino[] {
  return [...dominoes].sort((a, b) => {
    // Sort by high value first, then by low value
    if (a.high !== b.high) {
      return b.high - a.high;
    }
    return b.low - a.low;
  });
}
