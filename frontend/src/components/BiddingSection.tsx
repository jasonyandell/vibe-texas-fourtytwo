import React, { useState } from 'react'
import { DominoComponent } from './DominoComponent'
import { createFullDominoSet, DominoSuit } from '@/types/texas42'
import { TrumpSuitCard } from './TrumpSuitCard'
import { trumpSuits, isTrumpDomino } from '@/utils/trumpUtils'
import { validateBidAmount } from '@/utils/biddingSectionUtils'
import { sampleBiddingHistory } from './biddingTypes'
import styles from './BiddingSection.module.css'

export const BiddingSection: React.FC = () => {
  const { dominoes } = createFullDominoSet()
  const [selectedTrumpSuit, setSelectedTrumpSuit] = useState<DominoSuit | null>(null)
  const [bidAmount, setBidAmount] = useState<number>(30)
  const [selectedBidTrump, setSelectedBidTrump] = useState<DominoSuit | ''>('')
  const [validationError, setValidationError] = useState<string>('')

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
      validateBid(value)
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

  // Validate bid amount wrapper
  const validateBid = (amount: number): string => {
    const error = validateBidAmount(amount, 35)
    setValidationError(error)
    return error
  }

  // Handle sample bid submission
  const handleSampleBid = () => {
    const amountError = validateBid(bidAmount)
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
            {sampleBiddingHistory.map((bid, _index) => (
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
