import { describe, it, expect } from 'vitest'
import { createDomino, isCountDomino, getCountDominoes } from '../gameUtils'

describe('Domino Creation and Identification', () => {
  describe('createDomino', () => {
    it('creates count dominoes with correct properties', () => {
      const domino = createDomino(5, 0)
      expect(domino.high).toBe(5)
      expect(domino.low).toBe(0)
      expect(domino.pointValue).toBe(5)
      expect(domino.isCountDomino).toBe(true)
      expect(domino.id).toBe('5-0')
    })

    it('creates non-count dominoes with correct properties', () => {
      const domino = createDomino(6, 6)
      expect(domino.high).toBe(6)
      expect(domino.low).toBe(6)
      expect(domino.pointValue).toBe(0)
      expect(domino.isCountDomino).toBe(false)
      expect(domino.id).toBe('6-6')
    })
  })

  describe('isCountDomino', () => {
    it('identifies count dominoes correctly', () => {
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

    it('identifies non-count dominoes correctly', () => {
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

  describe('getCountDominoes', () => {
    it('filters and returns only count dominoes', () => {
      const mixedDominoes = [
        createDomino(5, 0), // count
        createDomino(0, 0), // not count
        createDomino(4, 1), // count
        createDomino(6, 6), // not count
        createDomino(5, 5)  // count
      ]

      const countDominoes = getCountDominoes(mixedDominoes)
      expect(countDominoes).toHaveLength(3)
      expect(countDominoes.every(d => d.isCountDomino)).toBe(true)
    })
  })
})