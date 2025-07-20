import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { mockDomino, mockBlankDomino } from './DominoComponent.test.fixtures'

describe('DominoComponent - Accessibility', () => {
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