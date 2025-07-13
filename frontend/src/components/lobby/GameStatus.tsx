import React from 'react';
import { Badge } from '@/components/ui';
import { LobbyGame } from '@/types/texas42';
import styles from './GameStatus.module.css';

export interface GameStatusProps {
  status: LobbyGame['status'];
  playerCount?: number;
  maxPlayers?: number;
  currentHand?: number;
  totalHands?: number;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  status,
  playerCount = 0,
  maxPlayers = 4,
  currentHand,
  totalHands
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'waiting':
        return {
          variant: 'warning' as const,
          text: 'Waiting for Players',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          )
        };
      case 'playing':
        return {
          variant: 'success' as const,
          text: 'In Progress',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )
        };
      case 'finished':
        return {
          variant: 'secondary' as const,
          text: 'Completed',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          )
        };
      default:
        return {
          variant: 'default' as const,
          text: 'Unknown',
          icon: null
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={styles.gameStatus}>
      <Badge 
        variant={statusConfig.variant} 
        className={styles.statusBadge}
      >
        <span className={styles.statusIcon}>
          {statusConfig.icon}
        </span>
        {statusConfig.text}
      </Badge>
      
      {status === 'playing' && currentHand && totalHands && (
        <div className={styles.gameProgress}>
          <span className={styles.progressText}>
            Hand {currentHand} of {totalHands}
          </span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(currentHand / totalHands) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {status === 'waiting' && (
        <div className={styles.playerProgress}>
          <span className={styles.progressText}>
            {playerCount}/{maxPlayers} players
          </span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(playerCount / maxPlayers) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
