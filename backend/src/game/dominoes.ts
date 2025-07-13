import { nanoid } from 'nanoid'
import { Domino } from '@/types/texas42.js'

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
        this.fullSet.push({
          high,
          low,
          id: nanoid()
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
    // Texas 42 domino values for scoring
    const { high, low } = domino
    
    // Count dominoes (5s and 10s)
    if ((high === 5 && low === 0) || (high === 4 && low === 1)) return 10 // 5-0 and 4-1
    if ((high === 3 && low === 2) || (high === 6 && low === 4)) return 10 // 3-2 and 6-4
    if (high === 5 && low === 5) return 5 // 5-5
    
    return 0 // Non-count dominoes
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
