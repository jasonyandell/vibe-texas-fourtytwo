import { describe, it, expect } from 'vitest'
import {
  isValidTrick,
  createCompatibleTrick,
  createCompatiblePlayedDomino,
  type Trick
} from '@texas42/shared-types'

describe('Trick Validation', () => {
  const validTrick: Trick = createCompatibleTrick(
    'trick-1',
    [
      createCompatiblePlayedDomino(
        { id: '1', high: 6, low: 3, pointValue: 0, isCountDomino: false },
        'player-1',
        'north',
        0
      )
    ],
    1
  )

  it('validates correct trick', () => {
    expect(isValidTrick(validTrick)).toBe(true)
  })

  it('validates complete trick', () => {
    const trick: Trick = createCompatibleTrick(
      'trick-complete',
      [
        createCompatiblePlayedDomino({ id: '1', high: 6, low: 3, pointValue: 0, isCountDomino: false }, 'player-1', 'north', 0),
        createCompatiblePlayedDomino({ id: '2', high: 5, low: 2, pointValue: 0, isCountDomino: false }, 'player-2', 'east', 1),
        createCompatiblePlayedDomino({ id: '3', high: 4, low: 1, pointValue: 5, isCountDomino: true }, 'player-3', 'south', 2),
        createCompatiblePlayedDomino({ id: '4', high: 3, low: 0, pointValue: 0, isCountDomino: false }, 'player-4', 'west', 3)
      ],
      1,
      {
        winner: 'player-1',
        leadSuit: 'sixes'
      }
    )
    expect(isValidTrick(trick)).toBe(true)
  })

  it('rejects trick with too many dominoes', () => {
    const trick = {
      ...validTrick,
      dominoes: Array(5).fill(validTrick.dominoes[0])
    }
    expect(isValidTrick(trick)).toBe(false)
  })

  it('rejects trick with invalid domino', () => {
    const trick = {
      ...validTrick,
      dominoes: [{
        domino: { id: '1', high: 7, low: 3 }, // Invalid domino
        playerId: 'player-1',
        position: 'north'
      }]
    }
    expect(isValidTrick(trick)).toBe(false)
  })
})