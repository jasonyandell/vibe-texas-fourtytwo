import { describe, it, expect } from 'vitest'
import { render } from '@/test/test-utils'
import { DominoHand } from '../DominoHand'
import { Domino, createDomino } from '@/types/texas42'

describe('DominoHand - Gaps and 2-Row Layout', () => {
  const mockDominoes: Domino[] = [
    createDomino(6, 6),
    createDomino(5, 4),
    createDomino(3, 2),
    createDomino(1, 0),
    createDomino(4, 4),
    createDomino(2, 1),
    createDomino(6, 3)
  ]

  describe('2-Row Layout Requirements', () => {
    it('always places exactly 4 dominoes in top row', () => {
      const fullHand = Array.from({ length: 7 }, (_, i) =>
        createDomino(Math.floor(i / 2), i % 2)
      )

      const { container } = render(<DominoHand dominoes={fullHand} />)

      const topRow = container.querySelector('.top-row')
      const bottomRow = container.querySelector('.bottom-row')

      expect(topRow?.children).toHaveLength(4)
      expect(bottomRow?.children).toHaveLength(3)
    })

    it('handles partial hands correctly in 2-row layout', () => {
      const partialHand = Array.from({ length: 5 }, (_, i) =>
        createDomino(Math.floor(i / 2), i % 2)
      )

      const { container } = render(<DominoHand dominoes={partialHand} />)

      const topRow = container.querySelector('.top-row')
      const bottomRow = container.querySelector('.bottom-row')

      expect(topRow?.children).toHaveLength(4)
      expect(bottomRow?.children).toHaveLength(1)
    })

    it('centers bottom row with 3 dominoes', () => {
      const { container } = render(<DominoHand dominoes={mockDominoes} />)

      const bottomRow = container.querySelector('.bottom-row')
      expect(bottomRow).toHaveStyle({ justifyContent: 'center' })
    })
  })

  describe('Gap Handling', () => {
    it('shows gaps where dominoes have been played', () => {
      const handWithGaps = [
        mockDominoes[0],
        null, // gap
        mockDominoes[2],
        mockDominoes[3],
        null, // gap
        mockDominoes[5]
      ]

      const { container } = render(<DominoHand dominoes={handWithGaps} />)

      expect(container.querySelectorAll('.domino-gap')).toHaveLength(2)
    })
  })
})