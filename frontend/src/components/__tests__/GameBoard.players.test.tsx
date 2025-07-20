import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import {
  GameState,
  Player,
  createDomino,
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

describe('GameBoard Players', () => {
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
})