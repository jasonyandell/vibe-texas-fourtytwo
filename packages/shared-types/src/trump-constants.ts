/**
 * Texas 42 Trump System Constants
 * Static constants for the trump system
 */

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