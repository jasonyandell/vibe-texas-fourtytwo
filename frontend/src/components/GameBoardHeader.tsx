import React from 'react';
import { GameState } from '@texas42/shared-types';
import styles from './GameBoard.module.css';

interface GameBoardHeaderProps {
  gameId?: string;
  gameState: GameState;
}

export const GameBoardHeader: React.FC<GameBoardHeaderProps> = ({ gameId, gameState }) => {
  const formatPhase = (phase: string) => {
    return phase.charAt(0).toUpperCase() + phase.slice(1) + ' Phase';
  };

  const formatTrumpSuit = (trump?: string) => {
    if (!trump) return '';
    return `Trump: ${trump.charAt(0).toUpperCase() + trump.slice(1)}`;
  };

  const formatBid = (bid?: { amount: number; trump?: string }) => {
    if (!bid || bid.amount === 0) return '';
    return `Bid: ${bid.amount}`;
  };

  return (
    <div className={styles.gameHeader}>
      <div className={styles.gameInfo}>
        <h2>Texas 42</h2>
        <p>Game ID: {gameId}</p>
        <span className={styles.gamePhase}>{formatPhase(gameState.phase)}</span>
        {gameState.currentBid && (
          <span className={styles.bidDisplay}>{formatBid(gameState.currentBid)}</span>
        )}
        {gameState.trump && (
          <span className={styles.trumpSuit}>{formatTrumpSuit(gameState.trump)}</span>
        )}
      </div>

      <div className={styles.scoreDisplay}>
        <div className={styles.scoreTeam}>
          <span className={styles.teamName}>North-South</span>
          <span className={styles.teamScore}>{gameState.partnerships.northSouth.currentHandScore}</span>
          <span className={styles.gameScore}>Games: {gameState.gameScore.northSouth}</span>
        </div>
        <div className={styles.scoreTeam}>
          <span className={styles.teamName}>East-West</span>
          <span className={styles.teamScore}>{gameState.partnerships.eastWest.currentHandScore}</span>
          <span className={styles.gameScore}>Games: {gameState.gameScore.eastWest}</span>
        </div>
      </div>
    </div>
  );
};