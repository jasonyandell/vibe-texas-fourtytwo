import { Domino, DominoSuit } from '@texas42/shared-types'

/**
 * Suit and trump utilities for Texas 42
 * Utilities for determining domino suits and trump values
 */

export function getDominoSuit(domino: Domino, trump?: DominoSuit): DominoSuit {
  // Handle trump suits
  if (trump === 'doubles' && domino.high === domino.low) {
    return 'doubles';
  }
  
  if (trump && trump !== 'doubles') {
    const trumpValue = getTrumpValue(trump);
    if (domino.high === trumpValue || domino.low === trumpValue) {
      return trump;
    }
  }
  
  // Default suit is the higher value
  if (domino.high === domino.low) {
    return 'doubles';
  }
  
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

export function getTrumpValue(trump: DominoSuit): number {
  switch (trump) {
    case 'blanks': return 0;
    case 'ones': return 1;
    case 'twos': return 2;
    case 'threes': return 3;
    case 'fours': return 4;
    case 'fives': return 5;
    case 'sixes': return 6;
    default: return -1;
  }
}