import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { DominoesSection } from '../DominoesSection'
import { createFullDominoSet } from '@/types/texas42'
import styles from '../DominoesSection.module.css'

describe('DominoesSection', () => {
  const { dominoes: allDominoes } = createFullDominoSet()

  describe('Basic Rendering', () => {
    it('renders all 28 dominoes', () => {
      render(<DominoesSection />)
      
      // Check that all 28 dominoes are rendered
      allDominoes.forEach(domino => {
        expect(screen.getByTestId(`domino-${domino.high}-${domino.low}`)).toBeInTheDocument()
      })
    })

    it('displays section title and description', () => {
      render(<DominoesSection />)
      
      expect(screen.getByText('Complete Domino Set')).toBeInTheDocument()
      expect(screen.getByText(/All 28 dominoes from the double-6 set/)).toBeInTheDocument()
    })


  })

  describe('Interactive Controls', () => {
    it('renders all toggle controls', () => {
      render(<DominoesSection />)
      
      expect(screen.getByTestId('toggle-point-values')).toBeInTheDocument()
      expect(screen.getByTestId('toggle-count-highlighting')).toBeInTheDocument()
      expect(screen.getByTestId('toggle-orientation')).toBeInTheDocument()
    })

    it('toggles point value display', () => {
      render(<DominoesSection />)
      
      const toggle = screen.getByTestId('toggle-point-values')
      
      // Initially point values should be hidden
      const domino50 = screen.getByTestId('domino-5-0')
      expect(domino50.querySelector('.point-value')).not.toBeInTheDocument()

      // Click to show point values
      fireEvent.click(toggle)

      // Should show point values for count dominoes
      expect(domino50.querySelector('.point-value')).toBeInTheDocument()
      expect(domino50.querySelector('.point-value')).toHaveTextContent('5')
    })

    it('toggles count domino highlighting', () => {
      render(<DominoesSection />)
      
      const toggle = screen.getByTestId('toggle-count-highlighting')
      
      // Click to enable highlighting
      fireEvent.click(toggle)
      
      // Count dominoes should have highlighting class
      const countDomino = screen.getByTestId('domino-5-0') // 5-0 is a count domino
      expect(countDomino).toHaveClass('highlighted')
    })

    it('toggles orientation between horizontal and vertical', () => {
      render(<DominoesSection />)
      
      const toggle = screen.getByTestId('toggle-orientation')
      
      // Initially should be horizontal
      const firstDomino = screen.getByTestId('domino-0-0')
      expect(firstDomino).toHaveClass('horizontal')
      
      // Click to change to vertical
      fireEvent.click(toggle)
      
      expect(firstDomino).toHaveClass('vertical')
    })
  })

  describe('Domino Selection', () => {
    it('allows selecting individual dominoes', () => {
      render(<DominoesSection />)
      
      const domino = screen.getByTestId('domino-6-6')
      
      // Initially not selected
      expect(domino).not.toHaveClass('selected')
      
      // Click to select
      fireEvent.click(domino)
      
      expect(domino).toHaveClass('selected')
    })

    it('allows deselecting dominoes', () => {
      render(<DominoesSection />)
      
      const domino = screen.getByTestId('domino-6-6')
      
      // Select first
      fireEvent.click(domino)
      expect(domino).toHaveClass('selected')
      
      // Click again to deselect
      fireEvent.click(domino)
      expect(domino).not.toHaveClass('selected')
    })

    it('allows multiple domino selection', () => {
      render(<DominoesSection />)
      
      const domino1 = screen.getByTestId('domino-6-6')
      const domino2 = screen.getByTestId('domino-5-5')
      
      // Select both
      fireEvent.click(domino1)
      fireEvent.click(domino2)
      
      expect(domino1).toHaveClass('selected')
      expect(domino2).toHaveClass('selected')
    })
  })

  describe('Grid Layout', () => {
    it('renders dominoes in a responsive grid', () => {
      render(<DominoesSection />)
      
      const grid = screen.getByTestId('dominoes-grid')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass(styles.dominoesGrid)
    })

    it('applies correct CSS classes for responsive layout', () => {
      render(<DominoesSection />)
      
      const container = screen.getByTestId('dominoes-section-container')
      expect(container).toHaveClass(styles.dominoesSection)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<DominoesSection />)
      
      const section = screen.getByTestId('dominoes-section-container')
      expect(section).toHaveAttribute('aria-label', 'Complete domino set showcase')
      
      const grid = screen.getByTestId('dominoes-grid')
      expect(grid).toHaveAttribute('role', 'grid')
      expect(grid).toHaveAttribute('aria-label', 'All 28 dominoes from double-6 set')
    })

    it('provides keyboard navigation support', () => {
      render(<DominoesSection />)
      
      const firstDomino = screen.getByTestId('domino-0-0')
      expect(firstDomino).toHaveAttribute('tabindex', '0')
    })

    it('announces selection changes to screen readers', () => {
      render(<DominoesSection />)
      
      const liveRegion = screen.getByTestId('selection-announcer')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
    })
  })

  describe('Point Value Calculations', () => {
    it('correctly identifies count dominoes', () => {
      render(<DominoesSection />)

      // Enable point value display
      const toggle = screen.getByTestId('toggle-point-values')
      fireEvent.click(toggle)

      // Check specific count dominoes
      expect(screen.getByTestId('domino-5-0').querySelector('.point-value')).toHaveTextContent('5')
      expect(screen.getByTestId('domino-4-1').querySelector('.point-value')).toHaveTextContent('5')
      expect(screen.getByTestId('domino-3-2').querySelector('.point-value')).toHaveTextContent('5')
      expect(screen.getByTestId('domino-6-4').querySelector('.point-value')).toHaveTextContent('10')
      expect(screen.getByTestId('domino-5-5').querySelector('.point-value')).toHaveTextContent('10')
    })
  })
})
