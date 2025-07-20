import { Domino, createDomino } from '@/types/texas42'

// Test fixtures for DominoComponent tests
export const mockDomino: Domino = createDomino(6, 3)
export const mockBlankDomino: Domino = createDomino(0, 0)
export const mockDoubleDomino: Domino = createDomino(5, 5)

// Generate all 28 domino combinations for comprehensive testing
export const generateAllDominoes = (): Domino[] => {
  const dominoes: Domino[] = []
  for (let high = 0; high <= 6; high++) {
    for (let low = 0; low <= high; low++) {
      dominoes.push(createDomino(high, low))
    }
  }
  return dominoes
}

export const allDominoes = generateAllDominoes()

// Count dominoes in Texas 42: 5-0, 4-1, 3-2, 6-4, 5-5
export const countDominoes = [
  { high: 5, low: 0 },
  { high: 4, low: 1 },
  { high: 3, low: 2 },
  { high: 6, low: 4 },
  { high: 5, low: 5 }
]