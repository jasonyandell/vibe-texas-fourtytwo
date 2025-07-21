import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import {
  GameState,
  createCompatibleTrick,
  createCompatiblePlayedDomino,
  createDomino
} from '@texas42/shared-types'
import { mockGameState } from './GameBoard.gamestate.test.fixtures'

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

describe('GameBoard - Caught Trick Stacks Display', () => {
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