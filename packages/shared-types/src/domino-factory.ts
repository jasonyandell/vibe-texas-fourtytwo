/**
 * Texas 42 Domino Factory
 * Functions for creating dominoes and domino sets
 */

import type { Domino, DominoSet } from './domino-types';
import { calculateDominoPointValue } from './domino-utils';

/**
 * Create a single domino with point values
 * Factory function that automatically calculates point values and count status
 * 
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns A complete domino with point values
 */
export function createDomino(high: number, low: number): Domino {
  // Validate input ranges
  if (high < 0 || high > 6 || low < 0 || low > 6) {
    throw new Error(`Invalid domino values: high=${high}, low=${low}. Values must be 0-6.`);
  }
  
  // Ensure high >= low (domino convention)
  if (low > high) {
    [high, low] = [low, high];
  }
  
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
 * Generates all 28 dominoes in a double-six set with point values
 * 
 * @returns Object containing all 28 dominoes and validation info
 */
export function createFullDominoSet(): DominoSet {
  const dominoes: Domino[] = [];

  // Generate all 28 domino combinations (double-six set)
  for (let high = 0; high <= 6; high++) {
    for (let low = 0; low <= high; low++) {
      dominoes.push(createDomino(high, low));
    }
  }

  const totalPoints = dominoes.reduce((sum, d) => sum + d.pointValue, 0);
  const isValid = totalPoints === 35 && dominoes.length === 28;

  return {
    dominoes,
    totalPoints,
    isValid
  };
}
