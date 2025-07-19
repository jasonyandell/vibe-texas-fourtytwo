import React, { useState, useCallback } from 'react'
import { DominoComponent } from './DominoComponent'
import { createFullDominoSet, Domino, DominoSuit, Bid } from '@/types/texas42'
import styles from './BiddingSection.module.css'

// Trump suit information for display
export interface TrumpSuitInfo {
  suit: DominoSuit
  label: string
  description: string
  dominoCount: number
}

// Sample bidding data for demonstration
export interface SampleBid {
  playerId: string
  playerName: string
  amount: number | null // null for pass
  trump?: DominoSuit
  isWinning: boolean
}

export const BiddingSection: React.FC = () => {
  const { dominoes } = createFullDominoSet()
  const [selectedTrumpSuit, setSelectedTrumpSuit] = useState<DominoSuit | null>(null)
  const [bidAmount, setBidAmount] = useState<number>(30)
  const [selectedBidTrump, setSelectedBidTrump] = useState<DominoSuit | ''>('')
  const [validationError, setValidationError] = useState<string>('')

  // Trump suit definitions
  const trumpSuits: TrumpSuitInfo[] = [
    { suit: 'blanks', label: 'Blanks (0s)', description: 'All dominoes containing a blank', dominoCount: 7 },
    { suit: 'ones', label: 'Ones (1s)', description: 'All dominoes containing a 1', dominoCount: 7 },
    { suit: 'twos', label: 'Twos (2s)', description: 'All dominoes containing a 2', dominoCount: 7 },
    { suit: 'threes', label: 'Threes (3s)', description: 'All dominoes containing a 3', dominoCount: 7 },
    { suit: 'fours', label: 'Fours (4s)', description: 'All dominoes containing a 4', dominoCount: 7 },
    { suit: 'fives', label: 'Fives (5s)', description: 'All dominoes containing a 5', dominoCount: 7 },
    { suit: 'sixes', label: 'Sixes (6s)', description: 'All dominoes containing a 6', dominoCount: 7 }
  ]

  // Sample bidding history for demonstration
  const sampleBiddingHistory: SampleBid[] = [
    { playerId: 'north', playerName: 'North', amount: null, isWinning: false }, // pass
    { playerId: 'east', playerName: 'East', amount: 30, trump: 'fours', isWinning: false },
    { playerId: 'south', playerName: 'South', amount: null, isWinning: false }, // pass
    { playerId: 'west', playerName: 'West', amount: 35, trump: 'sixes', isWinning: true }
  ]

  // Determine if a domino is trump for the given suit
  const isTrumpDomino = useCallback((domino: Domino, trump: DominoSuit): boolean => {
    if (trump === 'doubles') {
      return domino.high === domino.low
    }
    
    // Get the numeric value for the trump suit
    const trumpValue = getTrumpValue(trump)
    return domino.high === trumpValue || domino.low === trumpValue
  }, [])

  // Convert trump suit to numeric value
  const getTrumpValue = (trump: DominoSuit): number => {
    switch (trump) {
      case 'blanks': return 0
      case 'ones': return 1
      case 'twos': return 2
      case 'threes': return 3
      case 'fours': return 4
      case 'fives': return 5
      case 'sixes': return 6
      default: return -1
    }
  }

  // Handle trump suit card click for highlighting
  const handleTrumpSuitClick = (suit: DominoSuit) => {
    setSelectedTrumpSuit(selectedTrumpSuit === suit ? null : suit)
  }

  // Handle bid amount change
  const handleBidAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    if (!isNaN(value)) {
      setBidAmount(value)
      // Validate on change to show immediate feedback
      validateBidAmount(value)
    }
  }

  // Handle trump selection for bidding
  const handleBidTrumpChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const trump = event.target.value as DominoSuit | ''
    setSelectedBidTrump(trump)
    // Clear validation error when trump is selected
    if (trump) {
      setValidationError('')
    }
  }

  // Validate bid amount
  const validateBidAmount = (amount: number): string => {
    if (amount < 30 || amount > 42) {
      const error = 'Bid must be between 30 and 42'
      setValidationError(error)
      return error
    }
    
    // Check against current highest bid (35 in our sample)
    const highestBid = 35
    if (amount <= highestBid) {
      const error = `Bid must be higher than current bid (${highestBid})`
      setValidationError(error)
      return error
    }
    
    setValidationError('')
    return ''
  }

  // Handle sample bid submission
  const handleSampleBid = () => {
    const amountError = validateBidAmount(bidAmount)
    if (amountError) return
    
    if (!selectedBidTrump) {
      setValidationError('Must select trump suit')
      return
    }
    
    setValidationError('')
    // In a real game, this would submit the bid
    console.log(`Sample bid: ${bidAmount} with ${selectedBidTrump} trump`)
  }

  return (
    <div 
      className={styles.biddingSection}
      data-testid="bidding-section-container"
      aria-label="Bidding system showcase"
    >
      <div className={styles.header}>
        <h3>Bidding & Trump System</h3>
        <p>Explore the 7 trump suits, interactive bidding controls, and see how trump selection affects domino rankings.</p>
      </div>

      <div className={styles.mainContent}>
        {/* Trump Suits Display */}
        <div className={styles.trumpSuitsSection}>
          <h4>Trump Suits</h4>
          <p>Click any trump suit to highlight the dominoes that become trump:</p>
          <div 
            className={styles.trumpSuitsGrid}
            data-testid="trump-suits-grid"
            role="group"
            aria-label="Trump suit selection"
          >
            {trumpSuits.map((trumpInfo) => (
              <TrumpSuitCard
                key={trumpInfo.suit}
                trumpInfo={trumpInfo}
                isSelected={selectedTrumpSuit === trumpInfo.suit}
                onClick={() => handleTrumpSuitClick(trumpInfo.suit)}
              />
            ))}
          </div>
        </div>

        {/* Interactive Bid Controls */}
        <div className={styles.bidControlsSection}>
          <h4>Interactive Bid Controls</h4>
          <div 
            className={styles.bidControls}
            data-testid="bid-controls"
            role="group"
            aria-label="Bidding controls"
          >
            <div className={styles.bidAmountControl}>
              <label htmlFor="bid-amount">Bid Amount (30-42):</label>
              <input
                id="bid-amount"
                type="number"
                min="30"
                max="42"
                value={bidAmount}
                onChange={handleBidAmountChange}
                data-testid="bid-amount-input"
                aria-describedby="bid-amount-help"
              />
              <div id="bid-amount-help" className={styles.helpText}>
                Current highest bid: 35 (West with Sixes)
              </div>
            </div>

            <div className={styles.trumpSelectControl}>
              <label htmlFor="bid-trump">Trump Suit:</label>
              <select
                id="bid-trump"
                value={selectedBidTrump}
                onChange={handleBidTrumpChange}
                data-testid="bid-trump-select"
                aria-describedby="trump-help"
              >
                <option value="">Select trump suit...</option>
                {trumpSuits.map((trumpInfo) => (
                  <option key={trumpInfo.suit} value={trumpInfo.suit}>
                    {trumpInfo.label}
                  </option>
                ))}
              </select>
              <div id="trump-help" className={styles.helpText}>
                Choose which suit becomes trump for your bid
              </div>
            </div>

            {validationError && (
              <div 
                className={styles.validationError}
                data-testid="validation-error"
                role="alert"
                aria-live="polite"
              >
                {validationError}
              </div>
            )}

            <button
              type="button"
              onClick={handleSampleBid}
              disabled={bidAmount <= 35 || bidAmount < 30 || bidAmount > 42 || !selectedBidTrump}
              data-testid="sample-bid-button"
              className={styles.bidButton}
            >
              Place Sample Bid
            </button>
          </div>
        </div>

        {/* Bidding History Panel */}
        <div className={styles.biddingHistorySection}>
          <h4>Sample Bidding History</h4>
          <div
            className={styles.biddingHistory}
            data-testid="bidding-history"
            role="table"
            aria-label="Sample bidding sequence"
          >
            <div className={styles.historyHeader} role="row">
              <div role="columnheader">Player</div>
              <div role="columnheader">Bid</div>
              <div role="columnheader">Trump</div>
            </div>
            {sampleBiddingHistory.map((bid, index) => (
              <div
                key={bid.playerId}
                className={`${styles.historyRow} ${bid.isWinning ? styles.winningBid : ''}`}
                role="row"
                data-testid={`bid-history-${bid.playerId}`}
              >
                <div role="cell">{bid.playerName}</div>
                <div role="cell">
                  {bid.amount === null ? 'Pass' : bid.amount}
                </div>
                <div role="cell">
                  {bid.trump ? trumpSuits.find(t => t.suit === bid.trump)?.label || bid.trump : '-'}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.currentBidInfo}>
            <strong>Current Winning Bid:</strong> 35 by West with Sixes trump
          </div>
        </div>
      </div>

      {/* Domino Grid with Trump Highlighting */}
      <div className={styles.dominoGridSection}>
        <h4>
          Domino Set
          {selectedTrumpSuit && (
            <span className={styles.trumpIndicator}>
              - {trumpSuits.find(t => t.suit === selectedTrumpSuit)?.label} Trump Highlighted
            </span>
          )}
        </h4>
        <div
          className={styles.dominoesGrid}
          data-testid="dominoes-grid-with-trump"
          role="grid"
          aria-label={selectedTrumpSuit
            ? `Domino set with ${selectedTrumpSuit} trump highlighted`
            : "Complete domino set"
          }
        >
          {dominoes.map((domino) => {
            const isTrump = selectedTrumpSuit ? isTrumpDomino(domino, selectedTrumpSuit) : false
            return (
              <DominoComponent
                key={domino.id}
                domino={domino}
                onClick={() => {}} // No click handler needed for display
                orientation="horizontal"
                selected={false}
                showPointValue={false}
                highlightCount={false}
                className={`${styles.gridDomino} ${isTrump ? styles.trumpHighlight : ''}`}
                isPlayable={false}
              />
            )
          })}
        </div>
      </div>

      {/* Screen reader announcements */}
      <div
        data-testid="trump-announcer"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {selectedTrumpSuit &&
          `${trumpSuits.find(t => t.suit === selectedTrumpSuit)?.label} trump selected.
           ${dominoes.filter(d => isTrumpDomino(d, selectedTrumpSuit)).length} dominoes highlighted.`
        }
      </div>
    </div>
  )
}

// TrumpSuitCard Component
interface TrumpSuitCardProps {
  trumpInfo: TrumpSuitInfo
  isSelected: boolean
  onClick: () => void
}

const TrumpSuitCard: React.FC<TrumpSuitCardProps> = ({ trumpInfo, isSelected, onClick }) => {
  return (
    <button
      type="button"
      className={`${styles.trumpSuitCard} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      data-testid={`trump-suit-${trumpInfo.suit}`}
      aria-pressed={isSelected}
      aria-describedby={`trump-desc-${trumpInfo.suit}`}
    >
      <div className={styles.trumpSuitLabel}>{trumpInfo.label}</div>
      <div
        id={`trump-desc-${trumpInfo.suit}`}
        className={styles.trumpSuitDescription}
      >
        {trumpInfo.description}
      </div>
      <div className={styles.trumpSuitCount}>
        {trumpInfo.dominoCount} dominoes
      </div>
    </button>
  )
}
