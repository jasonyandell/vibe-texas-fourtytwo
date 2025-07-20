import { describe, it, expect } from 'vitest'
import { createDomino } from '@/types/texas42'

describe('Point Value System Validation', () => {
  // Generate all 28 domino combinations
  const generateAllDominoes = () => {
    const dominoes = []
    for (let high = 0; high <= 6; high++) {
      for (let low = 0; low <= high; low++) {
        dominoes.push(createDomino(high, low))
      }
    }
    return dominoes
  }

  const allDominoes = generateAllDominoes()

  it('validates all 28 domino combinations have correct point values', () => {
    const expectedPointValues = new Map([
      // 5-point dominoes
      ['5-0', 5], ['4-1', 5], ['3-2', 5],
      // 10-point dominoes
      ['6-4', 10], ['5-5', 10],
      // All other dominoes should have 0 points
    ])

    let totalPoints = 0
    let countDominoes = 0

    allDominoes.forEach(domino => {
      const dominoKey = `${domino.high}-${domino.low}`
      const expectedPoints = expectedPointValues.get(dominoKey) || 0

      expect(domino.pointValue).toBe(expectedPoints)
      expect(domino.isCountDomino).toBe(expectedPoints > 0)

      totalPoints += domino.pointValue
      if (domino.isCountDomino) countDominoes++
    })

    // Validate total point system: 35 count points + 7 tricks = 42 total
    expect(totalPoints).toBe(35)
    expect(countDominoes).toBe(5)
  })
})