import React from 'react';
import { Bid, Player } from '@/types/texas42';
import styles from './BiddingHistory.module.css';

export interface BiddingHistoryProps {
  bidHistory: Bid[];
  players: Player[];
  className?: string;
}

export const BiddingHistory: React.FC<BiddingHistoryProps> = ({
  bidHistory,
  players,
  className = ''
}) => {
  const getPlayerName = (playerId: string): string => {
    const player = players.find(p => p.id === playerId);
    return player?.name || 'Unknown Player';
  };

  const formatTrumpSuit = (trump?: string): string => {
    if (!trump) return '';
    return trump.charAt(0).toUpperCase() + trump.slice(1);
  };

  const formatBidAmount = (amount: number): string => {
    return amount === 0 ? 'Pass' : amount.toString();
  };

  const getBidTypeClass = (amount: number): string => {
    if (amount === 0) return styles.passBid;
    if (amount >= 40) return styles.highBid;
    return styles.normalBid;
  };

  if (bidHistory.length === 0) {
    return (
      <div className={`${styles.biddingHistory} ${className}`} data-testid="bidding-history">
        <div className={styles.header}>
          <h4>Bidding History</h4>
        </div>
        <div className={styles.emptyState}>
          <p>No bids yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.biddingHistory} ${className}`} data-testid="bidding-history">
      <div className={styles.header}>
        <h4>Bidding History</h4>
        <span className={styles.bidCount}>{bidHistory.length} bid{bidHistory.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className={styles.bidList} role="list" aria-label="Bidding history">
        {bidHistory.map((bid, index) => (
          <div
            key={`${bid.playerId}-${index}`}
            className={`${styles.bidItem} ${getBidTypeClass(bid.amount)}`}
            role="listitem"
            data-testid={`bid-item-${index}`}
          >
            <div className={styles.bidInfo}>
              <span className={styles.playerName}>
                {getPlayerName(bid.playerId)}
              </span>
              <span className={styles.bidAmount}>
                {formatBidAmount(bid.amount)}
              </span>
              {bid.trump && bid.amount > 0 && (
                <span className={styles.trumpSuit}>
                  {formatTrumpSuit(bid.trump)}
                </span>
              )}
            </div>
            <div className={styles.bidOrder}>
              #{index + 1}
            </div>
          </div>
        ))}
      </div>

      {bidHistory.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.highestBid}>
            {(() => {
              const validBids = bidHistory.filter(bid => bid.amount > 0);
              if (validBids.length === 0) {
                return <span>All players passed</span>;
              }
              const highest = validBids.reduce((max, bid) => 
                bid.amount > max.amount ? bid : max
              );
              return (
                <span>
                  High bid: {highest.amount} ({formatTrumpSuit(highest.trump || '')}) 
                  by {getPlayerName(highest.playerId)}
                </span>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
