import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { mockDomino } from './DominoComponent.test.fixtures'

describe('DominoComponent - Visual States', () => {
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
})