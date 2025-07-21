import { Domino, createDomino } from '@/types/texas42'

// Generate all 28 domino combinations for visual testing
export const generateAllDominoes = (): Domino[] => {
  const dominoes: Domino[] = []
  for (let high = 0; high <= 6; high++) {
    for (let low = 0; low <= high; low++) {
      dominoes.push(createDomino(high, low))
    }
  }
  return dominoes
}

// Test data for count dominoes
export const fivePointDominoes = [
  createDomino(5, 0),
  createDomino(4, 1),
  createDomino(3, 2)
]

export const tenPointDominoes = [
  createDomino(6, 4),
  createDomino(5, 5)
]

export const allDominoes = generateAllDominoes()
export const testDominoMidRange = allDominoes[10]
export const testDominoOrientation = allDominoes[15]
export const countDomino = createDomino(5, 0) // 5-point domino
export const regularDomino = createDomino(6, 1) // 0-point domino
export const tenPointDomino = createDomino(6, 4) // 10-point domino