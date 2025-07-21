/**
 * Texas 42 Trump Ranking Functions
 * Functions for determining trump ranks and comparing dominoes
 */

import { Domino } from './dominoes';
import { DominoSuit } from './trump-types';
import { getSuitValue } from './suit-utils';
import { isTrumpDomino } from './trump-suit-mapping';

/**
 * Get the trump rank of a domino within its trump suit
 * Higher rank means stronger trump
 * 
 * @param domino The domino to rank
 * @param trump The current trump suit
 * @returns Trump rank (higher = stronger) or -1 if not trump
 */
export function getTrumpRank(domino: Domino, trump: DominoSuit): number {
  if (!isTrumpDomino(domino, trump)) return -1;
  
  if (trump === 'doubles') {
    // In doubles trump, rank by pip total (6-6 highest, 0-0 lowest)
    return domino.high; // Since high === low for doubles
  }
  
  // For regular trump suits
  if (domino.high === domino.low) {
    // Double is highest in its suit
    return 7; // Higher than any single domino (0-6)
  }
  
  // For non-double trump, rank by the non-trump end
  const trumpValue = getSuitValue(trump);
  if (domino.high === trumpValue) {
    return domino.low; // Trump is high end, rank by low end
  } else {
    return domino.high; // Trump is low end, rank by high end
  }
}

/**
 * Compare two dominoes for trump hierarchy
 * Returns positive if domino1 is stronger, negative if domino2 is stronger, 0 if equal
 * 
 * @param domino1 First domino
 * @param domino2 Second domino
 * @param trump Current trump suit
 * @returns Comparison result
 */
export function compareTrumpDominoes(domino1: Domino, domino2: Domino, trump: DominoSuit): number {
  const rank1 = getTrumpRank(domino1, trump);
  const rank2 = getTrumpRank(domino2, trump);
  
  // If both are trump, compare ranks
  if (rank1 >= 0 && rank2 >= 0) {
    return rank1 - rank2;
  }
  
  // If only one is trump, trump wins
  if (rank1 >= 0) return 1;
  if (rank2 >= 0) return -1;
  
  // Neither is trump, compare by suit and value
  return compareNonTrumpDominoes(domino1, domino2);
}

/**
 * Compare two non-trump dominoes
 * Used when neither domino is trump
 * 
 * @param domino1 First domino
 * @param domino2 Second domino
 * @returns Comparison result
 */
export function compareNonTrumpDominoes(domino1: Domino, domino2: Domino): number {
  // Compare by higher end first
  if (domino1.high !== domino2.high) {
    return domino1.high - domino2.high;
  }
  
  // If high ends are equal, compare by lower end
  return domino1.low - domino2.low;
}