import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { GameBoard } from '../../GameBoard'
import { createDomino } from '@/types/texas42'
import { createEmptyGameState } from '@texas42/shared-types'

describe('GameBoard Accessibility', () => {
  const mockDomino = createDomino(3, 2)
  const mockGameState = createEmptyGameState('test-game')
  
  // Add test-specific data
  mockGameState.phase = 'playing'
  mockGameState.players = [
    {
      id: 'player1',
      name: 'Player 1',
      position: 'north',
      hand: [mockDomino],
      isConnected: true,
      isReady: true
    }
  ]
  mockGameState.dealer = 'player1'
  mockGameState.currentPlayer = 'player1'

  it('has proper landmark roles', () => {
    render(<GameBoard gameState={mockGameState} />)
    
    const gameBoard = screen.getByRole('main')
    expect(gameBoard).toHaveAttribute('aria-label', 'Texas 42 game board')
    
    const playerAreas = screen.getByRole('region', { name: 'Player areas' })
    expect(playerAreas).toBeInTheDocument()
    
    const centerArea = screen.getByRole('region', { name: 'Center play area' })
    expect(centerArea).toBeInTheDocument()
  })

  it('provides descriptive labels for player areas', () => {
    render(<GameBoard gameState={mockGameState} />)
    
    const playerArea = screen.getByTestId('player-area-north')
    expect(playerArea).toBeInTheDocument()
  })
})