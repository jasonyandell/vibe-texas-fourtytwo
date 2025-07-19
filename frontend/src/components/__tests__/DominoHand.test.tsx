import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { DominoHand } from '../DominoHand'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoHand', () => {
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

  describe('Interactive Features', () => {
    it('calls onDominoClick when a domino is clicked', () => {
      const mockOnClick = vi.fn()
      render(<DominoHand dominoes={mockDominoes} onDominoClick={mockOnClick} />)
      
      const firstDomino = screen.getByTestId('domino-6-6')
      fireEvent.click(firstDomino)
      
      expect(mockOnClick).toHaveBeenCalledWith(mockDominoes[0])
    })

    it('marks playable dominoes correctly', () => {
      const playableDominoes = [mockDominoes[0], mockDominoes[2]]
      render(
        <DominoHand 
          dominoes={mockDominoes} 
          playableDominoes={playableDominoes}
        />
      )
      
      expect(screen.getByTestId('domino-6-6')).toHaveClass('playable')
      expect(screen.getByTestId('domino-3-2')).toHaveClass('playable')
      expect(screen.getByTestId('domino-5-4')).not.toHaveClass('playable')
    })

    it('marks selected domino correctly', () => {
      render(
        <DominoHand 
          dominoes={mockDominoes} 
          selectedDomino={mockDominoes[1]}
        />
      )
      
      expect(screen.getByTestId('domino-5-4')).toHaveClass('selected')
      expect(screen.getByTestId('domino-6-6')).not.toHaveClass('selected')
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
