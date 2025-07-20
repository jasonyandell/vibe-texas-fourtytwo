import React from 'react';
import { GameState, PlayerPosition, DominoSuit } from '@texas42/shared-types';
import { BiddingPanel } from './BiddingPanel';
import { BiddingHistory } from './BiddingHistory';
import { DominoComponent } from './DominoComponent';
import styles from './GameBoard.module.css';

interface GameBoardCenterProps {
  gameState: GameState;
  currentPlayerId?: string;
  onBid: (amount: number, trump: DominoSuit) => void;
  onPass: () => void;
}

export const GameBoardCenter: React.FC<GameBoardCenterProps> = ({
  gameState,
  currentPlayerId,
  onBid,
  onPass
}) => {
  const getPlayerByPosition = (position: PlayerPosition) => {
    return gameState.players.find(player => player.position === position);
  };

  const getCurrentPlayer = () => {
    return gameState.players.find(player => player.id === gameState.currentPlayer);
  };

  return (
    <div
      className={`center-play-area ${styles.centerPlayArea}`}
      data-testid="center-play-area"
      role="region"
      aria-label="Center play area"
    >
      {gameState.phase === 'bidding' ? (
        <div className={styles.biddingArea} data-testid="bidding-area">
          <div className={styles.biddingContainer}>
            <BiddingPanel
              currentBid={gameState.currentBid || null}
              currentBidder={gameState.currentPlayer || ''}
              isCurrentPlayer={gameState.currentPlayer === currentPlayerId}
              minimumBid={gameState.biddingState?.minimumBid || 30}
              onBid={onBid}
              onPass={onPass}
              className={styles.centerBiddingPanel}
            />
            <BiddingHistory
              bidHistory={gameState.biddingState?.bidHistory || []}
              players={gameState.players}
              className={styles.biddingHistoryPanel}
            />
          </div>
        </div>
      ) : gameState.currentTrick && gameState.currentTrick.dominoes.length > 0 ? (
        <div className={styles.currentTrick} data-testid="current-trick">
          <h3>Current Trick</h3>
          <div className={styles.trickDominoes}>
            {gameState.currentTrick.dominoes.map((play) => (
              <div key={`${play.playerId}-${play.domino.id}`} className={styles.playedDomino}>
                <DominoComponent domino={play.domino} />
                <span className={styles.playerLabel}>
                  {getPlayerByPosition(play.position)?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyTrick}>
          <p>Waiting for play...</p>
          {getCurrentPlayer() && (
            <p className={styles.turnIndicator}>
              Current turn: {getCurrentPlayer()?.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};