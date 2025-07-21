import { describe, it, expect } from 'vitest'
import {
  validateDominoSetPoints,
  createDomino,
  createFullDominoSet,
  getCountDominoes
} from '../gameUtils'

describe('Domino Set Validation', () => {
  describe('validateDominoSetPoints', () => {
    it('validates complete domino set has exactly 35 points', () => {
      const { dominoes } = createFullDominoSet()
      expect(validateDominoSetPoints(dominoes)).toBe(true)
    })

    it('returns false for incomplete sets', () => {
      const incompleteDominoes = [
        createDomino(5, 0), // 5 points
        createDomino(4, 1)  // 5 points - total 10, not 35
      ]
      expect(validateDominoSetPoints(incompleteDominoes)).toBe(false)
    })
  })

  describe('createFullDominoSet', () => {
    it('creates exactly 28 dominoes with 35 total points', () => {
      const { dominoes, totalPoints, isValid } = createFullDominoSet()
      expect(dominoes).toHaveLength(28)
      expect(totalPoints).toBe(35)
      expect(isValid).toBe(true)
    })

    it('includes exactly 5 count dominoes', () => {
      const { dominoes } = createFullDominoSet()
      const countDominoes = getCountDominoes(dominoes)
      expect(countDominoes).toHaveLength(5)
    })

    it('includes all expected count dominoes with correct points', () => {
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
})