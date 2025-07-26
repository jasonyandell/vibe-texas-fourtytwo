import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import {
  GameState,
  createCompatibleTrick,
  createCompatiblePlayedDomino,
  createDomino,
  createCompatibleBid,
  createCompatibleBiddingState
} from '@texas42/shared-types'
import { mockGameState, mockPlayers } from './GameBoard.gamestate.test.fixtures'

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ gameId: 'test-game-123' })
  }
})

const renderGameBoard = (gameState?: Partial<GameState>, isSpectatorMode = true) => {
  return render(
    <GameBoard 
      gameState={gameState ? { ...mockGameState, ...gameState } : mockGameState} 
      isSpectatorMode={isSpectatorMode}
    />
  )
}

describe('GameBoard - Center Play Area', () => {
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

describe('GameBoard - Error Handling', () => {
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