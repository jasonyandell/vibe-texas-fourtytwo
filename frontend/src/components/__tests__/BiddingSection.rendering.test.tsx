import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { BiddingSection } from '../BiddingSection'
import { createFullDominoSet, DominoSuit } from '@/types/texas42'

describe('BiddingSection - Basic Rendering', () => {
  const { dominoes: allDominoes } = createFullDominoSet()

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