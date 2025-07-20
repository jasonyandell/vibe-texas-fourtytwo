import React, { useState, useEffect, useCallback } from 'react';
import { DominoSuit, Bid } from '@/types/texas42';
import { useBiddingState } from '@/hooks/useBiddingState';
import { BiddingInfo } from './BiddingInfo';
import { BiddingControls } from './BiddingControls';
import { IntegratedBiddingControls } from './IntegratedBiddingControls';
import { validateBidAmount, validateTrumpSelection, getMinimumValidBid } from './BiddingValidation';
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
  const [bidAmount, setBidAmount] = useState<number>(getMinimumValidBid(currentBid, minimumBid));
  const [selectedTrump, setSelectedTrump] = useState<DominoSuit | ''>('');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    const minValidBid = getMinimumValidBid(currentBid, minimumBid);
    setBidAmount(minValidBid);
  }, [currentBid, minimumBid]);

  const handleBidAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    const amount = value === '' ? 0 : parseInt(value, 10);

    if (!isNaN(amount)) {
      setBidAmount(amount);
      const amountError = validateBidAmount(amount, currentBid);
      setValidationError(amountError);
    }
  };

  const handleTrumpChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const trump = (event.target as HTMLSelectElement).value as DominoSuit | '';
    setSelectedTrump(trump);

    if (trump && !validateBidAmount(bidAmount, currentBid)) {
      setValidationError('');
    }
  };

  const handleBidSubmit = () => {
    const amountError = validateBidAmount(bidAmount, currentBid);
    const trumpError = validateTrumpSelection(selectedTrump);

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
      setBidAmount(getMinimumValidBid(currentBid, minimumBid));
      setSelectedTrump('');
      setValidationError('');
    }
  };

  const handlePass = () => {
    onPass();
  };

  const isDisabled = disabled || !isCurrentPlayer;
  const isBidButtonDisabled = isDisabled || !!validateBidAmount(bidAmount, currentBid);

  return (
    <div 
      className={`${styles.biddingPanel} ${className}`}
      role="group"
      aria-label="Bidding controls"
    >
      <BiddingInfo currentBid={currentBid} minimumBid={minimumBid} />
      <BiddingControls
        bidAmount={bidAmount}
        selectedTrump={selectedTrump}
        isDisabled={isDisabled}
        isBidButtonDisabled={isBidButtonDisabled}
        onBidAmountChange={handleBidAmountChange}
        onTrumpChange={handleTrumpChange}
        onBidSubmit={handleBidSubmit}
        onPass={handlePass}
        validationError={validationError}
      />
    </div>
  );
};

export const IntegratedBiddingPanel: React.FC<IntegratedBiddingPanelProps> = ({
  disabled = false,
  className = ''
}) => {
  const { biddingState: _biddingState, actions, isLoading, error } = useBiddingState();

  const [bidAmount, setBidAmount] = useState<number>(actions.getMinimumBidAmount());
  const [selectedTrump, setSelectedTrump] = useState<DominoSuit | ''>('');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    const minBid = actions.getMinimumBidAmount();
    setBidAmount(minBid);
  }, [actions]);

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
      setSelectedTrump('');
      setBidAmount(actions.getMinimumBidAmount());
    }
  }, [bidAmount, selectedTrump, actions]);

  const handlePass = useCallback(() => {
    setValidationError('');
    const result = actions.passBid();

    if (!result.success) {
      setValidationError(result.error || 'Failed to pass');
    }
  }, [actions]);

  const isCurrentPlayer = actions.canCurrentPlayerBid();
  const isDisabled = disabled || !isCurrentPlayer;
  const isBidButtonDisabled = isDisabled || !!validateBidAmount(bidAmount, actions.getHighestBid());

  const currentBid = actions.getHighestBid();

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

      <IntegratedBiddingControls
        bidAmount={bidAmount}
        selectedTrump={selectedTrump}
        isDisabled={isDisabled}
        isBidButtonDisabled={isBidButtonDisabled}
        onBidAmountChange={setBidAmount}
        onTrumpChange={setSelectedTrump}
        onBidSubmit={handleBidSubmit}
        onPass={handlePass}
        validationError={validationError}
      />
    </div>
  );
};

export default BiddingPanel;