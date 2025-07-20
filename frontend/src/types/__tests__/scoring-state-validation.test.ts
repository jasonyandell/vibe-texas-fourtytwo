import { describe, it, expect } from 'vitest'
import {
  isValidScoringState,
  createEmptyScoringState
} from '@texas42/shared-types'

describe('ScoringState Validation', () => {
  it('validates correct scoring state', () => {
    const scoringState = createEmptyScoringState()
    expect(isValidScoringState(scoringState)).toBe(true)
  })

  it('validates scoring state with count dominoes', () => {
    const scoringState = {
      trickPoints: 5,
      countDominoes: [{ id: '5-0', high: 5, low: 0, pointValue: 5, isCountDomino: true }],
      bonusPoints: 10,
      penaltyPoints: 0,
      roundComplete: true,
      currentTrickWinner: 'player1'
    }
    expect(isValidScoringState(scoringState)).toBe(true)
  })

  it('rejects scoring state with invalid count dominoes', () => {
    const scoringState = {
      trickPoints: 5,
      countDominoes: [{ id: '5-0', high: 8, low: 0, pointValue: 5, isCountDomino: true }], // Invalid domino
      bonusPoints: 10,
      penaltyPoints: 0,
      roundComplete: false
    }
    expect(isValidScoringState(scoringState)).toBe(false)
  })

  it('rejects scoring state with negative trick points', () => {
    const scoringState = {
      trickPoints: -1,
      countDominoes: [],
      bonusPoints: 0,
      penaltyPoints: 0,
      roundComplete: false
    }
    expect(isValidScoringState(scoringState)).toBe(false)
  })
})