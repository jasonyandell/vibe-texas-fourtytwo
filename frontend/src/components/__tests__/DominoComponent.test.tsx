import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoComponent', () => {
  const mockDomino: Domino = createDomino(6, 3)

  const mockBlankDomino: Domino = createDomino(0, 0)

  const mockDoubleDomino: Domino = createDomino(5, 5)

  // Generate all 28 domino combinations for comprehensive testing
  const generateAllDominoes = (): Domino[] => {
    const dominoes: Domino[] = []
    for (let high = 0; high <= 6; high++) {
      for (let low = 0; low <= high; low++) {
        dominoes.push(createDomino(high, low))
      }
    }
    return dominoes
  }

  const allDominoes = generateAllDominoes()

  describe('Basic Rendering', () => {
    it('renders a domino with correct test id', () => {
      render(<DominoComponent domino={mockDomino} />)
      
      expect(screen.getByTestId('domino-6-3')).toBeInTheDocument()
    })

    it('renders correct number of pips for each half', () => {
      render(<DominoComponent domino={mockDomino} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      const highHalf = dominoElement.querySelector('.domino-half.domino-high')
      const lowHalf = dominoElement.querySelector('.domino-half.domino-low')
      
      expect(highHalf?.querySelectorAll('.pip')).toHaveLength(6)
      expect(lowHalf?.querySelectorAll('.pip')).toHaveLength(3)
    })

    it('renders blank domino correctly', () => {
      render(<DominoComponent domino={mockBlankDomino} />)
      
      const dominoElement = screen.getByTestId('domino-0-0')
      const highHalf = dominoElement.querySelector('.domino-half.domino-high')
      const lowHalf = dominoElement.querySelector('.domino-half.domino-low')
      
      expect(highHalf?.querySelectorAll('.pip')).toHaveLength(0)
      expect(lowHalf?.querySelectorAll('.pip')).toHaveLength(0)
    })

    it('renders double domino correctly', () => {
      render(<DominoComponent domino={mockDoubleDomino} />)
      
      const dominoElement = screen.getByTestId('domino-5-5')
      const highHalf = dominoElement.querySelector('.domino-half.domino-high')
      const lowHalf = dominoElement.querySelector('.domino-half.domino-low')
      
      expect(highHalf?.querySelectorAll('.pip')).toHaveLength(5)
      expect(lowHalf?.querySelectorAll('.pip')).toHaveLength(5)
    })
  })

  describe('Interactive States', () => {
    it('applies playable class when isPlayable is true', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={true} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveClass('playable')
    })

    it('does not apply playable class when isPlayable is false', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={false} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).not.toHaveClass('playable')
    })

    it('calls onClick when clicked and playable', () => {
      const mockOnClick = vi.fn()
      render(<DominoComponent domino={mockDomino} onClick={mockOnClick} isPlayable={true} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      fireEvent.click(dominoElement)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('applies custom className', () => {
      render(<DominoComponent domino={mockDomino} className="custom-class" />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveClass('custom-class')
    })
  })

  describe('Face States', () => {
    it('renders face-up by default', () => {
      render(<DominoComponent domino={mockDomino} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveClass('face-up')
      expect(dominoElement).not.toHaveClass('face-down')
    })

    it('renders face-down when faceDown prop is true', () => {
      render(<DominoComponent domino={mockDomino} faceDown={true} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveClass('face-down')
      expect(dominoElement).not.toHaveClass('face-up')
    })

    it('hides pips when face-down', () => {
      render(<DominoComponent domino={mockDomino} faceDown={true} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      const pips = dominoElement.querySelectorAll('.pip')
      
      // Pips should not be visible when face-down
      pips.forEach(pip => {
        expect(pip).toHaveStyle({ opacity: '0' })
      })
    })
  })

  describe('Orientation', () => {
    it('applies horizontal orientation by default', () => {
      render(<DominoComponent domino={mockDomino} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveClass('horizontal')
    })

    it('applies vertical orientation when specified', () => {
      render(<DominoComponent domino={mockDomino} orientation="vertical" />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveClass('vertical')
    })
  })

  describe('Selection State', () => {
    it('applies selected class when selected', () => {
      render(<DominoComponent domino={mockDomino} selected={true} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveClass('selected')
    })

    it('does not apply selected class when not selected', () => {
      render(<DominoComponent domino={mockDomino} selected={false} />)
      
      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).not.toHaveClass('selected')
    })
  })

  describe('All 28 Domino Combinations', () => {
    it('renders all 28 domino combinations correctly', () => {
      expect(allDominoes).toHaveLength(28)

      allDominoes.forEach(domino => {
        const { unmount } = render(<DominoComponent domino={domino} />)

        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        expect(dominoElement).toBeInTheDocument()

        const highHalf = dominoElement.querySelector('.domino-half.domino-high')
        const lowHalf = dominoElement.querySelector('.domino-half.domino-low')

        expect(highHalf?.querySelectorAll('.pip')).toHaveLength(domino.high)
        expect(lowHalf?.querySelectorAll('.pip')).toHaveLength(domino.low)

        unmount()
      })
    })

    it('renders all double dominoes correctly', () => {
      const doubles = allDominoes.filter(d => d.high === d.low)
      expect(doubles).toHaveLength(7) // 0-0, 1-1, 2-2, 3-3, 4-4, 5-5, 6-6

      doubles.forEach(domino => {
        const { unmount } = render(<DominoComponent domino={domino} />)

        const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
        const highHalf = dominoElement.querySelector('.domino-half.domino-high')
        const lowHalf = dominoElement.querySelector('.domino-half.domino-low')

        expect(highHalf?.querySelectorAll('.pip')).toHaveLength(domino.high)
        expect(lowHalf?.querySelectorAll('.pip')).toHaveLength(domino.low)
        expect(domino.high).toBe(domino.low)

        unmount()
      })
    })

    it('renders all count dominoes correctly', () => {
      // Count dominoes in Texas 42: 5-0, 4-1, 3-2, 6-4, 5-5
      const countDominoes = [
        { high: 5, low: 0 },
        { high: 4, low: 1 },
        { high: 3, low: 2 },
        { high: 6, low: 4 },
        { high: 5, low: 5 }
      ]

      countDominoes.forEach(({ high, low }) => {
        const domino = allDominoes.find(d => d.high === high && d.low === low)
        expect(domino).toBeDefined()

        if (domino) {
          const { unmount } = render(<DominoComponent domino={domino} />)

          const dominoElement = screen.getByTestId(`domino-${high}-${low}`)
          expect(dominoElement).toBeInTheDocument()

          unmount()
        }
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<DominoComponent domino={mockDomino} />)

      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveAttribute('role', 'button')
      expect(dominoElement).toHaveAttribute('aria-label', 'Domino 6-3')
    })

    it('has proper ARIA attributes for blank domino', () => {
      render(<DominoComponent domino={mockBlankDomino} />)

      const dominoElement = screen.getByTestId('domino-0-0')
      expect(dominoElement).toHaveAttribute('aria-label', 'Domino blank-blank')
    })

    it('indicates playable state in ARIA attributes', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={true} />)

      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveAttribute('aria-disabled', 'false')
    })

    it('indicates non-playable state in ARIA attributes', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={false} />)

      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveAttribute('aria-disabled', 'true')
    })

    it('supports keyboard navigation', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={true} />)

      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveAttribute('tabIndex', '0')
    })

    it('excludes non-playable dominoes from tab order', () => {
      render(<DominoComponent domino={mockDomino} isPlayable={false} />)

      const dominoElement = screen.getByTestId('domino-6-3')
      expect(dominoElement).toHaveAttribute('tabIndex', '-1')
    })
  })
})
