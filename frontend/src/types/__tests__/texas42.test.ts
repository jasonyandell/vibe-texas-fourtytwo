import { describe, it, expect } from 'vitest'
import {
  isValidDomino,
  isValidPlayer,
  isValidLegacyGameState as isValidGameState,
  isValidLobbyState,
  isValidBiddingState,
  isValidScoringState,
  isValidTrick,
  isValidBid,
  createEmptyLegacyGameState,
  createEmptyLobbyState,
  createEmptyBiddingState,
  createEmptyScoringState,
  validatePlayerPosition,
  validateGamePhase,
  validateDominoSuit,
  createCompatibleBid,
  createCompatiblePlayedDomino,
  createCompatibleTrick,
  type Domino,
  type Player,
  type LegacyGameState as GameState,
  type LobbyState,
  type LobbyGame,
  type Trick,
  type Bid,
  type PlayerPosition,
  type DominoSuit
} from '@texas42/shared-types'

describe('Texas 42 Type Validation', () => {
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

  describe('GameState Validation', () => {
    const validGameState: GameState = {
      id: 'game-1',
      phase: 'bidding',
      players: [
        { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
        { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
        { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
        { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
      ],
      dealer: 'p1',
      tricks: [],
      scores: { northSouth: 0, eastWest: 0 },
      gameScore: { northSouth: 0, eastWest: 0 },
      boneyard: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    it('validates correct game state', () => {
      expect(isValidGameState(validGameState)).toBe(true)
    })

    it('rejects game state with wrong number of players', () => {
      const gameState = { ...validGameState, players: validGameState.players.slice(0, 3) }
      expect(isValidGameState(gameState)).toBe(false)
    })

    it('rejects game state with duplicate positions', () => {
      const gameState = {
        ...validGameState,
        players: [
          ...validGameState.players.slice(0, 3),
          { ...validGameState.players[3], position: 'north' as PlayerPosition }
        ]
      }
      expect(isValidGameState(gameState)).toBe(false)
    })

    it('rejects game state with invalid dealer', () => {
      const gameState = { ...validGameState, dealer: 'invalid-player' }
      expect(isValidGameState(gameState)).toBe(false)
    })
  })

  describe('LobbyState Validation', () => {
    const validLobbyState: LobbyState = {
      availableGames: [
        {
          id: 'game-1',
          name: 'Test Game',
          playerCount: 2,
          maxPlayers: 4,
          status: 'waiting',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ],
      connectedPlayers: 5
    }

    it('validates correct lobby state', () => {
      expect(isValidLobbyState(validLobbyState)).toBe(true)
    })

    it('validates empty lobby', () => {
      const lobbyState: LobbyState = {
        availableGames: [],
        connectedPlayers: 0
      }
      expect(isValidLobbyState(lobbyState)).toBe(true)
    })

    it('rejects lobby with invalid game status', () => {
      const lobbyState = {
        ...validLobbyState,
        availableGames: [{
          ...validLobbyState.availableGames[0],
          status: 'invalid' as unknown as LobbyGame['status']
        }]
      }
      expect(isValidLobbyState(lobbyState)).toBe(false)
    })
  })

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

  describe('Factory Functions', () => {
    it('creates empty game state', () => {
      const gameState = createEmptyLegacyGameState('game-1')
      expect(gameState.id).toBe('game-1')
      expect(gameState.players).toHaveLength(0)
      expect(gameState.phase).toBe('bidding')
      expect(gameState.scores.northSouth).toBe(0)
      expect(gameState.scores.eastWest).toBe(0)
      expect(gameState.tricks).toHaveLength(0)
      expect(gameState.boneyard).toHaveLength(0)
      // Note: Empty game state won't pass full validation until players are added
    })

    it('creates empty lobby state', () => {
      const lobbyState = createEmptyLobbyState()
      expect(isValidLobbyState(lobbyState)).toBe(true)
      expect(lobbyState.availableGames).toHaveLength(0)
      expect(lobbyState.connectedPlayers).toBe(0)
    })

    it('creates empty bidding state', () => {
      const biddingState = createEmptyBiddingState()
      expect(isValidBiddingState(biddingState)).toBe(true)
      expect(biddingState.bidHistory).toHaveLength(0)
      expect(biddingState.biddingComplete).toBe(false)
      expect(biddingState.passCount).toBe(0)
      expect(biddingState.minimumBid).toBe(30)
    })

    it('creates empty scoring state', () => {
      const scoringState = createEmptyScoringState()
      expect(isValidScoringState(scoringState)).toBe(true)
      expect(scoringState.trickPoints).toBe(0)
      expect(scoringState.countDominoes).toHaveLength(0)
      expect(scoringState.bonusPoints).toBe(0)
      expect(scoringState.penaltyPoints).toBe(0)
      expect(scoringState.roundComplete).toBe(false)
    })
  })
})
