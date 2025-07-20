import { describe, it, expect } from 'vitest'
import {
  isValidDomino,
  type Domino
} from '@texas42/shared-types'

describe('Domino Validation', () => {
  it('validates correct domino', () => {
    const domino: Domino = { id: '1', high: 6, low: 3, pointValue: 0, isCountDomino: false }
    expect(isValidDomino(domino)).toBe(true)
  })

  it('validates blank domino', () => {
    const domino: Domino = { id: '2', high: 0, low: 0, pointValue: 0, isCountDomino: false }
    expect(isValidDomino(domino)).toBe(true)
  })

  it('rejects domino with invalid high value', () => {
    const domino = { id: '3', high: 7, low: 3, pointValue: 0, isCountDomino: false }
    expect(isValidDomino(domino)).toBe(false)
  })

  it('rejects domino with invalid low value', () => {
    const domino = { id: '4', high: 3, low: -1, pointValue: 0, isCountDomino: false }
    expect(isValidDomino(domino)).toBe(false)
  })

  it('rejects domino with missing id', () => {
    const domino = { high: 3, low: 2, pointValue: 5, isCountDomino: true }
    expect(isValidDomino(domino)).toBe(false)
  })

  it('rejects domino where low > high', () => {
    const domino = { id: '5', high: 2, low: 5, pointValue: 0, isCountDomino: false }
    expect(isValidDomino(domino)).toBe(false)
  })
})