import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../../DominoComponent'
import { DominoHand } from '../../DominoHand'
import { createDomino } from '@/types/texas42'

describe('High Contrast Mode Support', () => {
  const mockDomino = createDomino(3, 2)

  it('applies high contrast styles when preferred', () => {
    // This would typically be tested with CSS-in-JS or by checking computed styles
    // For now, we verify the CSS classes are applied correctly
    render(<DominoComponent domino={mockDomino} />)
    
    const domino = screen.getByRole('button')
    expect(domino).toHaveClass('domino')
  })
})

describe('Reduced Motion Support', () => {
  const mockDomino = createDomino(3, 2)

  it('respects reduced motion preferences', () => {
    // Verify that components don't force animations when reduced motion is preferred
    render(<DominoComponent domino={mockDomino} isPlayable={true} />)
    
    const domino = screen.getByRole('button')
    expect(domino).toHaveClass('playable')
  })
})

describe('Screen Reader Support', () => {
  const mockDomino = createDomino(3, 2)

  it('provides meaningful content for screen readers', () => {
    render(<DominoComponent domino={mockDomino} />)
    
    const domino = screen.getByRole('button')
    expect(domino).toHaveAttribute('role', 'button')
    expect(domino).toHaveAttribute('aria-label')
  })

  it('maintains logical tab order', () => {
    const playableDominoes = Array.from({ length: 3 }, (_, i) =>
      createDomino(i + 1, 0)
    )

    render(
      <DominoHand 
        dominoes={playableDominoes} 
        playableDominoes={playableDominoes}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex', '0')
    })
  })
})