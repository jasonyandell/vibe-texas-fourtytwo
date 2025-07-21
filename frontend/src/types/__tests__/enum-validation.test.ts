import { describe, it, expect } from 'vitest'
import {
  validatePlayerPosition,
  validateGamePhase,
  validateDominoSuit
} from '@texas42/shared-types'

describe('Enum Validation', () => {
  it('validates player positions', () => {
    expect(validatePlayerPosition('north')).toBe(true)
    expect(validatePlayerPosition('east')).toBe(true)
    expect(validatePlayerPosition('south')).toBe(true)
    expect(validatePlayerPosition('west')).toBe(true)
    expect(validatePlayerPosition('invalid')).toBe(false)
  })

  it('validates game phases', () => {
    expect(validateGamePhase('bidding')).toBe(true)
    expect(validateGamePhase('playing')).toBe(true)
    expect(validateGamePhase('scoring')).toBe(true)
    expect(validateGamePhase('finished')).toBe(true)
    expect(validateGamePhase('invalid')).toBe(false)
  })

  it('validates domino suits', () => {
    expect(validateDominoSuit('blanks')).toBe(true)
    expect(validateDominoSuit('ones')).toBe(true)
    expect(validateDominoSuit('sixes')).toBe(true)
    expect(validateDominoSuit('doubles')).toBe(true)
    expect(validateDominoSuit('invalid')).toBe(false)
  })
})