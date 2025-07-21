/**
 * Texas 42 Domino Validators
 * Functions for validating dominoes and domino sets
 */

import type { Domino, DominoSet } from './domino-types';
import { calculateDominoPointValue, calculateTotalPoints } from './domino-utils';
import { createFullDominoSet } from './domino-factory';

/**
 * Validate a domino object
 * Checks if a domino has valid structure and values
 * 
 * @param value Object to validate
 * @returns True if the object is a valid domino
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

  // Verify point value calculation is correct
  const expectedPointValue = calculateDominoPointValue(high, low);
  if (pointValue !== expectedPointValue) return false;

  return true;
}

/**
 * Validate a domino set
 * Checks if a domino set is complete and valid for Texas 42
 * 
 * @param dominoSet The domino set to validate
 * @returns True if the set is valid
 */
export function isValidDominoSet(dominoSet: DominoSet): boolean {
  const { dominoes, totalPoints, isValid } = dominoSet;
  
  // Check basic structure
  if (!Array.isArray(dominoes) || typeof totalPoints !== 'number' || typeof isValid !== 'boolean') {
    return false;
  }
  
  // Must have exactly 28 dominoes
  if (dominoes.length !== 28) return false;
  
  // All dominoes must be valid
  if (!dominoes.every(isValidDomino)) return false;
  
  // Must have exactly 35 count points
  const calculatedPoints = calculateTotalPoints(dominoes);
  if (calculatedPoints !== 35 || totalPoints !== 35) return false;
  
  // Check for duplicate dominoes
  const ids = new Set(dominoes.map(d => d.id));
  if (ids.size !== 28) return false;
  
  // Verify we have all expected dominoes
  const expectedDominoes = createFullDominoSet();
  const expectedIds = new Set(expectedDominoes.dominoes.map(d => d.id));
  
  for (const id of ids) {
    if (!expectedIds.has(id)) return false;
  }
  
  return isValid;
}