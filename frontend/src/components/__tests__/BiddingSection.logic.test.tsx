import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { createUserEvent } from '@/test/test-utils'
import { BiddingSection } from '../BiddingSection'
import { createFullDominoSet, DominoSuit } from '@/types/texas42'
import styles from '../BiddingSection.module.css'

describe('BiddingSection - Trump Logic', () => {
  const { dominoes: allDominoes } = createFullDominoSet()

  it('correctly identifies trump dominoes for number suits', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    // Select threes trump
    const threesCard = screen.getByTestId('trump-suit-threes')
    await user.click(threesCard)

    // All dominoes with a 3 should be highlighted
    const trumpDominoes = allDominoes.filter(d => d.high === 3 || d.low === 3)
    expect(trumpDominoes).toHaveLength(7) // 3-0, 3-1, 3-2, 3-3, 3-4, 3-5, 3-6

    trumpDominoes.forEach(domino => {
      const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
      expect(dominoElement).toHaveClass(styles.trumpHighlight)
    })
  })

  it('correctly counts trump dominoes for each suit', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    const trumpSuits: DominoSuit[] = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes']
    
    for (const suit of trumpSuits) {
      const suitCard = screen.getByTestId(`trump-suit-${suit}`)
      await user.click(suitCard)

      // Each suit should have exactly 7 trump dominoes
      const announcer = screen.getByTestId('trump-announcer')
      expect(announcer).toHaveTextContent('7 dominoes highlighted.')

      // Deselect for next iteration
      await user.click(suitCard)
    }
  })
})