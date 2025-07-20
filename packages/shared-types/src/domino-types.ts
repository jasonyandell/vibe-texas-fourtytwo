/**
 * Texas 42 Domino Type Definitions
 * Core data structures for Texas 42 dominoes
 */

/**
 * Core domino interface with point values
 * Represents a single domino in the Texas 42 game
 */
export interface Domino {
  /** High value (0-6) */
  high: number;
  /** Low value (0-6) */
  low: number;
  /** Unique identifier */
  id: string;
  /** Point value: 0, 5, or 10 points */
  pointValue: number;
  /** True for scoring dominoes (count dominoes) */
  isCountDomino: boolean;
}

/**
 * Complete domino set with validation
 * Represents the full set of 28 dominoes used in Texas 42
 */
export interface DominoSet {
  /** All 28 dominoes in the set */
  dominoes: Domino[];
  /** Total points from count dominoes (must equal 35) */
  totalPoints: number;
  /** True if the set is valid (has correct dominoes and point total) */
  isValid: boolean;
}

/**
 * Constants for Texas 42 domino point system
 */
export const DOMINO_CONSTANTS = {
  /** Total number of dominoes in a double-six set */
  TOTAL_DOMINOES: 28,
  /** Total points available from count dominoes */
  TOTAL_COUNT_POINTS: 35,
  /** Number of count dominoes */
  COUNT_DOMINO_COUNT: 5,
  /** Valid point values for dominoes */
  VALID_POINT_VALUES: [0, 5, 10] as const,
  /** Maximum domino value (double-six) */
  MAX_DOMINO_VALUE: 6,
  /** Minimum domino value */
  MIN_DOMINO_VALUE: 0
} as const;