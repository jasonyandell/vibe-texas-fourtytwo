import { describe, it, expect } from 'vitest'
import {
  isValidBiddingState,
  createEmptyBiddingState,
  type DominoSuit
} from '@texas42/shared-types'

describe('BiddingState Validation', () => {
  it('validates correct bidding state', () => {
    const biddingState = createEmptyBiddingState()
    expect(isValidBiddingState(biddingState)).toBe(true)
  })

  it('validates bidding state with history', () => {
    const biddingState = {
      bidHistory: [{ playerId: 'player1', amount: 30, trump: 'sixes' as DominoSuit }],
      biddingComplete: false,
      passCount: 1,
      minimumBid: 30,
      currentBidder: 'player2',
      currentBid: { playerId: 'player2', amount: 31, trump: 'fives' as DominoSuit }
    }
    expect(isValidBiddingState(biddingState)).toBe(true)
  })

  it('rejects bidding state with invalid bid history', () => {
    const biddingState = {
      bidHistory: [{ playerId: 'player1', amount: 25 }], // Invalid bid
      biddingComplete: false,
      passCount: 0,
      minimumBid: 30
    }
    expect(isValidBiddingState(biddingState)).toBe(false)
  })

  it('rejects bidding state with negative pass count', () => {
    const biddingState = {
      bidHistory: [],
      biddingComplete: false,
      passCount: -1,
      minimumBid: 30
    }
    expect(isValidBiddingState(biddingState)).toBe(false)
  })
})