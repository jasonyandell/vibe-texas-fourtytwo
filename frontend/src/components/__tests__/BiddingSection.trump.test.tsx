import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { createUserEvent } from '@/test/test-utils'
import { BiddingSection } from '../BiddingSection'
import { createFullDominoSet } from '@/types/texas42'
import styles from '../BiddingSection.module.css'

describe('BiddingSection - Trump Suit Selection', () => {
  const { dominoes: allDominoes } = createFullDominoSet()

  it('allows selecting trump suits', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    const blanksCard = screen.getByTestId('trump-suit-blanks')
    
    // Initially not selected
    expect(blanksCard).toHaveAttribute('aria-pressed', 'false')
    
    // Click to select
    await user.click(blanksCard)
    expect(blanksCard).toHaveAttribute('aria-pressed', 'true')
    
    // Click again to deselect
    await user.click(blanksCard)
    expect(blanksCard).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows trump suit information correctly', () => {
    render(<BiddingSection />)

    expect(screen.getAllByText('Blanks (0s)')).toHaveLength(2) // One in card, one in select
    expect(screen.getByText('All dominoes containing a blank')).toBeInTheDocument()
    expect(screen.getAllByText('7 dominoes')).toHaveLength(7) // All 7 trump suits show "7 dominoes"
  })

  it('highlights trump dominoes when suit is selected', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    // Select blanks trump
    const blanksCard = screen.getByTestId('trump-suit-blanks')
    await user.click(blanksCard)

    // Check that blank dominoes are highlighted
    const blankDominoes = allDominoes.filter(d => d.high === 0 || d.low === 0)
    blankDominoes.forEach(domino => {
      const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
      expect(dominoElement).toHaveClass(styles.trumpHighlight)
    })

    // Check that non-blank dominoes are not highlighted
    const nonBlankDominoes = allDominoes.filter(d => d.high !== 0 && d.low !== 0)
    nonBlankDominoes.forEach(domino => {
      const dominoElement = screen.getByTestId(`domino-${domino.high}-${domino.low}`)
      expect(dominoElement).not.toHaveClass(styles.trumpHighlight)
    })
  })

  it('updates trump indicator when suit is selected', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    // Initially no trump indicator
    expect(screen.queryByText(/Trump Highlighted/)).not.toBeInTheDocument()

    // Select sixes trump
    const sixesCard = screen.getByTestId('trump-suit-sixes')
    await user.click(sixesCard)

    // Should show trump indicator
    expect(screen.getByText(/Sixes \(6s\) Trump Highlighted/)).toBeInTheDocument()
  })
})