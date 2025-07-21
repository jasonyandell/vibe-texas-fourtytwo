import { describe, it, expect } from 'vitest'
import {
  getDominoValue,
  getDominoSuit,
  isDouble
} from '../gameUtils'
import { Domino } from '@/types/texas42'

describe('Domino Property Utils', () => {
  describe('getDominoValue', () => {
    it('returns 5 for 5-0 (corrected point value)', () => {
      const domino: Domino = { id: 'd1', high: 5, low: 0, pointValue: 5, isCountDomino: true }
      expect(getDominoValue(domino)).toBe(5)
    })

    it('returns 5 for 4-1 (corrected point value)', () => {
      const domino: Domino = { id: 'd1', high: 4, low: 1, pointValue: 5, isCountDomino: true }
      expect(getDominoValue(domino)).toBe(5)
    })

    it('returns 5 for 3-2 (corrected point value)', () => {
      const domino: Domino = { id: 'd1', high: 3, low: 2, pointValue: 5, isCountDomino: true }
      expect(getDominoValue(domino)).toBe(5)
    })

    it('returns 10 for 6-4 (corrected point value)', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 4, pointValue: 10, isCountDomino: true }
      expect(getDominoValue(domino)).toBe(10)
    })

    it('returns 10 for 5-5 (corrected point value)', () => {
      const domino: Domino = { id: 'd1', high: 5, low: 5, pointValue: 10, isCountDomino: true }
      expect(getDominoValue(domino)).toBe(10)
    })

    it('returns 0 for non-count dominoes', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 3, pointValue: 0, isCountDomino: false }
      expect(getDominoValue(domino)).toBe(0)
    })
  })

  describe('getDominoSuit', () => {
    it('returns doubles for double dominoes', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 6, pointValue: 0, isCountDomino: false }
      expect(getDominoSuit(domino)).toBe('doubles')
    })

    it('returns correct suit for non-double dominoes', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 3, pointValue: 0, isCountDomino: false }
      expect(getDominoSuit(domino)).toBe('sixes')
    })
  })

  describe('isDouble', () => {
    it('returns true for double dominoes', () => {
      const domino: Domino = { id: 'd1', high: 4, low: 4, pointValue: 0, isCountDomino: false }
      expect(isDouble(domino)).toBe(true)
    })

    it('returns false for non-double dominoes', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 3, pointValue: 0, isCountDomino: false }
      expect(isDouble(domino)).toBe(false)
    })
  })
})