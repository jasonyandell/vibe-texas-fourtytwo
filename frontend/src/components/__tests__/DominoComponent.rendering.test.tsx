import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { mockDomino, mockBlankDomino, mockDoubleDomino } from './DominoComponent.test.fixtures'

describe('DominoComponent - Basic Rendering', () => {
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