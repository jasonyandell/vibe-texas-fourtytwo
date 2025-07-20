import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import {
  GameState,
  DominoSuit,
  createCompatibleBid,
  createEmptyGameState
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

const renderGameBoard = (gameState?: Partial<GameState>) => {
  return render(
    <GameBoard gameState={gameState ? { ...mockGameState, ...gameState } : mockGameState} />
  )
}

describe('GameBoard - Enhanced Game Information Display', () => {
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

describe('GameBoard - Game State Integration', () => {
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