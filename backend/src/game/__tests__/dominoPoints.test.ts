import { describe, it, expect } from 'vitest'
import {
  calculateDominoPointValue,
  isCountDomino,
  getCountDominoes,
  validateDominoSetPoints,
  createDomino,
  createFullDominoSet
} from '../dominoes'

describe('Point Calculation Functions', () => {
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

  describe('createDomino', () => {
    it('should create count dominoes with correct properties', () => {
      const domino = createDomino(5, 0)
      expect(domino.high).toBe(5)
      expect(domino.low).toBe(0)
      expect(domino.pointValue).toBe(5)
      expect(domino.isCountDomino).toBe(true)
      expect(domino.id).toBe('5-0')
    })

    it('should create non-count dominoes with correct properties', () => {
      const domino = createDomino(6, 6)
      expect(domino.high).toBe(6)
      expect(domino.low).toBe(6)
      expect(domino.pointValue).toBe(0)
      expect(domino.isCountDomino).toBe(false)
      expect(domino.id).toBe('6-6')
    })
  })

  describe('isCountDomino', () => {
    it('should identify count dominoes correctly', () => {
      const countDominoes = [
        createDomino(5, 0),
        createDomino(4, 1),
        createDomino(3, 2),
        createDomino(6, 4),
        createDomino(5, 5)
      ]

      countDominoes.forEach(domino => {
        expect(isCountDomino(domino)).toBe(true)
      })
    })

    it('should identify non-count dominoes correctly', () => {
      const nonCountDominoes = [
        createDomino(0, 0),
        createDomino(1, 0),
        createDomino(6, 6),
        createDomino(4, 4)
      ]

      nonCountDominoes.forEach(domino => {
        expect(isCountDomino(domino)).toBe(false)
      })
    })
  })

  describe('validateDominoSetPoints', () => {
    it('should validate a complete domino set has exactly 35 points', () => {
      const { dominoes } = createFullDominoSet()
      expect(validateDominoSetPoints(dominoes)).toBe(true)
    })

    it('should return false for incomplete sets', () => {
      const incompleteDominoes = [
        createDomino(5, 0), // 5 points
        createDomino(4, 1)  // 5 points - total 10, not 35
      ]
      expect(validateDominoSetPoints(incompleteDominoes)).toBe(false)
    })
  })

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
})