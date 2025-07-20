import { describe, it, expect } from 'vitest'
import { render } from '@/test/test-utils'
import { DominoHand } from '../DominoHand'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoHand - Layout', () => {
  const mockDominoes: Domino[] = [
    createDomino(6, 6),
    createDomino(5, 4),
    createDomino(3, 2),
    createDomino(1, 0),
    createDomino(4, 4),
    createDomino(2, 1),
    createDomino(6, 3)
  ]

  const mockPartialHand: Domino[] = [
    createDomino(6, 6),
    createDomino(5, 4),
    createDomino(3, 2),
    createDomino(1, 0)
  ]

  describe('Layout Structure', () => {
    it('creates top and bottom rows', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)
      
      expect(container.querySelector('.top-row')).toBeInTheDocument()
      expect(container.querySelector('.bottom-row')).toBeInTheDocument()
    })

    it('places first 4 dominoes in top row', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)
      
      const topRow = container.querySelector('.top-row')
      expect(topRow?.children).toHaveLength(4)
    })

    it('places remaining dominoes in bottom row', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)
      
      const bottomRow = container.querySelector('.bottom-row')
      expect(bottomRow?.children).toHaveLength(3)
    })

    it('handles partial hands correctly', () => {
      const { container } = render(<DominoHand dominoes={mockPartialHand} />)
      
      const topRow = container.querySelector('.top-row')
      const bottomRow = container.querySelector('.bottom-row')
      
      expect(topRow?.children).toHaveLength(4)
      expect(bottomRow?.children).toHaveLength(0)
    })
  })

  describe('2-Row Layout Requirements', () => {
    it('always places exactly 4 dominoes in top row', () => {
      const fullHand = Array.from({ length: 7 }, (_, i) =>
        createDomino(Math.floor(i / 2), i % 2)
      )

      const { container } = render(<DominoHand dominoes={fullHand} />)

      const topRow = container.querySelector('.top-row')
      const bottomRow = container.querySelector('.bottom-row')

      expect(topRow?.children).toHaveLength(4)
      expect(bottomRow?.children).toHaveLength(3)
    })

    it('handles partial hands correctly in 2-row layout', () => {
      const partialHand = Array.from({ length: 5 }, (_, i) =>
        createDomino(Math.floor(i / 2), i % 2)
      )

      const { container } = render(<DominoHand dominoes={partialHand} />)

      const topRow = container.querySelector('.top-row')
      const bottomRow = container.querySelector('.bottom-row')

      expect(topRow?.children).toHaveLength(4)
      expect(bottomRow?.children).toHaveLength(1)
    })

    it('centers bottom row with 3 dominoes', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)

      const bottomRow = container.querySelector('.bottom-row')
      expect(bottomRow).toHaveStyle({ justifyContent: 'center' })
    })
  })

  describe('Gap Handling', () => {
    it('shows gaps where dominoes have been played', () => {
      const handWithGaps = [
        mockDominoes[0],
        null, // gap
        mockDominoes[2],
        mockDominoes[3],
        null, // gap
        mockDominoes[5]
      ]

      const { container } = render(<DominoHand dominoes={handWithGaps} />)

      expect(container.querySelectorAll('.domino-gap')).toHaveLength(2)
    })
  })

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