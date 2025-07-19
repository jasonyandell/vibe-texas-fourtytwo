/**
 * Texas 42 Trump Suit System Types
 * Complete trump suit system with 7 suits and domino mapping logic
 */

import { Domino } from './dominoes';

/**
 * The 7 trump suits in Texas 42
 * Based on rules-research-4: 6 number suits plus doubles
 */
export type DominoSuit = 'blanks' | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'doubles';

/**
 * Trump system configuration
 * Defines the current trump state and options
 */
export interface TrumpSystem {
  /** The current trump suit */
  suit: DominoSuit;
  /** True if no trump is in effect */
  isNoTrump: boolean;
  /** For no-trump games: whether doubles are high or low */
  doublesOption?: 'high' | 'low';
}

/**
 * Domino suit mapping information
 * Shows which suits a domino belongs to and its trump status
 */
export interface DominoSuitMapping {
  /** The domino being mapped */
  domino: Domino;
  /** All suits this domino belongs to */
  suits: DominoSuit[];
  /** True if this domino is trump */
  isTrump: boolean;
  /** Ranking within trump suit (higher = stronger) */
  trumpRank?: number;
}

/**
 * Trump hierarchy information
 * Defines the ranking system within trump suits
 */
export interface TrumpHierarchy {
  /** The trump suit */
  suit: DominoSuit;
  /** All trump dominoes ranked from highest to lowest */
  rankedDominoes: Domino[];
  /** Total number of trump dominoes */
  trumpCount: number;
}

/**
 * No-trump game configuration
 * Special rules for games without trump
 */
export interface NoTrumpConfig {
  /** Whether doubles are high or low in each suit */
  doublesOption: 'high' | 'low';
  /** Special rules that apply */
  specialRules: string[];
}

/**
 * Convert a domino suit to its numeric value
 * Used for trump determination and comparison
 * 
 * @param suit The domino suit
 * @returns Numeric value (0-6) or -1 for doubles
 */
export function getSuitValue(suit: DominoSuit): number {
  switch (suit) {
    case 'blanks': return 0;
    case 'ones': return 1;
    case 'twos': return 2;
    case 'threes': return 3;
    case 'fours': return 4;
    case 'fives': return 5;
    case 'sixes': return 6;
    case 'doubles': return -1;
    default: return -1;
  }
}

/**
 * Convert a numeric value to its domino suit name
 * Used for mapping domino values to suit names
 * 
 * @param value Numeric value (0-6)
 * @returns The corresponding domino suit
 */
export function getSuitName(value: number): DominoSuit {
  switch (value) {
    case 0: return 'blanks';
    case 1: return 'ones';
    case 2: return 'twos';
    case 3: return 'threes';
    case 4: return 'fours';
    case 5: return 'fives';
    case 6: return 'sixes';
    default: throw new Error(`Invalid suit value: ${value}. Must be 0-6.`);
  }
}

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
 * Validate a trump suit
 * 
 * @param suit The suit to validate
 * @returns True if the suit is valid
 */
export function isValidTrumpSuit(suit: unknown): suit is DominoSuit {
  return typeof suit === 'string' && 
    ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'doubles'].includes(suit);
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

/**
 * Constants for the trump system
 */
export const TRUMP_CONSTANTS = {
  /** All valid trump suits */
  ALL_SUITS: ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'doubles'] as const,
  /** Number of regular suits (excluding doubles) */
  REGULAR_SUIT_COUNT: 7,
  /** Maximum trump rank for doubles */
  MAX_DOUBLE_RANK: 7,
  /** Number of dominoes in each regular suit */
  DOMINOES_PER_REGULAR_SUIT: 7,
  /** Number of doubles */
  DOUBLES_COUNT: 7
} as const;
