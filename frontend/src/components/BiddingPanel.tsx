import React, { useState, useEffect } from 'react';
import { DominoSuit, Bid } from '@/types/texas42';
import { BiddingInfo } from './BiddingInfo';
import { BiddingControls } from './BiddingControls';
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

export default BiddingPanel;