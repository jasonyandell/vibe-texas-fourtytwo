import React from 'react';
import { Button } from './ui/Button';
import { DominoSuit } from '@/types/texas42';
import styles from './BiddingPanel.module.css';

export interface IntegratedBiddingControlsProps {
  bidAmount: number;
  selectedTrump: DominoSuit | '';
  isDisabled: boolean;
  isBidButtonDisabled: boolean;
  onBidAmountChange: (value: number) => void;
  onTrumpChange: (trump: DominoSuit) => void;
  onBidSubmit: () => void;
  onPass: () => void;
  validationError: string;
}

export const IntegratedBiddingControls: React.FC<IntegratedBiddingControlsProps> = ({
  bidAmount,
  selectedTrump,
  isDisabled,
  isBidButtonDisabled,
  onBidAmountChange,
  onTrumpChange,
  onBidSubmit,
  onPass,
  validationError
}) => {
  return (
    <div className={styles.content}>
      <div className={styles.bidAmountSection}>
        <label htmlFor="bid-amount" className={styles.label}>
          Bid Amount
        </label>
        <input
          id="bid-amount"
          type="number"
          min="30"
          max="42"
          value={bidAmount}
          onChange={(e) => onBidAmountChange(parseInt((e.target as HTMLInputElement).value) || 30)}
          disabled={isDisabled}
          className={styles.bidInput}
          aria-describedby="bid-amount-error"
        />
      </div>

      <div className={styles.trumpSuitSection}>
        <fieldset disabled={isDisabled} className={styles.trumpFieldset}>
          <legend className={styles.trumpLegend}>Trump Suit</legend>
          <div className={styles.trumpOptions}>
            {(['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'] as DominoSuit[]).map((suit) => (
              <label key={suit} className={styles.trumpOption}>
                <input
                  type="radio"
                  name="trump-suit"
                  value={suit}
                  checked={selectedTrump === suit}
                  onChange={(e) => onTrumpChange((e.target as HTMLInputElement).value as DominoSuit)}
                  aria-describedby="trump-suit-error"
                />
                <span className={styles.trumpLabel}>
                  {suit.charAt(0).toUpperCase() + suit.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {validationError && (
        <div
          className={styles.error}
          role="alert"
          aria-live="polite"
          id="bid-amount-error trump-suit-error"
        >
          {validationError}
        </div>
      )}

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={() => void onBidSubmit()}
          disabled={isBidButtonDisabled}
          className={styles.bidButton}
        >
          Place Bid
        </Button>
        <Button
          variant="secondary"
          onClick={() => void onPass()}
          disabled={isDisabled}
          className={styles.passButton}
        >
          Pass
        </Button>
      </div>
    </div>
  );
};