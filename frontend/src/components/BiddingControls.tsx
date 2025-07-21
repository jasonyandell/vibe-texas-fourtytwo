import React from 'react';
import { Button } from './ui/Button';
import { DominoSuit } from '@/types/texas42';
import styles from './BiddingPanel.module.css';

export interface BiddingControlsProps {
  bidAmount: number;
  selectedTrump: DominoSuit | '';
  isDisabled: boolean;
  isBidButtonDisabled: boolean;
  onBidAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTrumpChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBidSubmit: () => void;
  onPass: () => void;
  validationError: string;
}

const trumpSuits: { value: DominoSuit; label: string }[] = [
  { value: 'blanks', label: 'Blanks' },
  { value: 'ones', label: 'Ones' },
  { value: 'twos', label: 'Twos' },
  { value: 'threes', label: 'Threes' },
  { value: 'fours', label: 'Fours' },
  { value: 'fives', label: 'Fives' },
  { value: 'sixes', label: 'Sixes' }
];

export const BiddingControls: React.FC<BiddingControlsProps> = ({
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
    <div className={styles.biddingControls}>
      <div className={styles.inputGroup}>
        <label htmlFor="bid-amount" className={styles.label}>
          Bid Amount
        </label>
        <input
          id="bid-amount"
          type="number"
          min={30}
          max={42}
          value={bidAmount === 0 ? '' : bidAmount}
          onChange={onBidAmountChange}
          disabled={isDisabled}
          className={styles.bidInput}
          aria-describedby="bid-amount-help"
        />
        <div id="bid-amount-help" className={styles.helpText}>
          Enter bid amount (30-42)
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="trump-suit" className={styles.label}>
          Trump Suit
        </label>
        <select
          id="trump-suit"
          value={selectedTrump}
          onChange={onTrumpChange}
          disabled={isDisabled}
          className={styles.trumpSelect}
          aria-describedby="trump-suit-help"
        >
          <option value="">Select trump suit</option>
          {trumpSuits.map(suit => (
            <option key={suit.value} value={suit.value}>
              {suit.label}
            </option>
          ))}
        </select>
        <div id="trump-suit-help" className={styles.helpText}>
          Choose the trump suit for your bid
        </div>
      </div>

      {validationError && (
        <div className={styles.errorMessage} role="alert">
          {validationError}
        </div>
      )}

      <div className={styles.actionButtons}>
        <Button
          variant="primary"
          onClick={onBidSubmit}
          disabled={isBidButtonDisabled}
          className={styles.bidButton}
        >
          Place Bid
        </Button>
        
        <Button
          variant="secondary"
          onClick={onPass}
          disabled={isDisabled}
          className={styles.passButton}
        >
          Pass
        </Button>
      </div>
    </div>
  );
};