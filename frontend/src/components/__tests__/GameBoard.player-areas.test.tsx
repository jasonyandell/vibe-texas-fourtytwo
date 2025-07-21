import { describe, it, expect } from 'vitest'
import { screen } from '@/test/test-utils'
import { renderGameBoard } from './gameboard-test-utils'

describe('GameBoard Player Areas', () => {
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