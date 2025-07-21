import { describe, it, expect } from 'vitest'
import { screen } from '@/test/test-utils'
import { renderGameBoard } from './gameboard-test-utils'

describe('GameBoard Partnership Visual Indicators', () => {
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