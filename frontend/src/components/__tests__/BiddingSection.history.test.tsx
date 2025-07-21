import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { BiddingSection } from '../BiddingSection'
import styles from '../BiddingSection.module.css'

describe('BiddingSection - Bidding History Display', () => {
  it('shows sample bidding sequence correctly', () => {
    render(<BiddingSection />)
    
    // Check North's pass
    const northRow = screen.getByTestId('bid-history-north')
    expect(northRow).toHaveTextContent('North')
    expect(northRow).toHaveTextContent('Pass')

    // Check East's bid
    const eastRow = screen.getByTestId('bid-history-east')
    expect(eastRow).toHaveTextContent('East')
    expect(eastRow).toHaveTextContent('30')
    expect(eastRow).toHaveTextContent('Fours')

    // Check South's pass
    const southRow = screen.getByTestId('bid-history-south')
    expect(southRow).toHaveTextContent('South')
    expect(southRow).toHaveTextContent('Pass')

    // Check West's winning bid
    const westRow = screen.getByTestId('bid-history-west')
    expect(westRow).toHaveTextContent('West')
    expect(westRow).toHaveTextContent('35')
    expect(westRow).toHaveTextContent('Sixes')
  })

  it('highlights winning bid', () => {
    render(<BiddingSection />)

    const westRow = screen.getByTestId('bid-history-west')
    expect(westRow).toHaveClass(styles.winningBid)
  })

  it('shows current bid information', () => {
    render(<BiddingSection />)
    
    const currentBidInfo = screen.getByText((content, element) => {
      return element?.textContent === 'Current Winning Bid: 35 by West with Sixes trump'
    })
    expect(currentBidInfo).toBeInTheDocument()
  })
})