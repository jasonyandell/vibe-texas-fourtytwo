import React from 'react'
import { trumpSuits } from '@/utils/trumpUtils'
import { sampleBiddingHistory } from './biddingTypes'
import styles from './BiddingSection.module.css'

export const BiddingSectionHistory: React.FC = () => {
  return (
    <div className={styles.biddingHistorySection}>
      <h4>Sample Bidding History</h4>
      <div
        className={styles.biddingHistory}
        data-testid="bidding-history"
        role="table"
        aria-label="Sample bidding sequence"
      >
        <div className={styles.historyHeader} role="row">
          <div role="columnheader">Player</div>
          <div role="columnheader">Bid</div>
          <div role="columnheader">Trump</div>
        </div>
        {sampleBiddingHistory.map((bid) => (
          <div
            key={bid.playerId}
            className={`${styles.historyRow} ${bid.isWinning ? styles.winningBid : ''}`}
            role="row"
            data-testid={`bid-history-${bid.playerId}`}
          >
            <div role="cell">{bid.playerName}</div>
            <div role="cell">
              {bid.amount === null ? 'Pass' : bid.amount}
            </div>
            <div role="cell">
              {bid.trump ? trumpSuits.find(t => t.suit === bid.trump)?.label || bid.trump : '-'}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.currentBidInfo}>
        <strong>Current Winning Bid:</strong> 35 by West with Sixes trump
      </div>
    </div>
  )
}