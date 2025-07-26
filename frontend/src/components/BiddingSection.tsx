import React from 'react'
import { TrumpSuitCard } from './TrumpSuitCard'
import { BidControls } from './BidControls'
import { BiddingSectionHistory } from './BiddingSectionHistory'
import { TrumpDominoGrid } from './TrumpDominoGrid'
import { trumpSuits } from '@/utils/trumpUtils'
import { useBiddingSectionState } from '@/hooks/useBiddingSectionState'
import styles from './BiddingSection.module.css'

export const BiddingSection: React.FC = () => {
  const {
    selectedTrumpSuit,
    bidAmount,
    selectedBidTrump,
    validationError,
    handleTrumpSuitClick,
    handleBidAmountChange,
    handleBidTrumpChange,
    handleSampleBid,
  } = useBiddingSectionState()


  return (
    <div 
      className="section-container"
      data-testid="bidding-section-container"
      aria-label="Bidding system showcase"
    >
      <div className="section-header">
        <h3>Bidding & Trump System</h3>
        <p>Explore the 7 trump suits, interactive bidding controls, and see how trump selection affects domino rankings.</p>
      </div>

      <div className="section-main-content">
        {/* Trump Suits Display */}
        <div className="section-subsection">
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
        <BidControls
          bidAmount={bidAmount}
          selectedBidTrump={selectedBidTrump}
          validationError={validationError}
          onBidAmountChange={handleBidAmountChange}
          onBidTrumpChange={handleBidTrumpChange}
          onSampleBid={handleSampleBid}
        />

        {/* Bidding History Panel */}
        <BiddingSectionHistory />
      </div>

      {/* Domino Grid with Trump Highlighting */}
      <TrumpDominoGrid selectedTrumpSuit={selectedTrumpSuit} />

      {/* Screen reader announcements */}
      <div
        data-testid="trump-announcer"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {selectedTrumpSuit &&
          `${trumpSuits.find(t => t.suit === selectedTrumpSuit)?.label} trump selected. 7 dominoes highlighted.`
        }
      </div>
    </div>
  )
}
