import { nanoid } from 'nanoid'
import { Domino } from '@texas42/shared-types'

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

export class DominoSet {
  private fullSet: Domino[] = []

  constructor() {
    this.generateFullSet()
  }

  private generateFullSet(): void {
    this.fullSet = []

    // Generate all dominoes from 0-0 to 6-6 (28 total)
    for (let high = 0; high <= 6; high++) {
      for (let low = 0; low <= high; low++) {
        const pointValue = calculateDominoPointValue(high, low);
        this.fullSet.push({
          high,
          low,
          id: nanoid(),
          pointValue,
          isCountDomino: pointValue > 0
        })
      }
    }
  }

  getFullSet(): Domino[] {
    // Return a fresh copy with new IDs for each game
    return this.fullSet.map(domino => ({
      ...domino,
      id: nanoid()
    }))
  }

  shuffle(dominoes: Domino[]): Domino[] {
    const shuffled = [...dominoes]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  dealHands(dominoes: Domino[]): { hands: Domino[][], boneyard: Domino[] } {
    const shuffled = this.shuffle(dominoes)
    const hands: Domino[][] = [[], [], [], []]
    
    // Deal 7 dominoes to each of 4 players
    for (let i = 0; i < 28; i++) {
      const playerIndex = i % 4
      hands[playerIndex].push(shuffled[i])
    }
    
    return {
      hands,
      boneyard: [] // No boneyard in Texas 42 - all dominoes are dealt
    }
  }

  getDominoValue(domino: Domino, _trump?: string): number {
    return calculateDominoPointValue(domino.high, domino.low)
  }

  isDouble(domino: Domino): boolean {
    return domino.high === domino.low
  }

  getDominoSuit(domino: Domino): string {
    if (this.isDouble(domino)) {
      return 'doubles'
    }
    return domino.high.toString()
  }
}
