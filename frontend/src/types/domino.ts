/**
 * Domino Types
 * Core types and utilities for domino representation in Texas 42
 */

// Domino representation
export interface Domino {
  high: number;        // 0-6
  low: number;         // 0-6
  id: string;          // unique identifier
  pointValue: number;  // 0, 5, or 10 points
  isCountDomino: boolean; // true for scoring dominoes
}

// Domino suits for trump
export type DominoSuit = 'blanks' | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'doubles';

// Domino state (alias for Domino interface for story compliance)
export type DominoState = Domino;

/**
 * Validates if a value is a valid domino
 */
export function isValidDomino(value: unknown): value is Domino {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { id, high, low, pointValue, isCountDomino } = obj;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (typeof high !== 'number' || typeof low !== 'number') return false;
  if (typeof pointValue !== 'number' || typeof isCountDomino !== 'boolean') return false;

  // Check value ranges (0-6 for double-six dominoes)
  if (high < 0 || high > 6 || low < 0 || low > 6) return false;

  // Check domino convention: high >= low
  if (low > high) return false;

  // Check point value is valid (0, 5, or 10)
  if (![0, 5, 10].includes(pointValue)) return false;

  // Check consistency between pointValue and isCountDomino
  if ((pointValue > 0) !== isCountDomino) return false;

  return true;
}

/**
 * Validates domino suit enum
 */
export function validateDominoSuit(value: unknown): value is DominoSuit {
  return typeof value === 'string' &&
    ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'doubles'].includes(value);
}

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
 * Check if a domino is a count domino (has point value > 0)
 * @param domino The domino to check
 * @returns True if the domino has points
 */
export function isCountDomino(domino: Domino): boolean {
  return calculateDominoPointValue(domino.high, domino.low) > 0;
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
  const isValid = totalPoints === 35;

  return {
    dominoes,
    totalPoints,
    isValid
  };
}