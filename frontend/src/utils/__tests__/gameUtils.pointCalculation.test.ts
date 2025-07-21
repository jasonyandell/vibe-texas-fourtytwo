import { describe, it, expect } from 'vitest'
import { calculateDominoPointValue } from '../gameUtils'

describe('calculateDominoPointValue', () => {
  it('returns 5 points for dominoes with pip total of 5', () => {
    expect(calculateDominoPointValue(5, 0)).toBe(5)
    expect(calculateDominoPointValue(4, 1)).toBe(5)
    expect(calculateDominoPointValue(3, 2)).toBe(5)
  })

  it('returns 10 points for dominoes with pip total of 10', () => {
    expect(calculateDominoPointValue(6, 4)).toBe(10)
    expect(calculateDominoPointValue(5, 5)).toBe(10)
  })

  it('returns 0 points for all other dominoes', () => {
    expect(calculateDominoPointValue(0, 0)).toBe(0)
    expect(calculateDominoPointValue(1, 0)).toBe(0)
    expect(calculateDominoPointValue(6, 6)).toBe(0)
    expect(calculateDominoPointValue(4, 4)).toBe(0)
    expect(calculateDominoPointValue(6, 3)).toBe(0)
  })

  it('validates all 28 domino combinations total 35 points', () => {
    let totalPoints = 0
    let dominoCount = 0

    for (let high = 0; high <= 6; high++) {
      for (let low = 0; low <= high; low++) {
        totalPoints += calculateDominoPointValue(high, low)
        dominoCount++
      }
    }

    expect(dominoCount).toBe(28)
    expect(totalPoints).toBe(35)
  })
})