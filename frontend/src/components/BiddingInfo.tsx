import React from 'react';
import { Bid } from '@/types/texas42';
import styles from './BiddingPanel.module.css';

export interface BiddingInfoProps {
  currentBid: Bid | null;
  minimumBid: number;
}

export const BiddingInfo: React.FC<BiddingInfoProps> = ({
  currentBid,
  minimumBid
}) => {
  return (
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
  );
};