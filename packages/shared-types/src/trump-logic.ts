/**
 * Texas 42 Trump Logic Functions
 * Core logic for trump determination, ranking, and comparison
 */

import { Domino } from './dominoes';
import { DominoSuit, TrumpHierarchy, NoTrumpConfig } from './trump-types';
import { getSuitValue, getSuitName } from './suit-utils';

/**
 * Determine which suits a domino belongs to given the current trump
 * Based on rules-research-4 mapping logic
 * 
 * @param domino The domino to map
 * @param trump The current trump suit
 * @returns Array of suits this domino belongs to
 */
export function getDominoSuits(domino: Domino, trump: DominoSuit): DominoSuit[] {
  if (trump === 'doubles') {
    // In doubles trump, all doubles are trump
    if (domino.high === domino.low) return ['doubles'];
    // Non-doubles belong to both number suits they contain
    return [getSuitName(domino.high), getSuitName(domino.low)];
  }
  
  // Regular trump suit
  if (domino.high === domino.low) {
    // Doubles belong to their number suit when it's trump, otherwise both suits
    if (getSuitName(domino.high) === trump) return [trump];
    return [getSuitName(domino.high)];
  }
  
  // Check if either end is trump
  const suits = [getSuitName(domino.high), getSuitName(domino.low)];
  if (suits.includes(trump)) return [trump];
  
  // Non-trump domino: belongs to the higher number suit
  return [getSuitName(domino.high)];
}

/**
 * Check if a domino is trump
 * 
 * @param domino The domino to check
 * @param trump The current trump suit
 * @returns True if the domino is trump
 */
export function isTrumpDomino(domino: Domino, trump: DominoSuit): boolean {
  const suits = getDominoSuits(domino, trump);
  return suits.includes(trump);
}

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

/**
 * Get all trump dominoes from a set
 * 
 * @param dominoes Array of dominoes to filter
 * @param trump Current trump suit
 * @returns Array of trump dominoes
 */
export function getTrumpDominoes(dominoes: Domino[], trump: DominoSuit): Domino[] {
  return dominoes.filter(d => isTrumpDomino(d, trump));
}

/**
 * Create a trump hierarchy for a given trump suit
 * Returns all trump dominoes ranked from highest to lowest
 * 
 * @param trump The trump suit
 * @param allDominoes All available dominoes
 * @returns Trump hierarchy information
 */
export function createTrumpHierarchy(trump: DominoSuit, allDominoes: Domino[]): TrumpHierarchy {
  const trumpDominoes = getTrumpDominoes(allDominoes, trump);
  
  // Sort trump dominoes from highest to lowest
  const rankedDominoes = trumpDominoes.sort((a, b) => compareTrumpDominoes(b, a, trump));
  
  return {
    suit: trump,
    rankedDominoes,
    trumpCount: trumpDominoes.length
  };
}

/**
 * Create a no-trump configuration
 * 
 * @param doublesOption Whether doubles are high or low
 * @returns No-trump configuration
 */
export function createNoTrumpConfig(doublesOption: 'high' | 'low' = 'high'): NoTrumpConfig {
  return {
    doublesOption,
    specialRules: [
      'No trump suit in effect',
      `Doubles are ${doublesOption} in each suit`,
      'Follow suit rules still apply',
      'Highest domino of led suit wins'
    ]
  };
}