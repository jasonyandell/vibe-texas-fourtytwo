import { describe, it, expect } from 'vitest'
import {
  canPlayDomino,
  canBid,
  getValidDominoes,
  getDominoValue,
  getDominoSuit,
  isDouble
} from '../gameUtils'
import { GameState, Domino, Bid, Player } from '@/types/texas42'

describe('Game Utils', () => {
  const mockPlayers: Player[] = [
    { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ]

  const mockDomino: Domino = { id: 'd1', high: 6, low: 3 }
  const mockDomino2: Domino = { id: 'd2', high: 5, low: 2 }
  const mockDomino3: Domino = { id: 'd3', high: 4, low: 1 }

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

  describe('canPlayDomino', () => {
    it('allows valid domino play when it is player turn', () => {
      const gameState = {
        ...baseGameState,
        players: [
          { ...mockPlayers[0], hand: [mockDomino] },
          ...mockPlayers.slice(1)
        ]
      }

      const result = canPlayDomino(mockDomino, gameState, 'p1')
      expect(result.valid).toBe(true)
    })

    it('rejects domino play when not player turn', () => {
      const gameState = {
        ...baseGameState,
        currentPlayer: 'p2',
        players: [
          { ...mockPlayers[0], hand: [mockDomino] },
          ...mockPlayers.slice(1)
        ]
      }

      const result = canPlayDomino(mockDomino, gameState, 'p1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Not your turn to play')
    })

    it('rejects domino play when player does not have domino', () => {
      const gameState = {
        ...baseGameState,
        players: [
          { ...mockPlayers[0], hand: [mockDomino2] }, // Different domino
          ...mockPlayers.slice(1)
        ]
      }

      const result = canPlayDomino(mockDomino, gameState, 'p1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('You do not have this domino')
    })

    it('enforces follow suit rules', () => {
      const foursDomino = { id: 'd-four', high: 4, low: 2 } // Fours suit (not trump, not lead)
      const fivesDomino = { id: 'd-five', high: 5, low: 1 } // Fives suit (lead suit)

      const gameState = {
        ...baseGameState,
        trump: 'sixes' as const, // Trump is sixes
        currentTrick: {
          id: 'trick-1',
          dominoes: [{
            domino: { id: 'd-lead', high: 5, low: 0 }, // Fives suit lead
            playerId: 'p2',
            position: 'east' as const
          }],
          leadSuit: 'fives' as const
        },
        players: [
          {
            ...mockPlayers[0],
            hand: [foursDomino, fivesDomino] // Player has fours and fives
          },
          ...mockPlayers.slice(1)
        ]
      }

      // Should reject playing fours when fives are available (must follow suit)
      const result = canPlayDomino(foursDomino, gameState, 'p1')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Must follow suit if possible')
    })
  })

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

  describe('getValidDominoes', () => {
    it('returns all dominoes when no current trick', () => {
      const gameState = {
        ...baseGameState,
        players: [
          { ...mockPlayers[0], hand: [mockDomino, mockDomino2] },
          ...mockPlayers.slice(1)
        ]
      }

      const validDominoes = getValidDominoes(gameState, 'p1')
      expect(validDominoes).toHaveLength(2)
      expect(validDominoes).toContain(mockDomino)
      expect(validDominoes).toContain(mockDomino2)
    })

    it('returns empty array when not player turn', () => {
      const gameState = {
        ...baseGameState,
        currentPlayer: 'p2',
        players: [
          { ...mockPlayers[0], hand: [mockDomino, mockDomino2] },
          ...mockPlayers.slice(1)
        ]
      }

      const validDominoes = getValidDominoes(gameState, 'p1')
      expect(validDominoes).toHaveLength(0)
    })

    it('returns only follow suit dominoes when required', () => {
      const gameState = {
        ...baseGameState,
        currentTrick: {
          id: 'trick-1',
          dominoes: [{
            domino: { id: 'd-lead', high: 5, low: 0 }, // Fives suit
            playerId: 'p2',
            position: 'east' as const
          }],
          leadSuit: 'fives' as const
        },
        players: [
          { 
            ...mockPlayers[0], 
            hand: [
              mockDomino, // Sixes suit
              { id: 'd-five', high: 5, low: 1 } // Fives suit
            ] 
          },
          ...mockPlayers.slice(1)
        ]
      }

      const validDominoes = getValidDominoes(gameState, 'p1')
      expect(validDominoes).toHaveLength(1)
      expect(validDominoes[0].id).toBe('d-five')
    })
  })

  describe('getDominoValue', () => {
    it('returns 10 for 5-0', () => {
      const domino: Domino = { id: 'd1', high: 5, low: 0 }
      expect(getDominoValue(domino)).toBe(10)
    })

    it('returns 10 for 4-1', () => {
      const domino: Domino = { id: 'd1', high: 4, low: 1 }
      expect(getDominoValue(domino)).toBe(10)
    })

    it('returns 5 for 5-5', () => {
      const domino: Domino = { id: 'd1', high: 5, low: 5 }
      expect(getDominoValue(domino)).toBe(5)
    })

    it('returns 0 for non-count dominoes', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 3 }
      expect(getDominoValue(domino)).toBe(0)
    })
  })

  describe('getDominoSuit', () => {
    it('returns doubles for double dominoes', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 6 }
      expect(getDominoSuit(domino)).toBe('doubles')
    })

    it('returns correct suit for non-double dominoes', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 3 }
      expect(getDominoSuit(domino)).toBe('sixes')
    })
  })

  describe('isDouble', () => {
    it('returns true for double dominoes', () => {
      const domino: Domino = { id: 'd1', high: 4, low: 4 }
      expect(isDouble(domino)).toBe(true)
    })

    it('returns false for non-double dominoes', () => {
      const domino: Domino = { id: 'd1', high: 6, low: 3 }
      expect(isDouble(domino)).toBe(false)
    })
  })
})
