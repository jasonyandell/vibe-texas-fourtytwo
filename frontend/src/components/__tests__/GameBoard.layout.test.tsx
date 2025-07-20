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

describe('GameBoard Layout', () => {
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
})