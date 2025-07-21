import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import { createDomino } from '@texas42/shared-types'
import { mockGameState, mockPlayers } from './gameboard-test-utils'

describe('GameBoard Spectator Mode Support', () => {
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