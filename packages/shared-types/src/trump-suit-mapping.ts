/**
 * Texas 42 Trump Suit Mapping Functions
 * Determines which suits a domino belongs to based on trump rules
 */

import { Domino } from './dominoes';
import { DominoSuit } from './trump-types';
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
 * Get all trump dominoes from a set
 * 
 * @param dominoes Array of dominoes to filter
 * @param trump Current trump suit
 * @returns Array of trump dominoes
 */
export function getTrumpDominoes(dominoes: Domino[], trump: DominoSuit): Domino[] {
  return dominoes.filter(d => isTrumpDomino(d, trump));
}