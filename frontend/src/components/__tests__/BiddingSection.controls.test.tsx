import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import { createUserEvent } from '@/test/test-utils'
import { BiddingSection } from '../BiddingSection'

describe('BiddingSection - Bid Controls', () => {
  it('has default bid amount of 30', () => {
    render(<BiddingSection />)
    
    const bidInput = screen.getByTestId('bid-amount-input')
    expect(bidInput).toHaveValue(30)
  })

  it('allows changing bid amount', () => {
    render(<BiddingSection />)

    const bidInput = screen.getByTestId('bid-amount-input')
    
    // Use fireEvent to change the value directly
    fireEvent.change(bidInput, { target: { value: '38' } })

    expect(bidInput).toHaveValue(38)
  })

  it('validates bid amount range', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    const bidInput = screen.getByTestId('bid-amount-input')

    // Test below minimum
    await user.clear(bidInput)
    await user.type(bidInput, '25')
    expect(screen.getByText(/Bid must be between 30 and 42/)).toBeInTheDocument()

    // Test above maximum
    await user.clear(bidInput)
    await user.type(bidInput, '45')
    expect(screen.getByText(/Bid must be between 30 and 42/)).toBeInTheDocument()
  })

  it('validates bid must be higher than current bid', async () => {
    render(<BiddingSection />)

    const bidInput = screen.getByTestId('bid-amount-input')
    
    // Try to bid same as current highest (35)
    fireEvent.change(bidInput, { target: { value: '35' } })
    
    // Wait for validation to appear
    await waitFor(() => {
      expect(screen.getByText('Bid must be higher than current bid (35)')).toBeInTheDocument()
    })

    // Try to bid lower than current highest
    fireEvent.change(bidInput, { target: { value: '32' } })
    
    await waitFor(() => {
      expect(screen.getByText('Bid must be higher than current bid (35)')).toBeInTheDocument()
    })
  })

  it('allows selecting trump suit for bid', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    const trumpSelect = screen.getByTestId('bid-trump-select')
    await user.selectOptions(trumpSelect, 'fours')

    expect(trumpSelect).toHaveValue('fours')
  })

  it('disables bid button when validation fails', () => {
    render(<BiddingSection />)

    const bidInput = screen.getByTestId('bid-amount-input')
    const bidButton = screen.getByTestId('sample-bid-button')

    // Set invalid bid amount
    fireEvent.change(bidInput, { target: { value: '25' } })

    expect(bidButton).toBeDisabled()
  })

  it('enables bid button when valid bid and trump selected', async () => {
    const user = createUserEvent()
    render(<BiddingSection />)

    const bidInput = screen.getByTestId('bid-amount-input')
    const trumpSelect = screen.getByTestId('bid-trump-select')
    const bidButton = screen.getByTestId('sample-bid-button')

    // Set valid bid and trump
    fireEvent.change(bidInput, { target: { value: '36' } })
    await user.selectOptions(trumpSelect, 'threes')

    expect(bidButton).not.toBeDisabled()
  })
})