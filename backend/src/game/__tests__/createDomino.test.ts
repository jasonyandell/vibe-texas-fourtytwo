import { describe, it, expect } from 'vitest'
import { createDomino } from '../dominoes'

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