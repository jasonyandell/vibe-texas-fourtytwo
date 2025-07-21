import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoHand } from '../DominoHand'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoHand - Rendering', () => {
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

  describe('Basic Rendering', () => {
    it('renders all dominoes in the hand', () => {
      render(<DominoHand dominoes={mockDominoes} />)
      
      mockDominoes.forEach(domino => {
        expect(screen.getByTestId(`domino-${domino.high}-${domino.low}`)).toBeInTheDocument()
      })
    })

    it('renders with correct container class', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)
      
      expect(container.firstChild).toHaveClass('domino-hand')
    })

    it('renders empty hand correctly', () => {
      const { container } = render(<DominoHand dominoes={[]} />)
      
      expect(container.firstChild).toHaveClass('domino-hand')
      expect(container.querySelectorAll('.domino')).toHaveLength(0)
    })
  })

  describe('Face States', () => {
    it('shows dominoes face-up by default', () => {
      render(<DominoHand dominoes={mockDominoes} />)
      
      mockDominoes.forEach(domino => {
        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        expect(dominoElement).toHaveClass('face-up')
        expect(dominoElement).not.toHaveClass('face-down')
      })
    })

    it('shows dominoes face-down when specified', () => {
      render(<DominoHand dominoes={mockDominoes} faceDown={true} />)
      
      mockDominoes.forEach(domino => {
        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        expect(dominoElement).toHaveClass('face-down')
        expect(dominoElement).not.toHaveClass('face-up')
      })
    })
  })

  describe('Orientation', () => {
    it('uses horizontal orientation by default', () => {
      render(<DominoHand dominoes={mockDominoes} />)
      
      mockDominoes.forEach(domino => {
        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        expect(dominoElement).toHaveClass('horizontal')
      })
    })

    it('applies specified orientation to all dominoes', () => {
      render(<DominoHand dominoes={mockDominoes} orientation="vertical" />)
      
      mockDominoes.forEach(domino => {
        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        expect(dominoElement).toHaveClass('vertical')
      })
    })
  })

  describe('Player vs Opponent Views', () => {
    it('shows dominoes face-up for player view', () => {
      render(<DominoHand dominoes={mockDominoes} faceDown={false} />)

      const dominoes = screen.getAllByRole('button')
      dominoes.forEach(domino => {
        expect(domino).not.toHaveClass('face-down')
        expect(domino).toHaveClass('face-up')
      })
    })

    it('shows dominoes face-down for opponent view', () => {
      render(<DominoHand dominoes={mockDominoes} faceDown={true} />)

      const dominoes = screen.getAllByRole('button')
      dominoes.forEach(domino => {
        expect(domino).toHaveClass('face-down')
        expect(domino).not.toHaveClass('face-up')
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)
      
      expect(container.firstChild).toHaveAttribute('role', 'group')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Domino hand with 7 dominoes')
    })

    it('has correct ARIA label for partial hands', () => {
      const { container } = render(<DominoHand dominoes={mockPartialHand} />)
      
      expect(container.firstChild).toHaveAttribute('aria-label', 'Domino hand with 4 dominoes')
    })

    it('has correct ARIA label for empty hand', () => {
      const { container } = render(<DominoHand dominoes={[]} />)
      
      expect(container.firstChild).toHaveAttribute('aria-label', 'Empty domino hand')
    })
  })
})