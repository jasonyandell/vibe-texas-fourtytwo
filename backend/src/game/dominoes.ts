import { nanoid } from 'nanoid'
import { Domino } from '@texas42/shared-types'
import { calculateDominoPointValue, isDouble, getDominoSuit } from './dominoUtils'

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
    return isDouble(domino)
  }

  getDominoSuit(domino: Domino): string {
    return getDominoSuit(domino)
  }
}

// Re-export utility functions for backward compatibility
export { 
  calculateDominoPointValue,
  isCountDomino,
  getCountDominoes,
  validateDominoSetPoints,
  createDomino,
  createFullDominoSet
} from './dominoUtils'