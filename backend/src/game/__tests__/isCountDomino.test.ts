import { describe, it, expect } from 'vitest'
import { isCountDomino, createDomino } from '../dominoes'

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