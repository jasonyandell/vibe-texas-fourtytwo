import { describe, it, expect } from 'vitest'
import { createFullDominoSet, getCountDominoes } from '../dominoes'

describe('createFullDominoSet', () => {
  it('should create exactly 28 dominoes', () => {
    const { dominoes } = createFullDominoSet()
    expect(dominoes).toHaveLength(28)
  })

  it('should have exactly 35 total points', () => {
    const { totalPoints, isValid } = createFullDominoSet()
    expect(totalPoints).toBe(35)
    expect(isValid).toBe(true)
  })

  it('should have exactly 5 count dominoes', () => {
    const { dominoes } = createFullDominoSet()
    const countDominoes = getCountDominoes(dominoes)
    expect(countDominoes).toHaveLength(5)
  })

  it('should include all expected count dominoes with correct points', () => {
    const { dominoes } = createFullDominoSet()
    const countDominoes = getCountDominoes(dominoes)

    const expectedCountDominoes = [
      { high: 5, low: 0, points: 5 },
      { high: 4, low: 1, points: 5 },
      { high: 3, low: 2, points: 5 },
      { high: 6, low: 4, points: 10 },
      { high: 5, low: 5, points: 10 }
    ]

    expectedCountDominoes.forEach(expected => {
      const found = countDominoes.find(d =>
        d.high === expected.high && d.low === expected.low
      )
      expect(found).toBeDefined()
      expect(found?.pointValue).toBe(expected.points)
    })
  })
})