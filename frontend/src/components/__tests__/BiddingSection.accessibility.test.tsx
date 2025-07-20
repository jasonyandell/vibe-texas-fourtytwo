import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { createUserEvent } from '@/test/test-utils'
import { BiddingSection } from '../BiddingSection'

describe('BiddingSection - Accessibility', () => {
  it('has proper ARIA labels and roles', () => {
    render(<BiddingSection />)
    
    expect(screen.getByRole('group', { name: /trump suit selection/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /bidding controls/i })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /sample bidding sequence/i })).toBeInTheDocument()
    expect(screen.getByRole('grid', { name: /domino set/i })).toBeInTheDocument()
  })

  it('announces validation errors to screen readers', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    const bidInput = screen.getByTestId('bid-amount-input')
    await user.clear(bidInput)
    await user.type(bidInput, '25')

    const errorMessage = screen.getByTestId('validation-error')
    expect(errorMessage).toHaveAttribute('role', 'alert')
    expect(errorMessage).toHaveAttribute('aria-live', 'polite')
  })

  it('announces trump selection to screen readers', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    const blanksCard = screen.getByTestId('trump-suit-blanks')
    await user.click(blanksCard)

    const announcer = screen.getByTestId('trump-announcer')
    expect(announcer).toHaveTextContent(/Blanks.*trump selected/)
    expect(announcer).toHaveTextContent(/7 dominoes highlighted/)
  })

  it('supports keyboard navigation', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    // Tab through trump suit cards
    await user.tab()
    expect(screen.getByTestId('trump-suit-blanks')).toHaveFocus()

    // Continue tabbing through controls
    await user.tab()
    expect(screen.getByTestId('trump-suit-ones')).toHaveFocus()
  })
})