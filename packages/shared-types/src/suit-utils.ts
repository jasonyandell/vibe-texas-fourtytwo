/**
 * Texas 42 Suit Utility Functions
 * Conversion utilities for domino suits
 */

import { DominoSuit } from './trump-types';

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
 * Validate a trump suit
 * 
 * @param suit The suit to validate
 * @returns True if the suit is valid
 */
export function isValidTrumpSuit(suit: unknown): suit is DominoSuit {
  return typeof suit === 'string' && 
    ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'doubles'].includes(suit);
}