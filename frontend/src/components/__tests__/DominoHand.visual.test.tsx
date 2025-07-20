import { describe, it, expect } from 'vitest'
import { render } from '@/test/test-utils'
import { DominoHand } from '../DominoHand'
import { createDomino } from '@/types/texas42'

describe('DominoHand Visual Layout', () => {
  // Generate test dominoes
  const generateTestDominoes = () => {
    const dominoes = []
    for (let i = 0; i < 7; i++) {
      dominoes.push(createDomino(6, i))
    }
    return dominoes
  }

  const allDominoes = generateTestDominoes()

  it('maintains proper 2-row layout structure', () => {
    const fullHand = allDominoes.slice(0, 7)
    const { container } = render(<DominoHand dominoes={fullHand} />)
    
    const handContainer = container.firstChild as HTMLElement
    expect(handContainer).toHaveClass('domino-hand')
    
    const topRow = handContainer.querySelector('.top-row')
    const bottomRow = handContainer.querySelector('.bottom-row')
    
    expect(topRow).toBeInTheDocument()
    expect(bottomRow).toBeInTheDocument()
    expect(topRow?.children).toHaveLength(4)
    expect(bottomRow?.children).toHaveLength(3)
  })

  it('handles gaps visually correctly', () => {
    const handWithGaps = [
      allDominoes[0],
      null,
      allDominoes[1],
      null,
      allDominoes[2],
      allDominoes[3],
      allDominoes[4]
    ]
    
    const { container } = render(<DominoHand dominoes={handWithGaps} />)
    
    const gaps = container.querySelectorAll('.domino-gap')
    expect(gaps).toHaveLength(2)
    
    gaps.forEach(gap => {
      expect(gap).toHaveClass('domino-gap')
      // Check that gap has visual styling
      expect(gap).toHaveStyle({ opacity: '0.5' })
    })
  })

  it('applies responsive classes correctly', () => {
    const { container } = render(<DominoHand dominoes={allDominoes.slice(0, 5)} />)
    
    const handContainer = container.firstChild as HTMLElement
    expect(handContainer).toHaveClass('responsive')
  })
})