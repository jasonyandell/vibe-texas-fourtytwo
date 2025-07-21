import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { mockDomino } from './DominoComponent.test.fixtures'

describe('DominoComponent - Interactive States', () => {
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