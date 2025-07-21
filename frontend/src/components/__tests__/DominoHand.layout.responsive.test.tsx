import { describe, it, expect } from 'vitest'
import { render } from '@/test/test-utils'
import { DominoHand } from '../DominoHand'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoHand - Responsive Behavior', () => {
  const mockDominoes: Domino[] = [
    createDomino(6, 6),
    createDomino(5, 4),
    createDomino(3, 2),
    createDomino(1, 0),
    createDomino(4, 4),
    createDomino(2, 1),
    createDomino(6, 3)
  ]

  describe('Responsive Behavior', () => {
    it('applies responsive class', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)
      
      expect(container.firstChild).toHaveClass('responsive')
    })

    it('applies custom className', () => {
      const { container } = render(
        <DominoHand dominoes={mockDominoes} className="custom-hand" />
      )
      
      expect(container.firstChild).toHaveClass('custom-hand')
    })
  })

  describe('Responsive Scaling', () => {
    it('applies responsive class for scaling', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)

      const handContainer = container.firstChild as HTMLElement
      expect(handContainer).toHaveClass('responsive')
    })

    it('maintains layout structure on different screen sizes', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)

      const handContainer = container.firstChild as HTMLElement
      const topRow = handContainer.querySelector('.top-row')
      const bottomRow = handContainer.querySelector('.bottom-row')

      expect(topRow).toHaveStyle({ display: 'flex' })
      expect(bottomRow).toHaveStyle({ display: 'flex' })
      expect(handContainer).toHaveStyle({ flexDirection: 'column' })
    })
  })
})