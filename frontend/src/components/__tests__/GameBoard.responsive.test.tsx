import { describe, it, expect } from 'vitest'
import { render } from '@/test/test-utils'
import { GameBoard } from '../GameBoard'
import { createResponsiveTestGameState } from './GameBoard.testHelpers'

describe('GameBoard Responsive Behavior', () => {
  it('applies responsive classes to all major components', () => {
    const responsiveGameState = createResponsiveTestGameState()

    const { container } = render(
      <GameBoard gameState={responsiveGameState} />
    )

    const gameBoard = container.querySelector('.game-board')
    expect(gameBoard).toHaveClass('responsive')

    const diamond = container.querySelector('.baseball-diamond')
    expect(diamond).toHaveClass('mobile-friendly')
  })
})