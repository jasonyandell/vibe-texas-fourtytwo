import { describe, it, expect } from 'vitest'
import { canBid } from '../gameUtils'
import { GameState, Bid, Player } from '@/types/texas42'

describe('Bidding Utils', () => {
  const mockPlayers: Player[] = [
    { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ]

  const baseGameState: GameState = {
    id: 'game-1',
    phase: 'playing',
    players: mockPlayers,
    currentPlayer: 'p1',
    dealer: 'p1',
    tricks: [],
    scores: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    boneyard: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }

  describe('canBid', () => {
    const biddingGameState = {
      ...baseGameState,
      phase: 'bidding' as const
    }

    it('allows valid bid', () => {
      const bid: Bid = { playerId: 'p1', amount: 30, trump: 'sixes' }
      const result = canBid(bid, biddingGameState)
      expect(result.valid).toBe(true)
    })

    it('allows pass bid', () => {
      const bid: Bid = { playerId: 'p1', amount: 0 }
      const result = canBid(bid, biddingGameState)
      expect(result.valid).toBe(true)
    })

    it('rejects bid when not player turn', () => {
      const bid: Bid = { playerId: 'p2', amount: 30, trump: 'sixes' }
      const result = canBid(bid, biddingGameState)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Not your turn to bid')
    })

    it('rejects bid below minimum', () => {
      const bid: Bid = { playerId: 'p1', amount: 29, trump: 'sixes' }
      const result = canBid(bid, biddingGameState)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Bid must be between 30-42 or 0 (pass)')
    })

    it('rejects bid above maximum', () => {
      const bid: Bid = { playerId: 'p1', amount: 43, trump: 'sixes' }
      const result = canBid(bid, biddingGameState)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Bid must be between 30-42 or 0 (pass)')
    })

    it('rejects bid not higher than current bid', () => {
      const gameStateWithBid = {
        ...biddingGameState,
        currentBid: { playerId: 'p2', amount: 35, trump: 'fives' as const }
      }
      const bid: Bid = { playerId: 'p1', amount: 35, trump: 'sixes' }
      const result = canBid(bid, gameStateWithBid)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Bid must be higher than current bid')
    })

    it('rejects non-pass bid without trump', () => {
      const bid: Bid = { playerId: 'p1', amount: 30 }
      const result = canBid(bid, biddingGameState)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Must select trump suit for non-pass bids')
    })
  })
})