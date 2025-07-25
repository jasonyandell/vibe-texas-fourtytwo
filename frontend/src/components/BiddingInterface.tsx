import React from 'react';
import { GameState } from '@texas42/shared-types';
import { DominoHand } from './DominoHand';
import styles from './BiddingInterface.module.css';

interface BiddingInterfaceProps {
  gameState: GameState;
  currentPlayerId?: string;
  onBid: (amount: number) => void;
  onPass: () => void;
}

export const BiddingInterface: React.FC<BiddingInterfaceProps> = ({
  gameState,
  currentPlayerId,
  onBid,
  onPass
}) => {
  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
  const isCurrentBidder = gameState.currentPlayer === currentPlayerId;
  const biddingState = gameState.biddingState;
  
  // Get the current highest bid to determine valid bids
  const currentHighestBid = gameState.currentBid?.amount || 29;
  
  // Generate valid bid amounts
  const validBids: (number | 'pass' | 'plunge')[] = ['pass'];
  for (let bid = Math.max(30, currentHighestBid + 1); bid <= 42; bid++) {
    validBids.push(bid);
  }
  // Add special bids
  validBids.push(84, 'plunge');
  
  const handleBidClick = (bid: number | 'pass' | 'plunge') => {
    if (!isCurrentBidder) return;
    
    if (bid === 'pass') {
      onPass();
    } else if (bid === 'plunge') {
      // Plunge is a special 42 bid with restrictions
      onBid(42);
    } else {
      onBid(bid);
    }
  };
  
  return (
    <div className={styles.biddingInterface}>
      {/* Previous Bids Section */}
      <div className={`${styles.previousBids} card`}>
        <h3>Bidding History</h3>
        <div className={styles.bidHistory}>
          {biddingState?.bidHistory?.map((bid, index) => {
            const player = gameState.players.find(p => p.id === bid.playerId);
            return (
              <div key={index} className={`${styles.bidEntry} flex-between`}>
                <span className={styles.playerName}>{player?.name || 'Unknown'}</span>
                <span className={styles.bidAmount}>
                  {bid.amount === 0 ? 'Pass' : bid.amount}
                </span>
              </div>
            );
          })}
          {isCurrentBidder && (
            <div className={`${styles.bidEntry} ${styles.currentTurn} flex-between`}>
              <span className={styles.playerName}>{currentPlayer?.name}</span>
              <span className={styles.bidAmount}>?</span>
            </div>
          )}
        </div>
      </div>

      {/* Bid Buttons Section */}
      <div className={`${styles.bidSection} card card-large`}>
        <h3>{isCurrentBidder ? 'Your Bid' : `Waiting for ${gameState.players.find(p => p.id === gameState.currentPlayer)?.name}`}</h3>
        <div className={`${styles.bidButtons} flex flex-wrap justify-center flex-items-center`}>
          {validBids.map((bid) => (
            <button
              key={bid}
              className={`${styles.bidButton} ${!isCurrentBidder ? styles.disabled : ''}`}
              onClick={() => handleBidClick(bid)}
              disabled={!isCurrentBidder}
            >
              {bid === 'pass' ? 'PASS' : bid === 'plunge' ? 'PLUNGE' : bid}
            </button>
          ))}
        </div>
      </div>

      {/* Player Hand Section */}
      {currentPlayer && (
        <div className={`${styles.handSection} card card-large flex-column`}>
          <h3>Your Hand</h3>
          <DominoHand
            dominoes={currentPlayer.hand || []}
            onDominoClick={() => {}} // No clicking during bidding
            faceDown={false}
            orientation="horizontal"
          />
        </div>
      )}
    </div>
  );
};