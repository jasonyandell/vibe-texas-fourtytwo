import { describe, it, expect } from 'vitest'
import { calculateDominoPointValue } from '../dominoes'

describe('calculateDominoPointValue', () => {
  it('should return 5 points for dominoes with pip total of 5', () => {
    expect(calculateDominoPointValue(5, 0)).toBe(5)
    expect(calculateDominoPointValue(4, 1)).toBe(5)
    expect(calculateDominoPointValue(3, 2)).toBe(5)
  })

  it('should return 10 points for dominoes with pip total of 10', () => {
    expect(calculateDominoPointValue(6, 4)).toBe(10)
    expect(calculateDominoPointValue(5, 5)).toBe(10)
  })

  it('should return 0 points for all other dominoes', () => {
    expect(calculateDominoPointValue(0, 0)).toBe(0)
    expect(calculateDominoPointValue(1, 0)).toBe(0)
    expect(calculateDominoPointValue(6, 6)).toBe(0)
    expect(calculateDominoPointValue(4, 4)).toBe(0)
    expect(calculateDominoPointValue(6, 3)).toBe(0)
  })

  it('should handle all 28 domino combinations correctly', () => {
    const expectedPoints: { [key: string]: number } = {
      '5-0': 5, '4-1': 5, '3-2': 5, '6-4': 10, '5-5': 10
    }

    for (let high = 0; high <= 6; high++) {
      for (let low = 0; low <= high; low++) {
        const key = `${high}-${low}`
        const expected = expectedPoints[key] || 0
        expect(calculateDominoPointValue(high, low)).toBe(expected)
      }
    }
  })
})