import { Domino, DominoSuit } from '@/types/texas42';

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
 * Get the point value of a domino (legacy function for compatibility)
 * @param domino The domino to evaluate
 * @returns Point value: 0, 5, or 10
 */
export function getDominoValue(domino: Domino): number {
  return calculateDominoPointValue(domino.high, domino.low);
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
 * Get all count dominoes from a set
 * @param dominoes Array of dominoes
 * @returns Array of count dominoes only
 */
export function getCountDominoes(dominoes: Domino[]): Domino[] {
  return dominoes.filter(d => isCountDomino(d));
}

/**
 * Validate that a domino set has exactly 35 count points
 * @param dominoes Array of dominoes to validate
 * @returns True if total count points equals 35
 */
export function validateDominoSetPoints(dominoes: Domino[]): boolean {
  const totalCountPoints = dominoes.reduce((sum, d) =>
    sum + calculateDominoPointValue(d.high, d.low), 0);
  return totalCountPoints === 35;
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

  return {
    dominoes,
    totalPoints,
    isValid: totalPoints === 35 // Must equal 35 count points
  };
}

export function isDouble(domino: Domino): boolean {
  return domino.high === domino.low;
}

export function getDominoSuit(domino: Domino): DominoSuit {
  if (isDouble(domino)) {
    return 'doubles';
  }
  
  // Return the higher number as the suit
  switch (domino.high) {
    case 0: return 'blanks';
    case 1: return 'ones';
    case 2: return 'twos';
    case 3: return 'threes';
    case 4: return 'fours';
    case 5: return 'fives';
    case 6: return 'sixes';
    default: return 'blanks';
  }
}

export function calculateHandValue(hand: Domino[]): number {
  return hand.reduce((total, domino) => total + getDominoValue(domino), 0);
}

export function sortDominoes(dominoes: Domino[]): Domino[] {
  return [...dominoes].sort((a, b) => {
    // Sort by high value first, then by low value
    if (a.high !== b.high) {
      return b.high - a.high;
    }
    return b.low - a.low;
  });
}