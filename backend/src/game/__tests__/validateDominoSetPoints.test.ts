import { describe, it, expect } from 'vitest'
import { validateDominoSetPoints, createDomino, createFullDominoSet } from '../dominoes'

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