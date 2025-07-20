import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { DominoComponent } from '../DominoComponent'
import { allDominoes, countDominoes } from './DominoComponent.test.fixtures'

describe('DominoComponent - All Domino Combinations', () => {
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