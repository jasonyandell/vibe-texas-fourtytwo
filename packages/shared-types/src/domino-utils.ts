/**
 * Texas 42 Domino Utility Functions
 * Core calculation and query utilities for dominoes
 */

import type { Domino } from './domino-types';

/**
 * Calculate the point value of a domino according to Texas 42 rules
 * Based on rules-research-2: dominoes with 5 or 10 total pips have point values
 * 
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
 * Count dominoes are the 5 dominoes that contribute to the 35 count points
 * 
 * @param domino The domino to check
 * @returns True if the domino has points
 */
export function isCountDomino(domino: Domino): boolean {
  return domino.pointValue > 0;
}

/**
 * Alternative count domino check using high/low values
 * Useful for validation and factory functions
 * 
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns True if the domino has points
 */
export function isCountDominoByValues(high: number, low: number): boolean {
  return calculateDominoPointValue(high, low) > 0;
}

/**
 * Get all count dominoes from a domino array
 * Filters dominoes to return only those with point values
 * 
 * @param dominoes Array of dominoes to filter
 * @returns Array containing only count dominoes
 */
export function getCountDominoes(dominoes: Domino[]): Domino[] {
  return dominoes.filter(d => d.isCountDomino);
}

/**
 * Calculate total points from a domino array
 * Sums up all point values from the given dominoes
 * 
 * @param dominoes Array of dominoes to sum
 * @returns Total point value
 */
export function calculateTotalPoints(dominoes: Domino[]): number {
  return dominoes.reduce((sum, d) => sum + d.pointValue, 0);
}