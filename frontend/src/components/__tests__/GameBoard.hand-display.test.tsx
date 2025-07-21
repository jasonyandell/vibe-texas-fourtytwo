import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import { createDomino } from '@texas42/shared-types'
import { mockGameState, mockPlayers } from './gameboard-test-utils'

describe('GameBoard Player Hand Display Integration', () => {
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