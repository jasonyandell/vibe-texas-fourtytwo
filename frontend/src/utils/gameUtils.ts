import { Domino, GameState, DominoSuit } from '@/types/texas42';

/**
 * Utility functions for Texas 42 game logic
 */

export function getDominoValue(domino: Domino): number {
  const { high, low } = domino;
  
  // Count dominoes (5s and 10s)
  if ((high === 5 && low === 0) || (high === 4 && low === 1)) return 10; // 5-0 and 4-1
  if ((high === 3 && low === 2) || (high === 6 && low === 4)) return 10; // 3-2 and 6-4
  if (high === 5 && low === 5) return 5; // 5-5
  
  return 0; // Non-count dominoes
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

export function canPlayDomino(_domino: Domino, _gameState: GameState): boolean {
  // TODO: Implement domino play validation
  // This is where frontend validation logic will go
  return true;
}

export function formatGameState(gameState: GameState): string {
  // TODO: Implement game state serialization for URLs
  return JSON.stringify(gameState);
}

export function parseGameState(serialized: string): GameState | null {
  try {
    return JSON.parse(serialized);
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
