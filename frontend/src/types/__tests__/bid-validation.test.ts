import { describe, it, expect } from 'vitest'
import {
  isValidBid,
  createCompatibleBid,
  type Bid
} from '@texas42/shared-types'

describe('Bid Validation', () => {
  it('validates pass bid', () => {
    const bid: Bid = createCompatibleBid('player-1', 0)
    expect(isValidBid(bid)).toBe(true)
  })

  it('validates minimum bid', () => {
    const bid: Bid = createCompatibleBid('player-1', 30, 'sixes')
    expect(isValidBid(bid)).toBe(true)
  })

  it('validates maximum bid', () => {
    const bid: Bid = createCompatibleBid('player-1', 42, 'doubles')
    expect(isValidBid(bid)).toBe(true)
  })

  it('rejects bid below minimum', () => {
    const bid = { playerId: 'player-1', amount: 29, trump: 'sixes' }
    expect(isValidBid(bid)).toBe(false)
  })

  it('rejects bid above maximum', () => {
    const bid = { playerId: 'player-1', amount: 43, trump: 'sixes' }
    expect(isValidBid(bid)).toBe(false)
  })

  it('rejects non-pass bid without trump', () => {
    const bid = { playerId: 'player-1', amount: 30 }
    expect(isValidBid(bid)).toBe(false)
  })

  it('rejects pass bid with trump', () => {
    const bid = { playerId: 'player-1', amount: 0, trump: 'sixes' }
    expect(isValidBid(bid)).toBe(false)
  })
})