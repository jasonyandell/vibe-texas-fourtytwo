import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { GameBoard } from '../GameBoard'
import { GameState, Player, Domino } from '@/types/texas42'

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
      <MemoryRouter>
        <GameBoard gameState={gameState ? { ...mockGameState, ...gameState } : mockGameState} />
      </MemoryRouter>
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
      expect(screen.getByText('(2)')).toBeInTheDocument()
      expect(screen.getByText('(1)')).toBeInTheDocument()
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
    it('shows current trick when available', () => {
      const mockTrick = {
        id: 'trick-1',
        dominoes: [
          {
            domino: { id: 'dom-1', high: 6, low: 3 },
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
        <MemoryRouter>
          <GameBoard />
        </MemoryRouter>
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
