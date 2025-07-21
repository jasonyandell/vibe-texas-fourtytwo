import { describe, it, expect } from 'vitest'
import { render } from '@/test/test-utils'
import { DominoHand } from '../DominoHand'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoHand - Layout Structure', () => {
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
})