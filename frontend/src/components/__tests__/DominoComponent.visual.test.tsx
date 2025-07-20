import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoComponent Visual Tests', () => {
  // Generate all 28 domino combinations for visual testing
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

  it('renders all domino combinations with correct visual structure', () => {
    allDominoes.forEach(domino => {
      const { unmount } = render(<DominoComponent domino={domino} />)
      
      const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
      
      // Check basic structure
      expect(dominoElement).toHaveClass('domino')
      expect(dominoElement.querySelector('.domino-half.domino-high')).toBeInTheDocument()
      expect(dominoElement.querySelector('.domino-half.domino-low')).toBeInTheDocument()
      expect(dominoElement.querySelector('.domino-divider')).toBeInTheDocument()
      
      // Check pip count
      const highHalf = dominoElement.querySelector('.domino-half.domino-high')
      const lowHalf = dominoElement.querySelector('.domino-half.domino-low')
      expect(highHalf?.querySelectorAll('.pip')).toHaveLength(domino.high)
      expect(lowHalf?.querySelectorAll('.pip')).toHaveLength(domino.low)
      
      unmount()
    })
  })

  it('applies correct visual states for interactive dominoes', () => {
    const testDomino = allDominoes[10] // Pick a mid-range domino
    
    // Test playable state
    const { rerender } = render(
      <DominoComponent domino={testDomino} isPlayable={true} />
    )
    let dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
    expect(dominoElement).toHaveClass('playable')
    
    // Test selected state
    rerender(
      <DominoComponent domino={testDomino} isPlayable={true} selected={true} />
    )
    dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
    expect(dominoElement).toHaveClass('selected')
    
    // Test face-down state
    rerender(
      <DominoComponent domino={testDomino} faceDown={true} />
    )
    dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
    expect(dominoElement).toHaveClass('face-down')
  })

  it('renders both orientations correctly', () => {
    const testDomino = allDominoes[15]

    // Horizontal orientation
    const { rerender } = render(
      <DominoComponent domino={testDomino} orientation="horizontal" />
    )
    let dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
    expect(dominoElement).toHaveClass('horizontal')

    // Vertical orientation
    rerender(
      <DominoComponent domino={testDomino} orientation="vertical" />
    )
    dominoElement = screen.getByTestId(`domino-${testDomino.high}-${testDomino.low}`)
    expect(dominoElement).toHaveClass('vertical')
  })

  it('displays point values correctly for count dominoes', () => {
    // Test 5-point dominoes: 5-0, 4-1, 3-2
    const fivePointDominoes = [
      createDomino(5, 0),
      createDomino(4, 1),
      createDomino(3, 2)
    ]

    fivePointDominoes.forEach(domino => {
      const { unmount } = render(
        <DominoComponent domino={domino} showPointValue={true} />
      )

      const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
      const pointValueElement = dominoElement.querySelector('.point-value')

      expect(pointValueElement).toBeInTheDocument()
      expect(pointValueElement).toHaveTextContent('5')
      expect(pointValueElement?.className).toContain('fivePoints')

      unmount()
    })

    // Test 10-point dominoes: 6-4, 5-5
    const tenPointDominoes = [
      createDomino(6, 4),
      createDomino(5, 5)
    ]

    tenPointDominoes.forEach(domino => {
      const { unmount } = render(
        <DominoComponent domino={domino} showPointValue={true} />
      )

      const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
      const pointValueElement = dominoElement.querySelector('.point-value')

      expect(pointValueElement).toBeInTheDocument()
      expect(pointValueElement).toHaveTextContent('10')
      expect(pointValueElement?.className).toContain('tenPoints')

      unmount()
    })
  })

  it('highlights count dominoes when enabled', () => {
    const countDomino = createDomino(5, 0) // 5-point domino
    const regularDomino = createDomino(6, 1) // 0-point domino

    // Test count domino highlighting
    const { rerender } = render(
      <DominoComponent domino={countDomino} highlightCount={true} />
    )
    let dominoElement = screen.getByTestId(`domino-${countDomino.high}-${countDomino.low}`)
    expect(dominoElement).toHaveClass('count-domino')

    // Test regular domino (should not be highlighted)
    rerender(
      <DominoComponent domino={regularDomino} highlightCount={true} />
    )
    dominoElement = screen.getByTestId(`domino-${regularDomino.high}-${regularDomino.low}`)
    expect(dominoElement).not.toHaveClass('count-domino')
  })

  it('hides point values when face down', () => {
    const countDomino = createDomino(6, 4) // 10-point domino

    const { container } = render(
      <DominoComponent
        domino={countDomino}
        showPointValue={true}
        faceDown={true}
      />
    )

    const pointValueElement = container.querySelector('.point-value')
    expect(pointValueElement).not.toBeInTheDocument()
  })

  it('renders all 28 dominoes with proper visual structure and accessibility', () => {
    allDominoes.forEach(domino => {
      const { unmount } = render(
        <DominoComponent
          domino={domino}
          showPointValue={true}
          highlightCount={true}
        />
      )

      const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)

      // Check accessibility
      expect(dominoElement).toHaveAttribute('role', 'button')
      expect(dominoElement).toHaveAttribute('aria-label')

      const ariaLabel = dominoElement.getAttribute('aria-label')
      expect(ariaLabel).toContain(`${domino.high === 0 ? 'blank' : domino.high}`)
      expect(ariaLabel).toContain(`${domino.low === 0 ? 'blank' : domino.low}`)

      if (domino.pointValue > 0) {
        expect(ariaLabel).toContain(`${domino.pointValue} points`)
        expect(dominoElement).toHaveClass('count-domino')
      }

      unmount()
    })
  })
})