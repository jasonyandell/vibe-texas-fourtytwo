import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { createUserEvent } from '@/test/test-utils'
import { BiddingSection } from '../BiddingSection'
import { createFullDominoSet, DominoSuit } from '@/types/texas42'
import styles from '../BiddingSection.module.css'

describe('BiddingSection', () => {
  const { dominoes: allDominoes } = createFullDominoSet()

  describe('Basic Rendering', () => {
    it('renders section title and description', () => {
      render(<BiddingSection />)
      
      expect(screen.getByText('Bidding & Trump System')).toBeInTheDocument()
      expect(screen.getByText(/Explore the 7 trump suits/)).toBeInTheDocument()
    })

    it('renders all trump suit cards', () => {
      render(<BiddingSection />)
      
      const trumpSuits: DominoSuit[] = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes']
      trumpSuits.forEach(suit => {
        expect(screen.getByTestId(`trump-suit-${suit}`)).toBeInTheDocument()
      })
    })

    it('renders bid controls', () => {
      render(<BiddingSection />)
      
      expect(screen.getByTestId('bid-amount-input')).toBeInTheDocument()
      expect(screen.getByTestId('bid-trump-select')).toBeInTheDocument()
      expect(screen.getByTestId('sample-bid-button')).toBeInTheDocument()
    })

    it('renders bidding history', () => {
      render(<BiddingSection />)
      
      expect(screen.getByTestId('bidding-history')).toBeInTheDocument()
      expect(screen.getByTestId('bid-history-north')).toBeInTheDocument()
      expect(screen.getByTestId('bid-history-east')).toBeInTheDocument()
      expect(screen.getByTestId('bid-history-south')).toBeInTheDocument()
      expect(screen.getByTestId('bid-history-west')).toBeInTheDocument()
    })

    it('renders domino grid', () => {
      render(<BiddingSection />)
      
      expect(screen.getByTestId('dominoes-grid-with-trump')).toBeInTheDocument()
      
      // Check that all 28 dominoes are rendered
      allDominoes.forEach(domino => {
        expect(screen.getByTestId(`domino-${domino.high}-${domino.low}`)).toBeInTheDocument()
      })
    })
  })

  describe('Trump Suit Selection', () => {
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
      expect(screen.getByText('7 dominoes')).toBeInTheDocument()
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

  describe('Bid Controls', () => {
    it('has default bid amount of 30', () => {
      render(<BiddingSection />)
      
      const bidInput = screen.getByTestId('bid-amount-input')
      expect(bidInput).toHaveValue(30)
    })

    it('allows changing bid amount', async () => {
      const user = createUserEvent()
      render(<BiddingSection />)

      const bidInput = screen.getByTestId('bid-amount-input')
      await user.clear(bidInput)
      await user.type(bidInput, '38')

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
      const user = createUserEvent()
      render(<BiddingSection />)

      const bidInput = screen.getByTestId('bid-amount-input')
      
      // Try to bid same as current highest (35)
      await user.clear(bidInput)
      await user.type(bidInput, '35')
      expect(screen.getByText(/Bid must be higher than current bid/)).toBeInTheDocument()

      // Try to bid lower than current highest
      await user.clear(bidInput)
      await user.type(bidInput, '32')
      expect(screen.getByText(/Bid must be higher than current bid/)).toBeInTheDocument()
    })

    it('allows selecting trump suit for bid', async () => {
      const user = createUserEvent()
      render(<BiddingSection />)

      const trumpSelect = screen.getByTestId('bid-trump-select')
      await user.selectOptions(trumpSelect, 'fours')

      expect(trumpSelect).toHaveValue('fours')
    })

    it('shows validation error when trump not selected for bid', async () => {
      const user = createUserEvent()
      render(<BiddingSection />)

      const bidInput = screen.getByTestId('bid-amount-input')
      const bidButton = screen.getByTestId('sample-bid-button')

      // Set valid bid amount but no trump
      await user.clear(bidInput)
      await user.type(bidInput, '36')
      await user.click(bidButton)

      expect(screen.getByText(/Must select trump suit/)).toBeInTheDocument()
    })

    it('disables bid button when validation fails', async () => {
      const user = createUserEvent()
      render(<BiddingSection />)

      const bidInput = screen.getByTestId('bid-amount-input')
      const bidButton = screen.getByTestId('sample-bid-button')

      // Set invalid bid amount
      await user.clear(bidInput)
      await user.type(bidInput, '25')

      expect(bidButton).toBeDisabled()
    })

    it('enables bid button when valid bid and trump selected', async () => {
      const user = createUserEvent()
      render(<BiddingSection />)

      const bidInput = screen.getByTestId('bid-amount-input')
      const trumpSelect = screen.getByTestId('bid-trump-select')
      const bidButton = screen.getByTestId('sample-bid-button')

      // Set valid bid and trump
      await user.clear(bidInput)
      await user.type(bidInput, '36')
      await user.selectOptions(trumpSelect, 'threes')

      expect(bidButton).not.toBeDisabled()
    })
  })

  describe('Bidding History Display', () => {
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
      
      expect(screen.getByText(/Current Winning Bid: 35 by West with Sixes trump/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
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

  describe('Trump Logic', () => {
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
        expect(announcer).toHaveTextContent('7 dominoes highlighted')

        // Deselect for next iteration
        await user.click(suitCard)
      }
    })
  })
})
