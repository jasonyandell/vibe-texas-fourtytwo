import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import { GameState, Player, Domino as _Domino, createDomino, DominoSuit, PlayerPosition } from '@/types/texas42'

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ gameId: 'test-game-123' })
  }
})

describe('GameBoard', () => {
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

  const mockGameState: GameState = {
    id: 'test-game-123',
    phase: 'playing',
    players: mockPlayers,
    dealer: 'player-1',
    tricks: [],
    scores: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    boneyard: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }

  const renderGameBoard = (gameState?: Partial<GameState>) => {
    return render(
      <GameBoard gameState={gameState ? { ...mockGameState, ...gameState } : mockGameState} />
    )
  }

  describe('Basic Layout', () => {
    it('renders the game board container', () => {
      renderGameBoard()
      
      expect(screen.getByTestId('game-board')).toBeInTheDocument()
      expect(screen.getByTestId('game-board')).toHaveClass('game-board')
    })

    it('renders the baseball diamond layout', () => {
      renderGameBoard()
      
      expect(screen.getByTestId('baseball-diamond')).toBeInTheDocument()
      expect(screen.getByTestId('baseball-diamond')).toHaveClass('baseball-diamond')
    })

    it('renders all four player positions', () => {
      renderGameBoard()
      
      expect(screen.getByTestId('player-area-north')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-east')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-south')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-west')).toBeInTheDocument()
    })

    it('renders the center play area', () => {
      renderGameBoard()
      
      expect(screen.getByTestId('center-play-area')).toBeInTheDocument()
      expect(screen.getByTestId('center-play-area')).toHaveClass('center-play-area')
    })
  })

  describe('Player Areas', () => {
    it('displays player names in correct positions', () => {
      renderGameBoard()
      
      expect(screen.getByText('North Player')).toBeInTheDocument()
      expect(screen.getByText('East Player')).toBeInTheDocument()
      expect(screen.getByText('South Player')).toBeInTheDocument()
      expect(screen.getByText('West Player')).toBeInTheDocument()
    })

    it('applies correct CSS classes to player areas', () => {
      renderGameBoard()
      
      expect(screen.getByTestId('player-area-north')).toHaveClass('player-area', 'player-north')
      expect(screen.getByTestId('player-area-east')).toHaveClass('player-area', 'player-east')
      expect(screen.getByTestId('player-area-south')).toHaveClass('player-area', 'player-south')
      expect(screen.getByTestId('player-area-west')).toHaveClass('player-area', 'player-west')
    })

    it('shows current player indicator', () => {
      renderGameBoard({ currentPlayer: 'player-2' })
      
      const eastPlayerArea = screen.getByTestId('player-area-east')
      expect(eastPlayerArea).toHaveClass('current-player')
    })

    it('shows dealer indicator', () => {
      renderGameBoard({ dealer: 'player-3' })
      
      const southPlayerArea = screen.getByTestId('player-area-south')
      expect(southPlayerArea).toHaveClass('dealer')
    })
  })

  describe('Partnership Visual Indicators', () => {
    it('displays partnership indicators for North-South team', () => {
      renderGameBoard()

      const northArea = screen.getByTestId('player-area-north')
      const southArea = screen.getByTestId('player-area-south')

      expect(northArea).toHaveAttribute('data-partnership', 'north-south')
      expect(southArea).toHaveAttribute('data-partnership', 'north-south')
    })

    it('displays partnership indicators for East-West team', () => {
      renderGameBoard()

      const eastArea = screen.getByTestId('player-area-east')
      const westArea = screen.getByTestId('player-area-west')

      expect(eastArea).toHaveAttribute('data-partnership', 'east-west')
      expect(westArea).toHaveAttribute('data-partnership', 'east-west')
    })

    it('applies partnership color coding', () => {
      renderGameBoard()

      const northArea = screen.getByTestId('player-area-north')
      const eastArea = screen.getByTestId('player-area-east')

      // Check for CSS module class names
      expect(northArea.className).toContain('partnershipNorthSouth')
      expect(eastArea.className).toContain('partnershipEastWest')
    })
  })

  describe('Caught Trick Stacks Display', () => {
    it('displays trick stack areas for both teams', () => {
      renderGameBoard()

      expect(screen.getByTestId('trick-stacks-north-south')).toBeInTheDocument()
      expect(screen.getByTestId('trick-stacks-east-west')).toBeInTheDocument()
    })

    it('shows trick count for each team', () => {
      const gameStateWithTricks = {
        tricks: [
          { id: 'trick-1', dominoes: [], winner: 'player-1' },
          { id: 'trick-2', dominoes: [], winner: 'player-2' }
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
          {
            id: 'trick-1',
            dominoes: [
              { domino: createDomino(6, 6), playerId: 'player-1', position: 'north' as PlayerPosition },
              { domino: createDomino(5, 4), playerId: 'player-2', position: 'east' as PlayerPosition },
              { domino: createDomino(4, 3), playerId: 'player-3', position: 'south' as PlayerPosition },
              { domino: createDomino(3, 2), playerId: 'player-4', position: 'west' as PlayerPosition }
            ],
            winner: 'player-1'
          }
        ]
      }
      renderGameBoard(gameStateWithTricks)

      expect(screen.getByTestId('trick-stack-0')).toBeInTheDocument()
    })
  })

  describe('Enhanced Game Information Display', () => {
    it('displays current bid and trump suit prominently', () => {
      const gameStateWithBid = {
        currentBid: { playerId: 'player-1', amount: 35, trump: 'doubles' as DominoSuit },
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

  describe('Responsive Design', () => {
    it('applies responsive classes', () => {
      renderGameBoard()

      const gameBoard = screen.getByTestId('game-board')
      expect(gameBoard).toHaveClass('responsive')
    })

    it('applies mobile-friendly layout class', () => {
      renderGameBoard()

      const baseballDiamond = screen.getByTestId('baseball-diamond')
      expect(baseballDiamond).toHaveClass('mobile-friendly')
    })

    it('maintains diamond layout proportions', () => {
      renderGameBoard()

      const baseballDiamond = screen.getByTestId('baseball-diamond')
      expect(baseballDiamond).toHaveClass('baseball-diamond')

      // Check that all player areas maintain their grid positions
      expect(screen.getByTestId('player-area-north')).toHaveClass('player-north')
      expect(screen.getByTestId('player-area-east')).toHaveClass('player-east')
      expect(screen.getByTestId('player-area-south')).toHaveClass('player-south')
      expect(screen.getByTestId('player-area-west')).toHaveClass('player-west')
    })
  })

  describe('Player Hand Display Integration', () => {
    it('shows current player hand face-up', () => {
      const gameStateWithHands = {
        players: mockPlayers.map((p, index) => ({
          ...p,
          hand: [createDomino(6, index)] // Different dominoes for each player
        })),
        currentPlayer: 'player-1'
      }

      render(
        <GameBoard gameState={{ ...mockGameState, ...gameStateWithHands }} currentPlayerId="player-1" />
      )

      // Current player's hand should be face-up (visible) - player-1 has domino 6-0
      expect(screen.getByTestId('domino-6-0')).toBeInTheDocument()
    })

    it('shows other players hands face-down', () => {
      const gameStateWithHands = {
        players: mockPlayers.map((p, index) => ({
          ...p,
          hand: [createDomino(6, index)]
        })),
        currentPlayer: 'player-1'
      }

      render(
        <GameBoard gameState={{ ...mockGameState, ...gameStateWithHands }} currentPlayerId="player-1" />
      )

      // Other players should have hands but face-down
      expect(screen.getByTestId('player-area-east')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-south')).toBeInTheDocument()
      expect(screen.getByTestId('player-area-west')).toBeInTheDocument()

      // Face-down dominoes should have the face-down class
      const eastDomino = screen.getByTestId('domino-6-1') // East player's domino
      const southDomino = screen.getByTestId('domino-6-2') // South player's domino
      const westDomino = screen.getByTestId('domino-6-3') // West player's domino

      expect(eastDomino).toHaveClass('face-down')
      expect(southDomino).toHaveClass('face-down')
      expect(westDomino).toHaveClass('face-down')
    })

    it('supports gaps for played dominoes', () => {
      const gameStateWithGaps = {
        players: [
          {
            ...mockPlayers[0],
            hand: [
              createDomino(6, 5),
              createDomino(4, 3),
              createDomino(2, 1)
            ]
          },
          ...mockPlayers.slice(1)
        ],
        currentPlayer: 'player-1'
      }

      render(
        <GameBoard gameState={{ ...mockGameState, ...gameStateWithGaps }} currentPlayerId="player-1" />
      )

      // Should show dominoes and gaps
      expect(screen.getByTestId('domino-6-5')).toBeInTheDocument()
      expect(screen.getByTestId('domino-4-3')).toBeInTheDocument()
      expect(screen.getByTestId('domino-2-1')).toBeInTheDocument()
    })
  })

  describe('Spectator Mode Support', () => {
    it('shows all hands face-up in spectator mode', () => {
      const gameStateWithHands = {
        players: mockPlayers.map((p, index) => ({
          ...p,
          hand: [createDomino(5, index)] // Different dominoes for each player
        }))
      }

      render(
        <GameBoard
          gameState={{ ...mockGameState, ...gameStateWithHands }}
          currentPlayerId="player-2" // Not the north player
          isSpectatorMode={true}
        />
      )

      // In spectator mode, all hands should be visible including non-current players
      expect(screen.getByTestId('domino-5-0')).toBeInTheDocument() // North player's domino
      expect(screen.getByTestId('domino-5-1')).toBeInTheDocument() // East player's domino
      expect(screen.getByTestId('domino-5-2')).toBeInTheDocument() // South player's domino
      expect(screen.getByTestId('domino-5-3')).toBeInTheDocument() // West player's domino
    })
  })

  describe('Game State Integration', () => {
    it('displays current scores', () => {
      renderGameBoard({
        scores: { northSouth: 15, eastWest: 23 },
        gameScore: { northSouth: 2, eastWest: 1 }
      })

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
        biddingState: {
          bidHistory: [
            { playerId: 'player-1', amount: 30, trump: 'sixes' as const }
          ],
          biddingComplete: false,
          passCount: 0,
          minimumBid: 30
        }
      }

      renderGameBoard(gameStateWithBidding)

      expect(screen.getByTestId('bidding-history')).toBeInTheDocument()
      expect(screen.getByText('Bidding History')).toBeInTheDocument()
    })

    it('shows current trick when available', () => {
      const mockTrick = {
        id: 'trick-1',
        dominoes: [
          {
            domino: createDomino(6, 3),
            playerId: 'player-1',
            position: 'north' as const
          }
        ]
      }

      renderGameBoard({ currentTrick: mockTrick })

      expect(screen.getByTestId('current-trick')).toBeInTheDocument()
    })

    it('shows empty state when no current trick', () => {
      renderGameBoard({ currentTrick: undefined })

      expect(screen.getByText(/waiting for play/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderGameBoard()
      
      const gameBoard = screen.getByTestId('game-board')
      expect(gameBoard).toHaveAttribute('role', 'main')
      expect(gameBoard).toHaveAttribute('aria-label', 'Texas 42 game board')
    })

    it('has proper landmark roles', () => {
      renderGameBoard()
      
      expect(screen.getByRole('region', { name: /player areas/i })).toBeInTheDocument()
      expect(screen.getByRole('region', { name: /center play area/i })).toBeInTheDocument()
    })

    it('provides screen reader friendly descriptions', () => {
      renderGameBoard({ currentPlayer: 'player-2', phase: 'playing' })
      
      expect(screen.getByText(/current turn.*east player/i)).toBeInTheDocument()
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
