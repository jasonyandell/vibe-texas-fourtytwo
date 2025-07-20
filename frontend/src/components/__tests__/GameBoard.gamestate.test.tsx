import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import {
  GameState,
  Player,
  createDomino,
  DominoSuit,
  createCompatibleTrick,
  createCompatiblePlayedDomino,
  createCompatibleBid,
  createCompatibleBiddingState,
  createEmptyGameState
} from '@texas42/shared-types'

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ gameId: 'test-game-123' })
  }
})

describe('GameBoard Game State', () => {
  const mockPlayers: Player[] = [
    {
      id: 'player-1',
      name: 'North Player',
      position: 'north',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-2',
      name: 'East Player',
      position: 'east',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-3',
      name: 'South Player',
      position: 'south',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-4',
      name: 'West Player',
      position: 'west',
      hand: [],
      isConnected: true,
      isReady: true
    }
  ]

  const mockGameState: GameState = (() => {
    const state = createEmptyGameState('test-game-123');
    state.phase = 'playing';
    state.players = mockPlayers;
    state.dealer = 'player-1';
    state.createdAt = '2024-01-01T00:00:00Z';
    state.updatedAt = '2024-01-01T00:00:00Z';
    return state;
  })()

  const renderGameBoard = (gameState?: Partial<GameState>) => {
    return render(
      <GameBoard gameState={gameState ? { ...mockGameState, ...gameState } : mockGameState} />
    )
  }

  describe('Caught Trick Stacks Display', () => {
    it('displays trick stack areas for both teams', () => {
      renderGameBoard()

      expect(screen.getByTestId('trick-stacks-north-south')).toBeInTheDocument()
      expect(screen.getByTestId('trick-stacks-east-west')).toBeInTheDocument()
    })

    it('shows trick count for each team', () => {
      const gameStateWithTricks = {
        tricks: [
          createCompatibleTrick('trick-1', [], 1, { winner: 'player-1' }),
          createCompatibleTrick('trick-2', [], 2, { winner: 'player-2' })
        ]
      }
      renderGameBoard(gameStateWithTricks)

      // Should show different counts for each team
      const trickCounts = screen.getAllByText(/Tricks: \d+/)
      expect(trickCounts).toHaveLength(2)
    })

    it('displays individual trick stacks', () => {
      const gameStateWithTricks = {
        tricks: [
          createCompatibleTrick(
            'trick-1',
            [
              createCompatiblePlayedDomino(createDomino(6, 6), 'player-1', 'north', 0),
              createCompatiblePlayedDomino(createDomino(5, 4), 'player-2', 'east', 1),
              createCompatiblePlayedDomino(createDomino(4, 3), 'player-3', 'south', 2),
              createCompatiblePlayedDomino(createDomino(3, 2), 'player-4', 'west', 3)
            ],
            1,
            { winner: 'player-1' }
          )
        ]
      }
      renderGameBoard(gameStateWithTricks)

      expect(screen.getByTestId('trick-stack-0')).toBeInTheDocument()
    })
  })

  describe('Enhanced Game Information Display', () => {
    it('displays current bid and trump suit prominently', () => {
      const gameStateWithBid = {
        currentBid: createCompatibleBid('player-1', 35, 'doubles'),
        trump: 'doubles' as DominoSuit
      }
      renderGameBoard(gameStateWithBid)

      expect(screen.getByText('Bid: 35')).toBeInTheDocument()
      expect(screen.getByText('Trump: Doubles')).toBeInTheDocument()
    })

    it('displays game phase clearly', () => {
      renderGameBoard({ phase: 'bidding' })

      expect(screen.getByText('Bidding Phase')).toBeInTheDocument()
    })

    it('shows marks (games won) for each team', () => {
      const gameStateWithMarks = {
        gameScore: { northSouth: 2, eastWest: 1 }
      }
      renderGameBoard(gameStateWithMarks)

      expect(screen.getByText('Games: 2')).toBeInTheDocument()
      expect(screen.getByText('Games: 1')).toBeInTheDocument()
    })
  })

  describe('Game State Integration', () => {
    it('displays current scores', () => {
      const gameStateWithScores = createEmptyGameState('test-game-123');
      gameStateWithScores.phase = 'playing';
      gameStateWithScores.players = mockPlayers;
      gameStateWithScores.dealer = 'player-1';
      gameStateWithScores.partnerships.northSouth.currentHandScore = 15;
      gameStateWithScores.partnerships.eastWest.currentHandScore = 23;
      gameStateWithScores.gameScore = { northSouth: 2, eastWest: 1 };

      render(<GameBoard gameState={gameStateWithScores} />)

      expect(screen.getByText('North-South')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
      expect(screen.getByText('East-West')).toBeInTheDocument()
      expect(screen.getByText('23')).toBeInTheDocument()
      expect(screen.getByText('Games: 2')).toBeInTheDocument()
      expect(screen.getByText('Games: 1')).toBeInTheDocument()
    })

    it('shows game phase', () => {
      renderGameBoard({ phase: 'bidding' })
      
      expect(screen.getByText(/Bidding Phase/i)).toBeInTheDocument()
    })

    it('displays trump suit when set', () => {
      renderGameBoard({ trump: 'sixes' })
      
      expect(screen.getByText(/Trump.*Sixes/i)).toBeInTheDocument()
    })
  })

  describe('Center Play Area', () => {
    it('shows bidding panel during bidding phase', () => {
      renderGameBoard({ phase: 'bidding' })

      expect(screen.getByTestId('bidding-area')).toBeInTheDocument()
      expect(screen.getByLabelText(/bid amount/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/trump suit/i)).toBeInTheDocument()
    })

    it('shows bidding history during bidding phase', () => {
      const gameStateWithBidding = {
        phase: 'bidding' as const,
        biddingState: createCompatibleBiddingState({
          bidHistory: [
            createCompatibleBid('player-1', 30, 'sixes')
          ],
          biddingComplete: false,
          passCount: 0,
          minimumBid: 30
        })
      }

      renderGameBoard(gameStateWithBidding)

      expect(screen.getByTestId('bidding-history')).toBeInTheDocument()
      expect(screen.getByText('Bidding History')).toBeInTheDocument()
    })

    it('shows current trick when available', () => {
      const mockTrick = createCompatibleTrick(
        'trick-1',
        [
          createCompatiblePlayedDomino(createDomino(6, 3), 'player-1', 'north', 0)
        ],
        1
      )

      renderGameBoard({ currentTrick: mockTrick })

      expect(screen.getByTestId('current-trick')).toBeInTheDocument()
    })

    it('shows empty state when no current trick', () => {
      renderGameBoard({ currentTrick: undefined })

      expect(screen.getByText(/waiting for play/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing game state gracefully', () => {
      render(
        <GameBoard />
      )
      
      expect(screen.getByText(/loading game/i)).toBeInTheDocument()
    })

    it('handles incomplete player data', () => {
      const incompleteGameState = {
        ...mockGameState,
        players: mockPlayers.slice(0, 2) // Only 2 players
      }
      
      renderGameBoard(incompleteGameState)
      
      expect(screen.getByTestId('player-area-north')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-east')).toBeInTheDocument()
      expect(screen.getByText(/waiting for players/i)).toBeInTheDocument()
    })
  })
})