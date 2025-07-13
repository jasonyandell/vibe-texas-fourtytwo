import { describe, it, expect, beforeEach } from 'vitest'
import { DominoSet } from '../dominoes'

describe('DominoSet', () => {
  let dominoSet: DominoSet

  beforeEach(() => {
    dominoSet = new DominoSet()
  })

  describe('getFullSet', () => {
    it('should return 28 dominoes', () => {
      const dominoes = dominoSet.getFullSet()
      expect(dominoes).toHaveLength(28)
    })

    it('should include all dominoes from 0-0 to 6-6', () => {
      const dominoes = dominoSet.getFullSet()
      const combinations = new Set()
      
      dominoes.forEach(domino => {
        const key = `${Math.max(domino.high, domino.low)}-${Math.min(domino.high, domino.low)}`
        combinations.add(key)
      })
      
      expect(combinations.size).toBe(28)
      expect(combinations.has('0-0')).toBe(true)
      expect(combinations.has('6-6')).toBe(true)
      expect(combinations.has('6-5')).toBe(true)
    })

    it('should return dominoes with unique IDs', () => {
      const dominoes = dominoSet.getFullSet()
      const ids = dominoes.map(d => d.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(28)
    })
  })

  describe('shuffle', () => {
    it('should return the same number of dominoes', () => {
      const dominoes = dominoSet.getFullSet()
      const shuffled = dominoSet.shuffle(dominoes)
      
      expect(shuffled).toHaveLength(dominoes.length)
    })

    it('should not modify the original array', () => {
      const dominoes = dominoSet.getFullSet()
      const original = [...dominoes]
      dominoSet.shuffle(dominoes)
      
      expect(dominoes).toEqual(original)
    })
  })

  describe('dealHands', () => {
    it('should deal 7 dominoes to each of 4 players', () => {
      const dominoes = dominoSet.getFullSet()
      const { hands, boneyard } = dominoSet.dealHands(dominoes)
      
      expect(hands).toHaveLength(4)
      hands.forEach(hand => {
        expect(hand).toHaveLength(7)
      })
      expect(boneyard).toHaveLength(0) // No boneyard in Texas 42
    })

    it('should deal all dominoes', () => {
      const dominoes = dominoSet.getFullSet()
      const { hands } = dominoSet.dealHands(dominoes)
      
      const totalDealt = hands.reduce((total, hand) => total + hand.length, 0)
      expect(totalDealt).toBe(28)
    })
  })

  describe('getDominoValue', () => {
    it('should return correct values for count dominoes', () => {
      expect(dominoSet.getDominoValue({ high: 5, low: 0, id: 'test' })).toBe(10)
      expect(dominoSet.getDominoValue({ high: 4, low: 1, id: 'test' })).toBe(10)
      expect(dominoSet.getDominoValue({ high: 3, low: 2, id: 'test' })).toBe(10)
      expect(dominoSet.getDominoValue({ high: 6, low: 4, id: 'test' })).toBe(10)
      expect(dominoSet.getDominoValue({ high: 5, low: 5, id: 'test' })).toBe(5)
    })

    it('should return 0 for non-count dominoes', () => {
      expect(dominoSet.getDominoValue({ high: 6, low: 6, id: 'test' })).toBe(0)
      expect(dominoSet.getDominoValue({ high: 2, low: 1, id: 'test' })).toBe(0)
      expect(dominoSet.getDominoValue({ high: 3, low: 0, id: 'test' })).toBe(0)
    })
  })

  describe('isDouble', () => {
    it('should identify doubles correctly', () => {
      expect(dominoSet.isDouble({ high: 6, low: 6, id: 'test' })).toBe(true)
      expect(dominoSet.isDouble({ high: 0, low: 0, id: 'test' })).toBe(true)
      expect(dominoSet.isDouble({ high: 6, low: 5, id: 'test' })).toBe(false)
    })
  })
})
