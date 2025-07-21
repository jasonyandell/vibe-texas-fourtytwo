import { describe, it, expect } from 'vitest'
import {
  isValidPlayer,
  type Player,
  type PlayerPosition
} from '@texas42/shared-types'

describe('Player Validation', () => {
  const validPlayer: Player = {
    id: 'player-1',
    name: 'Test Player',
    position: 'north',
    hand: [],
    isConnected: true,
    isReady: false
  }

  it('validates correct player', () => {
    expect(isValidPlayer(validPlayer)).toBe(true)
  })

  it('rejects player with invalid position', () => {
    const player = { ...validPlayer, position: 'invalid' as PlayerPosition }
    expect(isValidPlayer(player)).toBe(false)
  })

  it('rejects player with missing required fields', () => {
    const player = { ...validPlayer, id: undefined }
    expect(isValidPlayer(player)).toBe(false)
  })

  it('validates player with dominoes in hand', () => {
    const player = {
      ...validPlayer,
      hand: [
        { id: '1', high: 6, low: 3, pointValue: 0, isCountDomino: false },
        { id: '2', high: 4, low: 2, pointValue: 0, isCountDomino: false }
      ]
    }
    expect(isValidPlayer(player)).toBe(true)
  })

  it('rejects player with invalid dominoes in hand', () => {
    const player = {
      ...validPlayer,
      hand: [{ id: '1', high: 7, low: 3, pointValue: 0, isCountDomino: false }] // Invalid domino
    }
    expect(isValidPlayer(player)).toBe(false)
  })
})