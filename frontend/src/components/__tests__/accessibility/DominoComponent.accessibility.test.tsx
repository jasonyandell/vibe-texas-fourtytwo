import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../../DominoComponent'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoComponent Accessibility', () => {
  const mockDomino: Domino = createDomino(3, 2)

  it('has proper keyboard navigation support', () => {
    render(<DominoComponent domino={mockDomino} isPlayable={true} />)
    
    const domino = screen.getByRole('button')
    expect(domino).toHaveAttribute('tabIndex', '0')
  })

  it('excludes non-playable dominoes from keyboard navigation', () => {
    render(<DominoComponent domino={mockDomino} isPlayable={false} />)
    
    const domino = screen.getByRole('button')
    expect(domino).toHaveAttribute('tabIndex', '-1')
  })

  it('provides descriptive ARIA labels', () => {
    render(<DominoComponent domino={mockDomino} />)
    
    const domino = screen.getByRole('button')
    expect(domino).toHaveAttribute('aria-label', 'Domino 3-2, 5 points')
  })

  it('indicates disabled state properly', () => {
    render(<DominoComponent domino={mockDomino} isPlayable={false} />)
    
    const domino = screen.getByRole('button')
    expect(domino).toHaveAttribute('aria-disabled', 'true')
  })

  it('handles blank dominoes in ARIA labels', () => {
    const blankDomino: Domino = createDomino(0, 0)
    render(<DominoComponent domino={blankDomino} />)
    
    const domino = screen.getByRole('button')
    expect(domino).toHaveAttribute('aria-label', 'Domino blank-blank')
  })
})