import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';
import { DominoSuit, Bid } from '@/types/texas42';
import { useBiddingState } from '@/hooks/useBiddingState';
import styles from './BiddingPanel.module.css';

export interface BiddingPanelProps {
  currentBid: Bid | null;
  currentBidder: string;
  isCurrentPlayer: boolean;
  minimumBid: number;
  onBid: (amount: number, trump: DominoSuit) => void;
  onPass: () => void;
  disabled?: boolean;
  className?: string;
}

// New interface for the integrated version
export interface IntegratedBiddingPanelProps {
  disabled?: boolean;
  className?: string;
}

export const BiddingPanel: React.FC<BiddingPanelProps> = ({
  currentBid,
  currentBidder: _currentBidder,
  isCurrentPlayer,
  minimumBid,
  onBid,
  onPass,
  disabled = false,
  className = ''
}) => {
  // Calculate the minimum valid bid
  const getMinimumValidBid = useCallback(() => {
    return currentBid ? currentBid.amount + 1 : minimumBid;
  }, [currentBid, minimumBid]);

  const [bidAmount, setBidAmount] = useState<number>(getMinimumValidBid());
  const [selectedTrump, setSelectedTrump] = useState<DominoSuit | ''>('');
  const [validationError, setValidationError] = useState<string>('');

  // Update bid amount when current bid changes
  useEffect(() => {
    const minValidBid = getMinimumValidBid();
    setBidAmount(minValidBid);
  }, [getMinimumValidBid]);

  // Validate bid amount
  const validateBidAmount = useCallback((amount: number): string => {
    if (amount < 30 || amount > 42) {
      return 'Bid must be between 30 and 42';
    }
    if (currentBid && amount <= currentBid.amount) {
      return 'Bid must be higher than current bid';
    }
    return '';
  }, [currentBid]);

  // Validate trump selection for bid submission
  const validateTrumpSelection = useCallback((): string => {
    if (!selectedTrump) {
      return 'Must select trump suit';
    }
    return '';
  }, [selectedTrump]);

  // Handle bid amount change
  const handleBidAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    const amount = value === '' ? 0 : parseInt(value, 10);

    if (!isNaN(amount)) {
      setBidAmount(amount);

      // Update validation error
      const amountError = validateBidAmount(amount);
      setValidationError(amountError);
    }
  };

  // Handle trump selection change
  const handleTrumpChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const trump = (event.target as HTMLSelectElement).value as DominoSuit | '';
    setSelectedTrump(trump);

    // Clear validation error when trump is selected
    if (trump && !validateBidAmount(bidAmount)) {
      setValidationError('');
    }
  };

  // Handle bid submission
  const handleBidSubmit = () => {
    const amountError = validateBidAmount(bidAmount);
    const trumpError = validateTrumpSelection();

    if (amountError) {
      setValidationError(amountError);
      return;
    }

    if (trumpError) {
      setValidationError(trumpError);
      return;
    }

    if (selectedTrump !== '') {
      onBid(bidAmount, selectedTrump);
      // Reset form after successful bid
      setBidAmount(getMinimumValidBid());
      setSelectedTrump('');
      setValidationError('');
    } else {
      // This should not happen due to validation, but just in case
      setValidationError('Must select trump suit');
    }
  };

  // Handle pass
  const handlePass = () => {
    onPass();
  };

  const isDisabled = disabled || !isCurrentPlayer;
  const _isBidValid = !validateBidAmount(bidAmount) && !validateTrumpSelection();
  const isBidButtonDisabled = isDisabled || !!validateBidAmount(bidAmount);

  const trumpSuits: { value: DominoSuit; label: string }[] = [
    { value: 'blanks', label: 'Blanks' },
    { value: 'ones', label: 'Ones' },
    { value: 'twos', label: 'Twos' },
    { value: 'threes', label: 'Threes' },
    { value: 'fours', label: 'Fours' },
    { value: 'fives', label: 'Fives' },
    { value: 'sixes', label: 'Sixes' }
  ];

  return (
    <div 
      className={`${styles.biddingPanel} ${className}`}
      role="group"
      aria-label="Bidding controls"
    >
      <div className={styles.currentBidInfo}>
        {currentBid ? (
          <div className={styles.currentBid}>
            <span>Current bid: {currentBid.amount}</span>
            <span>Trump: {currentBid.trump}</span>
          </div>
        ) : (
          <div className={styles.minimumBid}>
            <span>Minimum bid: {minimumBid}</span>
          </div>
        )}
      </div>

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
            onChange={handleBidAmountChange}
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
            onChange={handleTrumpChange}
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
            onClick={handleBidSubmit}
            disabled={isBidButtonDisabled}
            className={styles.bidButton}
          >
            Place Bid
          </Button>
          
          <Button
            variant="secondary"
            onClick={handlePass}
            disabled={isDisabled}
            className={styles.passButton}
          >
            Pass
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Integrated Bidding Panel that uses the useBiddingState hook
 * This version automatically manages state and integrates with the game state
 */
export const IntegratedBiddingPanel: React.FC<IntegratedBiddingPanelProps> = ({
  disabled = false,
  className = ''
}) => {
  const { biddingState: _biddingState, actions, isLoading, error } = useBiddingState();

  const [bidAmount, setBidAmount] = useState<number>(actions.getMinimumBidAmount());
  const [selectedTrump, setSelectedTrump] = useState<DominoSuit | ''>('');
  const [validationError, setValidationError] = useState<string>('');

  // Update bid amount when minimum changes
  useEffect(() => {
    const minBid = actions.getMinimumBidAmount();
    setBidAmount(minBid);
  }, [actions]);

  // Handle bid submission
  const handleBidSubmit = useCallback(() => {
    if (!selectedTrump) {
      setValidationError('Must select trump suit');
      return;
    }

    const validation = actions.validateBidInput(bidAmount, selectedTrump);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid bid');
      return;
    }

    setValidationError('');
    const result = actions.placeBid(bidAmount, selectedTrump);

    if (!result.success) {
      setValidationError(result.error || 'Failed to place bid');
    } else {
      // Reset form after successful bid
      setSelectedTrump('');
      setBidAmount(actions.getMinimumBidAmount());
    }
  }, [bidAmount, selectedTrump, actions]);

  // Handle pass
  const handlePass = useCallback(() => {
    setValidationError('');
    const result = actions.passBid();

    if (!result.success) {
      setValidationError(result.error || 'Failed to pass');
    }
  }, [actions]);

  // Validate bid amount
  const validateBidAmount = useCallback((amount: number): string => {
    if (amount < 30 || amount > 42) {
      return 'Bid must be between 30 and 42';
    }
    const highestBid = actions.getHighestBid();
    if (highestBid && amount <= highestBid.amount) {
      return 'Bid must be higher than current bid';
    }
    return '';
  }, [actions]);

  // Validate trump selection
  const validateTrumpSelection = useCallback((): string => {
    if (!selectedTrump) {
      return 'Must select trump suit';
    }
    return '';
  }, [selectedTrump]);

  const isCurrentPlayer = actions.canCurrentPlayerBid();
  const isDisabled = disabled || !isCurrentPlayer;
  const _isBidValid = !validateBidAmount(bidAmount) && !validateTrumpSelection();
  const isBidButtonDisabled = isDisabled || !!validateBidAmount(bidAmount);

  const currentBid = actions.getHighestBid();
  const _currentBidder = actions.getCurrentBidder();

  if (isLoading) {
    return <div className={`${styles.biddingPanel} ${className}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`${styles.biddingPanel} ${className}`}>Error: {error}</div>;
  }

  return (
    <div className={`${styles.biddingPanel} ${className}`}>
      <div className={styles.header}>
        <h3>Bidding</h3>
        {currentBid && (
          <div className={styles.currentBid}>
            Current bid: {currentBid.amount} ({currentBid.trump})
          </div>
        )}
        {!currentBid && (
          <div className={styles.currentBid}>
            Minimum bid: {actions.getMinimumBidAmount()}
          </div>
        )}
      </div>

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
            onChange={(e) => setBidAmount(parseInt((e.target as HTMLInputElement).value) || 30)}
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
                    onChange={(e) => setSelectedTrump((e.target as HTMLInputElement).value as DominoSuit)}
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
            onClick={() => void handleBidSubmit()}
            disabled={isBidButtonDisabled}
            className={styles.bidButton}
          >
            Place Bid
          </Button>
          <Button
            variant="secondary"
            onClick={() => void handlePass()}
            disabled={isDisabled}
            className={styles.passButton}
          >
            Pass
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BiddingPanel;
