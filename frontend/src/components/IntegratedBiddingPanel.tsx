import React, { useState, useEffect, useCallback } from 'react';
import { DominoSuit } from '@/types/texas42';
import { useBiddingState } from '@/hooks/useBiddingState';
import { IntegratedBiddingControls } from './IntegratedBiddingControls';
import { validateBidAmount } from './BiddingValidation';
import styles from './BiddingPanel.module.css';

export interface IntegratedBiddingPanelProps {
  disabled?: boolean;
  className?: string;
}

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

export default IntegratedBiddingPanel;