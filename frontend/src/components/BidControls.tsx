import React from 'react'
import { DominoSuit } from '@/types/texas42'
import { trumpSuits } from '@/utils/trumpUtils'
import styles from './BiddingSection.module.css'

interface BidControlsProps {
  bidAmount: number
  selectedBidTrump: DominoSuit | ''
  validationError: string
  onBidAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBidTrumpChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onSampleBid: () => void
}

export const BidControls: React.FC<BidControlsProps> = ({
  bidAmount,
  selectedBidTrump,
  validationError,
  onBidAmountChange,
  onBidTrumpChange,
  onSampleBid,
}) => {
  return (
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
            onChange={onBidAmountChange}
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
            onChange={onBidTrumpChange}
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
          onClick={onSampleBid}
          disabled={bidAmount <= 35 || bidAmount < 30 || bidAmount > 42 || !selectedBidTrump}
          data-testid="sample-bid-button"
          className={styles.bidButton}
        >
          Place Sample Bid
        </button>
      </div>
    </div>
  )
}